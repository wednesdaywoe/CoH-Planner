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
  { text: 'Pets and Lore pet stats (individual pet abilities) are not yet parsed from raw data', status: 'known-bug' },
  { text: 'If you see a [missing-icon] icon, it means the icon is missing. Please report it using the feedback tool', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'New: Added Procs toggle to dashboard', status: 'new' },
  { text: 'fix: Fixed incorrect ED calculation', status: 'fixed' },
  { text: 'Massive cleanup of powers data structure, should expose more power effects to the infopanel', status: 'fixed' },
  { text: 'fix: Fixed missing effects across 395 powers 😓', status: 'fixed' },
  { text: 'New: Added highlight indicator for unique and proc enhancements', status: 'new' },
  { text: 'New: Tracked stats now highlight matching bonus effects in enhancement picker tooltips', status: 'new' },
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
