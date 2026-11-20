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

  // --- Palettes & Generators ---
  const COLOR_PALETTE = [
    '#38bdf8', // Neon Cyan
    '#22c55e', // Emerald
    '#a855f7', // Electric Purple
    '#f43f5e', // Rose
    '#fbbf24', // Amber
    '#06b6d4', // Aqua
    '#ec4899', // Pink
    '#3b82f6', // Royal Blue
    '#10b981'  // Teal
  ];

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

  // --- DOM Elements ---
  const onlineCountEl = document.getElementById('online-count');
  const userAvatarEl = document.getElementById('user-avatar');
  const userDisplayNameEl = document.getElementById('user-display-name');
  const profileDropdownWrapper = document.getElementById('profile-dropdown-wrapper');
  const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
  const dropdownUserAvatar = document.getElementById('dropdown-user-avatar');
  const dropdownUserName = document.getElementById('dropdown-user-name');
  const editProfileBtn = document.getElementById('edit-profile-btn');
  const toggleSoundBtn = document.getElementById('toggle-sound-btn');
  const toggleBlurBtn = document.getElementById('toggle-blur-btn');
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
  const customNameInput = document.getElementById('custom-name-input');
  const colorPaletteEl = document.getElementById('color-palette');
  const saveProfileBtn = document.getElementById('save-profile-btn');
  const modalPreviewAvatar = document.getElementById('modal-preview-avatar');
  const modalPreviewName = document.getElementById('modal-preview-name');

  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxDownload = document.getElementById('lightbox-download');
  const closeLightboxBtn = document.getElementById('close-lightbox');

  const toastContainer = document.getElementById('toast-container');

  let modalSelectedColor = state.color;

  // --- Toast Notifications ---
  function showToast(message, type = 'info', duration = 3500) {
    SoundFX.toast(type);
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${type === 'error' ? '⚠️' : 'ℹ️'}</span> <span>${message}</span>`;
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
      if (soundIcon) soundIcon.innerText = '🔊';
      if (soundBadge) {
        soundBadge.innerText = 'On';
        soundBadge.className = 'dropdown-item-badge on';
      }
    } else {
      toggleSoundBtn.classList.remove('active');
      if (soundIcon) soundIcon.innerText = '🔇';
      if (soundBadge) {
        soundBadge.innerText = 'Muted';
        soundBadge.className = 'dropdown-item-badge off';
      }
    }

    // Safe Mode Button & Badge inside Dropdown
    if (state.safeMode) {
      toggleBlurBtn.classList.add('active');
      messagesList.classList.add('safe-blur');
      if (safeModeBadge) {
        safeModeBadge.innerText = 'On';
        safeModeBadge.className = 'dropdown-item-badge on';
      }
    } else {
      toggleBlurBtn.classList.remove('active');
      messagesList.classList.remove('safe-blur');
      if (safeModeBadge) {
        safeModeBadge.innerText = 'Off';
        safeModeBadge.className = 'dropdown-item-badge off';
      }
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
        if (themeIconEl) themeIconEl.innerText = '☀️';
        if (themeBadge) {
          themeBadge.innerText = 'Light';
          themeBadge.className = 'dropdown-item-badge theme';
        }
      } else {
        themeBtn.classList.remove('active');
        if (themeIconEl) themeIconEl.innerText = '🌙';
        if (themeBadge) {
          themeBadge.innerText = 'Dark';
          themeBadge.className = 'dropdown-item-badge theme';
        }
      }
    }

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
    onlineCountEl.innerText = `${count.toLocaleString()} online in World Chat`;
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

    // Auto-link URLs in text safely
    let formattedText = (msg.text || '').replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    let imageHtml = '';
    if (msg.imageUrl) {
      imageHtml = `
        <div class="msg-image-container">
          <img src="${msg.imageUrl}" class="msg-image" alt="Uploaded photo" loading="lazy">
          <div class="blur-overlay-tag">👁️ Click to view</div>
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
          quoteSnippet += ' 📷 [Photo]';
        }
      } else if (msg.replyTo.imageUrl) {
        quoteSnippet = '📷 [Photo]';
      } else {
        quoteSnippet = '...';
      }

      const safeSnippet = quoteSnippet
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

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
            <span class="reply-quote-icon">↩</span>
            <span class="reply-quote-author">${safeQuoteAuthor}</span>
          </div>
          <div class="reply-quote-snippet">${safeSnippet}</div>
        </div>
      `;
    }

    // Floating cloud bubble with external timestamp & reply button
    item.innerHTML = `
      ${authorHtml}
      <div class="msg-bubble-row">
        <div class="msg-cloud-bubble">
          ${replyQuoteHtml}
          ${formattedText ? `<div class="msg-text">${formattedText}</div>` : ''}
          ${imageHtml}
        </div>
        <span class="msg-time-external">${formattedTime}</span>
        <button type="button" class="msg-reply-btn" title="Reply to this message" aria-label="Reply">
          <span class="reply-btn-icon">↩</span>
        </button>
      </div>
    `;

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
      color: msg.color || '#38bdf8',
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
        snippet += ' 📷 [Photo]';
      }
    } else if (state.replyTo.imageUrl) {
      snippet = '📷 [Photo]';
    } else {
      snippet = '...';
    }
    replyBarSnippet.textContent = snippet;

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
    <span class="send-btn-label">Swipe ➔</span>
  `;

  // --- Slowmode Cooldown Timer UI ---
  function triggerCooldownDisplay(seconds) {
    sendBtn.disabled = true;
    sendBtn.classList.add('countdown');
    let rem = seconds;
    sendBtn.innerText = `⏳ ${rem}s`;
    const interval = setInterval(() => {
      rem--;
      if (rem <= 0) {
        clearInterval(interval);
        sendBtn.disabled = false;
        sendBtn.classList.remove('countdown');
        sendBtn.innerHTML = sendBtnIconHtml;
      } else {
        sendBtn.innerText = `⏳ ${rem}s`;
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
        sendBtn.innerText = '📤...';

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
      replyToId: state.replyTo ? state.replyTo.id : null
    });

    // Reset input states
    messageInput.value = '';
    charCounter.innerText = '0 / 350';
    charCounter.className = 'char-counter';
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

    // 1st click: show inline hint "Swipe ➔" with rightward nudge animation
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
          ? 'Switched to Neomorphism Light (Creamy White)'
          : 'Switched to Neomorphism Dark'
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

  // Open customization modal from the dropdown's Edit button
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      SoundFX.modalOpen();
      profileDropdownMenu.classList.add('hidden');
      profileBtn.classList.remove('active');
      profileBtn.setAttribute('aria-expanded', 'false');
      customNameInput.value = state.username;
      modalSelectedColor = state.color;
      renderColorPalette();
      updateModalPreview();
      profileModal.classList.remove('hidden');
    });
  }

  closeProfileModalBtn.addEventListener('click', () => {
    SoundFX.modalClose();
    profileModal.classList.add('hidden');
  });

  profileModal.addEventListener('click', (e) => {
    if (e.target === profileModal) {
      SoundFX.modalClose();
      profileModal.classList.add('hidden');
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

    localStorage.setItem('wc_username', state.username);
    localStorage.setItem('wc_color', state.color);

    updateHeaderProfile();
    profileModal.classList.add('hidden');

    // Notify server of updated name/color
    socket.emit('auth:guest_join', {
      username: state.username,
      color: state.color,
      clientToken: state.clientToken,
      userId: state.userId
    });

    showToast('Profile updated!', 'info');
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
      const modalOpen = !lightboxModal.classList.contains('hidden') || !profileModal.classList.contains('hidden');
      if (modalOpen) {
        SoundFX.modalClose();
      }
      lightboxModal.classList.add('hidden');
      profileModal.classList.add('hidden');
    }
  });
})();
