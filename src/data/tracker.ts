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
  { text: 'Some Hamidon/Special Enhancement icons may be missing', status: 'known-bug' },
  { text: 'The icon for Rime is missing. 10,000,000 inf for its safe return unharmed', status: 'known-bug' },
  { text: 'If you see a [missing-icon] icon, it means the icon is missing. Please report it using the feedback tool', status: 'known-bug' },
  { text: 'If you import a build and it has a lot of weirdness, please specify the method of import (if Mids, please mention if its an older Mids format)', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'Fixed various bugs related to endurance calculations and power display accuracy', status: 'fixed' },
  { text: 'Fixed toggle endurance costs (Leadership, etc.) now correctly use activate_period for per-second calculation', status: 'new' },
  { text: 'Fixed ToHit buffs (Tactics, Aim, Kismet) now properly affect per-power accuracy display', status: 'new' },
  { text: 'Fixed Sentinel ATOs no longer incorrectly appear on ineligible powersets', status: 'new' },
  { text: 'Added proc info tooltips to enhancement picker Procs filter with PPM, damage, and mechanics', status: 'new' },
  { text: 'Added 48 missing proc entries (ATOs, Superior variants, globals, Cupid\'s Crush, Overwhelming Force)', status: 'new' },
  { text: 'Calculations now support proc damage', status: 'new' },
  { text: 'New features for logged in users: favorites/bookmarks, new sort and filter options including by author, inline delete', status: 'new' },
  { text: 'Added A-Z / Level sort toggle above the IO sets list', status: 'new' },
  { text: 'Disabled IO set pieces now show the full stats tooltip', status: 'new' },
  { text: 'Added a defensive check on imported builds to enforce power assignment, but still investigating the root cause', status: 'fixed' },
  { text: 'Added fixPowerSetIds() to syncBuildDefinitions() so that existing builds already saved in localStorage with wrong display names get corrected on load', status: 'fixed' },
  { text: 'Users can optionally sign in with Discord to manage their builds across devices. Anonymous build management is still supported with build tokens', status: 'new' },
  { text: 'Shared builds can be updated or deleted by the original author (please save your build token)', status: 'new' },
  { text: 'Added print-friendly build export 🖨️ Go to Save/Load and scroll down', status: 'new' },
];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
