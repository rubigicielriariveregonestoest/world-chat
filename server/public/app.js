// World Chat — Client Application
(() => {
  // --- Audio Synthesizer (Web Audio API) ---
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  const SoundFX = {
    // 1. Soft tactile neomorphic micro-click
    click() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.025);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.025);
      } catch (_) {}
    },

    // 2. Dropdown / Menu Open (Smooth upward pop/flutter)
    menuOpen() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(680, now + 0.06);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
      } catch (_) {}
    },

    // 3. Dropdown / Menu Close (Descending tuck-in click)
    menuClose() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      } catch (_) {}
    },

    // 4. Swipe Drag Start (Tactile pickup snap)
    swipeStart() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(280, now + 0.018);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.018);
      } catch (_) {}
    },

    // 5. Swipe Hint / Warning bounce (When user clicks instead of swiping)
    swipeHint() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.05);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.12);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      } catch (_) {}
    },

    // 6. Message Sent (Satisfying ascending celestial tri-tone chord)
    sendSuccess() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const notes = [587.33, 739.99, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const start = now + (idx * 0.035);

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, start);

          gain.gain.setValueAtTime(0.09, start);
          gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(start);
          osc.stop(start + 0.14);
        });
      } catch (_) {}
    },

    // 7. Message Received (Dual starlight pop D5 -> A5)
    receiveMessage() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
      } catch (_) {}
    },

    // 8. Toggle Switch ON (Crisp high-register tactile switch)
    toggleOn(forcePlay = false) {
      if (!state.soundEnabled && !forcePlay) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.035);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
      } catch (_) {}
    },

    // 9. Toggle Switch OFF (Muffled lower tactile switch)
    toggleOff() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(380, now + 0.035);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
      } catch (_) {}
    },

    // 10. Theme Switch (Resonant harmonic fifth bell E5 + B5)
    themeSwitch() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [659.25, 987.77].forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.26);
        });
      } catch (_) {}
    },

    // 11. Profile Color Palette Swatch Click (Pentatonic bubble pop)
    colorSelect(index = 0) {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const scale = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.5, 1567.98];
        const freq = scale[Math.abs(index) % scale.length];

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 0.9, now);
        osc.frequency.exponentialRampToValueAtTime(freq, now + 0.04);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.08);
      } catch (_) {}
    },

    // 12. Modal Open (Warm ambient swell C5 + G5)
    modalOpen() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        [523.25, 783.99].forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          gain.gain.setValueAtTime(0.06, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.13);
        });
      } catch (_) {}
    },

    // 13. Modal Close (Soft acoustic thud)
    modalClose() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.05);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } catch (_) {}
    },

    // 14. File Attachment Staged
    attach() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(550, now + 0.045);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
      } catch (_) {}
    },

    // 15. File Attachment Canceled
    detach() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
      } catch (_) {}
    },

    // 16. Chat Photo Expanded in Lightbox
    imageExpand() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.07);

        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.07);
      } catch (_) {}
    },

    // 17. Scroll to Bottom Clicked
    scroll() {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.09);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.09);
      } catch (_) {}
    },

    // 18. Toast Alert (Informational or Error)
    toast(type = 'info') {
      if (!state.soundEnabled) return;
      try {
        const ctx = getAudioContext();
        const now = ctx.currentTime;
        if (type === 'error') {
          // Low double alert buzz
          [280, 220].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const start = now + (i * 0.06);

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.06, start);
            gain.gain.exponentialRampToValueAtTime(0.001, start + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 0.05);
          });
        } else {
          // Soft bright chime (880Hz)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, now);

          gain.gain.setValueAtTime(0.07, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.12);
        }
      } catch (_) {}
    },

    // 19. Slowmode Cooldown / Rate Limit Error
    errorAlert() {
      this.toast('error');
    }
  };

  function playPopSound() {
    SoundFX.receiveMessage();
  }

  // --- Palettes & Generators (Trust & Calm Color Psychology) ---
  const COLOR_PALETTE = [
    '#38bdf8', // Aurora Cerulean
    '#2563eb', // Trust Sapphire
    '#0d9488', // Balanced Sage Teal
    '#2dd4bf', // Serene Seafoam
    '#6366f1', // Calm Indigo
    '#0284c7', // Clear Sky Blue
    '#10b981', // Tranquil Emerald
    '#8b5cf6', // Twilight Lavender
    '#64748b'  // Structured Slate
  ];

  const WIDGET_SWATCHES = {
    accent: ['#38bdf8', '#2563eb', '#0d9488', '#6366f1', '#14b8a6', '#0284c7'],
    incomingDark: ['#253042', '#1f2937', '#263340', '#2b3245', '#1d2d35'],
    incomingLight: ['#f4f7fb', '#edf2f7', '#eef6f5', '#f1f0fb', '#f8fafc'],
    outgoingDark: ['#1e3b5a', '#164e63', '#1e3a8a', '#134e4a', '#2e2a5e'],
    outgoingLight: ['#dbe8f8', '#d5f0ec', '#e0e7ff', '#d1fae5', '#e0f2fe'],
    surfaceDark: ['#212b3c', '#1c2536', '#1e2f38', '#23283d', '#1f2937'],
    surfaceLight: ['#eef3fa', '#e6eef8', '#eaf4f4', '#edeff8', '#f1f5f9']
  };

  function loadSavedWidgetColors() {
    try {
      const raw = localStorage.getItem('wc_widget_colors');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          return {
            accent: parsed.accent || '',
            incoming: parsed.incoming || '',
            outgoing: parsed.outgoing || '',
            surface: parsed.surface || ''
          };
        }
      }
    } catch (_) {}
    return { accent: '', incoming: '', outgoing: '', surface: '' };
  }

  const ADJECTIVES = ['Cosmic', 'Starlight', 'Astro', 'Nova', 'Nebula', 'Eclipse', 'Quantum', 'Solar', 'Zenith', 'Celestial', 'Lunar', 'Astral'];
  const NOUNS = ['Pulsar', 'Voyager', 'Comet', 'Falcon', 'Orion', 'Nomad', 'Spark', 'Phoenix', 'Star', 'Specter', 'Drifter', 'Echo'];

  function generateRandomIdentity() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const token = 'guest_' + Math.random().toString(36).substring(2, 10);
    return {
      username: `${adj}${noun}#${num}`,
      color,
      clientToken: token,
      userId: 'usr_' + token.substring(0, 8)
    };
  }

  // --- Application State ---
  const state = {
    username: localStorage.getItem('wc_username') || '',
    color: localStorage.getItem('wc_color') || '',
    clientToken: localStorage.getItem('wc_token') || '',
    userId: localStorage.getItem('wc_userId') || '',
    soundEnabled: localStorage.getItem('wc_sound') !== 'false',
    safeMode: localStorage.getItem('wc_safemode') === 'true',
    theme: (function() {
      const saved = localStorage.getItem('worldchat_theme');
      if (saved === 'neomorphism-light' || saved === 'neomorphism' || saved === 'light') {
        return 'neomorphism-light';
      }
      return 'neomorphism-dark';
    })(),
    widgetColors: loadSavedWidgetColors(),
    messageMood: 'default',
    stagedFile: null,
    stagedFileUrl: null,
    replyTo: null,
    isUploading: false,
    isNearBottom: true,
    lastTypingSent: 0
  };

  // Initialize guest profile if not stored
  if (!state.clientToken || !state.username) {
    const generated = generateRandomIdentity();
    state.username = generated.username;
    state.color = generated.color;
    state.clientToken = generated.clientToken;
    state.userId = generated.userId;
    localStorage.setItem('wc_username', state.username);
    localStorage.setItem('wc_color', state.color);
    localStorage.setItem('wc_token', state.clientToken);
    localStorage.setItem('wc_userId', state.userId);
  }

  // --- Neomorphic Volumetric Icons Registry ---
  const Icons = {
    eye: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="neo-icon"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
    eyeOff: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="neo-icon"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`,
    volumeOn: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="neo-icon"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`,
    volumeOff: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="neo-icon"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="neo-icon"><path d="M12.3 2a10 10 0 0 0-1.9 19.8 10 10 0 0 0 11.5-11.5 10 10 0 0 1-9.6-8.3z"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="neo-icon"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>`,
    reply: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" class="neo-icon"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>`,
    camera: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" class="neo-icon"><path d="M9 3L7.17 5H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3.17L15 3H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.65 0-3 1.35-3 3s1.35 3 3 3 3-1.35 3-3-1.35-3-3-3z"/></svg>`,
    close: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" class="neo-icon"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" class="neo-icon"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/></svg>`,
    timer: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="neo-icon"><path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>`,
    upload: `<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" class="neo-icon"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>`,
    alertTriangle: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="neo-icon"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>`,
    info: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" class="neo-icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>`,
    react: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" class="neo-icon"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>`
  };

  // --- Animated SVG Reactions Registry (Zero Raw Emojis) ---
  const REACTION_TYPES = ['heart', 'haha', 'wow', 'sad', 'angry'];
  const REACTION_LABELS = {
    heart: 'Heart',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry'
  };
  const ReactionIcons = {
    heart: `<svg viewBox="0 0 24 24" class="reaction-svg react-heart" aria-hidden="true"><defs><linearGradient id="rg-heart" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#fb7185"/><stop offset="100%" stop-color="#e11d48"/></linearGradient></defs><path fill="url(#rg-heart)" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/><circle cx="7.5" cy="7.5" r="1.4" fill="rgba(255,255,255,0.55)"/></svg>`,
    haha: `<svg viewBox="0 0 24 24" class="reaction-svg react-haha" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fbbf24"/><path d="M7.2 9.8c.7-.9 1.9-.9 2.6 0M14.2 9.8c.7-.9 1.9-.9 2.6 0" stroke="#78350f" stroke-width="1.8" stroke-linecap="round" fill="none"/><path d="M7.5 13.5c1.1 2.7 3 4 4.5 4s3.4-1.3 4.5-4H7.5z" fill="#78350f"/><path d="M9.4 16c.8.8 1.7 1.2 2.6 1.2s1.8-.4 2.6-1.2c-.8-.6-1.7-.9-2.6-.9s-1.8.3-2.6.9z" fill="#fb7185"/></svg>`,
    wow: `<svg viewBox="0 0 24 24" class="reaction-svg react-wow" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#fcd34d"/><path d="M7.5 8.2c.8-.6 1.6-.6 2.2 0M14.3 8.2c.8-.6 1.6-.6 2.2 0" stroke="#78350f" stroke-width="1.5" stroke-linecap="round" fill="none"/><circle cx="8.8" cy="10.8" r="1.35" fill="#78350f"/><circle cx="15.2" cy="10.8" r="1.35" fill="#78350f"/><ellipse cx="12" cy="16" rx="2.1" ry="2.8" fill="#78350f"/></svg>`,
    sad: `<svg viewBox="0 0 24 24" class="reaction-svg react-sad" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="#60a5fa"/><circle cx="8.6" cy="10.5" r="1.3" fill="#1e3a8a"/><circle cx="15.4" cy="10.5" r="1.3" fill="#1e3a8a"/><path d="M8.5 16.4c1.1-1.3 2.3-1.8 3.5-1.8s2.4.5 3.5 1.8" stroke="#1e3a8a" stroke-width="1.8" stroke-linecap="round" fill="none"/><path class="sad-tear" d="M16.5 12.2c.8 1.2 1.2 2.1 1.2 2.8a1.2 1.2 0 1 1-2.4 0c0-.7.4-1.6 1.2-2.8z" fill="#e0f2fe"/></svg>`,
    angry: `<svg viewBox="0 0 24 24" class="reaction-svg react-angry" aria-hidden="true"><defs><linearGradient id="rg-angry" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f97316"/><stop offset="100%" stop-color="#dc2626"/></linearGradient></defs><circle cx="12" cy="12" r="10" fill="url(#rg-angry)"/><path d="M7.2 8.5l3.2 1.5M16.8 8.5l-3.2 1.5" stroke="#450a0a" stroke-width="1.9" stroke-linecap="round"/><circle cx="8.8" cy="11.5" r="1.25" fill="#450a0a"/><circle cx="15.2" cy="11.5" r="1.25" fill="#450a0a"/><path d="M8.8 16.2c1-.9 2.1-1.3 3.2-1.3s2.2.4 3.2 1.3" stroke="#450a0a" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>`
  };

  // --- DOM Elements ---
  const onlineCountEl = document.getElementById('online-count');
  const userAvatarEl = document.getElementById('user-avatar');
  const userDisplayNameEl = document.getElementById('user-display-name');
  const profileDropdownWrapper = document.getElementById('profile-dropdown-wrapper');
  const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
  const dropdownUserAvatar = document.getElementById('dropdown-user-avatar');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const openWidgetsBtn = document.getElementById('open-widgets-btn');
  const toggleSoundBtn = document.getElementById('toggle-sound-btn');
  const toggleBlurBtn = document.getElementById('toggle-blur-btn');
  const safeModeIcon = document.getElementById('safe-mode-icon');
  const safeModeBadge = document.getElementById('safe-mode-badge');
  const soundBadge = document.getElementById('sound-badge');
  const soundIcon = document.getElementById('sound-icon');
  const themeBtn = document.getElementById('theme-btn');
  const themeIconEl = document.getElementById('theme-icon');
  const themeBadge = document.getElementById('theme-badge');
  const profileBtn = document.getElementById('profile-btn');

  const chatViewport = document.getElementById('chat-viewport');
  const messagesList = document.getElementById('messages-list');
  const typingIndicator = document.getElementById('typing-indicator');
  const typingText = document.getElementById('typing-text');
  const scrollBottomBtn = document.getElementById('scroll-bottom-btn');

  const attachmentBar = document.getElementById('attachment-preview-bar');
  const previewImage = document.getElementById('preview-image');
  const previewFilename = document.getElementById('preview-filename');
  const previewFilesize = document.getElementById('preview-filesize');
  const cancelAttachmentBtn = document.getElementById('cancel-attachment-btn');

  const replyPreviewBar = document.getElementById('reply-preview-bar');
  const replyBarAccent = document.getElementById('reply-bar-accent');
  const replyBarTarget = document.getElementById('reply-bar-target');
  const replyBarSnippet = document.getElementById('reply-bar-snippet');
  const cancelReplyBtn = document.getElementById('cancel-reply-btn');

  const chatForm = document.getElementById('chat-form');
  const chatInputBubble = document.getElementById('chat-input-bubble');
  const messageInput = document.getElementById('message-input');
  const charCounter = document.getElementById('char-counter');
  const beautifyWrapper = document.getElementById('beautify-wrapper');
  const beautifyBtn = document.getElementById('beautify-btn');
  const beautifyMoodDot = document.getElementById('beautify-mood-dot');
  const beautifyPopover = document.getElementById('beautify-popover');
  const polishMsgBtn = document.getElementById('polish-msg-btn');
  const beautifyMoodRow = document.getElementById('beautify-mood-row');
  const attachBtn = document.getElementById('attach-btn');
  const plusBtn = document.getElementById('plus-btn');
  const actionsPopup = document.getElementById('actions-popup');
  const fileInput = document.getElementById('file-input');
  const sendBtn = document.getElementById('send-btn');

  const swipeNoticeModal = document.getElementById('swipe-notice-modal');
  const closeSwipeNoticeBtn = document.getElementById('close-swipe-notice');
  const confirmSwipeNoticeBtn = document.getElementById('confirm-swipe-notice-btn');
  const dismissSwipeNoticeCb = document.getElementById('dismiss-swipe-notice-cb');

  const profileModal = document.getElementById('profile-modal');
  const closeProfileModalBtn = document.getElementById('close-profile-modal');
  const tabIdentityBtn = document.getElementById('tab-identity-btn');
  const tabWidgetsBtn = document.getElementById('tab-widgets-btn');
  const tabIdentityPanel = document.getElementById('tab-identity-panel');
  const tabWidgetsPanel = document.getElementById('tab-widgets-panel');
  const customNameInput = document.getElementById('custom-name-input');
  const colorPaletteEl = document.getElementById('color-palette');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const modalPreviewAvatar = document.getElementById('modal-preview-avatar');
  const modalPreviewName = document.getElementById('modal-preview-name');

  const widgetAccentPicker = document.getElementById('widget-accent-picker');
  const widgetIncomingPicker = document.getElementById('widget-incoming-picker');
  const widgetOutgoingPicker = document.getElementById('widget-outgoing-picker');
  const widgetSurfacePicker = document.getElementById('widget-surface-picker');
  const widgetAccentSwatches = document.getElementById('widget-accent-swatches');
  const widgetIncomingSwatches = document.getElementById('widget-incoming-swatches');
  const widgetOutgoingSwatches = document.getElementById('widget-outgoing-swatches');
  const widgetSurfaceSwatches = document.getElementById('widget-surface-swatches');
  const previewIncomingBubble = document.getElementById('preview-incoming-bubble');
  const previewOutgoingBubble = document.getElementById('preview-outgoing-bubble');
  const resetWidgetsBtn = document.getElementById('reset-widgets-btn');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxDownload = document.getElementById('lightbox-download');
  const closeLightboxBtn = document.getElementById('close-lightbox');

  const toastContainer = document.getElementById('toast-container');

  let modalSelectedColor = state.color;
  let modalWidgetColors = { ...state.widgetColors };

  // --- Toast Notifications ---
  function showToast(message, type = 'info', duration = 3500) {
    SoundFX.toast(type);
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const iconSvg = type === 'error' ? Icons.alertTriangle : Icons.info;
    toast.innerHTML = `<span class="toast-icon">${iconSvg}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, duration);
  }

  // --- UI Update Helpers ---
  function updateHeaderProfile() {
    userAvatarEl.style.backgroundColor = state.color;
    userAvatarEl.innerText = state.username.charAt(0);
    userDisplayNameEl.innerText = state.username;

    if (dropdownUserAvatar) {
      dropdownUserAvatar.style.backgroundColor = state.color;
      dropdownUserAvatar.innerText = state.username.charAt(0);
    }
    if (dropdownUserName) {
      dropdownUserName.innerText = state.username;
    }
  }

  function updateTogglesUI() {
    // Sound Button & Badge inside Dropdown
    if (state.soundEnabled) {
      toggleSoundBtn.classList.add('active');
      if (soundIcon) soundIcon.innerHTML = Icons.volumeOn;
      if (soundBadge) {
        soundBadge.innerText = 'On';
        soundBadge.className = 'dropdown-item-badge on';
      }
    } else {
      toggleSoundBtn.classList.remove('active');
      if (soundIcon) soundIcon.innerHTML = Icons.volumeOff;
      if (soundBadge) {
        soundBadge.innerText = 'Muted';
        soundBadge.className = 'dropdown-item-badge off';
      }
    }

    // Safe Mode Button & Badge inside Dropdown
    if (state.safeMode) {
      toggleBlurBtn.classList.add('active');
      messagesList.classList.add('safe-blur');
      if (safeModeIcon) safeModeIcon.innerHTML = Icons.eye;
      if (safeModeBadge) {
        safeModeBadge.innerText = 'On';
        safeModeBadge.className = 'dropdown-item-badge on';
      }
    } else {
      toggleBlurBtn.classList.remove('active');
      messagesList.classList.remove('safe-blur');
      if (safeModeIcon) safeModeIcon.innerHTML = Icons.eyeOff;
      if (safeModeBadge) {
        safeModeBadge.innerText = 'Off';
        safeModeBadge.className = 'dropdown-item-badge off';
      }
    }
  }

  // --- Color Widget Contrast & Styling Helpers ---
  function isValidHexColor(hex) {
    return /^#([0-9a-fA-F]{6})$/.test(String(hex || '').trim());
  }

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16)
    };
  }

  function computeContrastText(hex) {
    if (!isValidHexColor(hex)) return '#f1f5f9';
    const { r, g, b } = hexToRgb(hex);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.56 ? '#0f172a' : '#f8fafc';
  }

  function adjustHexColor(hex, delta) {
    if (!isValidHexColor(hex)) return hex;
    const { r, g, b } = hexToRgb(hex);
    const clamp = v => Math.max(0, Math.min(255, v));
    const toHex = v => clamp(v).toString(16).padStart(2, '0');
    return `#${toHex(r + delta)}${toHex(g + delta)}${toHex(b + delta)}`;
  }

  function applyWidgetColors(colorsObj = state.widgetColors) {
    const root = document.documentElement;
    const isLight = state.theme === 'neomorphism-light';

    if (isValidHexColor(colorsObj.accent)) {
      root.style.setProperty('--accent-cyan', colorsObj.accent);
      root.style.setProperty('--accent-hover', adjustHexColor(colorsObj.accent, isLight ? -16 : 18));
      root.style.setProperty('--accent-btn-text', computeContrastText(colorsObj.accent));
    } else {
      root.style.removeProperty('--accent-cyan');
      root.style.removeProperty('--accent-hover');
      root.style.removeProperty('--accent-btn-text');
    }

    if (isValidHexColor(colorsObj.incoming)) {
      const shaded = adjustHexColor(colorsObj.incoming, isLight ? -6 : -10);
      root.style.setProperty('--bubble-incoming-bg', `linear-gradient(145deg, ${colorsObj.incoming}, ${shaded})`);
      root.style.setProperty('--bubble-incoming-text', computeContrastText(colorsObj.incoming));
    } else {
      root.style.removeProperty('--bubble-incoming-bg');
      root.style.removeProperty('--bubble-incoming-text');
    }

    if (isValidHexColor(colorsObj.outgoing)) {
      const shaded = adjustHexColor(colorsObj.outgoing, isLight ? -8 : -12);
      root.style.setProperty('--bubble-outgoing-bg', `linear-gradient(145deg, ${colorsObj.outgoing}, ${shaded})`);
      root.style.setProperty('--bubble-outgoing-text', computeContrastText(colorsObj.outgoing));
    } else {
      root.style.removeProperty('--bubble-outgoing-bg');
      root.style.removeProperty('--bubble-outgoing-text');
    }

    if (isValidHexColor(colorsObj.surface)) {
      root.style.setProperty('--widget-surface-bg', colorsObj.surface);
      root.style.setProperty('--widget-surface-hover', adjustHexColor(colorsObj.surface, isLight ? 8 : 10));
    } else {
      root.style.removeProperty('--widget-surface-bg');
      root.style.removeProperty('--widget-surface-hover');
    }
  }

  function applyTheme(theme) {
    const activeTheme = (theme === 'neomorphism-light' || theme === 'neomorphism' || theme === 'light')
      ? 'neomorphism-light'
      : 'neomorphism-dark';
    state.theme = activeTheme;
    document.documentElement.setAttribute('data-theme', activeTheme);
    localStorage.setItem('worldchat_theme', activeTheme);

    if (themeBtn) {
      if (activeTheme === 'neomorphism-light') {
        themeBtn.classList.add('active');
        if (themeIconEl) themeIconEl.innerHTML = Icons.sun;
        if (themeBadge) {
          themeBadge.innerText = 'Light';
          themeBadge.className = 'dropdown-item-badge theme';
        }
      } else {
        themeBtn.classList.remove('active');
        if (themeIconEl) themeIconEl.innerHTML = Icons.moon;
        if (themeBadge) {
          themeBadge.innerText = 'Dark';
          themeBadge.className = 'dropdown-item-badge theme';
        }
      }
    }

    applyWidgetColors(state.widgetColors);

    if (window.setCelestialTheme) {
      window.setCelestialTheme(activeTheme);
    }
  }

  updateHeaderProfile();
  updateTogglesUI();
  applyTheme(state.theme);

  // --- Socket.IO Connection ---
  const socket = io();

  socket.on('connect', () => {
    console.log('[Socket] Connected to World Chat server');
    socket.emit('auth:guest_join', {
      username: state.username,
      color: state.color,
      clientToken: state.clientToken,
      userId: state.userId
    });
  });

  socket.on('presence:update', (data) => {
    const count = data.onlineCount || 1;
    onlineCountEl.innerHTML = `<span class="online-num">${count.toLocaleString()}</span> online<span class="online-room-suffix"> in World Chat</span>`;
  });

  socket.on('world:history', (historyMessages) => {
    messagesList.innerHTML = '';
    if (Array.isArray(historyMessages)) {
      historyMessages.forEach(msg => appendMessage(msg, msg.userId === state.userId));
    }
    scrollToBottom(true);
  });

  socket.on('chat:broadcast', (msg) => {
    const isOwn = msg.userId === state.userId;
    appendMessage(msg, isOwn);
    if (!isOwn) playPopSound();

    if (state.isNearBottom || isOwn) {
      scrollToBottom();
    } else {
      scrollBottomBtn.classList.remove('hidden');
    }
  });

  socket.on('chat:reaction_update', (payload) => {
    if (!payload || !payload.messageId) return;
    const msgEl = messagesList.querySelector(`[data-msg-id="${payload.messageId}"]`);
    if (msgEl) {
      renderMessageReactions(msgEl, payload.reactions, true);
    }
  });

  socket.on('typing:update', (data) => {
    const typers = (data.typingUsers || []).filter(name => name !== state.username);
    if (typers.length === 0) {
      typingIndicator.classList.add('hidden');
    } else {
      typingIndicator.classList.remove('hidden');
      if (typers.length === 1) {
        typingText.innerText = `${typers[0]} is typing...`;
      } else if (typers.length === 2) {
        typingText.innerText = `${typers[0]} and ${typers[1]} are typing...`;
      } else {
        typingText.innerText = `${typers[0]} and ${typers.length - 1} others are typing...`;
      }
    }
  });

  socket.on('chat:error', (err) => {
    showToast(err.message || 'Error sending message', 'error');
    if (err.cooldown) {
      triggerCooldownDisplay(err.cooldown);
    }
  });

  // --- Message Rendering ---
  function formatTimestamp(isoString) {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (_) {
      return '';
    }
  }

  function formatSafeRichText(rawText) {
    if (!rawText) return '';
    // Raw text from server is already HTML-escaped by sanitizeText; apply safe inline formatting & links
    let out = String(rawText);
    out = out.replace(/`([^`\n]+?)`/g, '<code class="fmt-mono">$1</code>');
    out = out.replace(/\*\*([^*\n]+?)\*\*/g, '<strong class="fmt-bold">$1</strong>');
    out = out.replace(/\*([^*\n]+?)\*/g, '<em class="fmt-italic">$1</em>');
    out = out.replace(/==([^=\n]+?)==/g, '<mark class="fmt-highlight">$1</mark>');
    out = out.replace(
      /(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    return out;
  }

  function renderMessageReactions(msgEl, reactions = {}, burstAnimate = false) {
    const row = msgEl.querySelector('.msg-reactions-row');
    if (!row) return;

    const previousCounts = {};
    row.querySelectorAll('.reaction-pill').forEach(btn => {
      previousCounts[btn.dataset.reaction] = Number(btn.dataset.count || 0);
    });

    row.innerHTML = '';
    const msgId = msgEl.dataset.msgId;
    if (!msgId) return;

    let hasAny = false;
    REACTION_TYPES.forEach(type => {
      const users = Array.isArray(reactions[type]) ? reactions[type] : [];
      if (users.length === 0) return;
      hasAny = true;

      const isActive = users.includes(state.userId);
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = `reaction-pill ${isActive ? 'active' : ''}`;
      if (burstAnimate && users.length !== (previousCounts[type] || 0)) {
        pill.classList.add('is-burst');
      }
      pill.dataset.reaction = type;
      pill.dataset.count = String(users.length);
      pill.title = `${REACTION_LABELS[type]} (${users.length})`;
      pill.innerHTML = `${ReactionIcons[type]}<span>${users.length}</span>`;

      pill.addEventListener('click', (e) => {
        e.stopPropagation();
        SoundFX.click();
        socket.emit('chat:react', { messageId: msgId, reaction: type });
      });

      row.appendChild(pill);
    });

    row.classList.toggle('hidden', !hasAny);
  }

  function closeAllReactionPickers() {
    document.querySelectorAll('.reaction-picker').forEach(el => el.remove());
    document.querySelectorAll('.msg-react-btn.active').forEach(el => el.classList.remove('active'));
  }

  document.addEventListener('click', () => {
    closeAllReactionPickers();
  });

  function appendMessage(msg, isOwn = false) {
    const item = document.createElement('div');
    const senderId = msg.userId || msg.username || 'guest';
    const prevItem = messagesList.lastElementChild;
    const isConsecutive = prevItem && prevItem.dataset.senderId === senderId && !msg.replyTo;

    if (isConsecutive) {
      item.className = `message-item consecutive-item ${isOwn ? 'own-message' : ''}`;
      prevItem.classList.add('has-following');
    } else {
      item.className = `message-item ${isOwn ? 'own-message' : ''}`;
    }
    item.dataset.senderId = senderId;
    if (msg.id) {
      item.dataset.msgId = msg.id;
    }

    const formattedTime = formatTimestamp(msg.timestamp);
    const formattedText = formatSafeRichText(msg.text || '');

    const allowedMoods = ['calm', 'spotlight', 'greeting'];
    const moodClass = allowedMoods.includes(msg.styleVariant) ? `mood-${msg.styleVariant}` : '';

    let imageHtml = '';
    if (msg.imageUrl) {
      imageHtml = `
        <div class="msg-image-container">
          <img src="${msg.imageUrl}" class="msg-image" alt="Uploaded photo" loading="lazy">
          <div class="blur-overlay-tag">${Icons.eye} <span>Click to view</span></div>
        </div>
      `;
    }

    // Sanitize author and color defensively to prevent DOM injection
    const safeAuthorName = (msg.username || 'Guest')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    const safeAuthorColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(msg.color) ? msg.color : '#38bdf8';

    // Render author name externally above the bubble row (omitted on consecutive messages from the same sender)
    const authorHtml = !isConsecutive
      ? `<div class="msg-author-external" style="color: ${safeAuthorColor}">${safeAuthorName}</div>`
      : '';

    // Render reply quote block if this message is replying to another message
    let replyQuoteHtml = '';
    if (msg.replyTo && msg.replyTo.id) {
      let quoteSnippet = '';
      if (msg.replyTo.text) {
        quoteSnippet = msg.replyTo.text.length > 70
          ? msg.replyTo.text.substring(0, 70) + '...'
          : msg.replyTo.text;
        if (msg.replyTo.imageUrl) {
          quoteSnippet += ' [Photo]';
        }
      } else if (msg.replyTo.imageUrl) {
        quoteSnippet = '[Photo]';
      } else {
        quoteSnippet = '...';
      }

      const safeSnippet = quoteSnippet
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      const snippetWithIcon = msg.replyTo.imageUrl
        ? `${Icons.camera} <span>${safeSnippet}</span>`
        : safeSnippet;

      const safeQuoteAuthor = (msg.replyTo.username || 'Guest')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      const safeQuoteColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(msg.replyTo.color)
        ? msg.replyTo.color
        : 'var(--accent-cyan)';

      replyQuoteHtml = `
        <div class="msg-reply-quote" data-reply-to-id="${msg.replyTo.id}" style="border-left-color: ${safeQuoteColor};" title="Click to view original message">
          <div class="reply-quote-header" style="color: ${safeQuoteColor};">
            <span class="reply-quote-icon">${Icons.reply}</span>
            <span class="reply-quote-author">${safeQuoteAuthor}</span>
          </div>
          <div class="reply-quote-snippet">${snippetWithIcon}</div>
        </div>
      `;
    }

    // Floating cloud bubble with reactions row, external timestamp, react & reply buttons
    item.innerHTML = `
      ${authorHtml}
      <div class="msg-bubble-row">
        <div class="msg-bubble-col">
          <div class="msg-cloud-bubble ${moodClass}">
            ${replyQuoteHtml}
            ${formattedText ? `<div class="msg-text">${formattedText}</div>` : ''}
            ${imageHtml}
          </div>
          <div class="msg-reactions-row hidden"></div>
        </div>
        <span class="msg-time-external">${formattedTime}</span>
        <button type="button" class="msg-react-btn" title="React to message" aria-label="React">
          <span>${Icons.react}</span>
        </button>
        <button type="button" class="msg-reply-btn" title="Reply to this message" aria-label="Reply">
          <span class="reply-btn-icon">${Icons.reply}</span>
        </button>
      </div>
    `;

    // Populate any existing reactions from history
    renderMessageReactions(item, msg.reactions || {});

    // Click handler for react button (opens animated picker above/beside bubble)
    const reactBtn = item.querySelector('.msg-react-btn');
    const bubbleCol = item.querySelector('.msg-bubble-col');
    if (reactBtn && bubbleCol && msg.id) {
      reactBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const alreadyOpen = bubbleCol.querySelector('.reaction-picker');
        closeAllReactionPickers();
        if (alreadyOpen) return;

        SoundFX.menuOpen();
        reactBtn.classList.add('active');
        const picker = document.createElement('div');
        picker.className = 'reaction-picker';
        REACTION_TYPES.forEach(type => {
          const pickBtn = document.createElement('button');
          pickBtn.type = 'button';
          pickBtn.className = 'reaction-pick-btn';
          pickBtn.title = REACTION_LABELS[type];
          pickBtn.setAttribute('aria-label', REACTION_LABELS[type]);
          pickBtn.innerHTML = ReactionIcons[type];
          pickBtn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            SoundFX.click();
            socket.emit('chat:react', { messageId: msg.id, reaction: type });
            closeAllReactionPickers();
          });
          picker.appendChild(pickBtn);
        });
        bubbleCol.insertBefore(picker, bubbleCol.firstChild);
      });
    }

    // Click handler for reply button
    const replyBtn = item.querySelector('.msg-reply-btn');
    if (replyBtn) {
      replyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startReply(msg);
      });
    }

    // Click handler for reply quote block (smooth scroll & highlight original message)
    const quoteEl = item.querySelector('.msg-reply-quote');
    if (quoteEl) {
      quoteEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const targetId = quoteEl.dataset.replyToId;
        if (!targetId) return;
        const targetEl = messagesList.querySelector(`[data-msg-id="${targetId}"]`);
        if (targetEl) {
          SoundFX.click();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          const targetBubble = targetEl.querySelector('.msg-cloud-bubble') || targetEl;
          targetBubble.classList.remove('reply-pulse-highlight');
          void targetBubble.offsetWidth; // Force CSS reflow
          targetBubble.classList.add('reply-pulse-highlight');
          setTimeout(() => {
            targetBubble.classList.remove('reply-pulse-highlight');
          }, 2000);
        } else {
          showToast('Original message is further up in history', 'info');
        }
      });
    }

    // Click handler for images: unblur or open lightbox
    const imgEl = item.querySelector('.msg-image');
    if (imgEl) {
      imgEl.addEventListener('click', (e) => {
        const container = imgEl.closest('.msg-image-container');
        if (state.safeMode && !container.classList.contains('unblurred')) {
          SoundFX.click();
          container.classList.add('unblurred');
        } else {
          openLightbox(msg.imageUrl);
        }
      });
    }

    messagesList.appendChild(item);
  }

  // --- Scroll Management ---
  chatViewport.addEventListener('scroll', () => {
    const threshold = 120;
    const scrollPos = chatViewport.scrollTop + chatViewport.clientHeight;
    state.isNearBottom = (chatViewport.scrollHeight - scrollPos) <= threshold;

    if (state.isNearBottom) {
      scrollBottomBtn.classList.add('hidden');
    }
  });

  function scrollToBottom(instant = false) {
    if (instant) {
      chatViewport.scrollTop = chatViewport.scrollHeight;
    } else {
      chatViewport.scrollTo({ top: chatViewport.scrollHeight, behavior: 'smooth' });
    }
    scrollBottomBtn.classList.add('hidden');
  }

  scrollBottomBtn.addEventListener('click', () => {
    SoundFX.scroll();
    scrollToBottom();
  });

  // --- Character Counter & Typing Status ---
  messageInput.addEventListener('input', () => {
    const len = messageInput.value.length;
    charCounter.innerText = `${len} / 350`;

    if (len >= 350) {
      charCounter.className = 'char-counter limit';
    } else if (len >= 300) {
      charCounter.className = 'char-counter warning';
    } else {
      charCounter.className = 'char-counter';
    }

    // Emit typing indicator throttled
    const now = Date.now();
    if (now - state.lastTypingSent > 2500) {
      state.lastTypingSent = now;
      socket.emit('typing:update', { isTyping: len > 0 });
    }
  });

  messageInput.addEventListener('blur', () => {
    socket.emit('typing:update', { isTyping: false });
  });

  // --- Photo Attachment & Plus Popup Handling ---
  if (plusBtn && actionsPopup) {
    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = actionsPopup.classList.contains('hidden');
      actionsPopup.classList.toggle('hidden');
      if (willOpen) {
        SoundFX.menuOpen();
      } else {
        SoundFX.menuClose();
      }
    });

    document.addEventListener('click', (e) => {
      if (!actionsPopup.contains(e.target) && e.target !== plusBtn) {
        if (!actionsPopup.classList.contains('hidden')) {
          SoundFX.menuClose();
        }
        actionsPopup.classList.add('hidden');
      }
    });
  }

  attachBtn.addEventListener('click', () => {
    SoundFX.click();
    if (actionsPopup) actionsPopup.classList.add('hidden');
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) handleSelectedFile(file);
  });

  // Drag and Drop photos directly into chat
  ['dragenter', 'dragover'].forEach(eventName => {
    chatViewport.addEventListener(eventName, (e) => {
      e.preventDefault();
      chatViewport.style.background = 'rgba(56, 189, 248, 0.05)';
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    chatViewport.addEventListener(eventName, (e) => {
      e.preventDefault();
      chatViewport.style.background = '';
    });
  });

  chatViewport.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        handleSelectedFile(file);
      } else {
        showToast('Please drop an image file (JPG, PNG, WEBP, GIF)', 'error');
      }
    }
  });

  function handleSelectedFile(file) {
    // 5 MB limit check
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo is too large! Maximum allowed size is 5 MB.', 'error');
      fileInput.value = '';
      return;
    }

    state.stagedFile = file;
    state.stagedFileUrl = URL.createObjectURL(file);

    previewImage.src = state.stagedFileUrl;
    previewFilename.innerText = file.name;
    previewFilesize.innerText = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    SoundFX.attach();
    attachmentBar.classList.remove('hidden');
    messageInput.focus();
  }

  cancelAttachmentBtn.addEventListener('click', clearAttachment);

  function clearAttachment() {
    SoundFX.detach();
    if (state.stagedFileUrl) {
      URL.revokeObjectURL(state.stagedFileUrl);
    }
    state.stagedFile = null;
    state.stagedFileUrl = null;
    fileInput.value = '';
    attachmentBar.classList.add('hidden');
  }

  // --- Reply System Actions ---
  function startReply(msg) {
    if (!msg || !msg.id) return;
    state.replyTo = {
      id: msg.id,
      username: msg.username || 'Guest',
      color: msg.color || '#f59e0b',
      text: msg.text || '',
      imageUrl: msg.imageUrl || null
    };

    replyBarAccent.style.backgroundColor = state.replyTo.color;
    replyBarTarget.textContent = `Replying to ${state.replyTo.username}`;
    replyBarTarget.style.color = state.replyTo.color;

    let snippet = '';
    if (state.replyTo.text) {
      snippet = state.replyTo.text.length > 80 
        ? state.replyTo.text.substring(0, 80) + '...' 
        : state.replyTo.text;
      if (state.replyTo.imageUrl) {
        snippet += ' [Photo]';
      }
    } else if (state.replyTo.imageUrl) {
      snippet = '[Photo]';
    } else {
      snippet = '...';
    }

    const safeSnippet = snippet
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    if (state.replyTo.imageUrl) {
      replyBarSnippet.innerHTML = `${Icons.camera} <span>${safeSnippet}</span>`;
    } else {
      replyBarSnippet.textContent = snippet;
    }

    replyPreviewBar.classList.remove('hidden');
    messageInput.focus();
    SoundFX.click();
  }

  function clearReply() {
    if (!state.replyTo) return;
    state.replyTo = null;
    replyPreviewBar.classList.add('hidden');
    SoundFX.detach();
  }

  cancelReplyBtn.addEventListener('click', clearReply);

  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.replyTo) {
      clearReply();
    }
  });

  const sendBtnIconHtml = `
    <span class="send-btn-icon">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
      </svg>
    </span>
    <span class="send-btn-label">
      <span>Swipe</span>
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
      </svg>
    </span>
  `;

  // --- Slowmode Cooldown Timer UI ---
  function triggerCooldownDisplay(seconds) {
    sendBtn.disabled = true;
    sendBtn.classList.add('countdown');
    let rem = seconds;
    sendBtn.innerHTML = `${Icons.timer} <span>${rem}s</span>`;
    const interval = setInterval(() => {
      rem--;
      if (rem <= 0) {
        clearInterval(interval);
        sendBtn.disabled = false;
        sendBtn.classList.remove('countdown');
        sendBtn.innerHTML = sendBtnIconHtml;
      } else {
        sendBtn.innerHTML = `${Icons.timer} <span>${rem}s</span>`;
      }
    }, 1000);
  }

  // --- Message Dispatch Engine ---
  async function handleSendMessage() {
    const text = messageInput.value.trim();

    if (!text && !state.stagedFile) return;

    if (text.length > 350) {
      showToast('Message exceeds 350 character limit.', 'error');
      return;
    }

    let uploadedImageUrl = null;

    // Handle photo upload if attached
    if (state.stagedFile) {
      try {
        state.isUploading = true;
        sendBtn.disabled = true;
        sendBtn.innerHTML = `${Icons.upload} <span>Sending...</span>`;

        const formData = new FormData();
        formData.append('photo', state.stagedFile);

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'x-client-id': state.clientToken
          },
          body: formData
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to upload photo.');
        }

        uploadedImageUrl = data.imageUrl;
      } catch (uploadErr) {
        showToast(uploadErr.message, 'error');
        state.isUploading = false;
        sendBtn.disabled = false;
        sendBtn.innerHTML = sendBtnIconHtml;
        return;
      }
    }

    // Emit message to World Chat
    socket.emit('chat:send', {
      text,
      imageUrl: uploadedImageUrl,
      styleVariant: state.messageMood || 'default',
      replyToId: state.replyTo ? state.replyTo.id : null
    });

    // Reset input states
    messageInput.value = '';
    charCounter.innerText = '0 / 350';
    charCounter.className = 'char-counter';
    setMessageMood('default');
    clearAttachment();
    if (state.replyTo) {
      state.replyTo = null;
      replyPreviewBar.classList.add('hidden');
    }

    state.isUploading = false;
    sendBtn.disabled = false;
    sendBtn.innerHTML = sendBtnIconHtml;
    sendBtn.style.transform = 'translateY(-50%)';
    messageInput.focus();
  }

  // --- Message Beautifier Engine (Before Sending) ---
  function setMessageMood(mood) {
    state.messageMood = mood || 'default';
    if (beautifyMoodRow) {
      beautifyMoodRow.querySelectorAll('.beautify-mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === state.messageMood);
      });
    }
    if (beautifyMoodDot) {
      beautifyMoodDot.classList.toggle('hidden', state.messageMood === 'default');
    }
  }

  function applyComposerFormat(type) {
    const delimiters = {
      bold: ['**', '**'],
      italic: ['*', '*'],
      highlight: ['==', '=='],
      mono: ['`', '`']
    };
    const pair = delimiters[type];
    if (!pair) return;

    const start = messageInput.selectionStart ?? messageInput.value.length;
    const end = messageInput.selectionEnd ?? messageInput.value.length;
    const val = messageInput.value;
    const selected = val.substring(start, end);
    const wrapped = `${pair[0]}${selected || 'text'}${pair[1]}`;
    const nextVal = val.substring(0, start) + wrapped + val.substring(end);

    if (nextVal.length > 350) {
      showToast('Formatted text exceeds 350 character limit.', 'error');
      return;
    }

    messageInput.value = nextVal;
    messageInput.focus();
    const cursorStart = start + pair[0].length;
    const cursorEnd = cursorStart + (selected ? selected.length : 4);
    messageInput.setSelectionRange(cursorStart, cursorEnd);
    messageInput.dispatchEvent(new Event('input'));
    SoundFX.click();
  }

  function polishMessageText(str) {
    let text = String(str || '').trim().replace(/\s{2,}/g, ' ');
    if (!text) return '';
    // Capitalize first letter and sentence starts neatly
    text = text.charAt(0).toUpperCase() + text.slice(1);
    text = text.replace(/([.!?]\s+)([a-z])/g, (_, sep, ch) => sep + ch.toUpperCase());
    // Smart arrows and ellipses (ASCII/math glyphs only, zero emojis)
    text = text.replace(/\s*->\s*/g, ' \u2192 ');
    text = text.replace(/\.{4,}/g, '...');
    return text.substring(0, 350);
  }

  if (beautifyBtn && beautifyPopover) {
    beautifyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = beautifyPopover.classList.contains('hidden');
      if (isHidden) {
        SoundFX.menuOpen();
        beautifyPopover.classList.remove('hidden');
        beautifyBtn.classList.add('active');
        beautifyBtn.setAttribute('aria-expanded', 'true');
      } else {
        SoundFX.menuClose();
        beautifyPopover.classList.add('hidden');
        beautifyBtn.classList.remove('active');
        beautifyBtn.setAttribute('aria-expanded', 'false');
      }
    });

    beautifyPopover.querySelectorAll('.beautify-tool-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        applyComposerFormat(btn.dataset.format);
      });
    });

    if (polishMsgBtn) {
      polishMsgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const polished = polishMessageText(messageInput.value);
        if (!polished) {
          showToast('Type a message first to polish it.', 'info');
          return;
        }
        messageInput.value = polished;
        messageInput.dispatchEvent(new Event('input'));
        SoundFX.click();
        showToast('Message polished!', 'info', 2000);
      });
    }

    if (beautifyMoodRow) {
      beautifyMoodRow.querySelectorAll('.beautify-mood-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          SoundFX.click();
          setMessageMood(btn.dataset.mood);
        });
      });
    }

    document.addEventListener('click', (e) => {
      if (beautifyWrapper && !beautifyWrapper.contains(e.target) && !beautifyPopover.classList.contains('hidden')) {
        beautifyPopover.classList.add('hidden');
        beautifyBtn.classList.remove('active');
        beautifyBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Swipe-to-Send Gesture Engine & Click Feedback ---
  let swipeClickCount = 0;
  let swipeHintTimeout = null;
  let isDraggingSend = false;
  let startDragX = 0;
  let currentDragX = 0;
  let maxDragDistance = 0;
  let hasMovedSignificantly = false;

  sendBtn.addEventListener('pointerdown', (e) => {
    if (sendBtn.disabled || state.isUploading || sendBtn.classList.contains('countdown')) return;
    
    SoundFX.swipeStart();

    // Capture pointer for continuous drag tracking
    sendBtn.setPointerCapture(e.pointerId);
    isDraggingSend = true;
    hasMovedSignificantly = false;
    startDragX = e.clientX;
    currentDragX = 0;

    const bubbleWidth = chatInputBubble.clientWidth;
    const btnWidth = sendBtn.offsetWidth;
    maxDragDistance = Math.max(0, bubbleWidth - btnWidth - 10);

    sendBtn.classList.add('is-dragging');
    sendBtn.classList.remove('swipe-hint');
    clearTimeout(swipeHintTimeout);
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDraggingSend) return;

    const deltaX = e.clientX - startDragX;
    if (Math.abs(deltaX) > 6) {
      hasMovedSignificantly = true;
    }

    currentDragX = Math.max(0, Math.min(deltaX, maxDragDistance));
    sendBtn.style.transform = `translateY(-50%) translateX(${currentDragX}px)`;
  });

  function endSendDrag(e) {
    if (!isDraggingSend) return;
    isDraggingSend = false;
    sendBtn.classList.remove('is-dragging');

    try {
      if (e && e.pointerId !== undefined && sendBtn.hasPointerCapture(e.pointerId)) {
        sendBtn.releasePointerCapture(e.pointerId);
      }
    } catch (_) {}

    // Check if swiped >= 85% of total travel distance
    if (maxDragDistance > 0 && currentDragX >= maxDragDistance * 0.85) {
      // Swiped successfully across the input field!
      SoundFX.sendSuccess();
      sendBtn.style.transform = 'translateY(-50%) translateX(0px)';
      swipeClickCount = 0;
      handleSendMessage();
    } else {
      // Rebound back to far left starting position
      sendBtn.style.transform = 'translateY(-50%) translateX(0px)';

      // If user merely clicked instead of swiping
      if (!hasMovedSignificantly) {
        handleSendBtnClick();
      }
    }
  }

  sendBtn.addEventListener('pointerup', endSendDrag);
  sendBtn.addEventListener('pointercancel', endSendDrag);

  function handleSendBtnClick() {
    swipeClickCount++;
    SoundFX.swipeHint();

    // 1st click: show inline hint with rightward nudge animation
    sendBtn.classList.add('swipe-hint');
    clearTimeout(swipeHintTimeout);
    swipeHintTimeout = setTimeout(() => {
      sendBtn.classList.remove('swipe-hint');
    }, 2200);

    // 2nd+ click: if user still clicked, display educational popup modal
    if (swipeClickCount >= 2) {
      const isDismissed = localStorage.getItem('wc_dismiss_swipe_notice') === 'true';
      if (!isDismissed && swipeNoticeModal) {
        SoundFX.modalOpen();
        swipeNoticeModal.classList.remove('hidden');
      }
    }
  }

  // --- Swipe Notice Modal Controls ---
  function closeSwipeNotice() {
    SoundFX.modalClose();
    if (dismissSwipeNoticeCb && dismissSwipeNoticeCb.checked) {
      localStorage.setItem('wc_dismiss_swipe_notice', 'true');
    }
    if (swipeNoticeModal) {
      swipeNoticeModal.classList.add('hidden');
    }
  }

  if (closeSwipeNoticeBtn) closeSwipeNoticeBtn.addEventListener('click', closeSwipeNotice);
  if (confirmSwipeNoticeBtn) confirmSwipeNoticeBtn.addEventListener('click', closeSwipeNotice);
  if (swipeNoticeModal) {
    swipeNoticeModal.addEventListener('click', (e) => {
      if (e.target === swipeNoticeModal) {
        closeSwipeNotice();
      }
    });
  }

  // Desktop Enter key shortcut
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSendMessage();
  });

  // --- Header Toggles ---
  toggleSoundBtn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem('wc_sound', state.soundEnabled ? 'true' : 'false');
    updateTogglesUI();
    if (state.soundEnabled) {
      SoundFX.toggleOn(true);
    } else {
      SoundFX.toggleOff();
    }
    showToast(state.soundEnabled ? 'Sound alerts enabled' : 'Sound muted');
  });

  toggleBlurBtn.addEventListener('click', () => {
    state.safeMode = !state.safeMode;
    localStorage.setItem('wc_safemode', state.safeMode ? 'true' : 'false');
    updateTogglesUI();
    if (state.safeMode) {
      SoundFX.toggleOn();
    } else {
      SoundFX.toggleOff();
    }
    showToast(state.safeMode ? 'Safe mode on: photos are blurred' : 'Safe mode off: photos visible');
  });

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const nextTheme = state.theme === 'neomorphism-light' ? 'neomorphism-dark' : 'neomorphism-light';
      SoundFX.themeSwitch();
      applyTheme(nextTheme);
      showToast(
        nextTheme === 'neomorphism-light'
          ? 'Switched to Neomorphism Light (Serene Alabaster)'
          : 'Switched to Neomorphism Dark (Midnight Harbor)'
      );
    });
  }

  // --- Profile Dropdown Toggle ---
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = !profileDropdownMenu.classList.contains('hidden');
    if (isExpanded) {
      SoundFX.menuClose();
      profileDropdownMenu.classList.add('hidden');
      profileBtn.classList.remove('active');
      profileBtn.setAttribute('aria-expanded', 'false');
    } else {
      SoundFX.menuOpen();
      profileDropdownMenu.classList.remove('hidden');
      profileBtn.classList.add('active');
      profileBtn.setAttribute('aria-expanded', 'true');
    }
  });

  // Close dropdown on outside click
  document.addEventListener('click', (e) => {
    if (profileDropdownWrapper && !profileDropdownWrapper.contains(e.target)) {
      if (!profileDropdownMenu.classList.contains('hidden')) {
        SoundFX.menuClose();
      }
      profileDropdownMenu.classList.add('hidden');
      profileBtn.classList.remove('active');
      profileBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close dropdown on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !profileDropdownMenu.classList.contains('hidden')) {
      SoundFX.menuClose();
      profileDropdownMenu.classList.add('hidden');
      profileBtn.classList.remove('active');
      profileBtn.setAttribute('aria-expanded', 'false');
    }
  });

  function switchModalTab(tabName) {
    const isWidgets = tabName === 'widgets';
    if (tabIdentityBtn) {
      tabIdentityBtn.classList.toggle('active', !isWidgets);
      tabIdentityBtn.setAttribute('aria-selected', String(!isWidgets));
    }
    if (tabWidgetsBtn) {
      tabWidgetsBtn.classList.toggle('active', isWidgets);
      tabWidgetsBtn.setAttribute('aria-selected', String(isWidgets));
    }
    if (tabIdentityPanel) tabIdentityPanel.classList.toggle('hidden', isWidgets);
    if (tabWidgetsPanel) tabWidgetsPanel.classList.toggle('hidden', !isWidgets);
  }

  function renderWidgetSwatches(containerEl, list, selectedHex, onPick) {
    if (!containerEl) return;
    containerEl.innerHTML = '';
    list.forEach((hex, idx) => {
      const sw = document.createElement('button');
      sw.type = 'button';
      sw.className = `widget-swatch ${selectedHex && selectedHex.toLowerCase() === hex.toLowerCase() ? 'selected' : ''}`;
      sw.style.backgroundColor = hex;
      sw.title = hex;
      sw.addEventListener('click', () => {
        SoundFX.colorSelect(idx);
        onPick(hex);
      });
      containerEl.appendChild(sw);
    });
  }

  function updateWidgetControlsUI() {
    const isLight = state.theme === 'neomorphism-light';
    const incomingList = isLight ? WIDGET_SWATCHES.incomingLight : WIDGET_SWATCHES.incomingDark;
    const outgoingList = isLight ? WIDGET_SWATCHES.outgoingLight : WIDGET_SWATCHES.outgoingDark;
    const surfaceList = isLight ? WIDGET_SWATCHES.surfaceLight : WIDGET_SWATCHES.surfaceDark;

    const defaultAccent = isLight ? '#2563eb' : '#38bdf8';
    const defaultIncoming = isLight ? '#f4f7fb' : '#253042';
    const defaultOutgoing = isLight ? '#dbe8f8' : '#1e3b5a';
    const defaultSurface = isLight ? '#eef3fa' : '#212b3c';

    if (widgetAccentPicker) widgetAccentPicker.value = isValidHexColor(modalWidgetColors.accent) ? modalWidgetColors.accent : defaultAccent;
    if (widgetIncomingPicker) widgetIncomingPicker.value = isValidHexColor(modalWidgetColors.incoming) ? modalWidgetColors.incoming : defaultIncoming;
    if (widgetOutgoingPicker) widgetOutgoingPicker.value = isValidHexColor(modalWidgetColors.outgoing) ? modalWidgetColors.outgoing : defaultOutgoing;
    if (widgetSurfacePicker) widgetSurfacePicker.value = isValidHexColor(modalWidgetColors.surface) ? modalWidgetColors.surface : defaultSurface;

    renderWidgetSwatches(widgetAccentSwatches, WIDGET_SWATCHES.accent, modalWidgetColors.accent, (hex) => {
      modalWidgetColors.accent = hex;
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
    });
    renderWidgetSwatches(widgetIncomingSwatches, incomingList, modalWidgetColors.incoming, (hex) => {
      modalWidgetColors.incoming = hex;
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
    });
    renderWidgetSwatches(widgetOutgoingSwatches, outgoingList, modalWidgetColors.outgoing, (hex) => {
      modalWidgetColors.outgoing = hex;
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
    });
    renderWidgetSwatches(widgetSurfaceSwatches, surfaceList, modalWidgetColors.surface, (hex) => {
      modalWidgetColors.surface = hex;
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
    });

    if (previewIncomingBubble) {
      const inc = isValidHexColor(modalWidgetColors.incoming) ? modalWidgetColors.incoming : '';
      previewIncomingBubble.style.background = inc || '';
      previewIncomingBubble.style.color = inc ? computeContrastText(inc) : '';
    }
    if (previewOutgoingBubble) {
      const out = isValidHexColor(modalWidgetColors.outgoing) ? modalWidgetColors.outgoing : '';
      previewOutgoingBubble.style.background = out || '';
      previewOutgoingBubble.style.color = out ? computeContrastText(out) : '';
    }
  }

  function openCustomizationModal(initialTab = 'identity') {
    SoundFX.modalOpen();
    profileDropdownMenu.classList.add('hidden');
    profileBtn.classList.remove('active');
    profileBtn.setAttribute('aria-expanded', 'false');
    customNameInput.value = state.username;
    modalSelectedColor = state.color;
    modalWidgetColors = { ...state.widgetColors };
    renderColorPalette();
    updateModalPreview();
    updateWidgetControlsUI();
    switchModalTab(initialTab);
    profileModal.classList.remove('hidden');
  }

  // Open customization modal from the dropdown's Edit or Color Widgets buttons
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => openCustomizationModal('identity'));
  }
  if (openWidgetsBtn) {
    openWidgetsBtn.addEventListener('click', () => openCustomizationModal('widgets'));
  }

  if (tabIdentityBtn) tabIdentityBtn.addEventListener('click', () => { SoundFX.click(); switchModalTab('identity'); });
  if (tabWidgetsBtn) tabWidgetsBtn.addEventListener('click', () => { SoundFX.click(); switchModalTab('widgets'); });

  if (widgetAccentPicker) {
    widgetAccentPicker.addEventListener('input', (e) => {
      modalWidgetColors.accent = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
    });
  }
  if (widgetIncomingPicker) {
    widgetIncomingPicker.addEventListener('input', (e) => {
      modalWidgetColors.incoming = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
    });
  }
  if (widgetOutgoingPicker) {
    widgetOutgoingPicker.addEventListener('input', (e) => {
      modalWidgetColors.outgoing = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
    });
  }
  if (widgetSurfacePicker) {
    widgetSurfacePicker.addEventListener('input', (e) => {
      modalWidgetColors.surface = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
    });
  }

  if (resetWidgetsBtn) {
    resetWidgetsBtn.addEventListener('click', () => {
      SoundFX.click();
      modalWidgetColors = { accent: '', incoming: '', outgoing: '', surface: '' };
      updateWidgetControlsUI();
      applyWidgetColors(modalWidgetColors);
      showToast('Color widgets reset to calm defaults (click Save to keep)', 'info');
    });
  }

  function closeAndRevertModalIfUnsaved() {
    SoundFX.modalClose();
    applyWidgetColors(state.widgetColors);
    profileModal.classList.add('hidden');
  }

  closeProfileModalBtn.addEventListener('click', closeAndRevertModalIfUnsaved);

  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      closeAndRevertModalIfUnsaved();
    }
  });

  function renderColorPalette() {
    colorPaletteEl.innerHTML = '';
    COLOR_PALETTE.forEach((c, idx) => {
      const dot = document.createElement('div');
      dot.className = `color-dot ${c === modalSelectedColor ? 'selected' : ''}`;
      dot.style.backgroundColor = c;
      dot.addEventListener('click', () => {
        SoundFX.colorSelect(idx);
        modalSelectedColor = c;
        renderColorPalette();
        updateModalPreview();
      });
      colorPaletteEl.appendChild(dot);
    });
  }

  function updateModalPreview() {
    const previewName = customNameInput.value.trim() || 'Guest';
    modalPreviewName.innerText = previewName;
    modalPreviewName.style.color = modalSelectedColor;
    modalPreviewAvatar.style.backgroundColor = modalSelectedColor;
    modalPreviewAvatar.innerText = previewName.charAt(0).toUpperCase();
  }

  customNameInput.addEventListener('input', updateModalPreview);

  saveProfileBtn.addEventListener('click', () => {
    SoundFX.click();
    let newName = customNameInput.value.trim();
    if (!newName) newName = 'Guest#' + Math.floor(1000 + Math.random() * 9000);
    if (newName.length > 24) newName = newName.substring(0, 24);

    state.username = newName;
    state.color = modalSelectedColor;
    state.widgetColors = { ...modalWidgetColors };

    localStorage.setItem('wc_username', state.username);
    localStorage.setItem('wc_color', state.color);
    localStorage.setItem('wc_widget_colors', JSON.stringify(state.widgetColors));

    updateHeaderProfile();
    applyWidgetColors(state.widgetColors);
    profileModal.classList.add('hidden');

    // Notify server of updated name/color
    socket.emit('auth:guest_join', {
      username: state.username,
      color: state.color,
      clientToken: state.clientToken,
      userId: state.userId
    });

    showToast('Profile & color widgets saved!', 'info');
  });

  // --- Lightbox Modal ---
  function openLightbox(url) {
    SoundFX.imageExpand();
    lightboxImg.src = url;
    lightboxDownload.href = url;
    lightboxModal.classList.remove('hidden');
  }

  closeLightboxBtn.addEventListener('click', () => {
    SoundFX.modalClose();
    lightboxModal.classList.add('hidden');
  });

  lightboxModal.addEventListener('click', (e) => {
    if (e.target === lightboxModal || e.target.classList.contains('lightbox-content')) {
      SoundFX.modalClose();
      lightboxModal.classList.add('hidden');
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const profileWasOpen = !profileModal.classList.contains('hidden');
      const modalOpen = !lightboxModal.classList.contains('hidden') || profileWasOpen;
      if (modalOpen) {
        SoundFX.modalClose();
      }
      if (profileWasOpen) {
        applyWidgetColors(state.widgetColors);
      }
      if (beautifyPopover && !beautifyPopover.classList.contains('hidden')) {
        beautifyPopover.classList.add('hidden');
        if (beautifyBtn) {
          beautifyBtn.classList.remove('active');
          beautifyBtn.setAttribute('aria-expanded', 'false');
        }
      }
      closeAllReactionPickers();
      lightboxModal.classList.add('hidden');
      profileModal.classList.add('hidden');
    }
  });
})();
