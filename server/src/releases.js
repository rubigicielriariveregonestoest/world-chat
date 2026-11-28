/*
 * Centralized Release Manifest & Semantic Versioning Registry
 * Traces the full patch progression chronologically from world_chat_plan.md
 * ("Update 1.0.0") to the present ("Update 1.6.0"), keeping /api/version,
 * Socket.IO popups, and Settings -> App Updates history cleanly synchronized.
 */
const pkg = require('../package.json');

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

function formatUpdateLabel(version) {
  const clean = String(version || '').trim().replace(/^v/i, '');
  return SEMVER_REGEX.test(clean) ? `Update ${clean}` : `Update 1.0.0`;
}

// Chronological newest-first changelog tracing every milestone from initial launch (1.0.0) to present (1.6.0)
const RELEASE_HISTORY = [
  {
    version: '1.6.0',
    label: formatUpdateLabel('1.6.0'),
    updateNumber: 6,
    commit: 'latest',
    title: 'Idle Pop Notifications, Popup History Split & Discord iFrame',
    highlights: [
      'Added PC and mobile idle pop notifications (floating jump-to-chat card, tab badge, and browser alerts) whenever someone chats while you are idle or away',
      'Update popups now showcase only Latest Highlights while Settings -> App Updates holds the complete traced History of Changes',
      'Added Discord-ready iframe embedding with adaptive layout mode (?embed=discord) and copyable embed generator'
    ]
  },
  {
    version: '1.5.0',
    label: formatUpdateLabel('1.5.0'),
    updateNumber: 5,
    commit: 'da52813',
    title: 'Light Mood Readability, Dark Hover Parity & Reaction Users List',
    highlights: [
      'Refined Light-theme Message Card Mood effects with airy pastel tones so message text stays bright and readable',
      'Matched Dark-theme chat bubble hover rim transitions cleanly with Light mode across normal and Mood bubbles',
      'Click any reacted emoji pill beneath a chat bubble to see who reacted with Heart, Haha, Wow, Sad, or Angry'
    ]
  },
  {
    version: '1.4.0',
    label: formatUpdateLabel('1.4.0'),
    updateNumber: 4,
    commit: '73d1de9',
    title: 'Animated Message Card Moods, 3s Soundscapes & Light Theme Visibility',
    highlights: [
      'Upgraded Calm Note (wind, swirling leaves, storm & lightning), Spotlight (LED uplights, waving beams & inner glow), and Greeting (confetti, top-left party hat & proportionate sun rays) into endless behind-text bubble animations',
      'Made all Message Card Mood effects clearly visible across both Serene Light and Midnight Dark themes',
      'Added bespoke 3-second fading audio effects per mood plus a dedicated 5-second Message Card Mood cooldown'
    ]
  },
  {
    version: '1.3.0',
    label: formatUpdateLabel('1.3.0'),
    updateNumber: 3,
    commit: 'be3aaea',
    title: 'App Updates History & Semantic Versioning',
    highlights: [
      'Synchronized App Updates with strict "Update x.y.z" semantic versioning across Settings and live notifications',
      'Added the scrollable History of Changes timeline inside Settings -> App Updates'
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
      'Added caring upload reminders plus >5 MB auto-resize, flexible image formats, and ephemeral-proof avatars'
    ]
  },
  {
    version: '1.1.2',
    label: formatUpdateLabel('1.1.2'),
    updateNumber: 1,
    commit: 'be99c11',
    title: 'Left Bubble Avatars, Distinguished User Icons & Update Notice Popup',
    highlights: [
      'Moved user profile photos onto the left side of chat bubbles paired with each user\'s distinguished icon',
      'Added selectable distinguished icons in Customize Profile & Widgets and live Update Notice prompts'
    ]
  },
  {
    version: '1.1.1',
    label: formatUpdateLabel('1.1.1'),
    updateNumber: 1,
    commit: '11fcb50',
    title: 'Noto Color Emojis, Globe Favicon, Profile Photos & Bubble Depth',
    highlights: [
      'Enabled Noto Color Emoji across reaction pills and chat drafting plus static globe sphere favicon',
      'Added saved-file custom profile photo cropping, mobile theme-switch speedups, and unclipped 3D convex bubble shadows'
    ]
  },
  {
    version: '1.1.0',
    label: formatUpdateLabel('1.1.0'),
    updateNumber: 1,
    commit: '44f7969',
    title: 'Trust & Calm Rebrand, Color Widgets, Beautifier & Reactions',
    highlights: [
      'Introduced Midnight Harbor Dark & Serene Alabaster Light neomorphic themes and customizable Color Widgets',
      'Launched pre-send message beautifier formatting, mood tags, and animated emoji reactions'
    ]
  },
  {
    version: '1.0.3',
    label: formatUpdateLabel('1.0.3'),
    updateNumber: 0,
    commit: '31be698',
    title: 'Mobile Header Alignment & Single-Row Presence Pill',
    highlights: [
      'Aligned header pills with safe-area padding and kept the live online counter compact on small mobile viewports'
    ]
  },
  {
    version: '1.0.2',
    label: formatUpdateLabel('1.0.2'),
    updateNumber: 0,
    commit: 'd984559',
    title: 'Tactile Dark & Harmonized Neomorphism Refinement',
    highlights: [
      'Unified convex 3D extrusion and concave sunken cavities across cards, composer tracks, and modals'
    ]
  },
  {
    version: '1.0.1',
    label: formatUpdateLabel('1.0.1'),
    updateNumber: 0,
    commit: '4566396',
    title: 'Adaptive SVG Icon System & Celestial Idle Engine',
    highlights: [
      'Introduced recessed neomorphic vector icon pods and 25-second celestial idle optimization for battery savings'
    ]
  },
  {
    version: '1.0.0',
    label: formatUpdateLabel('1.0.0'),
    updateNumber: 0,
    commit: 'de9f1ff',
    title: 'World Chat Initial Launch',
    highlights: [
      'Launched anonymous global live chatroom with swipe-to-send, 350-char limit, EXIF-stripped photo sharing, reply quotes, and Web Audio SoundFX'
    ]
  }
];

function buildReleaseInfo() {
  const pkgVersion = SEMVER_REGEX.test(String(pkg.version || '').trim())
    ? String(pkg.version).trim()
    : RELEASE_HISTORY[0].version;
  const activeEntry = RELEASE_HISTORY.find(r => r.version === pkgVersion) || RELEASE_HISTORY[0];

  return {
    version: activeEntry.version,
    label: formatUpdateLabel(activeEntry.version),
    buildId: `${activeEntry.version}-${Date.now().toString(36)}`,
    title: `World Chat ${formatUpdateLabel(activeEntry.version)} Available`,
    highlights: activeEntry.highlights,
    history: RELEASE_HISTORY
  };
}

module.exports = {
  RELEASE_HISTORY,
  formatUpdateLabel,
  buildReleaseInfo
};
