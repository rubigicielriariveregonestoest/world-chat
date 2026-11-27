/*
 * Message Database Initialization & Disk Persistence
 * Loads the rolling 500-message JSON store on startup and provides debounced
 * asynchronous flushing plus emergency SIGINT persistence to prevent data loss.
 */
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'messages.json');
const MAX_MESSAGES = 500;

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let messages = [];

// Load existing messages on startup
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    messages = JSON.parse(raw);
    if (!Array.isArray(messages)) messages = [];
  }
} catch (err) {
  console.warn('[DB] Failed to load messages.json, initializing fresh store:', err.message);
  messages = [];
}

let persistTimeout = null;
let isWriting = false;

function schedulePersist() {
  if (persistTimeout) return;
  persistTimeout = setTimeout(() => {
    persistTimeout = null;
    flushPersist();
  }, 1000); // Debounce disk writes to at most once per second under load
}

function flushPersist() {
  if (isWriting) {
    schedulePersist();
    return;
  }
  isWriting = true;
  const data = JSON.stringify(messages.slice(-MAX_MESSAGES), null, 2);
  fs.writeFile(DB_FILE, data, 'utf-8', (err) => {
    isWriting = false;
    if (err) {
      console.error('[DB] Error writing to messages.json:', err.message);
    }
  });
}

// Emergency flush on server shutdown
process.on('SIGINT', () => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(messages.slice(-MAX_MESSAGES), null, 2), 'utf-8');
  } catch (_) {}
  process.exit(0);
});

/*
 * Schema Normalization & Allowlists
 * Restricts chat reactions, beautified message moods, and distinguished user
 * icons to validated enums so legacy records and payloads normalize safely.
 */
const ALLOWED_REACTIONS = ['heart', 'haha', 'wow', 'sad', 'angry'];
const ALLOWED_STYLE_VARIANTS = ['default', 'calm', 'spotlight', 'greeting'];
const ALLOWED_USER_ICONS = ['🌟', '🚀', '🌙', '☀️', '🪐', '🔥', '⚡', '🧭', '🦋', '🦊', '🐬', '💎'];

function pickDefaultUserIcon(seed) {
  const str = String(seed || 'guest');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return ALLOWED_USER_ICONS[Math.abs(hash) % ALLOWED_USER_ICONS.length];
}

function normalizeUserIcon(rawIcon, seed) {
  if (typeof rawIcon === 'string' && ALLOWED_USER_ICONS.includes(rawIcon.trim())) {
    return rawIcon.trim();
  }
  return pickDefaultUserIcon(seed);
}

function createEmptyReactions() {
  return {
    heart: [],
    haha: [],
    wow: [],
    sad: [],
    angry: []
  };
}

function normalizeReactions(raw) {
  const base = createEmptyReactions();
  if (!raw || typeof raw !== 'object') return base;
  for (const key of ALLOWED_REACTIONS) {
    if (Array.isArray(raw[key])) {
      base[key] = raw[key].filter(id => typeof id === 'string' && id.length > 0);
    }
  }
  return base;
}

function sanitizeAvatarUrl(rawUrl) {
  if (typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim();
  if (/^\/uploads\/[a-zA-Z0-9_.-]+\.(webp|gif|png|jpg|jpeg)$/.test(trimmed)) {
    return trimmed;
  }
  if (/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]{16,32000}$/.test(trimmed)) {
    return trimmed;
  }
  return null;
}

function normalizeReactionMeta(rawMeta) {
  const clean = {};
  if (!rawMeta || typeof rawMeta !== 'object') return clean;
  for (const [uid, info] of Object.entries(rawMeta)) {
    if (typeof uid !== 'string' || !uid || !info || typeof info !== 'object') continue;
    clean[uid] = {
      userId: uid,
      username: info.username ? String(info.username).substring(0, 24) : 'Guest',
      color: /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(info.color) ? info.color : '#38bdf8',
      userIcon: normalizeUserIcon(info.userIcon, uid),
      avatarUrl: sanitizeAvatarUrl(info.avatarUrl)
    };
  }
  return clean;
}

/*
 * Public Database API (Read, Append & Reaction Toggling)
 * Exposes history retrieval, reply lookup, sanitized message creation (including
 * optional avatarUrl, styleVariant, and reactor metadata), and reaction state updates.
 */
module.exports = {
  ALLOWED_REACTIONS,
  ALLOWED_STYLE_VARIANTS,
  ALLOWED_USER_ICONS,
  pickDefaultUserIcon,
  sanitizeAvatarUrl,

  getRecentMessages(limit = 100) {
    return messages.slice(-limit).map(m => ({
      ...m,
      avatarUrl: sanitizeAvatarUrl(m.avatarUrl),
      userIcon: normalizeUserIcon(m.userIcon, m.userId || m.username),
      styleVariant: ALLOWED_STYLE_VARIANTS.includes(m.styleVariant) ? m.styleVariant : 'default',
      reactions: normalizeReactions(m.reactions),
      reactionMeta: normalizeReactionMeta(m.reactionMeta)
    }));
  },

  getMessageById(id) {
    if (!id) return null;
    return messages.find(m => m.id === id) || null;
  },

  addMessage(msg) {
    const styleVariant = ALLOWED_STYLE_VARIANTS.includes(msg.styleVariant)
      ? msg.styleVariant
      : 'default';

    const record = {
      id: msg.id || 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      userId: msg.userId,
      username: msg.username,
      color: msg.color || '#38bdf8',
      avatarUrl: sanitizeAvatarUrl(msg.avatarUrl),
      userIcon: normalizeUserIcon(msg.userIcon, msg.userId || msg.username),
      text: msg.text || '',
      imageUrl: msg.imageUrl || null,
      styleVariant,
      reactions: createEmptyReactions(),
      reactionMeta: {},
      timestamp: msg.timestamp || new Date().toISOString(),
      replyTo: msg.replyTo ? {
        id: msg.replyTo.id,
        username: msg.replyTo.username,
        color: msg.replyTo.color || '#38bdf8',
        text: msg.replyTo.text ? String(msg.replyTo.text).substring(0, 100) : '',
        imageUrl: msg.replyTo.imageUrl || null
      } : null
    };
    messages.push(record);
    if (messages.length > MAX_MESSAGES) {
      messages = messages.slice(-MAX_MESSAGES);
    }
    schedulePersist();
    return record;
  },

  toggleReaction(messageId, reactionType, userId, userMeta = null) {
    if (!messageId || !userId || !ALLOWED_REACTIONS.includes(reactionType)) {
      return null;
    }
    const target = messages.find(m => m.id === messageId);
    if (!target) return null;

    target.reactions = normalizeReactions(target.reactions);
    target.reactionMeta = normalizeReactionMeta(target.reactionMeta);
    const list = target.reactions[reactionType];
    const existingIdx = list.indexOf(userId);
    if (existingIdx >= 0) {
      list.splice(existingIdx, 1);
      const stillHasAny = ALLOWED_REACTIONS.some(r => target.reactions[r].includes(userId));
      if (!stillHasAny) {
        delete target.reactionMeta[userId];
      }
    } else {
      list.push(userId);
      const fallbackName = target.reactionMeta[userId]?.username || 'Guest';
      target.reactionMeta[userId] = {
        userId,
        username: userMeta && userMeta.username ? String(userMeta.username).substring(0, 24) : fallbackName,
        color: userMeta && /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(userMeta.color) ? userMeta.color : '#38bdf8',
        userIcon: normalizeUserIcon(userMeta && userMeta.userIcon, userId),
        avatarUrl: sanitizeAvatarUrl(userMeta && userMeta.avatarUrl)
      };
    }

    schedulePersist();
    return {
      messageId: target.id,
      reactions: target.reactions,
      reactionMeta: target.reactionMeta
    };
  },

  deleteMessage(messageId, userId) {
    if (!messageId || !userId) {
      return { deleted: false, reason: 'invalid_request' };
    }
    const idx = messages.findIndex(m => m.id === messageId);
    if (idx < 0) {
      return { deleted: false, reason: 'not_found' };
    }
    if (messages[idx].userId !== userId) {
      return { deleted: false, reason: 'forbidden' };
    }
    const [removed] = messages.splice(idx, 1);
    schedulePersist();
    return {
      deleted: true,
      messageId: removed.id
    };
  }
};
