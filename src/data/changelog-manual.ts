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

/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update' | 'known-issue';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ───────────────────────────────────────────────────────────────────────
  {
    date: '2026-07-07',

    items: [
      { message: '🚨 A very large and comprehensive data converter rewrite was implemented to address a large family of bugs related to the old coverter flattening data and dropping important attributes before it reached the planner (ie: a power does energy/smashing damage, but in the planner you only see the smashing damage portion). If the change is successful, you won\'t notice anything has changed other than more information surfacing in the planner that was previously missing 🚨', type: 'fix'},
      { message: 'Corrected an issue preventing the previous fix for Kheldian inherent travel powers from applying to loaded or imported builds', type: 'fix'},
      { message: 'Fixed the Brute ATO "Unrelenting Fury" +Regeneration proc showing a wildly inflated regen bonus (hundreds of %). It now reports the correct average steady-state value from its ~10s stacking buff. Other buff-granting procs (+Absorb, +Res, Hide) now also carry their true buff durations.', type: 'fix'},
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
