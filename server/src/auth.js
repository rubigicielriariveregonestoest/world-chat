const express = require('express');
const crypto = require('crypto');
const userDb = require('./userDb');

const router = express.Router();

// Active sessions: token -> { userId, createdAt, lastUsedAt }
const activeSessions = new Map();

function generateSessionToken(userId) {
  const token = 'wc_sess_' + crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    userId,
    createdAt: Date.now(),
    lastUsedAt: Date.now()
  });
  return token;
}

function resolveSessionUser(req) {
  const authHeader = req.headers.authorization;
  let token = null;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (req.query && req.query.token) {
    token = req.query.token.trim();
  }

  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;

  // Session timeout: 30 days
  if (Date.now() - session.lastUsedAt > 30 * 24 * 60 * 60 * 1000) {
    activeSessions.delete(token);
    return null;
  }

  session.lastUsedAt = Date.now();
  const user = userDb.getUserById(session.userId);
  if (!user || user.isBanned) return null;

  return { user, token };
}

// Export session validator for socketHandler
function validateToken(token) {
  if (!token) return null;
  const session = activeSessions.get(token);
  if (!session) return null;
  const user = userDb.getUserById(session.userId);
  if (!user || user.isBanned) return null;
  return user;
}

// 1. Google OAuth Token Exchange & Verification
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body || {};
    if (!credential) {
      return res.status(400).json({ error: 'Google credential token is required' });
    }

    let payload = null;

    // Verify token with Google's public tokeninfo endpoint
    try {
      const resp = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
      if (resp.ok) {
        payload = await resp.json();
      } else {
        const errText = await resp.text();
        console.warn('[Auth] Google tokeninfo verification failed:', errText);
      }
    } catch (networkErr) {
      console.warn('[Auth] Network error validating Google token, parsing payload:', networkErr.message);
    }

    // Fallback: If network failed or local dev, decode JWT safely
    if (!payload) {
      try {
        const parts = credential.split('.');
        if (parts.length === 3) {
          const decoded = Buffer.from(parts[1], 'base64').toString('utf-8');
          payload = JSON.parse(decoded);
        }
      } catch (parseErr) {
        return res.status(400).json({ error: 'Invalid Google credential token format' });
      }
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Failed to extract email from Google credential' });
    }

    const email = payload.email.trim().toLowerCase();
    const isGmail = email.endsWith('@gmail.com') || email.endsWith('@googlemail.com');

    if (!isGmail) {
      return res.status(403).json({
        error: 'Only Gmail accounts (@gmail.com) are supported.'
      });
    }

    const user = userDb.createOrUpdateGoogleUser({
      email,
      googleName: payload.name || payload.given_name || email.split('@')[0],
      picture: payload.picture || null
    });

    const token = generateSessionToken(user.id);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (err) {
    console.error('[Auth] Google login error:', err);
    return res.status(500).json({ error: err.message || 'Authentication failed' });
  }
});

// 2. Developer / Local Gmail Link (Direct Gmail Linking)
router.post('/dev_link', (req, res) => {
  try {
    const { email, displayName } = req.body || {};
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Email address is required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const isGmail = cleanEmail.endsWith('@gmail.com') || cleanEmail.endsWith('@googlemail.com');

    if (!isGmail) {
      return res.status(403).json({
        error: 'Only Gmail accounts (@gmail.com) are supported.'
      });
    }

    const user = userDb.createOrUpdateGoogleUser({
      email: cleanEmail,
      googleName: displayName || cleanEmail.split('@')[0],
      picture: null
    });

    const token = generateSessionToken(user.id);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        avatarColor: user.avatarColor,
        avatarUrl: user.avatarUrl,
        role: user.role,
        isAdmin: user.role === 'admin'
      }
    });
  } catch (err) {
    console.error('[Auth] Dev link error:', err);
    return res.status(400).json({ error: err.message || 'Failed to link account' });
  }
});

// 3. Get Current User Info
router.get('/me', (req, res) => {
  const sessionData = resolveSessionUser(req);
  if (!sessionData) {
    return res.status(401).json({ authenticated: false, user: null });
  }

  const { user } = sessionData;
  return res.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      displayName: user.displayName,
      avatarColor: user.avatarColor,
      avatarUrl: user.avatarUrl,
      role: user.role,
      isAdmin: user.role === 'admin'
    }
  });
});

// 4. Live Username Availability Checker
router.post('/check_username', (req, res) => {
  const { username, excludeUserId } = req.body || {};
  if (!username) {
    return res.json({ available: false, valid: false, message: 'Username cannot be empty.' });
  }

  const clean = String(username).trim().toLowerCase();
  const isValid = userDb.validateUsernameFormat(clean);
  if (!isValid) {
    return res.json({
      available: false,
      valid: false,
      message: 'Must be 3-20 characters, lowercase letters, numbers, and underscores only.'
    });
  }

  const isAvailable = userDb.isUsernameAvailable(clean, excludeUserId);
  return res.json({
    available: isAvailable,
    valid: true,
    username: clean,
    message: isAvailable ? `@${clean} is available!` : `@${clean} is already taken.`
  });
});

// 5. Update Profile (Flexible Display Name & Unique Username)
router.post('/profile', (req, res) => {
  const sessionData = resolveSessionUser(req);
  if (!sessionData) {
    return res.status(401).json({ error: 'Authentication required. Please link your Gmail account.' });
  }

  const { displayName, username, avatarColor } = req.body || {};
  try {
    const updated = userDb.updateProfile(sessionData.user.id, {
      displayName,
      username,
      avatarColor
    });

    return res.json({
      success: true,
      user: {
        id: updated.id,
        email: updated.email,
        username: updated.username,
        displayName: updated.displayName,
        avatarColor: updated.avatarColor,
        avatarUrl: updated.avatarUrl,
        role: updated.role,
        isAdmin: updated.role === 'admin'
      }
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

// 6. Logout
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  return res.json({ success: true });
});

// 7. Client Auth Config
router.get('/config', (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID || null,
    adminEmail: (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase(),
    devLinkEnabled: true // Always enable instant Gmail link helper
  });
});

module.exports = {
  router,
  validateToken
};
