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
  { text: 'If you see a [missing-icon] icon, it means the icon is missing. Please report it using the feedback tool', status: 'known-bug' },
  { text: 'Importing from Mids file is...less than reliable. You can send your Mids file (especially older builds) to Wednesdaywoe on Discord to help make this feature more robust', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'Significant audit of accuracy and damage calculations, and enhancement schedules', status: 'fixed' },
  { text: 'Added target level offset to calculate hit chance against different levels', status: 'new' },
  { text: 'VEATS specializations should be correctly handled now', status: 'fixed' },
  { text: 'Artillery set found its icon', status: 'fixed' },
  { text: 'Sorcery, Experimentation, and Force of Will pools are now mutually exclusive', status: 'fixed' },
  { text: 'Refactored slot level ordering to improve level-based planning', status: 'new' },
  { text: 'Added drag and drop functionality to swap powers BUT it requires chronological mode', status: 'new' },

];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
