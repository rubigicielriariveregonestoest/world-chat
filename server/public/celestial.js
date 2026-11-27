/*
 * Celestial Universe Engine & HiDPI Viewport Sizing
 * Drives the fullscreen twinkling starfield, diagonal shooting stars, and meteor
 * showers. Caps devicePixelRatio at 2x and trims mobile star density to keep
 * rendering fluid across both desktop and lower-power mobile GPUs.
 */
// World Chat — Celestial Universe Engine
// Handles: Twinkling Starfield, 80% Diagonal Shooting Stars, 20% Meteor Showers
(() => {
  const canvas = document.getElementById('celestial-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // --- Resize Handler with HiDPI support ---
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    if (typeof ctx.setTransform === 'function') {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    } else {
      ctx.scale(dpr, dpr);
    }
    initStars();
  }

  /*
   * Dynamic Theme Adaptation & Twinkling Starfield Registry
   * Adapts particle hues instantaneously between Midnight Harbor (dark) and
   * Serene Alabaster (light) themes while keeping star density responsive.
   */
  // --- Current Theme Tracking & Dynamic Adaptation ---
  let currentTheme = document.documentElement.getAttribute('data-theme') || 'neomorphism-dark';

  window.setCelestialTheme = function(theme) {
    currentTheme = theme;
    for (let i = 0; i < stars.length; i++) {
      stars[i].color = getRandomStarColor();
    }
  };

  // --- Background Starfield ---
  const stars = [];

  function initStars() {
    stars.length = 0;
    const starCount = width <= 640 ? 75 : 160;
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
        color: getRandomStarColor()
      });
    }
  }

  function getRandomStarColor() {
    if (currentTheme === 'neomorphism-light' || currentTheme === 'neomorphism' || currentTheme === 'light') {
      const darkColors = [
        '#1e3a5f', // Deep Harbor Navy
        '#2563eb', // Trust Sapphire
        '#0d9488', // Balanced Sage Teal
        '#475569', // Calm Slate
        '#334155'  // Structured Charcoal Slate
      ];
      return darkColors[Math.floor(Math.random() * darkColors.length)];
    }
    const colors = [
      '#f1f5f9', // Soft Mist Starlight
      '#bae6fd', // Serene Ice Blue
      '#7dd3fc', // Aurora Cerulean
      '#99f6e4', // Calm Seafoam
      '#c7d2fe'  // Moonlit Indigo
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // --- Active Meteors Collection ---
  const meteors = [];

  class Meteor {
    constructor(options = {}) {
      // Diagonal trajectory: typically from top-right towards bottom-left (or top-left to bottom-right)
      this.isShower = options.isShower || false;
      this.angle = options.angle || (Math.PI / 4 + (Math.random() * 0.15 - 0.075)); // ~45 deg diagonal
      this.speed = options.speed || (this.isShower ? Math.random() * 6 + 14 : Math.random() * 4 + 12);
      this.length = options.length || (this.isShower ? Math.random() * 80 + 130 : Math.random() * 70 + 100);

      // Start position somewhere along the top or upper edges
      if (Math.random() > 0.4) {
        this.x = options.x !== undefined ? options.x : Math.random() * (width + 200) - 100;
        this.y = options.y !== undefined ? options.y : -20;
      } else {
        this.x = options.x !== undefined ? options.x : -20;
        this.y = options.y !== undefined ? options.y : Math.random() * (height * 0.5);
      }

      this.vx = Math.cos(this.angle) * this.speed;
      this.vy = Math.sin(this.angle) * this.speed;

      this.life = 0;
      this.maxLife = options.maxLife || (Math.random() * 40 + 60); // frames
      this.width = options.width || (this.isShower ? Math.random() * 1.5 + 1.8 : Math.random() * 0.8 + 1.2);

      // Celestial color scheme (adapted dynamically per theme)
      if (currentTheme === 'neomorphism-light' || currentTheme === 'neomorphism' || currentTheme === 'light') {
        if (this.isShower) {
          const darkShowerColors = [
            { head: '#0f172a', mid: 'rgba(71, 85, 105, 0.9)', tail: 'rgba(15, 23, 42, 0)' }, // Deep slate to charcoal
            { head: '#1e293b', mid: 'rgba(120, 113, 108, 0.9)', tail: 'rgba(68, 64, 60, 0)' }, // Warm graphite
            { head: '#0f172a', mid: 'rgba(67, 56, 202, 0.85)', tail: 'rgba(30, 27, 75, 0)' }  // Twilight indigo
          ];
          this.palette = darkShowerColors[Math.floor(Math.random() * darkShowerColors.length)];
        } else {
          this.palette = {
            head: '#0f172a',
            mid: 'rgba(71, 85, 105, 0.85)',
            tail: 'rgba(15, 23, 42, 0)'
          };
        }
      } else {
        if (this.isShower) {
          const showerColors = [
            { head: '#ffffff', mid: 'rgba(56, 189, 248, 0.9)', tail: 'rgba(192, 132, 252, 0)' }, // Cyan to Aurora
            { head: '#ffffff', mid: 'rgba(253, 224, 71, 0.9)', tail: 'rgba(249, 115, 22, 0)' },  // Golden Fire
            { head: '#ffffff', mid: 'rgba(147, 197, 253, 0.9)', tail: 'rgba(59, 130, 246, 0)' }  // Deep Astral
          ];
          this.palette = showerColors[Math.floor(Math.random() * showerColors.length)];
        } else {
          this.palette = {
            head: '#ffffff',
            mid: 'rgba(224, 242, 254, 0.85)',
            tail: 'rgba(56, 189, 248, 0)'
          };
        }
      }
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
    }

    draw(ctx) {
      const progress = this.life / this.maxLife;
      let alpha = 1;

      // Smooth fade-in and long graceful fade-out
      if (progress < 0.15) {
        alpha = progress / 0.15;
      } else if (progress > 0.6) {
        alpha = (1 - progress) / 0.4;
      }

      if (alpha <= 0) return;

      const tailX = this.x - Math.cos(this.angle) * this.length;
      const tailY = this.y - Math.sin(this.angle) * this.length;

      const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
      gradient.addColorStop(0, this.palette.head);
      gradient.addColorStop(0.2, this.palette.mid);
      gradient.addColorStop(1, this.palette.tail);

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.strokeStyle = gradient;
      ctx.lineWidth = this.width;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(tailX, tailY);
      ctx.stroke();

      // Specular glow on the meteor head
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.width * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = this.palette.head;
      ctx.shadowColor = this.palette.mid;
      ctx.shadowBlur = this.isShower ? 20 : 14;
      ctx.fill();

      ctx.restore();
    }

    isDead() {
      return this.life >= this.maxLife || (this.x > width + 300) || (this.y > height + 300);
    }
  }

  // --- Spawner Engine ---
  // 70% Single Falling Star (40% slow, 60% high speed) vs 30% Meteor Shower (lasts 4s)
  function spawnShootingStar() {
    const isSlow = Math.random() < 0.40; // 40% slow falling star, 60% high speed
    meteors.push(new Meteor({
      isShower: false,
      speed: isSlow ? (Math.random() * 2.5 + 4.5) : (Math.random() * 6 + 18),
      length: isSlow ? (Math.random() * 40 + 120) : (Math.random() * 60 + 180),
      maxLife: isSlow ? (Math.random() * 40 + 120) : (Math.random() * 25 + 55),
      width: isSlow ? 1.5 : 2.2
    }));
  }

  function spawnMeteorShower() {
    // 30% Meteor Shower: lasts continuously for 4 full seconds
    const duration = 4000;
    const startTime = Date.now();
    const baseAngle = Math.PI / 4 + (Math.random() * 0.1 - 0.05);
    const originX = Math.random() * (width * 0.8) - 100;
    const originY = -30;

    // Immediate first meteor
    meteors.push(new Meteor({
      isShower: true,
      angle: baseAngle + (Math.random() * 0.04 - 0.02),
      x: originX + (Math.random() * 200 - 60),
      y: originY + (Math.random() * 40 - 20),
      speed: Math.random() * 6 + 15,
      length: Math.random() * 80 + 160,
      width: Math.random() * 1.5 + 2.0
    }));

    // Cascade meteors over the 4-second duration
    if (activeShowerInterval) {
      clearInterval(activeShowerInterval);
      activeShowerInterval = null;
    }
    activeShowerInterval = setInterval(() => {
      if (Date.now() - startTime >= duration || isIdle || !isRunning) {
        clearInterval(activeShowerInterval);
        activeShowerInterval = null;
        return;
      }
      meteors.push(new Meteor({
        isShower: true,
        angle: baseAngle + (Math.random() * 0.05 - 0.025),
        x: originX + (Math.random() * 320 - 80),
        y: originY + (Math.random() * 60 - 30),
        speed: Math.random() * 6 + 15,
        length: Math.random() * 80 + 160,
        width: Math.random() * 1.5 + 2.0
      }));
    }, 200);
  }

  // --- Celestial Spawner & Scheduler ---
  let isRunning = true;
  let animFrameId = null;
  let celestialTimerId = null;
  let activeShowerInterval = null;

  function scheduleCelestialEvent(delay) {
    if (celestialTimerId) {
      clearTimeout(celestialTimerId);
      celestialTimerId = null;
    }
    if (isIdle || !isRunning) return;
    const nextInterval = delay !== undefined ? delay : (Math.random() * 3000 + 3500);
    celestialTimerId = setTimeout(triggerCelestialEvent, nextInterval);
  }

  function triggerCelestialEvent() {
    if (isIdle || !isRunning) return;
    // 70% Single Falling Star, 30% Meteor Shower (lasting 4 seconds)
    const roll = Math.random();
    if (roll < 0.70) {
      spawnShootingStar();
    } else {
      spawnMeteorShower();
    }

    scheduleCelestialEvent();
  }

  // --- Idle / Inactivity Detection Engine ---
  const IDLE_TIMEOUT_MS = 25000; // 25 seconds of silence
  let isIdle = false;
  let isIdleHalted = false;
  let idleTimer = null;
  let lastActivityTime = Date.now();

  function onUserActivity() {
    const now = Date.now();
    // Throttle checks to avoid overhead on rapid mouse moves
    if (now - lastActivityTime < 250 && !isIdle && !isIdleHalted) {
      return;
    }
    lastActivityTime = now;

    if (isIdle || isIdleHalted) {
      wakeUp();
    }

    clearTimeout(idleTimer);
    idleTimer = setTimeout(enterIdle, IDLE_TIMEOUT_MS);
  }

  function enterIdle() {
    isIdle = true;
    if (celestialTimerId) {
      clearTimeout(celestialTimerId);
      celestialTimerId = null;
    }
    if (activeShowerInterval) {
      clearInterval(activeShowerInterval);
      activeShowerInterval = null;
    }
    // If no meteors are currently rendering, halt loop immediately
    if (meteors.length === 0) {
      isIdleHalted = true;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
    }
  }

  function wakeUp() {
    isIdle = false;
    isIdleHalted = false;
    if (isRunning && !animFrameId) {
      animFrameId = requestAnimationFrame(render);
      // Delightful wake-up shooting star
      spawnShootingStar();
      scheduleCelestialEvent(2000);
    }
  }

  // Listen to user interaction signals
  const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'pointerdown', 'scroll', 'wheel'];
  activityEvents.forEach(evt => {
    window.addEventListener(evt, onUserActivity, { passive: true });
  });

  // Expose engine controls for testing and external hooks
  window.celestialEngine = {
    isIdle: () => isIdle,
    isHalted: () => isIdleHalted,
    wakeUp,
    enterIdle
  };

  // Start idle timer initially
  idleTimer = setTimeout(enterIdle, IDLE_TIMEOUT_MS);

  // Initial spawns
  setTimeout(() => { if (!isIdle && isRunning) spawnShootingStar(); }, 600);
  scheduleCelestialEvent(3500);

  /*
   * Animation Frame Renderer & Visibility Lifecycle
   * Draws starfield particles without expensive save/restore stack churn per star,
   * advances meteors, halts rendering cleanly at 0 FPS when idle or hidden, and
   * restores active motion immediately on user interaction.
   */
  // --- Main Animation Loop (60 FPS when active, 0 FPS when idle) ---
  function render() {
    if (!isRunning) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw twinkling background stars across full canvas
    for (let i = 0; i < stars.length; i++) {
      const star = stars[i];
      star.twinklePhase += star.twinkleSpeed;
      const dynamicAlpha = star.alpha * (0.6 + 0.4 * Math.sin(star.twinklePhase));

      ctx.globalAlpha = Math.max(0, Math.min(1, dynamicAlpha));
      ctx.fillStyle = star.color;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // 2. Update and draw active meteors across full viewport (no container masking)
    for (let i = meteors.length - 1; i >= 0; i--) {
      const m = meteors[i];
      m.update();
      m.draw(ctx);
      if (m.isDead()) {
        meteors.splice(i, 1);
      }
    }

    // 3. If idle and all existing meteors have completed, halt the animation loop!
    if (isIdle && meteors.length === 0) {
      isIdleHalted = true;
      animFrameId = null;
      return; // 0 FPS, 0% CPU/GPU overhead while idle
    }

    animFrameId = requestAnimationFrame(render);
  }

  // --- Visibility & Lifecycle Management ---
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
        animFrameId = null;
      }
      if (celestialTimerId) {
        clearTimeout(celestialTimerId);
        celestialTimerId = null;
      }
      if (activeShowerInterval) {
        clearInterval(activeShowerInterval);
        activeShowerInterval = null;
      }
    } else {
      isRunning = true;
      onUserActivity();
      if (!isIdleHalted && !animFrameId) {
        animFrameId = requestAnimationFrame(render);
        scheduleCelestialEvent(2500);
      }
    }
  });

  window.addEventListener('resize', resize);

  // Initialize
  resize();
  animFrameId = requestAnimationFrame(render);
})();
