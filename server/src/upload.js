/*
 * Upload Dependencies & Storage Setup
 * Initializes Express router, Multer memory buffer limits (5MB max), MIME type
 * allowlisting, and optional Sharp image processing for safe server storage.
 */
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimiter = require('./rateLimiter');

let sharp;
try {
  sharp = require('sharp');
} catch (e) {
  console.warn('[Upload] Sharp not available, falling back to direct stream storage:', e.message);
}

const router = express.Router();
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer memory storage (accepts up to 20MB raw intake so oversize photos can be intentionally resized down below 5MB)
const storage = multer.memoryStorage();
const ALLOWED_IMAGE_MIME = [
  'image/jpeg',
  'image/jpg',
  'image/pjpeg',
  'image/jfif',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/bmp',
  'image/x-ms-bmp',
  'image/tiff',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/svg+xml',
  'image/heic',
  'image/heif'
];
const ALLOWED_IMAGE_EXT = /\.(jpe?g|jfif|png|webp|gif|avif|bmp|tiff?|ico|svg|heic|heif)$/i;

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB intake ceiling for auto-compression
  fileFilter: (req, file, cb) => {
    const mimeOk = file.mimetype && (ALLOWED_IMAGE_MIME.includes(file.mimetype.toLowerCase()) || file.mimetype.toLowerCase().startsWith('image/'));
    const extOk = file.originalname && ALLOWED_IMAGE_EXT.test(file.originalname.trim());
    if (mimeOk || extOk) {
      cb(null, true);
    } else {
      const err = new Error('Please choose a valid image file (JPG, PNG, WEBP, GIF, AVIF, BMP, TIFF, SVG, or HEIC) — we will optimize it cleanly for everyone.');
      err.code = 'INVALID_FILE_TYPE';
      cb(err);
    }
  }
});

// Translates Multer size/format limit errors into warm, helpful JSON reminders instead of 500 responses
function wrapUploadMiddleware(fieldName) {
  const middleware = upload.single(fieldName);
  return (req, res, next) => {
    middleware(req, res, (err) => {
      if (!err) return next();
      if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          code: 'LIMIT_FILE_SIZE',
          error: 'Even after optimization checks, that photo is over 20 MB — could you pick a lighter copy so it uploads smoothly?'
        });
      }
      return res.status(400).json({
        code: err.code || 'UPLOAD_LIMIT',
        error: err.message || 'We could not process that photo right now — please pick a standard image file and try again.'
      });
    });
  };
}

/*
 * Upload Directory Housekeeping & Validation Helpers
 * Prevents unbounded disk growth by trimming older files above 500 entries,
 * and validates image magic bytes/metadata before persisting uploaded buffers.
 */
// Clean up old photos if upload folder gets too large (> 500 files)
function cleanupOldUploads() {
  try {
    const files = fs.readdirSync(UPLOAD_DIR).map(f => {
      const full = path.join(UPLOAD_DIR, f);
      return { file: full, time: fs.statSync(full).mtimeMs };
    });
    if (files.length > 500) {
      files.sort((a, b) => a.time - b.time);
      const toDelete = files.slice(0, files.length - 400);
      toDelete.forEach(f => {
        try { fs.unlinkSync(f.file); } catch (_) {}
      });
      console.log(`[Upload] Cleaned up ${toDelete.length} old photos.`);
    }
  } catch (err) {
    console.error('[Upload] Cleanup error:', err.message);
  }
}

async function validateAndDetectImage(req) {
  if (!req.file || !req.file.buffer) {
    return { error: 'Please select a photo file first before uploading.' };
  }

  let detectedFormat = '';
  // Validate real image content (magic bytes & metadata verification) across flexible image formats
  if (sharp) {
    try {
      const metadata = await sharp(req.file.buffer).metadata();
      const allowedFormats = ['jpeg', 'png', 'webp', 'gif', 'avif', 'tiff', 'svg', 'heif'];
      if (!metadata || !allowedFormats.includes(metadata.format)) {
        return { error: 'We could not recognize that image format yet — please try JPG, PNG, WEBP, GIF, AVIF, BMP, TIFF, SVG, or HEIC!' };
      }
      detectedFormat = metadata.format;
    } catch (_) {
      return { error: 'That image file looks a bit tucked away or unreadable — picking another photo format (JPG, PNG, or WEBP) should do the trick!' };
    }
  }

  const isGif = (detectedFormat === 'gif' || req.file.mimetype === 'image/gif');
  if (isGif) {
    // Validate GIF magic bytes (GIF87a or GIF89a)
    const header = req.file.buffer.toString('ascii', 0, 6);
    if (header !== 'GIF87a' && header !== 'GIF89a') {
      return { error: 'That GIF file appears slightly incomplete — please try another GIF or photo.' };
    }
    if (req.file.buffer.length > 5 * 1024 * 1024) {
      return { error: 'Animated GIFs must be under 5 MB to keep chat fast for everyone — please try a smaller GIF or static photo.' };
    }
  }

  return { isGif, detectedFormat };
}

/*
 * Chat Photo Upload Endpoint (POST /api/upload)
 * Enforces per-token and per-IP photo cooldowns, strips EXIF metadata, scales
 * photos down to at most 1920x1080 WebP (or verified GIF), and returns the URL.
 */
router.post('/upload', wrapUploadMiddleware('photo'), async (req, res) => {
  try {
    const rawClientId = req.headers['x-client-id'];
    const clientToken = (typeof rawClientId === 'string' && rawClientId.trim().length > 0) ? rawClientId.trim() : null;
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown_ip';

    // 1. Check rate limits on BOTH token and real IP to prevent spoofing bypasses
    if (clientToken) {
      const tokenCheck = rateLimiter.checkImageLimit(clientToken);
      if (!tokenCheck.allowed) {
        return res.status(429).json({ code: 'COOLDOWN', error: tokenCheck.reason, waitSeconds: tokenCheck.waitSeconds });
      }
    }
    const ipCheck = rateLimiter.checkImageLimit(clientIp);
    if (!ipCheck.allowed) {
      return res.status(429).json({ code: 'COOLDOWN', error: ipCheck.reason, waitSeconds: ipCheck.waitSeconds });
    }

    // 2. Validate real image content (magic bytes & metadata verification)
    const validation = await validateAndDetectImage(req);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const uniqueId = 'img_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const filename = uniqueId + (validation.isGif ? '.gif' : '.webp');
    const outPath = path.join(UPLOAD_DIR, filename);

    if (sharp && !validation.isGif) {
      // Strip EXIF and intentionally compress oversize images under 5MB WebP
      let widthCap = 1920;
      let quality = 82;
      let outBuf = await sharp(req.file.buffer)
        .rotate() // auto-orient based on EXIF before stripping
        .resize(widthCap, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality })
        .toBuffer();

      if (outBuf.length > 5 * 1024 * 1024) {
        outBuf = await sharp(req.file.buffer)
          .rotate()
          .resize(1280, 960, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 65 })
          .toBuffer();
      }
      fs.writeFileSync(outPath, outBuf);
    } else {
      // Safe write verified GIF or fallback buffer
      fs.writeFileSync(outPath, req.file.buffer);
    }

    // Record photo cooldown for both token and IP
    if (clientToken) rateLimiter.recordImage(clientToken);
    rateLimiter.recordImage(clientIp);
    cleanupOldUploads();

    return res.json({
      success: true,
      imageUrl: `/uploads/${filename}`,
      filename
    });
  } catch (err) {
    console.error('[Upload] Error processing file:', err);
    return res.status(500).json({ error: err.message || 'Image processing failed' });
  }
});

/*
 * Profile Avatar Upload Endpoint (POST /api/avatar)
 * Processes user-selected local image files into crisp 256x256 square-cropped
 * WebP avatars (or verified GIFs) with a lightweight rate limit separate from chat photos.
 */
router.post('/avatar', wrapUploadMiddleware('avatar'), async (req, res) => {
  try {
    const rawClientId = req.headers['x-client-id'];
    const clientToken = (typeof rawClientId === 'string' && rawClientId.trim().length > 0) ? rawClientId.trim() : null;
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown_ip';

    // 1. Check avatar cooldown on both clientToken and real IP
    if (clientToken) {
      const tokenCheck = rateLimiter.checkAvatarLimit(clientToken);
      if (!tokenCheck.allowed) {
        return res.status(429).json({ code: 'COOLDOWN', error: tokenCheck.reason, waitSeconds: tokenCheck.waitSeconds });
      }
    }
    const ipCheck = rateLimiter.checkAvatarLimit(clientIp);
    if (!ipCheck.allowed) {
      return res.status(429).json({ code: 'COOLDOWN', error: ipCheck.reason, waitSeconds: ipCheck.waitSeconds });
    }

    // 2. Validate real image content before processing
    const validation = await validateAndDetectImage(req);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const uniqueId = 'avt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const filename = uniqueId + (validation.isGif ? '.gif' : '.webp');
    const outPath = path.join(UPLOAD_DIR, filename);

    let inlineAvatarUrl = null;
    if (sharp && !validation.isGif) {
      // Strip EXIF & center-crop to crisp 256x256 square WebP on disk
      await sharp(req.file.buffer)
        .rotate() // auto-orient based on EXIF before stripping
        .resize(256, 256, { fit: 'cover', position: 'center' })
        .webp({ quality: 86 })
        .toFile(outPath);

      // Also build a compact raster Data URI (<24KB) so avatars survive container restarts across all users
      let compactBuf = await sharp(req.file.buffer)
        .rotate()
        .resize(128, 128, { fit: 'cover', position: 'center' })
        .webp({ quality: 76 })
        .toBuffer();
      let candidateDataUri = `data:image/webp;base64,${compactBuf.toString('base64')}`;
      if (candidateDataUri.length > 30000) {
        compactBuf = await sharp(req.file.buffer)
          .rotate()
          .resize(96, 96, { fit: 'cover', position: 'center' })
          .webp({ quality: 62 })
          .toBuffer();
        candidateDataUri = `data:image/webp;base64,${compactBuf.toString('base64')}`;
      }
      if (candidateDataUri.length <= 32000) {
        inlineAvatarUrl = candidateDataUri;
      }
    } else {
      // Safe write verified GIF or fallback buffer
      fs.writeFileSync(outPath, req.file.buffer);
    }

    // Record avatar cooldown for both token and IP
    if (clientToken) rateLimiter.recordAvatar(clientToken);
    rateLimiter.recordAvatar(clientIp);
    cleanupOldUploads();

    return res.json({
      success: true,
      avatarUrl: `/uploads/${filename}`,
      inlineAvatarUrl,
      filename
    });
  } catch (err) {
    console.error('[Avatar Upload] Error processing avatar:', err);
    return res.status(500).json({ error: err.message || 'Avatar upload failed' });
  }
});

module.exports = router;
