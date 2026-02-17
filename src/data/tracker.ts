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
  { text: 'Set level caps (Touch of Death, Miracle) not enforced', status: 'known-bug' },
  { text: 'Free first slot on powers may incorrectly subtract from the 67 maximum placed slots', status: 'known-bug' },
  { text: 'Slots placed in inherent powers do not subtract from the 67 maximum', status: 'known-bug' },
  { text: 'Incarnate power toggle graphic is slightly misaligned', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'New: First pass at importing builds from Mids Reborn! (.mbd files) Use the Export/Import modal, expect bugs :3', status: 'new' },
  { text: 'Update to incorporate power updates in Issue 28, Page 3, Panel 2', status: 'fixed' },
  { text: 'Fix: Toggle/Auto powers with recharge buffs (Chronoshift, etc.) now properly apply to global recharge stats', status: 'fixed' },
  { text: 'Fix: Luck of the Gambler and Gift of the Ancients global procs now correctly apply their bonuses', status: 'fixed' },
  { text: 'Fix: More powers should start passing their active information to the dashboard (Hasten, Combat Jumping, etc)', status: 'fixed' },

];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add build sharing functionality', status: 'planned' },
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
