const db = require('./db');
const rateLimiter = require('./rateLimiter');

// Simple HTML escaping to prevent XSS
function sanitizeText(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const activeSockets = new Map(); // socket.id -> { userId, username, color, clientToken, ip }
const typingUsers = new Map(); // clientToken -> { username, expiresAt }

module.exports = function registerSocketHandlers(io) {
  function broadcastPresence() {
    // Unique user tokens to avoid counting multiple tabs as separate people
    const uniqueTokens = new Set();
    const roster = [];

    for (const user of activeSockets.values()) {
      if (user.clientToken && !uniqueTokens.has(user.clientToken)) {
        uniqueTokens.add(user.clientToken);
        roster.push({
          username: user.username,
          color: user.color,
          userId: user.userId
        });
      }
    }

    io.emit('presence:update', {
      onlineCount: Math.max(1, uniqueTokens.size || activeSockets.size),
      users: roster.slice(0, 30) // sample of active users
    });
  }

  function broadcastTyping() {
    const now = Date.now();
    const names = [];
    for (const [token, data] of typingUsers.entries()) {
      if (data.expiresAt > now) {
        names.push(data.username);
      } else {
        typingUsers.delete(token);
      }
    }
    io.emit('typing:update', { typingUsers: names.slice(0, 5) });
  }

  // Periodic cleanup for expired typing indicators
  setInterval(broadcastTyping, 3000);

  io.on('connection', (socket) => {
    // Parse client IP safely handling reverse proxy headers (e.g. Render, Railway, Cloudflare)
    const rawXForwardedFor = socket.handshake.headers['x-forwarded-for'];
    const clientIP = rawXForwardedFor
      ? String(rawXForwardedFor).split(',')[0].trim()
      : (socket.handshake.address || 'unknown_ip');

    // Handle guest join
    socket.on('auth:guest_join', (data = {}) => {
      let rawUsername = (data.username || '').toString().trim();
      let username = sanitizeText(rawUsername);
      if (!username || username.length === 0) {
        username = 'Guest#' + Math.floor(1000 + Math.random() * 9000);
      } else if (username.length > 24) {
        username = username.substring(0, 24);
      }

      const clientToken = data.clientToken || 'guest_' + Math.random().toString(36).substring(2, 9);
      
      // Strict hex color validation to eliminate CSS/attribute injection
      const colorRegex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
      const color = (data.color && colorRegex.test(String(data.color).trim()))
        ? String(data.color).trim()
        : '#38bdf8';

      const userId = data.userId || 'usr_' + clientToken.substring(0, 8);

      const session = {
        userId,
        username,
        color,
        clientToken,
        ip: clientIP
      };

      activeSockets.set(socket.id, session);

      // Send recent history to newly connected client
      const history = db.getRecentMessages(60);
      socket.emit('world:history', history);

      // Send presence update to all
      broadcastPresence();
    });

    // Handle chat message
    socket.on('chat:send', (payload = {}) => {
      const session = activeSockets.get(socket.id);
      if (!session) {
        return socket.emit('chat:error', { message: 'Session not initialized. Please refresh.' });
      }

      const rawText = (payload.text || '').toString();
      const imageUrl = payload.imageUrl ? String(payload.imageUrl).trim() : null;

      // 1. Validation: either text or image must be provided
      if (!rawText.trim() && !imageUrl) {
        return socket.emit('chat:error', { message: 'Message cannot be empty.' });
      }

      // 2. Character limit enforcement (350 characters max)
      if (rawText.length > 350) {
        return socket.emit('chat:error', {
          message: `Character limit exceeded! Max 350 characters (yours was ${rawText.length}).`
        });
      }

      // 3. Text Rate Limit (Slowmode) - Enforce on both clientToken and real IP
      if (rawText.trim()) {
        const tokenCheck = rateLimiter.checkTextLimit(session.clientToken);
        if (!tokenCheck.allowed) {
          return socket.emit('chat:error', {
            message: tokenCheck.reason,
            cooldown: tokenCheck.waitSeconds,
            type: 'slowmode'
          });
        }

        const ipCheck = rateLimiter.checkTextLimit(session.ip);
        if (!ipCheck.allowed) {
          return socket.emit('chat:error', {
            message: ipCheck.reason,
            cooldown: ipCheck.waitSeconds,
            type: 'slowmode'
          });
        }

        // 4. Duplicate Check
        const dupToken = rateLimiter.checkDuplicate(session.clientToken, rawText);
        if (dupToken.duplicate) {
          return socket.emit('chat:error', { message: dupToken.reason, type: 'duplicate' });
        }
        const dupIp = rateLimiter.checkDuplicate(session.ip, rawText);
        if (dupIp.duplicate) {
          return socket.emit('chat:error', { message: dupIp.reason, type: 'duplicate' });
        }
      }

      // Record text in rate limiter for both token and IP
      if (rawText.trim()) {
        rateLimiter.recordText(session.clientToken, rawText);
        rateLimiter.recordText(session.ip, rawText);
      }

      const cleanText = sanitizeText(rawText);
      const styleVariant = db.ALLOWED_STYLE_VARIANTS.includes(payload.styleVariant)
        ? payload.styleVariant
        : 'default';

      // Resolve reply context if replyToId is provided
      let replyToData = null;
      if (payload.replyToId && typeof payload.replyToId === 'string') {
        const targetMsg = db.getMessageById(payload.replyToId);
        if (targetMsg) {
          replyToData = {
            id: targetMsg.id,
            username: targetMsg.username,
            color: targetMsg.color,
            text: targetMsg.text ? targetMsg.text.substring(0, 100) : '',
            imageUrl: targetMsg.imageUrl || null
          };
        }
      }

      // 5. Save to database
      const savedMessage = db.addMessage({
        userId: session.userId,
        username: session.username,
        color: session.color,
        text: cleanText,
        imageUrl: imageUrl && imageUrl.startsWith('/uploads/') ? imageUrl : null,
        styleVariant,
        replyTo: replyToData
      });

      // Clear typing indicator for this user immediately
      typingUsers.delete(session.clientToken);
      broadcastTyping();

      // 6. Broadcast to ALL connected clients in the world!
      io.emit('chat:broadcast', savedMessage);
    });

    // Handle animated message reaction toggle
    let lastReactAt = 0;
    socket.on('chat:react', (payload = {}) => {
      const session = activeSockets.get(socket.id);
      if (!session) return;

      const now = Date.now();
      if (now - lastReactAt < 120) return; // Lightweight flood throttle
      lastReactAt = now;

      const messageId = typeof payload.messageId === 'string' ? payload.messageId.trim() : '';
      const reaction = typeof payload.reaction === 'string' ? payload.reaction.trim() : '';
      if (!messageId || !db.ALLOWED_REACTIONS.includes(reaction)) return;

      const updated = db.toggleReaction(messageId, reaction, session.userId);
      if (updated) {
        io.emit('chat:reaction_update', updated);
      }
    });

    // Handle typing status
    socket.on('typing:update', ({ isTyping } = {}) => {
      const session = activeSockets.get(socket.id);
      if (!session) return;

      if (isTyping) {
        typingUsers.set(session.clientToken, {
          username: session.username,
          expiresAt: Date.now() + 4000
        });
      } else {
        typingUsers.delete(session.clientToken);
      }
      broadcastTyping();
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const session = activeSockets.get(socket.id);
      if (session) {
        typingUsers.delete(session.clientToken);
      }
      activeSockets.delete(socket.id);
      broadcastPresence();
      broadcastTyping();
    });
  });
};
