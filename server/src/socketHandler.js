const db = require('./db');
const rateLimiter = require('./rateLimiter');
const { validateToken } = require('./auth');
const userDb = require('./userDb');

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

const activeSockets = new Map(); // socket.id -> session
const typingUsers = new Map(); // clientToken -> { username, expiresAt }

module.exports = function registerSocketHandlers(io) {
  function broadcastPresence() {
    const uniqueTokens = new Set();
    const roster = [];

    for (const user of activeSockets.values()) {
      if (user.clientToken && !uniqueTokens.has(user.clientToken)) {
        uniqueTokens.add(user.clientToken);
        roster.push({
          username: user.username,
          displayName: user.displayName || user.username,
          color: user.color,
          userId: user.userId,
          role: user.role || 'user',
          isAdmin: !!user.isAdmin
        });
      }
    }

    io.emit('presence:update', {
      onlineCount: Math.max(1, uniqueTokens.size || activeSockets.size),
      users: roster.slice(0, 30)
    });
  }

  function broadcastTyping() {
    const now = Date.now();
    const names = [];
    for (const [token, data] of typingUsers.entries()) {
      if (data.expiresAt > now) {
        names.push(data.displayName || data.username);
      } else {
        typingUsers.delete(token);
      }
    }
    io.emit('typing:update', { typingUsers: names.slice(0, 5) });
  }

  setInterval(broadcastTyping, 3000);

  io.on('connection', (socket) => {
    const rawXForwardedFor = socket.handshake.headers['x-forwarded-for'];
    const clientIP = rawXForwardedFor
      ? String(rawXForwardedFor).split(',')[0].trim()
      : (socket.handshake.address || 'unknown_ip');

    // Handle authenticated or guest connection
    socket.on('auth:join', (data = {}) => {
      const clientToken = data.clientToken || 'client_' + Math.random().toString(36).substring(2, 9);
      const authToken = data.authToken ? String(data.authToken).trim() : null;
      let authenticatedUser = null;

      if (authToken) {
        authenticatedUser = validateToken(authToken);
      }

      let session;
      if (authenticatedUser) {
        session = {
          userId: authenticatedUser.id,
          username: authenticatedUser.username,
          displayName: authenticatedUser.displayName,
          color: authenticatedUser.avatarColor || '#f59e0b',
          role: authenticatedUser.role,
          isAdmin: authenticatedUser.role === 'admin',
          isAuthenticated: true,
          clientToken,
          ip: clientIP
        };
        socket.emit('auth:state', {
          authenticated: true,
          user: {
            id: authenticatedUser.id,
            email: authenticatedUser.email,
            username: authenticatedUser.username,
            displayName: authenticatedUser.displayName,
            avatarColor: authenticatedUser.avatarColor,
            avatarUrl: authenticatedUser.avatarUrl,
            role: authenticatedUser.role,
            isAdmin: authenticatedUser.role === 'admin'
          }
        });
      } else {
        // Unlinked Guest Session (Read-Only)
        session = {
          userId: 'guest_' + clientToken.substring(0, 8),
          username: 'Guest#' + Math.floor(1000 + Math.random() * 9000),
          displayName: 'Guest',
          color: '#9e9a95',
          role: 'guest',
          isAdmin: false,
          isAuthenticated: false,
          clientToken,
          ip: clientIP
        };
        socket.emit('auth:state', {
          authenticated: false,
          user: null,
          message: 'Account not linked. Send and photo features are locked.'
        });
      }

      activeSockets.set(socket.id, session);

      // Send recent history
      const history = db.getRecentMessages(60);
      socket.emit('world:history', history);

      broadcastPresence();
    });

    // Legacy guest join alias (redirected to unauthenticated or guest session)
    socket.on('auth:guest_join', (data = {}) => {
      socket.emit('auth:state', {
        authenticated: false,
        user: null,
        message: 'Account not linked. Please link your Gmail account to chat.'
      });
      const clientToken = data.clientToken || 'guest_' + Math.random().toString(36).substring(2, 9);
      const session = {
        userId: 'guest_' + clientToken.substring(0, 8),
        username: 'Guest#' + Math.floor(1000 + Math.random() * 9000),
        displayName: 'Guest',
        color: '#9e9a95',
        role: 'guest',
        isAdmin: false,
        isAuthenticated: false,
        clientToken,
        ip: clientIP
      };
      activeSockets.set(socket.id, session);
      socket.emit('world:history', db.getRecentMessages(60));
      broadcastPresence();
    });

    // Handle chat message
    socket.on('chat:send', (payload = {}) => {
      const session = activeSockets.get(socket.id);
      if (!session) {
        return socket.emit('chat:error', { message: 'Session not initialized. Please refresh.' });
      }

      // STRICT LOCK: Reject if not linked to a Gmail account
      if (!session.isAuthenticated) {
        return socket.emit('chat:error', {
          message: 'Account link required. Please link your Gmail account to send messages.',
          type: 'auth_required'
        });
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

      // 3. Text Rate Limit (Slowmode)
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

      if (rawText.trim()) {
        rateLimiter.recordText(session.clientToken, rawText);
        rateLimiter.recordText(session.ip, rawText);
      }

      const cleanText = sanitizeText(rawText);

      // Resolve reply context if replyToId is provided
      let replyToData = null;
      if (payload.replyToId && typeof payload.replyToId === 'string') {
        const targetMsg = db.getMessageById(payload.replyToId);
        if (targetMsg) {
          replyToData = {
            id: targetMsg.id,
            username: targetMsg.username,
            displayName: targetMsg.displayName || targetMsg.username,
            isAdmin: !!targetMsg.isAdmin,
            color: targetMsg.color,
            text: targetMsg.text ? targetMsg.text.substring(0, 100) : '',
            imageUrl: targetMsg.imageUrl || null
          };
        }
      }

      // 5. Save to database with unique username and flexible displayName
      const savedMessage = db.addMessage({
        userId: session.userId,
        username: session.username,
        displayName: session.displayName,
        isAdmin: session.isAdmin,
        role: session.role,
        color: session.color,
        text: cleanText,
        imageUrl: imageUrl && imageUrl.startsWith('/uploads/') ? imageUrl : null,
        replyTo: replyToData
      });

      typingUsers.delete(session.clientToken);
      broadcastTyping();

      // 6. Broadcast to ALL connected clients
      io.emit('chat:broadcast', savedMessage);
    });

    // Handle typing status
    socket.on('typing:update', ({ isTyping } = {}) => {
      const session = activeSockets.get(socket.id);
      if (!session || !session.isAuthenticated) return;

      if (isTyping) {
        typingUsers.set(session.clientToken, {
          username: session.username,
          displayName: session.displayName,
          expiresAt: Date.now() + 4000
        });
      } else {
        typingUsers.delete(session.clientToken);
      }
      broadcastTyping();
    });

    // --- Exclusive Admin Moderation Events ---
    socket.on('admin:delete_message', ({ messageId } = {}) => {
      const session = activeSockets.get(socket.id);
      if (!session || !session.isAdmin) {
        return socket.emit('admin:error', { message: 'Unauthorized. Admin control required.' });
      }

      if (!messageId) return;
      const success = db.deleteMessage(messageId);
      if (success) {
        io.emit('chat:message_deleted', { messageId });
      }
    });

    socket.on('admin:clear_chat', () => {
      const session = activeSockets.get(socket.id);
      if (!session || !session.isAdmin) {
        return socket.emit('admin:error', { message: 'Unauthorized. Admin control required.' });
      }

      db.clearMessages();
      io.emit('chat:cleared');
    });

    socket.on('admin:kick_user', ({ userId } = {}) => {
      const session = activeSockets.get(socket.id);
      if (!session || !session.isAdmin) {
        return socket.emit('admin:error', { message: 'Unauthorized. Admin control required.' });
      }

      if (!userId) return;
      userDb.setBanStatus(userId, true);
      db.deleteMessagesByUser(userId);

      // Disconnect all sockets of this user
      for (const [sId, s] of activeSockets.entries()) {
        if (s.userId === userId) {
          const clientSock = io.sockets.sockets.get(sId);
          if (clientSock) {
            clientSock.emit('auth:banned', { message: 'You have been removed by an administrator.' });
            clientSock.disconnect(true);
          }
        }
      }

      io.emit('chat:reload_needed');
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
