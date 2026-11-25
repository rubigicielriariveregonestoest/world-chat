const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let users = [];

// Load existing users from disk on startup
try {
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      users = parsed;
    }
  }
} catch (err) {
  console.warn('[UserDB] Failed to load users.json, starting with empty store:', err.message);
  users = [];
}

let persistTimeout = null;
let isWriting = false;

function schedulePersist() {
  if (persistTimeout) return;
  persistTimeout = setTimeout(() => {
    persistTimeout = null;
    flushPersist();
  }, 500);
}

function flushPersist() {
  if (isWriting) {
    schedulePersist();
    return;
  }
  isWriting = true;
  const data = JSON.stringify(users, null, 2);
  fs.writeFile(USERS_FILE, data, 'utf-8', (err) => {
    isWriting = false;
    if (err) {
      console.error('[UserDB] Error writing to users.json:', err.message);
    }
  });
}

// Emergency flush on process exit
process.on('SIGINT', () => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (_) {}
});

function sanitizeName(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const DEFAULT_COLORS = [
  '#f59e0b', '#22c55e', '#a855f7', '#f43f5e',
  '#fbbf24', '#06b6d4', '#ec4899', '#3b82f6', '#10b981'
];

module.exports = {
  // Username format: 3-20 characters, lowercase alphanumeric or underscore
  validateUsernameFormat(username) {
    if (!username || typeof username !== 'string') return false;
    const clean = username.trim().toLowerCase();
    return /^[a-z0-9_]{3,20}$/.test(clean);
  },

  isUsernameAvailable(username, excludeUserId = null) {
    if (!this.validateUsernameFormat(username)) return false;
    const clean = username.trim().toLowerCase();
    const existing = users.find(u => 
      u.username.toLowerCase() === clean && (!excludeUserId || u.id !== excludeUserId)
    );
    return !existing;
  },

  generateUniqueUsername(baseSeed) {
    let clean = (baseSeed || 'user')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '_')
      .replace(/^_+|_+$/g, '');

    if (clean.length < 3) clean = 'user_' + clean;
    if (clean.length > 15) clean = clean.substring(0, 15);

    let candidate = clean;
    let counter = 1;

    while (!this.isUsernameAvailable(candidate)) {
      const suffix = String(counter);
      candidate = `${clean.substring(0, 20 - suffix.length - 1)}_${suffix}`;
      counter++;
    }

    return candidate;
  },

  getUserById(id) {
    if (!id) return null;
    return users.find(u => u.id === id) || null;
  },

  getUserByEmail(email) {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    return users.find(u => u.email.toLowerCase() === clean) || null;
  },

  getUserByUsername(username) {
    if (!username) return null;
    const clean = username.trim().toLowerCase();
    return users.find(u => u.username.toLowerCase() === clean) || null;
  },

  createOrUpdateGoogleUser({ email, googleName, picture }) {
    if (!email || typeof email !== 'string') {
      throw new Error('Valid email is required');
    }

    const cleanEmail = email.trim().toLowerCase();
    const isGmail = cleanEmail.endsWith('@gmail.com') || cleanEmail.endsWith('@googlemail.com');
    if (!isGmail) {
      throw new Error('Only Gmail accounts (@gmail.com) are supported.');
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
    const isAdmin = cleanEmail === adminEmail;

    let user = this.getUserByEmail(cleanEmail);

    if (user) {
      // Existing user: refresh last login, picture, and ensure admin role if email matches
      user.lastLoginAt = new Date().toISOString();
      if (isAdmin && user.role !== 'admin') {
        user.role = 'admin';
      }
      if (picture && !user.avatarUrl) {
        user.avatarUrl = picture;
      }
      schedulePersist();
      return user;
    }

    // New User: derive unique username and display name
    const emailPrefix = cleanEmail.split('@')[0];
    const initialUsername = this.generateUniqueUsername(emailPrefix);
    const initialDisplayName = sanitizeName(googleName || emailPrefix).substring(0, 24) || initialUsername;
    const initialColor = DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)];

    const newUser = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7),
      email: cleanEmail,
      username: initialUsername,
      displayName: initialDisplayName,
      avatarColor: initialColor,
      avatarUrl: picture || null,
      role: isAdmin ? 'admin' : 'user',
      isBanned: false,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };

    users.push(newUser);
    schedulePersist();
    return newUser;
  },

  updateProfile(userId, { displayName, username, avatarColor }) {
    const user = this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (username) {
      const cleanUsername = username.trim().toLowerCase();
      if (!this.validateUsernameFormat(cleanUsername)) {
        throw new Error('Username must be 3-20 characters and contain only lowercase letters, numbers, and underscores.');
      }
      if (cleanUsername !== user.username.toLowerCase()) {
        if (!this.isUsernameAvailable(cleanUsername, userId)) {
          throw new Error('Username is already taken. Please choose another.');
        }
        user.username = cleanUsername;
      }
    }

    if (displayName) {
      const cleanDisplayName = sanitizeName(displayName).substring(0, 24);
      if (cleanDisplayName.length > 0) {
        user.displayName = cleanDisplayName;
      }
    }

    if (avatarColor) {
      const colorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
      if (colorRegex.test(avatarColor)) {
        user.avatarColor = avatarColor;
      }
    }

    user.updatedAt = new Date().toISOString();
    schedulePersist();
    return user;
  },

  getAllUsers() {
    return users.map(u => ({
      id: u.id,
      email: u.email,
      username: u.username,
      displayName: u.displayName,
      avatarColor: u.avatarColor,
      role: u.role,
      isBanned: u.isBanned,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt
    }));
  },

  setBanStatus(userId, isBanned) {
    const user = this.getUserById(userId);
    if (!user) throw new Error('User not found');
    user.isBanned = !!isBanned;
    schedulePersist();
    return user;
  },

  deleteUser(userId) {
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('User not found');
    const removed = users.splice(index, 1)[0];
    schedulePersist();
    return removed;
  }
};
