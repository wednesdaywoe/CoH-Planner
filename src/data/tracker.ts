/**
 * Centralized tracker data for known issues, recent changes, and planned features.
 * Used by KnownIssuesModal and WelcomeModal.
 */

export interface TrackerItem {
  text: string;
  status: 'known-bug' | 'fixed' | 'planned' | 'in-progress';
}

// ============================================
// KNOWN BUGS
// ============================================

export const KNOWN_BUGS: TrackerItem[] = [
  { text: 'Titan/Hydra/D-Sync Origin Enhancements are not implemented', status: 'known-bug' },
  { text: 'Set level caps (Touch of Death, Miracle) not enforced', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'Update to incorporate power updates in Issue 28, Page 3, Panel 2', status: 'fixed' },
  { text: 'Fix: Toggle/Auto powers with recharge buffs (Chronoshift, etc.) now properly apply to global recharge stats', status: 'fixed' },
  { text: 'Fix: Luck of the Gambler and Gift of the Ancients global procs now correctly apply their bonuses', status: 'fixed' },
  { text: 'Fix: Flight pool powers (Group Fly, Evasive Maneuvers) now unlock after selecting two of the first three powers', status: 'fixed' },
  { text: 'Fix: Enhancement picker can now be reopened via left-click after using the context menu on a slot', status: 'fixed' },
  { text: 'Fix: Enhancement slot limits are now level-aware instead of always using the level 50 cap', status: 'fixed' },
];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add build sharing functionality', status: 'planned' },
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
