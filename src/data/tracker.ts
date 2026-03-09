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
  { text: 'VEATS specializations are missing sets', status: 'known-bug' },
  { text: 'Sorcery, Experimentation, and Force of Will pools are not mutally exclusive', status: 'known-bug' },
  { text: 'Artillery set is missing; 1,000,000 Inf offered for its safe return', status: 'known-bug' },
  { text: 'Importing from Mids file is...less than reliable', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'Added drag and drop functionality to swap powers BUT it requires chronological mode', status: 'new' },

];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
