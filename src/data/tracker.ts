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
  { text: 'Titan/Hydra/D-Sync Origin Enhancements are not implemented', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
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
