/*
 * HTTP Server & Security Middleware Initialization
 * Bootstraps Express, HTTP server, proxy trust settings for real client IPs,
 * defensive HTTP headers, CORS policy, and JSON body parsing.
 */
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const uploadRoutes = require('./upload');
const registerSocketHandlers = require('./socketHandler');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Trust reverse proxy (e.g. Render, Railway, Fly.io, Cloudflare) for real client IPs
app.set('trust proxy', 1);

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST']
}));
app.use(express.json());

/*
 * Static Asset Serving, API Mounting & SPA Fallback
 * Exposes persisted uploaded photos/avatars under /uploads, serves the public
 * web client assets, mounts upload routes under /api, and falls back to index.html.
 */
// Serve static uploads
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
app.use('/uploads', express.static(UPLOAD_DIR));

// Serve static frontend app
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR));

// API routes
app.use('/api', uploadRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'World Chat Server', timestamp: new Date().toISOString() });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

/*
 * Socket.IO Real-Time Transport Binding
 * Configures WebSocket server limits (1MB payload cap), registers chat/reaction
 * socket listeners, and binds the HTTP server to the active runtime port.
 */
// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  maxHttpBufferSize: 1e6 // 1MB buffer limit
});

// Attach socket event listeners
registerSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  World Chat is live at http://localhost:${PORT}`);
  console.log(`  Uploads directory: ${UPLOAD_DIR}`);
  console.log(`===============================================`);
});
