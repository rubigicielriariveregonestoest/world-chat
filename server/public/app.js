/*
 * World Chat — Client Application Bootstrap & Tactile Sound Synthesizer
 * Initializes the self-contained Web Audio API synthesizer providing zero-latency
 * tactile feedback (clicks, menu opens, color swatch chimes, swipe & toast tones)
 * without relying on external audio files.
 */
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
    surfaceLight: ['#eef3fa', '#e6eef8', '#eaf4f4', '#edeff8', '#f1f5f9'],
    backdropDark: ['#1a2230', '#18202c', '#17252a', '#1e1f30', '#1c2329'],
    backdropLight: ['#e7edf5', '#e3ecf5', '#e3f0ee', '#eae8f4', '#edf2f7']
  };

  const EMPTY_WIDGET_COLORS = { accent: '', incoming: '', outgoing: '', surface: '', backdrop: '' };

  function normalizeWidgetSet(raw) {
    if (!raw || typeof raw !== 'object') return { ...EMPTY_WIDGET_COLORS };
    return {
      accent: raw.accent || '',
      incoming: raw.incoming || '',
      outgoing: raw.outgoing || '',
      surface: raw.surface || '',
      backdrop: raw.backdrop || ''
    };
  }

  function cloneWidgetMap(map) {
    return {
      'neomorphism-dark': normalizeWidgetSet(map && map['neomorphism-dark']),
      'neomorphism-light': normalizeWidgetSet(map && map['neomorphism-light'])
    };
  }

  function getThemeKey(theme) {
    return (theme === 'neomorphism-light' || theme === 'neomorphism' || theme === 'light')
      ? 'neomorphism-light'
      : 'neomorphism-dark';
  }

  function loadSavedWidgetColors(initialTheme = 'neomorphism-dark') {
    const emptyMap = {
      'neomorphism-dark': { ...EMPTY_WIDGET_COLORS },
      'neomorphism-light': { ...EMPTY_WIDGET_COLORS }
    };
    try {
      const raw = localStorage.getItem('wc_widget_colors');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          if (parsed['neomorphism-dark'] || parsed['neomorphism-light']) {
            return cloneWidgetMap(parsed);
          }
          // Migrate legacy flat config exclusively to the initial theme so the opposite stays default
          const key = getThemeKey(initialTheme);
          emptyMap[key] = normalizeWidgetSet(parsed);
          return emptyMap;
        }
      }
    } catch (_) {}
    return emptyMap;
  }

  const ADJECTIVES = ['Cosmic', 'Starlight', 'Astro', 'Nova', 'Nebula', 'Eclipse', 'Quantum', 'Solar', 'Zenith', 'Celestial', 'Lunar', 'Astral'];
  const NOUNS = ['Pulsar', 'Voyager', 'Comet', 'Falcon', 'Orion', 'Nomad', 'Spark', 'Phoenix', 'Star', 'Specter', 'Drifter', 'Echo'];

  const DISTINGUISHED_USER_ICONS = ['🌟', '🚀', '🌙', '☀️', '🪐', '🔥', '⚡', '🧭', '🦋', '🦊', '🐬', '💎'];
  const CLIENT_APP_VERSION = '1.3.0';

  function formatUpdateLabel(version) {
    const clean = String(version || '').trim().replace(/^v/i, '');
    return /^\d+\.\d+\.\d+$/.test(clean) ? `Update ${clean}` : `Update ${CLIENT_APP_VERSION}`;
  }

  const DEFAULT_RELEASE_HISTORY = [
    {
      version: '1.3.0',
      label: formatUpdateLabel('1.3.0'),
      updateNumber: 3,
      commit: 'latest',
      title: 'App Updates History & Semantic Versioning',
      highlights: [
        'Always synchronizes App Updates with each release using strict "Update x.y.z" semantic versioning',
        'Added full History of Changes timeline inside Settings -> App Updates',
        'Added complete Update 1.2.0 and earlier release notes to the App Updates timeline'
      ]
    },
    {
      version: '1.2.0',
      label: formatUpdateLabel('1.2.0'),
      updateNumber: 2,
      commit: '50695b6',
      title: 'Theme Widget Isolation, Owner Delete, Reminders & Resilient Avatars',
      highlights: [
        'Isolated customized Color Widgets per theme (Midnight Dark vs. Serene Light) so neither overrides the other',
        'Added owner-only message deletion with accidental-tap confirmation and clean consecutive group promotion',
        'Added caring, non-scary upload reminders plus >5 MB auto-resize, flexible image formats, and ephemeral-proof avatars'
      ]
    },
    {
      version: '1.1.0',
      label: formatUpdateLabel('1.1.0'),
      updateNumber: 1,
      commit: 'be99c11',
      title: 'Left Bubble Avatars, Distinguished User Icons & Update Notice Popup',
      highlights: [
        'Moved user profile photos onto the left side of chat bubbles paired with each user\'s distinguished icon',
        'Added selectable distinguished icons in Customize Profile & Widgets',
        'Introduced the live Update Notice Popup and Settings -> App Updates checker'
      ]
    },
    {
      version: '1.0.0',
      label: formatUpdateLabel('1.0.0'),
      updateNumber: 0,
      commit: '794c42b',
      title: 'Trust & Calm Neomorphism Foundation',
      highlights: [
        'Midnight Harbor Dark & Serene Alabaster Light 3D neomorphic dome styling',
        'Pre-send message beautifier, animated Noto Color Emoji reactions, and custom profile photos'
      ]
    }
  ];

  const DEFAULT_RELEASE_INFO = {
    version: CLIENT_APP_VERSION,
    label: formatUpdateLabel(CLIENT_APP_VERSION),
    buildId: '',
    title: `World Chat ${formatUpdateLabel(CLIENT_APP_VERSION)} Available`,
    highlights: DEFAULT_RELEASE_HISTORY[0].highlights,
    history: DEFAULT_RELEASE_HISTORY
  };

  function pickDefaultUserIcon(seed) {
    const str = String(seed || 'guest');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
    }
    return DISTINGUISHED_USER_ICONS[Math.abs(hash) % DISTINGUISHED_USER_ICONS.length];
  }

  function resolveUserIcon(rawIcon, seed) {
    if (typeof rawIcon === 'string' && DISTINGUISHED_USER_ICONS.includes(rawIcon.trim())) {
      return rawIcon.trim();
    }
    return pickDefaultUserIcon(seed);
  }

  function generateRandomIdentity() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const num = Math.floor(1000 + Math.random() * 9000);
    const color = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)];
    const token = 'guest_' + Math.random().toString(36).substring(2, 10);
    const userId = 'usr_' + token.substring(0, 8);
    return {
      username: `${adj}${noun}#${num}`,
      color,
      userIcon: pickDefaultUserIcon(userId),
      clientToken: token,
      userId
    };
  }

  /*
   * Identity State, Noto Emoji Registries & Neomorphic Icon Assets
   * Manages persisted guest profile credentials (saved avatar photo URL and
   * distinguished icon), widget color state, structural UI SVG icons, Noto
   * Color Emoji reactions, and the curated Noto Emoji tray for chat drafting.
   */
  // --- Application State ---
  const state = {
    username: localStorage.getItem('wc_username') || '',
    color: localStorage.getItem('wc_color') || '',
    avatarUrl: localStorage.getItem('wc_avatar_url') || '',
    userIcon: localStorage.getItem('wc_user_icon') || '',
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
    widgetColorsByTheme: null,
    messageMood: 'default',
    stagedFile: null,
    stagedFileUrl: null,
    stagedAvatarFile: null,
    stagedAvatarPreviewUrl: null,
    replyTo: null,
    isUploading: false,
    isNearBottom: true,
    lastTypingSent: 0
  };
  state.widgetColorsByTheme = loadSavedWidgetColors(state.theme);

  function getActiveWidgetColors(theme = state.theme) {
    const key = getThemeKey(theme);
    return state.widgetColorsByTheme[key] || { ...EMPTY_WIDGET_COLORS };
  }

  // Initialize guest profile if not stored
  if (!state.clientToken || !state.username) {
    const generated = generateRandomIdentity();
    state.username = generated.username;
    state.color = generated.color;
    state.userIcon = generated.userIcon;
    state.clientToken = generated.clientToken;
    state.userId = generated.userId;
    localStorage.setItem('wc_username', state.username);
    localStorage.setItem('wc_color', state.color);
    localStorage.setItem('wc_user_icon', state.userIcon);
    localStorage.setItem('wc_token', state.clientToken);
    localStorage.setItem('wc_userId', state.userId);
  } else if (!DISTINGUISHED_USER_ICONS.includes(state.userIcon)) {
    state.userIcon = pickDefaultUserIcon(state.userId || state.username);
    localStorage.setItem('wc_user_icon', state.userIcon);
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
    react: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" class="neo-icon"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" class="neo-icon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`
  };

  /*
   * Animated Noto Color Emoji Reactions & Chat Picker Registry
   * Replaces custom SVG emoji illustrations with cross-platform Noto Color Emoji
   * characters styled via CSS keyframe animations for both reactions and chat drafts.
   */
  // --- Animated Noto Color Emoji Reactions Registry ---
  const REACTION_TYPES = ['heart', 'haha', 'wow', 'sad', 'angry'];
  const REACTION_LABELS = {
    heart: 'Heart',
    haha: 'Haha',
    wow: 'Wow',
    sad: 'Sad',
    angry: 'Angry'
  };
  const ReactionIcons = {
    heart: `<span class="noto-emoji react-heart" aria-hidden="true">❤️</span>`,
    haha: `<span class="noto-emoji react-haha" aria-hidden="true">😂</span>`,
    wow: `<span class="noto-emoji react-wow" aria-hidden="true">😮</span>`,
    sad: `<span class="noto-emoji react-sad" aria-hidden="true">😢</span>`,
    angry: `<span class="noto-emoji react-angry" aria-hidden="true">😡</span>`
  };
  const NOTO_CHAT_EMOJIS = [
    '😊', '😂', '🥹', '😍', '🤩', '😎',
    '🙌', '👏', '🤝', '❤️', '✨', '🌟',
    '🌍', '🚀', '🌙', '☀️', '🔥', '🎉'
  ];

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
  const beautifyEmojiRow = document.getElementById('beautify-emoji-row');
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
  const modalPhotoPreview = document.getElementById('modal-photo-preview');
  const profilePhotoInput = document.getElementById('profile-photo-input');
  const chooseProfilePhotoBtn = document.getElementById('choose-profile-photo-btn');
  const removeProfilePhotoBtn = document.getElementById('remove-profile-photo-btn');
  const customNameInput = document.getElementById('custom-name-input');
  const colorPaletteEl = document.getElementById('color-palette');
  const iconPaletteEl = document.getElementById('icon-palette');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const modalPreviewAvatar = document.getElementById('modal-preview-avatar');
  const modalPreviewName = document.getElementById('modal-preview-name');

  const checkUpdateBtn = document.getElementById('check-update-btn');
  const dropdownVersionBadge = document.getElementById('dropdown-version-badge');
  const updateNoticeModal = document.getElementById('update-notice-modal');
  const closeUpdateNoticeBtn = document.getElementById('close-update-notice');
  const laterUpdateBtn = document.getElementById('later-update-btn');
  const confirmUpdateBtn = document.getElementById('confirm-update-btn');
  const updateVersionBadge = document.getElementById('update-version-badge');
  const updateNoticeSubtitle = document.getElementById('update-notice-subtitle');
  const updateHighlightsList = document.getElementById('update-highlights-list');
  const updateHistoryList = document.getElementById('update-history-list');

  const widgetAccentPicker = document.getElementById('widget-accent-picker');
  const widgetIncomingPicker = document.getElementById('widget-incoming-picker');
  const widgetOutgoingPicker = document.getElementById('widget-outgoing-picker');
  const widgetSurfacePicker = document.getElementById('widget-surface-picker');
  const widgetBackdropPicker = document.getElementById('widget-backdrop-picker');
  const widgetAccentSwatches = document.getElementById('widget-accent-swatches');
  const widgetIncomingSwatches = document.getElementById('widget-incoming-swatches');
  const widgetOutgoingSwatches = document.getElementById('widget-outgoing-swatches');
  const widgetSurfaceSwatches = document.getElementById('widget-surface-swatches');
  const widgetBackdropSwatches = document.getElementById('widget-backdrop-swatches');
  const previewIncomingBubble = document.getElementById('preview-incoming-bubble');
  const previewOutgoingBubble = document.getElementById('preview-outgoing-bubble');
  const resetWidgetsBtn = document.getElementById('reset-widgets-btn');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxDownload = document.getElementById('lightbox-download');
  const closeLightboxBtn = document.getElementById('close-lightbox');

  const toastContainer = document.getElementById('toast-container');

  const widgetTargetDarkBtn = document.getElementById('widget-target-dark-btn');
  const widgetTargetLightBtn = document.getElementById('widget-target-light-btn');
  const widgetTargetThemeNote = document.getElementById('widget-target-theme-note');

  const deleteConfirmModal = document.getElementById('delete-confirm-modal');
  const closeDeleteModalBtn = document.getElementById('close-delete-modal');
  const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
  const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
  const deleteConfirmPreview = document.getElementById('delete-confirm-preview');

  const photoReminderModal = document.getElementById('photo-reminder-modal');
  const closePhotoReminderBtn = document.getElementById('close-photo-reminder');
  const closeReminderOkBtn = document.getElementById('close-reminder-ok-btn');
  const photoReminderHeading = document.getElementById('photo-reminder-heading');
  const photoReminderMessage = document.getElementById('photo-reminder-message');
  const photoReminderTip = document.getElementById('photo-reminder-tip');

  let modalSelectedColor = state.color;
  let modalSelectedIcon = state.userIcon;
  let modalEditingTheme = getThemeKey(state.theme);
  let modalInitialTheme = getThemeKey(state.theme);
  let modalWidgetColorsByTheme = cloneWidgetMap(state.widgetColorsByTheme);
  let pendingDeleteMessageId = null;

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

  /*
   * Header Avatar Renderer, Bubble Avatar + Distinguished Icon Builder & Image Optimizer
   * Validates flexible image formats, auto-resizes oversize >5MB photos on canvas,
   * renders circular profile photos with distinguished icons and broken-image fallback,
   * and freezes CSS transitions briefly during theme flips to prevent mobile lag.
   */
  const SUPPORTED_IMAGE_EXT = /\.(jpe?g|jfif|png|webp|gif|avif|bmp|tiff?|ico|svg|heic|heif)$/i;

  function isFlexibleImageFile(file) {
    if (!file) return false;
    const typeOk = Boolean(file.type && file.type.toLowerCase().startsWith('image/'));
    const extOk = Boolean(file.name && SUPPORTED_IMAGE_EXT.test(file.name.trim()));
    return typeOk || extOk;
  }

  function sanitizeAvatarUrl(rawUrl, allowBlob = false) {
    if (typeof rawUrl !== 'string') return '';
    const trimmed = rawUrl.trim();
    if (/^\/uploads\/[a-zA-Z0-9_.-]+\.(webp|gif|png|jpg|jpeg)$/.test(trimmed)) return trimmed;
    if (/^data:image\/(webp|jpeg|png);base64,[A-Za-z0-9+/=]{16,32000}$/.test(trimmed)) return trimmed;
    if (allowBlob && /^blob:https?:\/\//.test(trimmed)) return trimmed;
    return '';
  }

  async function compressImageFileIfNeeded(file, options = {}) {
    if (!file) return file;
    const isProfile = options.target === 'profile';
    const maxBytes = options.maxBytes || (isProfile ? 450 * 1024 : 4.5 * 1024 * 1024);
    const isGif = file.type === 'image/gif' || /\.gif$/i.test(file.name || '');

    // Preserve animated GIFs under 5MB untouched so animation stays intact
    if (isGif && file.size <= 5 * 1024 * 1024) {
      return file;
    }

    const isStandardFast = ['image/jpeg', 'image/png', 'image/webp'].includes((file.type || '').toLowerCase());
    if (!isProfile && isStandardFast && file.size <= maxBytes) {
      return file;
    }

    try {
      let source = null;
      let revokeUrl = '';
      if (typeof createImageBitmap === 'function') {
        try {
          source = await createImageBitmap(file);
        } catch (_) {
          source = null;
        }
      }
      if (!source) {
        source = await new Promise((resolve, reject) => {
          const url = URL.createObjectURL(file);
          revokeUrl = url;
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('decode_failed'));
          img.src = url;
        });
      }

      const origW = source.width || source.naturalWidth || 0;
      const origH = source.height || source.naturalHeight || 0;
      if (!origW || !origH) {
        if (revokeUrl) URL.revokeObjectURL(revokeUrl);
        if (source && typeof source.close === 'function') source.close();
        return file;
      }

      const steps = isProfile
        ? [{ maxDim: 512, q: 0.86 }, { maxDim: 384, q: 0.78 }, { maxDim: 256, q: 0.68 }]
        : [{ maxDim: 1920, q: 0.84 }, { maxDim: 1440, q: 0.76 }, { maxDim: 1080, q: 0.66 }, { maxDim: 800, q: 0.56 }];

      let bestBlob = null;
      for (const step of steps) {
        const scale = Math.min(1, step.maxDim / Math.max(origW, origH));
        const targetW = Math.max(1, Math.round(origW * scale));
        const targetH = Math.max(1, Math.round(origH * scale));
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) break;
        ctx.drawImage(source, 0, 0, targetW, targetH);

        let blob = await new Promise(res => canvas.toBlob(res, 'image/webp', step.q));
        if (!blob || blob.type === 'image/png') {
          blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', step.q));
        }
        if (blob) {
          bestBlob = blob;
          if (blob.size <= maxBytes) break;
        }
      }

      if (revokeUrl) URL.revokeObjectURL(revokeUrl);
      if (source && typeof source.close === 'function') source.close();

      if (bestBlob && (bestBlob.size <= file.size || !isStandardFast || bestBlob.size <= maxBytes)) {
        const ext = bestBlob.type === 'image/jpeg' ? 'jpg' : 'webp';
        const baseName = (file.name || 'photo').replace(/\.[^.]+$/, '');
        return new File([bestBlob], `${baseName}.${ext}`, { type: bestBlob.type, lastModified: Date.now() });
      }
    } catch (_) {
      // Fall back to original file so server Sharp pipeline can convert non-browser formats (e.g. HEIC/TIFF)
    }
    return file;
  }

  // --- UI Update Helpers ---
  function renderAvatarElement(el, avatarUrl, username, color, userIcon = state.userIcon) {
    if (!el) return;
    el.style.backgroundColor = color || 'var(--accent-cyan)';
    const icon = resolveUserIcon(userIcon, username);
    const validUrl = sanitizeAvatarUrl(avatarUrl, true);
    if (validUrl) {
      el.innerHTML = '';
      const img = document.createElement('img');
      img.src = validUrl;
      img.alt = username || 'Avatar';
      img.addEventListener('error', () => {
        el.innerHTML = `<span class="noto-emoji avatar-glyph" aria-hidden="true">${icon}</span>`;
      }, { once: true });
      el.appendChild(img);
    } else {
      el.innerHTML = `<span class="noto-emoji avatar-glyph" aria-hidden="true">${icon}</span>`;
    }
  }

  function applyBubbleAvatarVisual(el, avatarUrl, username, color, userIcon) {
    if (!el) return;
    const safeColor = isValidHexColor(color) ? color : '#38bdf8';
    const icon = resolveUserIcon(userIcon, username);
    const validUrl = sanitizeAvatarUrl(avatarUrl, true);
    el.innerHTML = '';
    if (validUrl) {
      el.style.background = 'var(--bg-card)';
      const img = document.createElement('img');
      img.src = validUrl;
      img.className = 'msg-bubble-avatar-img';
      img.alt = username || 'Avatar';
      img.addEventListener('error', () => {
        applyBubbleAvatarVisual(el, '', username, safeColor, icon);
      }, { once: true });
      el.appendChild(img);

      const badge = document.createElement('span');
      badge.className = 'msg-distinguished-badge';
      badge.title = `Distinguished icon (${icon})`;
      badge.textContent = icon;
      el.appendChild(badge);
    } else {
      const topStop = adjustHexColor(safeColor, 18);
      const bottomStop = adjustHexColor(safeColor, -22);
      el.style.background = `linear-gradient(145deg, ${topStop}, ${bottomStop})`;
      const glyph = document.createElement('span');
      glyph.className = 'msg-bubble-avatar-glyph';
      glyph.setAttribute('aria-hidden', 'true');
      glyph.textContent = icon;
      el.appendChild(glyph);
    }
  }

  function buildBubbleAvatarHtml(avatarUrl, username, color, userIcon) {
    const safeName = (username || 'Guest').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const safeColor = isValidHexColor(color) ? color : '#38bdf8';
    const icon = resolveUserIcon(userIcon, username);
    if (avatarUrl) {
      return `
        <div class="msg-bubble-avatar" title="${safeName} ${icon}" style="background: var(--bg-card);">
          <img src="${avatarUrl}" class="msg-bubble-avatar-img" alt="${safeName}" loading="lazy">
          <span class="msg-distinguished-badge" title="Distinguished icon">${icon}</span>
        </div>
      `;
    }
    const topStop = adjustHexColor(safeColor, 18);
    const bottomStop = adjustHexColor(safeColor, -22);
    return `
      <div class="msg-bubble-avatar" title="${safeName} ${icon}" style="background: linear-gradient(145deg, ${topStop}, ${bottomStop});">
        <span class="msg-bubble-avatar-glyph" aria-hidden="true">${icon}</span>
      </div>
    `;
  }

  function updateHeaderProfile() {
    renderAvatarElement(userAvatarEl, state.avatarUrl, state.username, state.color, state.userIcon);
    userDisplayNameEl.innerText = state.username;

    renderAvatarElement(dropdownUserAvatar, state.avatarUrl, state.username, state.color, state.userIcon);
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

  // Derives convex 145deg dome gradient, translucent rim, and dual surrounding shadows for a custom bubble color
  function buildBubbleNeomorphicTokens(hex, isLight) {
    const topStop = adjustHexColor(hex, isLight ? 9 : 11);
    const bottomStop = adjustHexColor(hex, isLight ? -12 : -14);
    const { r, g, b } = hexToRgb(hex);
    const rimLight = `rgba(${Math.min(255, r + 42)}, ${Math.min(255, g + 42)}, ${Math.min(255, b + 42)}, ${isLight ? 0.65 : 0.16})`;
    const ambientShade = `rgba(${Math.max(0, Math.round(r * 0.42))}, ${Math.max(0, Math.round(g * 0.42))}, ${Math.max(0, Math.round(b * 0.42))}, ${isLight ? 0.24 : 0.42})`;
    const shadow = [
      `7px 7px 16px var(--neo-shadow-dark)`,
      `3px 3px 10px ${ambientShade}`,
      `-6px -6px 14px var(--neo-shadow-light)`,
      `inset 1.5px 1.5px 3px ${rimLight}`,
      `inset -1.5px -1.5px 3px rgba(${Math.max(0, Math.round(r * 0.3))}, ${Math.max(0, Math.round(g * 0.3))}, ${Math.max(0, Math.round(b * 0.3))}, ${isLight ? 0.18 : 0.36})`
    ].join(', ');

    return {
      bg: `linear-gradient(145deg, ${topStop}, ${bottomStop})`,
      text: computeContrastText(hex),
      border: rimLight,
      shadow
    };
  }

  function applyWidgetColors(colorsObj = getActiveWidgetColors(), themeOverride = state.theme) {
    const root = document.documentElement;
    const isLight = getThemeKey(themeOverride) === 'neomorphism-light';
    const colors = normalizeWidgetSet(colorsObj);

    // Surrounding canvas backdrop & global neomorphic shadow harmonization
    if (isValidHexColor(colors.backdrop)) {
      const { r, g, b } = hexToRgb(colors.backdrop);
      const isDarkBackdrop = ((0.299 * r + 0.587 * g + 0.114 * b) / 255) < 0.52;
      root.style.setProperty('--bg-primary', colors.backdrop);
      root.style.setProperty('--bg-secondary', adjustHexColor(colors.backdrop, isDarkBackdrop ? -6 : -8));
      root.style.setProperty(
        '--neo-shadow-dark',
        `rgba(${Math.max(0, Math.round(r * 0.45))}, ${Math.max(0, Math.round(g * 0.45))}, ${Math.max(0, Math.round(b * 0.45))}, ${isDarkBackdrop ? 0.78 : 0.44})`
      );
      root.style.setProperty(
        '--neo-shadow-light',
        `rgba(${Math.min(255, r + 55)}, ${Math.min(255, g + 55)}, ${Math.min(255, b + 55)}, ${isDarkBackdrop ? 0.10 : 0.92})`
      );
      root.style.setProperty(
        '--neo-inset-dark',
        `rgba(${Math.max(0, Math.round(r * 0.40))}, ${Math.max(0, Math.round(g * 0.40))}, ${Math.max(0, Math.round(b * 0.40))}, ${isDarkBackdrop ? 0.84 : 0.46})`
      );
      root.style.setProperty(
        '--neo-inset-light',
        `rgba(${Math.min(255, r + 55)}, ${Math.min(255, g + 55)}, ${Math.min(255, b + 55)}, ${isDarkBackdrop ? 0.08 : 0.90})`
      );
    } else {
      root.style.removeProperty('--bg-primary');
      root.style.removeProperty('--bg-secondary');
      root.style.removeProperty('--neo-shadow-dark');
      root.style.removeProperty('--neo-shadow-light');
      root.style.removeProperty('--neo-inset-dark');
      root.style.removeProperty('--neo-inset-light');
    }

    if (isValidHexColor(colors.accent)) {
      root.style.setProperty('--accent-cyan', colors.accent);
      root.style.setProperty('--accent-hover', adjustHexColor(colors.accent, isLight ? -16 : 18));
      root.style.setProperty('--accent-btn-text', computeContrastText(colors.accent));
    } else {
      root.style.removeProperty('--accent-cyan');
      root.style.removeProperty('--accent-hover');
      root.style.removeProperty('--accent-btn-text');
    }

    if (isValidHexColor(colors.incoming)) {
      const incTokens = buildBubbleNeomorphicTokens(colors.incoming, isLight);
      root.style.setProperty('--bubble-incoming-bg', incTokens.bg);
      root.style.setProperty('--bubble-incoming-text', incTokens.text);
      root.style.setProperty('--bubble-incoming-border', incTokens.border);
      root.style.setProperty('--bubble-incoming-shadow', incTokens.shadow);
    } else {
      root.style.removeProperty('--bubble-incoming-bg');
      root.style.removeProperty('--bubble-incoming-text');
      root.style.removeProperty('--bubble-incoming-border');
      root.style.removeProperty('--bubble-incoming-shadow');
    }

    if (isValidHexColor(colors.outgoing)) {
      const outTokens = buildBubbleNeomorphicTokens(colors.outgoing, isLight);
      root.style.setProperty('--bubble-outgoing-bg', outTokens.bg);
      root.style.setProperty('--bubble-outgoing-text', outTokens.text);
      root.style.setProperty('--bubble-outgoing-border', outTokens.border);
      root.style.setProperty('--bubble-outgoing-shadow', outTokens.shadow);
    } else {
      root.style.removeProperty('--bubble-outgoing-bg');
      root.style.removeProperty('--bubble-outgoing-text');
      root.style.removeProperty('--bubble-outgoing-border');
      root.style.removeProperty('--bubble-outgoing-shadow');
    }

    if (isValidHexColor(colors.surface)) {
      root.style.setProperty('--widget-surface-bg', colors.surface);
      root.style.setProperty('--widget-surface-hover', adjustHexColor(colors.surface, isLight ? 8 : 10));
    } else {
      root.style.removeProperty('--widget-surface-bg');
      root.style.removeProperty('--widget-surface-hover');
    }
  }

  function applyTheme(theme, customColorsOverride = null) {
    const activeTheme = getThemeKey(theme);
    const rootEl = document.documentElement;
    rootEl.classList.add('theme-switching');

    state.theme = activeTheme;
    rootEl.setAttribute('data-theme', activeTheme);
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

    applyWidgetColors(customColorsOverride || getActiveWidgetColors(activeTheme), activeTheme);

    if (window.setCelestialTheme) {
      window.setCelestialTheme(activeTheme);
    }

    // Release transition lock after the browser commits the single-frame theme repaint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        rootEl.classList.remove('theme-switching');
      });
    });
  }

  updateHeaderProfile();
  updateTogglesUI();
  applyTheme(state.theme);

  /*
   * Socket.IO Real-Time Transport & World Stream Handlers
   * Authenticates the active guest profile (display name, accent, saved avatar)
   * on connection and routes live history, chat broadcasts, reactions, and typing.
   */
  /*
   * Update Notice Popup, Release History & Live Version Monitor
   * Tracks server release metadata pushed via Socket.IO and /api/version, renders
   * strict "Update x.y.z" semantic version badges plus the Settings History of
   * Changes timeline, and applies live updates cleanly on Update button click.
   */
  let activeReleaseInfo = { ...DEFAULT_RELEASE_INFO };
  let initialServerBuildId = '';
  let liveUpdateAvailable = false;

  function renderUpdateHistoryList(historyItems) {
    if (!updateHistoryList) return;
    updateHistoryList.innerHTML = '';
    const entries = Array.isArray(historyItems) && historyItems.length > 0
      ? historyItems
      : DEFAULT_RELEASE_HISTORY;

    entries.forEach((entry, index) => {
      const card = document.createElement('div');
      card.className = 'update-history-item';

      const header = document.createElement('div');
      header.className = 'update-history-header';

      const verSpan = document.createElement('span');
      verSpan.className = 'update-history-ver';
      verSpan.textContent = formatUpdateLabel(entry.version);
      header.appendChild(verSpan);

      const badgeText = index === 0
        ? 'Latest'
        : (entry.updateNumber > 0 ? `Update #${entry.updateNumber}` : 'Initial');
      const commitSpan = document.createElement('span');
      commitSpan.className = 'update-history-commit';
      commitSpan.textContent = badgeText;
      header.appendChild(commitSpan);

      card.appendChild(header);

      if (entry.title) {
        const titleEl = document.createElement('div');
        titleEl.className = 'update-history-title';
        titleEl.textContent = String(entry.title);
        card.appendChild(titleEl);
      }

      if (Array.isArray(entry.highlights) && entry.highlights.length > 0) {
        const ul = document.createElement('ul');
        ul.className = 'update-history-bullets';
        entry.highlights.forEach((line) => {
          const li = document.createElement('li');
          li.textContent = String(line);
          ul.appendChild(li);
        });
        card.appendChild(ul);
      }

      updateHistoryList.appendChild(card);
    });
  }

  function openUpdateNoticeModal(release = activeReleaseInfo, isLiveUpdate = liveUpdateAvailable) {
    if (!updateNoticeModal) return;
    const info = release && release.version ? release : DEFAULT_RELEASE_INFO;
    const updateLabel = formatUpdateLabel(info.version);

    if (updateVersionBadge) {
      updateVersionBadge.innerText = updateLabel;
    }
    if (updateNoticeSubtitle) {
      updateNoticeSubtitle.innerText = isLiveUpdate
        ? `World Chat ${updateLabel} is live on the server. Click Update Now to load the latest version.`
        : `Welcome to World Chat ${updateLabel}! Review the latest features and History of Changes below.`;
    }
    if (updateHighlightsList) {
      updateHighlightsList.innerHTML = '';
      const items = Array.isArray(info.highlights) && info.highlights.length > 0
        ? info.highlights
        : DEFAULT_RELEASE_INFO.highlights;
      items.forEach((line) => {
        const li = document.createElement('li');
        li.textContent = String(line);
        updateHighlightsList.appendChild(li);
      });
    }
    renderUpdateHistoryList(info.history);

    if (confirmUpdateBtn) {
      confirmUpdateBtn.disabled = false;
      confirmUpdateBtn.innerText = isLiveUpdate ? 'Update Now' : 'Apply Update';
    }

    SoundFX.modalOpen();
    updateNoticeModal.classList.remove('hidden');
  }

  function closeUpdateNoticeModal() {
    if (!updateNoticeModal || updateNoticeModal.classList.contains('hidden')) return;
    SoundFX.modalClose();
    updateNoticeModal.classList.add('hidden');
  }

  function handleServerReleaseInfo(release, forceOpen = false) {
    if (!release || typeof release !== 'object' || !release.version) return;
    activeReleaseInfo = release;

    if (!initialServerBuildId && release.buildId) {
      initialServerBuildId = release.buildId;
    }

    const versionChanged = release.version !== CLIENT_APP_VERSION;
    const buildChanged = Boolean(initialServerBuildId && release.buildId && release.buildId !== initialServerBuildId);
    liveUpdateAvailable = versionChanged || buildChanged;

    if (dropdownVersionBadge) {
      dropdownVersionBadge.innerText = liveUpdateAvailable ? 'New Update' : formatUpdateLabel(release.version);
      dropdownVersionBadge.className = liveUpdateAvailable ? 'dropdown-item-badge off' : 'dropdown-item-badge on';
    }

    const ackVersion = localStorage.getItem('wc_ack_version') || '';
    const isUnseenRelease = ackVersion !== String(release.version);

    if (forceOpen || liveUpdateAvailable || isUnseenRelease) {
      if (updateNoticeModal && updateNoticeModal.classList.contains('hidden')) {
        openUpdateNoticeModal(release, liveUpdateAvailable);
      }
    }
  }

  async function fetchServerVersion(forceOpen = false) {
    try {
      const res = await fetch('/api/version', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      handleServerReleaseInfo(data, forceOpen);
    } catch (_) {}
  }

  if (checkUpdateBtn) {
    checkUpdateBtn.addEventListener('click', () => {
      SoundFX.click();
      if (profileDropdownMenu) profileDropdownMenu.classList.add('hidden');
      if (profileBtn) {
        profileBtn.classList.remove('active');
        profileBtn.setAttribute('aria-expanded', 'false');
      }
      openUpdateNoticeModal(activeReleaseInfo, liveUpdateAvailable);
      fetchServerVersion(false);
    });
  }

  if (closeUpdateNoticeBtn) closeUpdateNoticeBtn.addEventListener('click', closeUpdateNoticeModal);
  if (laterUpdateBtn) laterUpdateBtn.addEventListener('click', closeUpdateNoticeModal);
  if (updateNoticeModal) {
    updateNoticeModal.addEventListener('click', (e) => {
      if (e.target === updateNoticeModal) {
        closeUpdateNoticeModal();
      }
    });
  }

  if (confirmUpdateBtn) {
    confirmUpdateBtn.addEventListener('click', () => {
      SoundFX.click();
      const targetVersion = String((activeReleaseInfo && activeReleaseInfo.version) || CLIENT_APP_VERSION);
      confirmUpdateBtn.disabled = true;
      confirmUpdateBtn.innerText = 'Updating...';
      localStorage.setItem('wc_ack_version', targetVersion);

      if (liveUpdateAvailable) {
        setTimeout(() => {
          window.location.reload();
        }, 250);
      } else {
        setTimeout(() => {
          if (updateNoticeModal) updateNoticeModal.classList.add('hidden');
          confirmUpdateBtn.disabled = false;
          confirmUpdateBtn.innerText = 'Apply Update';
          showToast(`World Chat updated to ${formatUpdateLabel(targetVersion)}!`, 'info');
        }, 320);
      }
    });
  }

  // --- Socket.IO Connection ---
  const socket = io();

  socket.on('connect', () => {
    console.log('[Socket] Connected to World Chat server');
    // Authenticate active guest identity, saved avatar, and distinguished icon on connection
    socket.emit('auth:guest_join', {
      username: state.username,
      color: state.color,
      avatarUrl: state.avatarUrl || null,
      userIcon: state.userIcon,
      clientToken: state.clientToken,
      userId: state.userId
    });

    // Self-heal if a legacy /uploads/ avatar file vanished after server redeploy/restart
    if (state.avatarUrl && state.avatarUrl.startsWith('/uploads/')) {
      fetch(state.avatarUrl, { method: 'HEAD' }).then((res) => {
        if (!res.ok) {
          state.avatarUrl = '';
          localStorage.setItem('wc_avatar_url', '');
          updateHeaderProfile();
          socket.emit('auth:guest_join', {
            username: state.username,
            color: state.color,
            avatarUrl: null,
            userIcon: state.userIcon,
            clientToken: state.clientToken,
            userId: state.userId
          });
        }
      }).catch(() => {});
    }
  });

  socket.on('world:version', (release) => {
    handleServerReleaseInfo(release, false);
  });

  // Fallback HTTP release check on startup and every 60 seconds
  fetchServerVersion(false);
  setInterval(() => {
    fetchServerVersion(false);
  }, 60000);

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

  socket.on('chat:deleted', (payload) => {
    if (!payload || !payload.messageId) return;
    const msgEl = messagesList.querySelector(`[data-msg-id="${payload.messageId}"]`);
    if (pendingDeleteMessageId === payload.messageId) {
      closeDeleteConfirmModal();
    }
    if (state.replyTo && state.replyTo.id === payload.messageId) {
      clearReply();
    }
    if (msgEl) {
      msgEl.classList.add('removing');
      setTimeout(() => {
        if (msgEl.parentNode) msgEl.remove();
        syncMessageGroupHeaders();
      }, 190);
    }
  });

  /*
   * Caring Photo Upload Reminder & Owner-Only Delete Confirmation Controls
   * Displays gentle, non-alarming reminders when chat or profile photos exceed
   * limits, manages delete confirmations, and promotes orphaned grouped bubbles.
   */
  function closePhotoReminderModal() {
    if (!photoReminderModal || photoReminderModal.classList.contains('hidden')) return;
    SoundFX.modalClose();
    photoReminderModal.classList.add('hidden');
  }

  function showPhotoLimitReminder(kind, options = {}) {
    const targetLabel = options.target === 'profile' ? 'profile photo' : 'chat photo';
    let heading = 'A Gentle Photo Reminder';
    let message = '';
    let tip = 'Friendly tip: Choose JPG, PNG, WEBP, or GIF up to 5 MB for the smoothest upload.';

    if (kind === 'size') {
      const sizeMb = options.sizeBytes ? (options.sizeBytes / (1024 * 1024)).toFixed(2) : 'over 5';
      heading = options.target === 'profile' ? 'Gentle Profile Photo Reminder' : 'A Gentle Photo Reminder';
      message = `Your chosen ${targetLabel} is about ${sizeMb} MB, which is just a little over our caring 5 MB limit. Picking a slightly lighter photo will help it ${options.target === 'profile' ? 'stay crisp and load fast on your profile' : 'upload and share smoothly for everyone'}!`;
      tip = 'Quick idea: A compressed copy or screenshot under 5 MB works wonderfully.';
    } else if (kind === 'type') {
      heading = 'Friendly Format Reminder';
      message = `We couldn't quite open that file as a ${targetLabel} yet. Whenever you're ready, please choose a JPG, PNG, WEBP, or GIF photo — we'd love to help share it!`;
    } else if (kind === 'cooldown') {
      heading = 'Take a Little Breather';
      message = options.message || `You're sharing wonderfully! Please wait just a few seconds before uploading another ${targetLabel}.`;
      tip = 'This brief pause helps keep World Chat responsive and calm for everyone.';
    } else {
      heading = 'Friendly Photo Check';
      message = options.message || `Something about that ${targetLabel} looks slightly incomplete or above our 5 MB limit — choosing another copy should work right away!`;
    }

    if (photoReminderModal && photoReminderMessage) {
      if (photoReminderHeading) photoReminderHeading.textContent = heading;
      photoReminderMessage.textContent = message;
      if (photoReminderTip) photoReminderTip.textContent = tip;
      SoundFX.modalOpen();
      photoReminderModal.classList.remove('hidden');
    } else {
      showToast(message, 'warning', 4500);
    }
  }

  if (closePhotoReminderBtn) closePhotoReminderBtn.addEventListener('click', closePhotoReminderModal);
  if (closeReminderOkBtn) closeReminderOkBtn.addEventListener('click', closePhotoReminderModal);
  if (photoReminderModal) {
    photoReminderModal.addEventListener('click', (e) => {
      if (e.target === photoReminderModal) closePhotoReminderModal();
    });
  }

  function openDeleteConfirmModal(msg) {
    if (!msg || !msg.id) return;
    pendingDeleteMessageId = msg.id;
    if (deleteConfirmPreview) {
      const rawText = (msg.text || '').trim();
      const snippet = rawText
        ? (rawText.length > 90 ? rawText.substring(0, 90) + '...' : rawText)
        : (msg.imageUrl ? '[Photo message]' : 'Message');
      deleteConfirmPreview.textContent = snippet;
    }
    if (deleteConfirmModal) {
      SoundFX.modalOpen();
      deleteConfirmModal.classList.remove('hidden');
    } else {
      socket.emit('chat:delete', { messageId: msg.id });
    }
  }

  function closeDeleteConfirmModal() {
    pendingDeleteMessageId = null;
    if (!deleteConfirmModal || deleteConfirmModal.classList.contains('hidden')) return;
    SoundFX.modalClose();
    deleteConfirmModal.classList.add('hidden');
  }

  if (closeDeleteModalBtn) closeDeleteModalBtn.addEventListener('click', closeDeleteConfirmModal);
  if (cancelDeleteBtn) cancelDeleteBtn.addEventListener('click', closeDeleteConfirmModal);
  if (deleteConfirmModal) {
    deleteConfirmModal.addEventListener('click', (e) => {
      if (e.target === deleteConfirmModal) closeDeleteConfirmModal();
    });
  }
  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      const targetId = pendingDeleteMessageId;
      if (!targetId) return;
      SoundFX.click();
      socket.emit('chat:delete', { messageId: targetId });
      closeDeleteConfirmModal();
    });
  }

  function syncMessageGroupHeaders() {
    const items = Array.from(messagesList.children);
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      const msg = el._msgData;
      if (!msg) continue;
      const prevEl = i > 0 ? items[i - 1] : null;
      const nextEl = i < items.length - 1 ? items[i + 1] : null;
      const senderId = el.dataset.senderId || 'guest';
      const shouldBeConsecutive = Boolean(prevEl && prevEl.dataset.senderId === senderId && !msg.replyTo);
      const nextFollows = Boolean(nextEl && nextEl.dataset.senderId === senderId && !(nextEl._msgData && nextEl._msgData.replyTo));

      el.classList.toggle('has-following', nextFollows);

      if (!shouldBeConsecutive && el.classList.contains('consecutive-item')) {
        el.classList.remove('consecutive-item');
        if (!el.querySelector('.msg-author-external')) {
          const authorDiv = document.createElement('div');
          authorDiv.className = 'msg-author-external';
          authorDiv.style.color = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(msg.color) ? msg.color : '#38bdf8';
          authorDiv.textContent = msg.username || 'Guest';
          el.insertBefore(authorDiv, el.firstChild);
        }
        const spacer = el.querySelector('.msg-bubble-avatar-spacer');
        if (spacer) {
          const safeAvatarUrl = sanitizeAvatarUrl(msg.avatarUrl);
          const safeColor = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(msg.color) ? msg.color : '#38bdf8';
          const slot = document.createElement('div');
          slot.className = 'msg-bubble-avatar-slot';
          slot.innerHTML = buildBubbleAvatarHtml(safeAvatarUrl, msg.username, safeColor, resolveUserIcon(msg.userIcon, senderId));
          const promotedAvatarEl = slot.querySelector('.msg-bubble-avatar');
          const promotedImg = promotedAvatarEl && promotedAvatarEl.querySelector('.msg-bubble-avatar-img');
          if (promotedAvatarEl && promotedImg) {
            promotedImg.addEventListener('error', () => {
              applyBubbleAvatarVisual(promotedAvatarEl, '', msg.username, safeColor, resolveUserIcon(msg.userIcon, senderId));
            }, { once: true });
          }
          spacer.replaceWith(slot);
        }
      }
    }
  }

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

    // Render author name above the bubble column and pair profile photo + distinguished icon on the left side of the bubble
    const safeAvatarUrl = sanitizeAvatarUrl(msg.avatarUrl);
    const safeUserIcon = resolveUserIcon(msg.userIcon, senderId);
    const authorHtml = !isConsecutive
      ? `<div class="msg-author-external" style="color: ${safeAuthorColor}">${safeAuthorName}</div>`
      : '';
    const avatarSlotHtml = !isConsecutive
      ? `<div class="msg-bubble-avatar-slot">${buildBubbleAvatarHtml(safeAvatarUrl, msg.username, safeAuthorColor, safeUserIcon)}</div>`
      : `<div class="msg-bubble-avatar-spacer" aria-hidden="true"></div>`;

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

    // Floating cloud bubble with left avatar/distinguished icon, reactions row, external timestamp, react, reply & owner delete buttons
    item._msgData = msg;
    const deleteBtnHtml = (isOwn && msg.id)
      ? `<button type="button" class="msg-delete-btn" title="Delete message" aria-label="Delete message"><span>${Icons.trash}</span></button>`
      : '';

    item.innerHTML = `
      ${authorHtml}
      <div class="msg-bubble-row">
        ${avatarSlotHtml}
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
        ${deleteBtnHtml}
      </div>
    `;

    // Populate any existing reactions from history
    renderMessageReactions(item, msg.reactions || {});

    // Automatically fall back broken left bubble avatar images to the user's colored distinguished icon
    const bubbleAvatarEl = item.querySelector('.msg-bubble-avatar');
    const bubbleAvatarImg = bubbleAvatarEl && bubbleAvatarEl.querySelector('.msg-bubble-avatar-img');
    if (bubbleAvatarEl && bubbleAvatarImg) {
      bubbleAvatarImg.addEventListener('error', () => {
        applyBubbleAvatarVisual(bubbleAvatarEl, '', msg.username, safeAuthorColor, safeUserIcon);
      }, { once: true });
    }

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

    // Click handler for owner-only delete button
    const deleteBtn = item.querySelector('.msg-delete-btn');
    if (deleteBtn && isOwn) {
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteConfirmModal(msg);
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
      if (isFlexibleImageFile(file)) {
        handleSelectedFile(file);
      } else {
        showPhotoLimitReminder('type', { target: 'chat' });
      }
    }
  });

  async function handleSelectedFile(file) {
    if (!isFlexibleImageFile(file)) {
      showPhotoLimitReminder('type', { target: 'chat' });
      fileInput.value = '';
      return;
    }

    let preparedFile = file;
    if (file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes((file.type || '').toLowerCase())) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Optimizing your photo so it fits under 5 MB smoothly...', 'info', 2500);
      }
      preparedFile = await compressImageFileIfNeeded(file, { target: 'chat', maxBytes: 4.5 * 1024 * 1024 });
    }

    // Reject only if even compressed/raw file still exceeds 20 MB server ceiling
    if (preparedFile.size > 20 * 1024 * 1024) {
      showPhotoLimitReminder('size', { target: 'chat', sizeBytes: preparedFile.size });
      fileInput.value = '';
      return;
    }

    state.stagedFile = preparedFile;
    state.stagedFileUrl = URL.createObjectURL(preparedFile);

    previewImage.src = state.stagedFileUrl;
    previewFilename.innerText = preparedFile.name;
    previewFilesize.innerText = (preparedFile.size / (1024 * 1024)).toFixed(2) + ' MB';
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
          const err = new Error(data.error || 'We could not share that photo right now.');
          err.status = res.status;
          err.code = data.code || '';
          throw err;
        }

        uploadedImageUrl = data.imageUrl;
      } catch (uploadErr) {
        const reminderKind = (uploadErr.status === 429 || uploadErr.code === 'COOLDOWN')
          ? 'cooldown'
          : (uploadErr.code === 'LIMIT_FILE_SIZE' ? 'size' : (uploadErr.code === 'INVALID_FILE_TYPE' ? 'type' : 'server'));
        showPhotoLimitReminder(reminderKind, { target: 'chat', message: uploadErr.message });
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

  /*
   * Message Beautifier, Noto Emoji Tray & Smart Polish Controls
   * Wraps draft selections in bold/italic/highlight/mono tokens, inserts curated
   * Noto Color Emojis at the composer cursor, polishes punctuation/spacing, and
   * tags messages with calm/spotlight/greeting presentation moods before send.
   */
  function insertEmojiAtCursor(emoji) {
    const start = messageInput.selectionStart ?? messageInput.value.length;
    const end = messageInput.selectionEnd ?? messageInput.value.length;
    const val = messageInput.value;
    const nextVal = val.substring(0, start) + emoji + val.substring(end);
    if (nextVal.length > 350) {
      showToast('Message exceeds 350 character limit.', 'error');
      return;
    }
    messageInput.value = nextVal;
    messageInput.focus();
    const pos = start + emoji.length;
    messageInput.setSelectionRange(pos, pos);
    messageInput.dispatchEvent(new Event('input'));
    SoundFX.click();
  }

  if (beautifyEmojiRow) {
    beautifyEmojiRow.innerHTML = '';
    NOTO_CHAT_EMOJIS.forEach(emoji => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'emoji-insert-btn';
      btn.innerText = emoji;
      btn.title = `Insert ${emoji}`;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        insertEmojiAtCursor(emoji);
      });
      beautifyEmojiRow.appendChild(btn);
    });
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

  function getModalEditingColors() {
    return modalWidgetColorsByTheme[modalEditingTheme] || { ...EMPTY_WIDGET_COLORS };
  }

  function updateWidgetControlsUI() {
    const isLight = getThemeKey(modalEditingTheme) === 'neomorphism-light';
    const currentColors = getModalEditingColors();
    const incomingList = isLight ? WIDGET_SWATCHES.incomingLight : WIDGET_SWATCHES.incomingDark;
    const outgoingList = isLight ? WIDGET_SWATCHES.outgoingLight : WIDGET_SWATCHES.outgoingDark;
    const surfaceList = isLight ? WIDGET_SWATCHES.surfaceLight : WIDGET_SWATCHES.surfaceDark;
    const backdropList = isLight ? WIDGET_SWATCHES.backdropLight : WIDGET_SWATCHES.backdropDark;

    if (widgetTargetDarkBtn) widgetTargetDarkBtn.classList.toggle('active', !isLight);
    if (widgetTargetLightBtn) widgetTargetLightBtn.classList.toggle('active', isLight);
    if (widgetTargetThemeNote) {
      widgetTargetThemeNote.innerText = isLight
        ? 'Customizing Serene Light only — Midnight Dark keeps its own colors.'
        : 'Customizing Midnight Dark only — Serene Light keeps its own colors.';
    }
    if (resetWidgetsBtn) {
      resetWidgetsBtn.innerText = isLight
        ? 'Reset Serene Light Widgets to Defaults'
        : 'Reset Midnight Dark Widgets to Defaults';
    }

    const defaultAccent = isLight ? '#2563eb' : '#38bdf8';
    const defaultIncoming = isLight ? '#f4f7fb' : '#253042';
    const defaultOutgoing = isLight ? '#dbe8f8' : '#1e3b5a';
    const defaultSurface = isLight ? '#eef3fa' : '#212b3c';
    const defaultBackdrop = isLight ? '#e7edf5' : '#1a2230';

    if (widgetAccentPicker) widgetAccentPicker.value = isValidHexColor(currentColors.accent) ? currentColors.accent : defaultAccent;
    if (widgetIncomingPicker) widgetIncomingPicker.value = isValidHexColor(currentColors.incoming) ? currentColors.incoming : defaultIncoming;
    if (widgetOutgoingPicker) widgetOutgoingPicker.value = isValidHexColor(currentColors.outgoing) ? currentColors.outgoing : defaultOutgoing;
    if (widgetSurfacePicker) widgetSurfacePicker.value = isValidHexColor(currentColors.surface) ? currentColors.surface : defaultSurface;
    if (widgetBackdropPicker) widgetBackdropPicker.value = isValidHexColor(currentColors.backdrop) ? currentColors.backdrop : defaultBackdrop;

    renderWidgetSwatches(widgetAccentSwatches, WIDGET_SWATCHES.accent, currentColors.accent, (hex) => {
      currentColors.accent = hex;
      updateWidgetControlsUI();
      applyWidgetColors(currentColors, modalEditingTheme);
    });
    renderWidgetSwatches(widgetIncomingSwatches, incomingList, currentColors.incoming, (hex) => {
      currentColors.incoming = hex;
      updateWidgetControlsUI();
      applyWidgetColors(currentColors, modalEditingTheme);
    });
    renderWidgetSwatches(widgetOutgoingSwatches, outgoingList, currentColors.outgoing, (hex) => {
      currentColors.outgoing = hex;
      updateWidgetControlsUI();
      applyWidgetColors(currentColors, modalEditingTheme);
    });
    renderWidgetSwatches(widgetSurfaceSwatches, surfaceList, currentColors.surface, (hex) => {
      currentColors.surface = hex;
      updateWidgetControlsUI();
      applyWidgetColors(currentColors, modalEditingTheme);
    });
    renderWidgetSwatches(widgetBackdropSwatches, backdropList, currentColors.backdrop, (hex) => {
      currentColors.backdrop = hex;
      updateWidgetControlsUI();
      applyWidgetColors(currentColors, modalEditingTheme);
    });

    // Clear inline overrides so live preview bubbles reflect CSS neomorphic tokens 1:1
    if (previewIncomingBubble) {
      previewIncomingBubble.style.background = '';
      previewIncomingBubble.style.color = '';
    }
    if (previewOutgoingBubble) {
      previewOutgoingBubble.style.background = '';
      previewOutgoingBubble.style.color = '';
    }
  }

  /*
   * Profile Photo Picker, Identity Customization & Color Widgets Persistence
   * Lets users choose an image from saved device files (previewed instantaneously
   * in the modal, cropped/converted to 256x256 WebP via POST /api/avatar on save),
   * edit display name and color widgets, and broadcast changes over Socket.IO.
   */
  let modalStagedAvatarFile = null;
  let modalStagedAvatarPreview = '';
  let modalEffectiveAvatarUrl = state.avatarUrl || '';

  function clearStagedAvatarPreview() {
    if (modalStagedAvatarPreview) {
      URL.revokeObjectURL(modalStagedAvatarPreview);
      modalStagedAvatarPreview = '';
    }
    modalStagedAvatarFile = null;
    if (profilePhotoInput) profilePhotoInput.value = '';
  }

  function openCustomizationModal(initialTab = 'identity') {
    SoundFX.modalOpen();
    profileDropdownMenu.classList.add('hidden');
    profileBtn.classList.remove('active');
    profileBtn.setAttribute('aria-expanded', 'false');
    customNameInput.value = state.username;
    modalSelectedColor = state.color;
    modalSelectedIcon = resolveUserIcon(state.userIcon, state.userId || state.username);
    modalInitialTheme = getThemeKey(state.theme);
    modalEditingTheme = modalInitialTheme;
    modalWidgetColorsByTheme = cloneWidgetMap(state.widgetColorsByTheme);
    clearStagedAvatarPreview();
    modalEffectiveAvatarUrl = state.avatarUrl || '';
    renderColorPalette();
    renderIconPalette();
    updateModalPreview();
    updateWidgetControlsUI();
    switchModalTab(initialTab);
    profileModal.classList.remove('hidden');
  }

  if (chooseProfilePhotoBtn && profilePhotoInput) {
    chooseProfilePhotoBtn.addEventListener('click', () => {
      SoundFX.click();
      profilePhotoInput.click();
    });

    profilePhotoInput.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (!isFlexibleImageFile(file)) {
        showPhotoLimitReminder('type', { target: 'profile' });
        profilePhotoInput.value = '';
        return;
      }

      let preparedFile = file;
      if (file.size > 5 * 1024 * 1024 || !['image/jpeg', 'image/png', 'image/webp'].includes((file.type || '').toLowerCase())) {
        if (file.size > 5 * 1024 * 1024) {
          showToast('Resizing your profile photo cleanly so everyone can see it...', 'info', 2500);
        }
        preparedFile = await compressImageFileIfNeeded(file, { target: 'profile', maxBytes: 450 * 1024 });
      }

      if (preparedFile.size > 20 * 1024 * 1024) {
        showPhotoLimitReminder('size', { target: 'profile', sizeBytes: preparedFile.size });
        profilePhotoInput.value = '';
        return;
      }
      clearStagedAvatarPreview();
      modalStagedAvatarFile = preparedFile;
      modalStagedAvatarPreview = URL.createObjectURL(preparedFile);
      modalEffectiveAvatarUrl = modalStagedAvatarPreview;
      SoundFX.attach();
      updateModalPreview();
    });
  }

  if (removeProfilePhotoBtn) {
    removeProfilePhotoBtn.addEventListener('click', () => {
      SoundFX.detach();
      clearStagedAvatarPreview();
      modalEffectiveAvatarUrl = '';
      updateModalPreview();
    });
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

  function switchWidgetTargetTheme(targetTheme) {
    const nextKey = getThemeKey(targetTheme);
    if (nextKey === modalEditingTheme) return;
    SoundFX.themeSwitch();
    modalEditingTheme = nextKey;
    applyTheme(modalEditingTheme, getModalEditingColors());
    updateWidgetControlsUI();
  }

  if (widgetTargetDarkBtn) {
    widgetTargetDarkBtn.addEventListener('click', () => switchWidgetTargetTheme('neomorphism-dark'));
  }
  if (widgetTargetLightBtn) {
    widgetTargetLightBtn.addEventListener('click', () => switchWidgetTargetTheme('neomorphism-light'));
  }

  if (widgetAccentPicker) {
    widgetAccentPicker.addEventListener('input', (e) => {
      const target = getModalEditingColors();
      target.accent = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(target, modalEditingTheme);
    });
  }
  if (widgetIncomingPicker) {
    widgetIncomingPicker.addEventListener('input', (e) => {
      const target = getModalEditingColors();
      target.incoming = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(target, modalEditingTheme);
    });
  }
  if (widgetOutgoingPicker) {
    widgetOutgoingPicker.addEventListener('input', (e) => {
      const target = getModalEditingColors();
      target.outgoing = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(target, modalEditingTheme);
    });
  }
  if (widgetSurfacePicker) {
    widgetSurfacePicker.addEventListener('input', (e) => {
      const target = getModalEditingColors();
      target.surface = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(target, modalEditingTheme);
    });
  }
  if (widgetBackdropPicker) {
    widgetBackdropPicker.addEventListener('input', (e) => {
      const target = getModalEditingColors();
      target.backdrop = e.target.value;
      updateWidgetControlsUI();
      applyWidgetColors(target, modalEditingTheme);
    });
  }

  if (resetWidgetsBtn) {
    resetWidgetsBtn.addEventListener('click', () => {
      SoundFX.click();
      modalWidgetColorsByTheme[modalEditingTheme] = { ...EMPTY_WIDGET_COLORS };
      updateWidgetControlsUI();
      applyWidgetColors(getModalEditingColors(), modalEditingTheme);
      const label = modalEditingTheme === 'neomorphism-light' ? 'Serene Light' : 'Midnight Dark';
      showToast(`${label} widgets reset to defaults (click Save to keep)`, 'info');
    });
  }

  function closeAndRevertModalIfUnsaved() {
    SoundFX.modalClose();
    clearStagedAvatarPreview();
    if (getThemeKey(state.theme) !== modalInitialTheme) {
      applyTheme(modalInitialTheme, getActiveWidgetColors(modalInitialTheme));
    } else {
      applyWidgetColors(getActiveWidgetColors(state.theme), state.theme);
    }
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

  function renderIconPalette() {
    if (!iconPaletteEl) return;
    iconPaletteEl.innerHTML = '';
    DISTINGUISHED_USER_ICONS.forEach((icon, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `icon-choice-btn ${icon === modalSelectedIcon ? 'selected' : ''}`;
      btn.textContent = icon;
      btn.title = `Select ${icon} icon`;
      btn.addEventListener('click', () => {
        SoundFX.colorSelect(idx);
        modalSelectedIcon = icon;
        renderIconPalette();
        updateModalPreview();
      });
      iconPaletteEl.appendChild(btn);
    });
  }

  function updateModalPreview() {
    const previewName = customNameInput.value.trim() || 'Guest';
    modalPreviewName.innerText = previewName;
    modalPreviewName.style.color = modalSelectedColor;
    applyBubbleAvatarVisual(modalPreviewAvatar, modalEffectiveAvatarUrl, previewName, modalSelectedColor, modalSelectedIcon);
    renderAvatarElement(modalPhotoPreview, modalEffectiveAvatarUrl, previewName, modalSelectedColor, modalSelectedIcon);
    if (removeProfilePhotoBtn) {
      removeProfilePhotoBtn.classList.toggle('hidden', !modalEffectiveAvatarUrl);
    }
  }

  customNameInput.addEventListener('input', updateModalPreview);

  saveProfileBtn.addEventListener('click', async () => {
    SoundFX.click();
    let newName = customNameInput.value.trim();
    if (!newName) newName = 'Guest#' + Math.floor(1000 + Math.random() * 9000);
    if (newName.length > 24) newName = newName.substring(0, 24);

    let finalAvatarUrl = modalEffectiveAvatarUrl;

    if (modalStagedAvatarFile) {
      try {
        saveProfileBtn.disabled = true;
        saveProfileBtn.innerText = 'Uploading Photo...';
        const formData = new FormData();
        formData.append('avatar', modalStagedAvatarFile);

        const res = await fetch('/api/avatar', {
          method: 'POST',
          headers: {
            'x-client-id': state.clientToken
          },
          body: formData
        });
        const data = await res.json();
        if (!res.ok) {
          const err = new Error(data.error || 'We could not update your profile photo right now.');
          err.status = res.status;
          err.code = data.code || '';
          throw err;
        }
        finalAvatarUrl = data.inlineAvatarUrl || data.avatarUrl;
      } catch (err) {
        const reminderKind = (err.status === 429 || err.code === 'COOLDOWN')
          ? 'cooldown'
          : (err.code === 'LIMIT_FILE_SIZE' ? 'size' : (err.code === 'INVALID_FILE_TYPE' ? 'type' : 'server'));
        showPhotoLimitReminder(reminderKind, { target: 'profile', message: err.message });
        saveProfileBtn.disabled = false;
        saveProfileBtn.innerText = 'Save Changes';
        return;
      } finally {
        saveProfileBtn.disabled = false;
        saveProfileBtn.innerText = 'Save Changes';
      }
    }

    clearStagedAvatarPreview();
    state.username = newName;
    state.color = modalSelectedColor;
    state.userIcon = resolveUserIcon(modalSelectedIcon, state.userId || newName);
    state.avatarUrl = finalAvatarUrl || '';
    state.widgetColorsByTheme = cloneWidgetMap(modalWidgetColorsByTheme);

    localStorage.setItem('wc_username', state.username);
    localStorage.setItem('wc_color', state.color);
    localStorage.setItem('wc_user_icon', state.userIcon);
    localStorage.setItem('wc_avatar_url', state.avatarUrl);
    localStorage.setItem('wc_widget_colors', JSON.stringify(state.widgetColorsByTheme));

    updateHeaderProfile();
    applyWidgetColors(getActiveWidgetColors(state.theme), state.theme);
    profileModal.classList.add('hidden');

    // Notify server of updated name, color, saved avatar photo, and distinguished icon
    socket.emit('auth:guest_join', {
      username: state.username,
      color: state.color,
      avatarUrl: state.avatarUrl || null,
      userIcon: state.userIcon,
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

  /*
   * Global Keyboard Shortcuts & Modal Escape Cleanup
   * Closes lightbox, open reaction pickers, beautifier popovers, and profile modal
   * on Escape while safely reverting any unsaved widget previews or staged avatars.
   */
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const profileWasOpen = !profileModal.classList.contains('hidden');
      const updateWasOpen = updateNoticeModal && !updateNoticeModal.classList.contains('hidden');
      const deleteWasOpen = deleteConfirmModal && !deleteConfirmModal.classList.contains('hidden');
      const reminderWasOpen = photoReminderModal && !photoReminderModal.classList.contains('hidden');
      const modalOpen = !lightboxModal.classList.contains('hidden') || profileWasOpen || updateWasOpen || deleteWasOpen || reminderWasOpen;
      if (modalOpen) {
        SoundFX.modalClose();
      }
      if (profileWasOpen) {
        clearStagedAvatarPreview();
        if (getThemeKey(state.theme) !== modalInitialTheme) {
          applyTheme(modalInitialTheme, getActiveWidgetColors(modalInitialTheme));
        } else {
          applyWidgetColors(getActiveWidgetColors(state.theme), state.theme);
        }
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
      if (updateNoticeModal) updateNoticeModal.classList.add('hidden');
      if (deleteConfirmModal) {
        deleteConfirmModal.classList.add('hidden');
        pendingDeleteMessageId = null;
      }
      if (photoReminderModal) photoReminderModal.classList.add('hidden');
    }
  });
})();
