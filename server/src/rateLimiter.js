/*
 * Rate Limiter Store & Configuration
 * Tracks per-clientToken and per-IP timestamps for text cooldowns, duplicate
 * message spam detection, chat photo uploads, and profile avatar updates.
 */
// Simple token/IP based in-memory rate limiter

const textTimestamps = new Map(); // key -> last message timestamp
const imageTimestamps = new Map(); // key -> last image timestamp
const avatarTimestamps = new Map(); // key -> last avatar update timestamp
const lastUserMessages = new Map(); // key -> last text content

const TEXT_COOLDOWN_MS = 1500; // 1.5 seconds between text messages
const IMAGE_COOLDOWN_MS = 15000; // 15 seconds between image uploads
const AVATAR_COOLDOWN_MS = 3000; // 3 seconds between profile photo changes

/*
 * Periodic Memory Eviction
 * Runs every 10 minutes to prune expired timestamp and message history entries
 * so long-running server processes maintain bounded memory usage.
 */
// Clean up old entries periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of textTimestamps.entries()) {
    if (now - ts > 60000) textTimestamps.delete(key);
  }
  for (const [key, ts] of imageTimestamps.entries()) {
    if (now - ts > 120000) imageTimestamps.delete(key);
  }
  for (const [key, ts] of avatarTimestamps.entries()) {
    if (now - ts > 60000) avatarTimestamps.delete(key);
  }
  for (const [key, entry] of lastUserMessages.entries()) {
    if (now - entry.time > 60000) lastUserMessages.delete(key);
  }
}, 600000);

/*
 * Exported Cooldown & Anti-Spam Validators
 * Provides check and record helpers used by WebSocket message dispatchers
 * and Express file upload routes to enforce fair usage across IP and token keys.
 */
module.exports = {
  checkTextLimit(clientId) {
    const now = Date.now();
    const last = textTimestamps.get(clientId) || 0;
    const diff = now - last;
    if (diff < TEXT_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((TEXT_COOLDOWN_MS - diff) / 1000);
      return { allowed: false, waitSeconds, reason: `Slowmode: Please wait ${waitSeconds}s before chatting again.` };
    }
    return { allowed: true };
  },

  recordText(clientId, text) {
    textTimestamps.set(clientId, Date.now());
    lastUserMessages.set(clientId, { text: text.trim().toLowerCase(), time: Date.now() });
  },

  checkDuplicate(clientId, text) {
    const clean = text.trim().toLowerCase();
    const prev = lastUserMessages.get(clientId);
    if (prev && prev.text === clean && (Date.now() - prev.time) < 10000) {
      return { duplicate: true, reason: 'Duplicate message detected. Please do not spam.' };
    }
    return { duplicate: false };
  },

  checkImageLimit(clientId) {
    const now = Date.now();
    const last = imageTimestamps.get(clientId) || 0;
    const diff = now - last;
    if (diff < IMAGE_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((IMAGE_COOLDOWN_MS - diff) / 1000);
      return { allowed: false, waitSeconds, reason: `Photo cooldown: Please wait ${waitSeconds}s before sending another photo.` };
    }
    return { allowed: true };
  },

  recordImage(clientId) {
    imageTimestamps.set(clientId, Date.now());
  },

  checkAvatarLimit(clientId) {
    const now = Date.now();
    const last = avatarTimestamps.get(clientId) || 0;
    const diff = now - last;
    if (diff < AVATAR_COOLDOWN_MS) {
      const waitSeconds = Math.ceil((AVATAR_COOLDOWN_MS - diff) / 1000);
      return { allowed: false, waitSeconds, reason: `Please wait ${waitSeconds}s before changing your profile photo again.` };
    }
    return { allowed: true };
  },

  recordAvatar(clientId) {
    avatarTimestamps.set(clientId, Date.now());
  }
};
