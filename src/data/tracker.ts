/**
 * Centralized tracker data for known issues and planned features.
 * Recent changes are now auto-generated from git history (see changelog.ts).
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
  { text: 'If you see a [missing-icon] icon, it means the icon is missing. Please report it using the feedback tool', status: 'known-bug' },
  { text: 'If you import a build and it has a lot of weirdness, please specify the method of import (if Mids, please mention if its an older Mids format)', status: 'known-bug' },
  { text: 'Chrono Shift now shows a toggle to display its buff effects on the build', status: 'fixed' },
  { text: 'Mez effects (Stun, Knockback, etc.) now show enhanced duration/distance values when slotted', status: 'fixed' },
  { text: 'Importing builds now correctly resolves archetype-specific epic pools (e.g., Stalker Psionic Mastery)', status: 'fixed' },
  { text: 'Login popover no longer clips off screen on desktop', status: 'fixed' },
];

// ============================================
// PLANNED FEATURES / ROADMAP
// ============================================

export const PLANNED_FEATURES: TrackerItem[] = [
  { text: 'Add data sets for Rebirth and Thunderspy', status: 'planned' },
  { text: 'Continue improving mobile experience', status: 'in-progress' },
];
