/*
 * Centralized Release Manifest & Semantic Versioning Registry
 * Maintains the single source of truth for World Chat release history in strict
 * "Update x.y.z" semantic format, keeping /api/version, Socket.IO broadcasts,
 * and Settings -> App Updates changelog synchronized on every update.
 */
const pkg = require('../package.json');

const SEMVER_REGEX = /^\d+\.\d+\.\d+$/;

function formatUpdateLabel(version) {
  const clean = String(version || '').trim().replace(/^v/i, '');
  return SEMVER_REGEX.test(clean) ? `Update ${clean}` : `Update 1.0.0`;
}

// Chronological newest-first changelog so the active release leads and commit 50695b6 sits as Update 2 on the webpage
const RELEASE_HISTORY = [
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
