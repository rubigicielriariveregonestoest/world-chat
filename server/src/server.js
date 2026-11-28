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
const { buildReleaseInfo } = require('./releases');
const uploadRoutes = require('./upload');
const registerSocketHandlers = require('./socketHandler');

/*
 * Application Release & Version Manifest
 * Derives active server version, buildId, release highlights, and full changelog
 * history from releases.js for GET /api/version and Socket.IO broadcasts.
 */
const RELEASE_INFO = buildReleaseInfo();

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Trust reverse proxy (e.g. Render, Railway, Fly.io, Cloudflare) for real client IPs
app.set('trust proxy', 1);

// Security & Discord-Compatible Framing Headers Middleware
const DISCORD_FRAME_ANCESTORS = [
  "'self'",
  'https://discord.com',
  'https://*.discord.com',
  'https://ptb.discord.com',
  'https://canary.discord.com',
  'https://*.discordsays.com',
  'http://localhost:*',
  'http://127.0.0.1:*'
].join(' ');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', `frame-ancestors ${DISCORD_FRAME_ANCESTORS}`);
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

// Serve static frontend app (revalidate HTML entry on each load)
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
app.use(express.static(PUBLIC_DIR, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// API routes
app.use('/api', uploadRoutes);

app.get('/api/version', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({ ...RELEASE_INFO, timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'World Chat Server', version: RELEASE_INFO.version, timestamp: new Date().toISOString() });
});

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.setHeader('Cache-Control', 'no-cache');
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

// Attach socket event listeners along with authoritative release metadata
registerSocketHandlers(io, RELEASE_INFO);

server.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`  World Chat is live at http://localhost:${PORT}`);
  console.log(`  Uploads directory: ${UPLOAD_DIR}`);
  console.log(`===============================================`);
});
