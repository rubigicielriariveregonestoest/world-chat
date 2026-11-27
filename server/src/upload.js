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

// Multer memory storage (up to 5MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.'));
    }
  }
});

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
    return { error: 'No image file uploaded.' };
  }

  // Validate real image content (magic bytes & metadata verification)
  if (sharp) {
    try {
      const metadata = await sharp(req.file.buffer).metadata();
      const allowedFormats = ['jpeg', 'png', 'webp', 'gif'];
      if (!metadata || !allowedFormats.includes(metadata.format)) {
        return { error: 'Uploaded file is not a recognized or supported image format.' };
      }
    } catch (_) {
      return { error: 'Corrupted image file or invalid format.' };
    }
  }

  const isGif = req.file.mimetype === 'image/gif';
  if (isGif) {
    // Validate GIF magic bytes (GIF87a or GIF89a)
    const header = req.file.buffer.toString('ascii', 0, 6);
    if (header !== 'GIF87a' && header !== 'GIF89a') {
      return { error: 'Invalid or forged GIF file.' };
    }
  }

  return { isGif };
}

/*
 * Chat Photo Upload Endpoint (POST /api/upload)
 * Enforces per-token and per-IP photo cooldowns, strips EXIF metadata, scales
 * photos down to at most 1920x1080 WebP (or verified GIF), and returns the URL.
 */
router.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    const rawClientId = req.headers['x-client-id'];
    const clientToken = (typeof rawClientId === 'string' && rawClientId.trim().length > 0) ? rawClientId.trim() : null;
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown_ip';

    // 1. Check rate limits on BOTH token and real IP to prevent spoofing bypasses
    if (clientToken) {
      const tokenCheck = rateLimiter.checkImageLimit(clientToken);
      if (!tokenCheck.allowed) {
        return res.status(429).json({ error: tokenCheck.reason, waitSeconds: tokenCheck.waitSeconds });
      }
    }
    const ipCheck = rateLimiter.checkImageLimit(clientIp);
    if (!ipCheck.allowed) {
      return res.status(429).json({ error: ipCheck.reason, waitSeconds: ipCheck.waitSeconds });
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
      // Strip EXIF, resize down if larger than 1920x1080, convert to high-efficiency webp
      await sharp(req.file.buffer)
        .rotate() // auto-orient based on EXIF before stripping
        .resize(1920, 1080, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(outPath);
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
router.post('/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const rawClientId = req.headers['x-client-id'];
    const clientToken = (typeof rawClientId === 'string' && rawClientId.trim().length > 0) ? rawClientId.trim() : null;
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown_ip';

    // 1. Check avatar cooldown on both clientToken and real IP
    if (clientToken) {
      const tokenCheck = rateLimiter.checkAvatarLimit(clientToken);
      if (!tokenCheck.allowed) {
        return res.status(429).json({ error: tokenCheck.reason, waitSeconds: tokenCheck.waitSeconds });
      }
    }
    const ipCheck = rateLimiter.checkAvatarLimit(clientIp);
    if (!ipCheck.allowed) {
      return res.status(429).json({ error: ipCheck.reason, waitSeconds: ipCheck.waitSeconds });
    }

    // 2. Validate real image content before processing
    const validation = await validateAndDetectImage(req);
    if (validation.error) {
      return res.status(400).json({ error: validation.error });
    }

    const uniqueId = 'avt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    const filename = uniqueId + (validation.isGif ? '.gif' : '.webp');
    const outPath = path.join(UPLOAD_DIR, filename);

    if (sharp && !validation.isGif) {
      // Strip EXIF & center-crop to crisp 256x256 square WebP
      await sharp(req.file.buffer)
        .rotate() // auto-orient based on EXIF before stripping
        .resize(256, 256, { fit: 'cover', position: 'center' })
        .webp({ quality: 86 })
        .toFile(outPath);
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
      filename
    });
  } catch (err) {
    console.error('[Avatar Upload] Error processing avatar:', err);
    return res.status(500).json({ error: err.message || 'Avatar upload failed' });
  }
});

module.exports = router;
