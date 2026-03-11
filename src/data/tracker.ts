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
  { text: 'Some Hamidon Enhancement icons may be missing', status: 'known-bug' },
  { text: 'If you see a [missing-icon] icon, it means the icon is missing. Please report it using the feedback tool', status: 'known-bug' },
  { text: 'Importing from Mids file is...less than reliable. You can send your Mids file (especially older builds) to Wednesdaywoe on Discord to help make this feature more robust', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'First pass at refactoring the import feature: Significant improvements to build importing reliability including preserving enhancement boosts.', status: 'fixed' },
  { text: 'Sidekicks export format 2.0: Tons of unnecessary data removed, reducing file length significantly. 1.0 Exports format is supported', status: 'fixed' },
  { text: 'Added a zoom feature. This just replicates what your browser can already do, but some may not be aware of that functionality so this makes it more discoverable', status: 'fixed' },
  { text: 'Fix to stop Containment from being applied all willy-nilly', status: 'new' },
  { text: 'Added print-friendly build export 🖨️ Go to Save/Load and scroll down', status: 'new' },
  { text: 'More fussing with layout because no one will stop me', status: 'new' },
  { text: 'Widespread issue with -recharge resistance being converted to +recharge', status: 'fixed' },
];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
