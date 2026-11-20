// Simple token/IP based in-memory rate limiter

const textTimestamps = new Map(); // key -> last message timestamp
const imageTimestamps = new Map(); // key -> last image timestamp
const lastUserMessages = new Map(); // key -> last text content

const TEXT_COOLDOWN_MS = 1500; // 1.5 seconds between text messages
const IMAGE_COOLDOWN_MS = 15000; // 15 seconds between image uploads

// Clean up old entries periodically (every 10 minutes)
setInterval(() => {
  const now = Date.now();
  for (const [key, ts] of textTimestamps.entries()) {
    if (now - ts > 60000) textTimestamps.delete(key);
  }
  for (const [key, ts] of imageTimestamps.entries()) {
    if (now - ts > 120000) imageTimestamps.delete(key);
  }
  for (const [key, entry] of lastUserMessages.entries()) {
    if (now - entry.time > 60000) lastUserMessages.delete(key);
  }
}, 600000);

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
  }
};
