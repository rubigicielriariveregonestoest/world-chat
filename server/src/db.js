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

module.exports = {
  getRecentMessages(limit = 100) {
    return messages.slice(-limit);
  },

  getMessageById(id) {
    if (!id) return null;
    return messages.find(m => m.id === id) || null;
  },

  addMessage(msg) {
    const record = {
      id: msg.id || 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      userId: msg.userId,
      username: msg.username,
      displayName: msg.displayName || msg.username,
      isAdmin: !!msg.isAdmin,
      role: msg.role || 'user',
      color: msg.color || '#f59e0b',
      text: msg.text || '',
      imageUrl: msg.imageUrl || null,
      timestamp: msg.timestamp || new Date().toISOString(),
      replyTo: msg.replyTo ? {
        id: msg.replyTo.id,
        username: msg.replyTo.username,
        displayName: msg.replyTo.displayName || msg.replyTo.username,
        isAdmin: !!msg.replyTo.isAdmin,
        color: msg.replyTo.color || '#f59e0b',
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

  deleteMessage(id) {
    if (!id) return false;
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) return false;
    messages.splice(index, 1);
    schedulePersist();
    return true;
  },

  clearMessages() {
    messages = [];
    schedulePersist();
    return true;
  },

  deleteMessagesByUser(userId) {
    if (!userId) return 0;
    const initial = messages.length;
    messages = messages.filter(m => m.userId !== userId);
    const deleted = initial - messages.length;
    if (deleted > 0) schedulePersist();
    return deleted;
  }
};
