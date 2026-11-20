# 🌍 World Chat

A real-time global "All Chat" web application where every visitor shares a single synchronized celestial chat room. Built with native WebSockets (Socket.IO), Express, and Web Audio API.

---

## ✨ Features

- **No Login Required**: Instant guest access with auto-generated celestial nicknames (e.g. `CosmicFalcon#4819`) and deterministic glowing avatars.
- **Swipe-to-Send**: Tactile, attached swipe gesture button with distance tracking, velocity threshold, and interactive sound effects.
- **Reply Chat**: Reply to any message sent in World Chat (both your own and other users') with quoted previews, author color borders, and click-to-jump with a celestial pulse animation.
- **Two-Phase Neomorphism**:
  - **Neomorphism Dark** (Default): Obsidian deep surface with dual shadows and cosmic glow.
  - **Neomorphism Light**: Warm creamy stone (`#f5f2eb` / `#ede9e1`) with tactile extruded elements.
- **Synthesized SoundFX System**: Zero-dependency Web Audio API synthesizer generating 19 distinct interaction sound effects (swipes, clicks, pops, alerts, toggles, modal transitions).
- **Profile Dropdown**: Clean top-right user pill opening a consolidated menu for profile editing, Safe Mode, Sound Alerts, and Theme switching.
- **Photo & Image Sharing**: Send photos directly in chat (JPG, PNG, WEBP, GIF up to 5MB) with drag-and-drop, Sharp optimization, EXIF stripping, and fullscreen lightbox.
- **Safe Mode**: One-click toggle in profile to blur photos for safe browsing in public/work environments (click to reveal).
- **Slowmode & Anti-Spam**:
  - Text cooldown (1.5s) with live countdown timer on the send button.
  - Photo cooldown (15s) to prevent image flooding.
  - Duplicate message suppression.
  - Reverse-proxy IP & token dual-layer rate limiting.
- **Real-Time Presence & Typing**: Live online counter and typing indicators.

---

## 🚀 Local Development

### 1. Install & Run Server
```bash
cd server
npm install
npm start
```

### 2. Open in Your Browser
Navigate to `http://localhost:4000`. Open multiple tabs or incognito windows to test live bidirectional communication!

---

## 📦 Deployment Guide (Render / Railway)

> [!IMPORTANT]
> **Why not Vercel?**
> Vercel is a serverless platform where functions terminate after 10–60 seconds, meaning persistent WebSocket connections (Socket.IO) and local files (`messages.json` and `/uploads`) cannot run.
>
> For persistent WebSockets and disk storage, use **Render** or **Railway** (both have generous free/cheap tiers).

### Option 1: Deploy on Render.com (Recommended)

1. **Push to GitHub**:
   ```bash
   cd world-chat
   git init
   git add .
   git commit -m "Initial commit: World Chat"
   git remote add origin https://github.com/<your-username>/world-chat.git
   git branch -M main
   git push -u origin main
   ```
2. **Create a Web Service on Render**:
   - Go to [dashboard.render.com](https://dashboard.render.com) and click **New + > Web Service**.
   - Connect your GitHub repository.
   - Configure the service:
     - **Root Directory**: `server`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variable**: `PORT = 4000` (or leave default, Render sets `PORT` automatically).
   - *(Optional for persistent storage)*: Under **Disks**, add a persistent disk mounted to `/opt/render/project/src/server/uploads` and `server/data`.
3. Click **Create Web Service**. Your app is live with SSL!

---

### Option 2: Deploy on Railway.app

1. Go to [railway.app](https://railway.app) and create a **New Project > Deploy from GitHub repo**.
2. Set **Root Directory** to `/server`.
3. Railway automatically detects `npm start` and provisions a public domain with native WebSocket support.
