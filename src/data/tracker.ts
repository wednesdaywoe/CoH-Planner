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
  { text: 'Added a defensive check on imported builds to enforce power assignment, but still investigating the root cause.', status: 'fixed' },  
  { text: 'The New button is now a hard reset to prevent a stale state lingering from an imported build.', status: 'fixed' },
  { text: 'Added fixPowerSetIds() to syncBuildDefinitions() so that existing builds already saved in localStorage with wrong display names get corrected on load', status: 'fixed' },
  { text: 'Users can optionally sign in with Discord to manage their builds across devices. Anonymous build management is still supported with build tokens.', status: 'new' },
  { text: 'Shared builds can be updated or deleted by the original author (please save your build token)', status: 'new' },
  { text: 'Added a global "Level Shift" toggle that controls whether incarnate level shifts are applied to calculations, independently from per-slot toggles.', status: 'new' },
  { text: 'First pass at refactoring the import feature: Significant improvements to build importing reliability including preserving enhancement boosts.', status: 'fixed' },
  { text: 'Added a zoom feature. This just replicates what your browser can already do, but some may not be aware of that functionality so this makes it more discoverable', status: 'fixed' },
  { text: 'Added print-friendly build export 🖨️ Go to Save/Load and scroll down', status: 'new' },
  { text: 'More fussing with layout because no one will stop me', status: 'new' },
];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
