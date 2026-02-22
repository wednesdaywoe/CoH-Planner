/**
 * Centralized tracker data for known issues, recent changes, and planned features.
 * Used by KnownIssuesModal and WelcomeModal.
 */

export interface TrackerItem {
  text: string;
  status: 'known-bug' | 'fixed' | 'planned' | 'in-progress' | 'new';
}

// ============================================
// KNOWN BUGS
// ============================================

export const KNOWN_BUGS: TrackerItem[] = [
  { text: 'Lore pet stats (individual pet abilities) are not yet parsed from raw data', status: 'known-bug' },
  { text: 'If you see a [missing-icon] icon, it means the icon is missing. Please report it using the feedback tool', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'fix: Fixed wonky slot counting', status: 'fixed' },
  { text: 'New: PvP IO set bonuses now split into PvE and PvP sections — PvP-only effects shown separately and excluded from stat calculations', status: 'new' },
  { text: 'New: Tracked stats now highlight matching bonus effects in enhancement picker tooltips', status: 'new' },
  { text: 'New: Added Controls button to the dashboard bar — quick reference for all desktop and mobile interactions', status: 'new' },
  { text: 'New: Added Titan Origin, Hydra Origin, and D-Sync Origin enhancements to the enhancement picker', status: 'new' },
  { text: 'Fix: Corrected Hamidon Origin enhancement data — per-aspect values now match game data', status: 'fixed' },
  { text: 'Update to address missing data from power pools', status: 'fixed' },
  { text: 'Update to incorporate power updates in Issue 28, Page 3, Panel 2', status: 'fixed' },
  { text: 'New: Added modal for incarnate recipe calculator', status: 'new' },
  { text: 'New: Added modal for set bonus finder', status: 'new' },
  { text: 'New: Added dashboard feature: stat tracking! Left click a stat to track it; tracked stats will highlight sets that provide bonuses for that stat', status: 'new' },
  { text: 'New: First pass at importing builds from Mids Reborn! (.mbd files) Use the Export/Import modal, expect bugs :3', status: 'new' },
];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add build sharing functionality', status: 'planned' },
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
