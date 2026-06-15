/**
 * Manually-maintained changelog for the WelcomeModal "What's New" list.
  * This is separate from the auto-generated changelog (changelog.ts) which is based on git history.
 */

export interface ManualChangelogGroup {
  date: string; // YYYY-MM-DD
  items: {
    message: string;
    type: 'feat' | 'fix' | 'update' | 'known-issue';
  }[];
}
WheelEvent
/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update' | 'known-issue';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ───────────────────────────────────────────────────────────────────────
  {
    date: '2026-06-15',
    items: [
      { message: 'Adjusted mobile UI: when adding/changing enhancements, there is now an expand button to list all the enhancements slotted in the power', type: 'update' },
      { message: 'Fixed a regression where split enhancmement aspects (health/absorb) were counted as two aspects', type: 'fix' },
      { message: "Fixed Synapse's Shock \"EndMod/+Run Speed\" — it now grants its global run-speed bonus and shows up in the proc list", type: 'fix' },
      { message: "Fixed the travel-set stealth procs (Celerity, Freebird, Time & Space Manipulation, Unbounded Leap) showing as \"Chance for Resurrect\" instead of \"+Stealth\"", type: 'fix' },
      { message: 'Added a few more themes', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
