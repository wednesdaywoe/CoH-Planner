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
  { text: 'VEATs power structure is incomplete, I am working on it', status: 'known-bug'},
  { text: 'If you see a [missing-icon] icon, it means the icon is missing. Please report it using the feedback tool', status: 'known-bug' },
];

// ============================================
// RECENT CHANGES / FIXES
// ============================================

export const RECENT_CHANGES: TrackerItem[] = [
  { text: 'Absolutely ginormous powerset audit for missing effects and allowedEnhancments 😓🤞', status: 'fixed' },
  { text: 'Fixed duplicate Reach for the Limit in Martial Combat', status: 'fixed' },
  { text: 'Fixed level slider reverting when removing a power at level 50', status: 'fixed' },
  { text: 'Fixed Overwhelming Force pieces not marked as unique', status: 'fixed' },
  { text: 'Fixed attuned enhancements allowing level boosting', status: 'fixed' },
  { text: 'Fixed Blaster Assault damage calculation (missing AT table data)', status: 'fixed' },
  { text: 'Fixed enhancement picker unclickable at narrow browser widths', status: 'fixed' },
  { text: 'Implemented public build sharing, no account or registration required', status: 'new' },
  { text: 'Finally added support for pets and pseudopet powers', status: 'new' },
  { text: 'Undock feature added to Info Panel, allowing it to be moved and resized', status: 'new' },  
  { text: 'Added Procs toggle to dashboard', status: 'new' },
  { text: 'Fixed incorrect ED calculation', status: 'fixed' },
  { text: 'Added highlight indicator for unique and proc enhancements', status: 'new' },
  { text: 'Tracked stats now highlight matching bonus effects in enhancement picker tooltips', status: 'new' },
  { text: 'Update to incorporate power updates in Issue 28, Page 3, Panel 2', status: 'fixed' },
  { text: 'Added modal for incarnate recipe calculator', status: 'new' },
  { text: 'Added modal for set bonus finder', status: 'new' },
  { text: 'Added dashboard feature: stat tracking! Left click a stat to track it; tracked stats will highlight sets that provide bonuses for that stat', status: 'new' },
];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
