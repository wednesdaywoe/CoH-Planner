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
    date: '2026-05-24',
    items: [
      { message: 'Fix for some Rebirth boostSets showing up in the wrong place with the wrong attribs', type: 'fix' },
      { message: 'The display of global recharge can now be toggled between a simple sum of your bonuses (e.g. +25%), and the base-100% plus bonuses (e.g., 125%) Settings > Display', type: 'feat' },
      { message: 'Began work on building a Thunderspy dataset. Not enabled yet, but soon!', type: 'feat' },
      { message: 'For Rebirth: Fixed Devastating Blow and three Wind Control powers being silently hidden from the picker by their accesslevel requirement', type: 'fix' },
      { message: 'Added a new Copy Short Link to the File menu. This generates a much friendlier link for sharing, but it does require authentication', type: 'feat' },
      { message: 'Added some safety checks when loading older builds to prevent powers from ending up in the wrong places', type: 'fix' },
      { message: 'The Maximize Enhancements feature has been changed and extended to a new modal that allows bulk-editing of enhancement levels, attunement, and boosters across the entire build', type: 'feat' },
      { message: 'Rebirth powersets + Rebirth pool/epic pools + Rebirth pet-entities + Rebirth incarnates all regenerated with corrected wiring for summons and redirects, some missing icons located', type: 'fix' },
      { message: 'Added a helper to computeAllSlotLevels once and write one slotOrder to capture the respec-mode level as the stored level', type: 'feat' },
      { message: 'Improved build management options: menu items are now New Build, Clear Powers, Clear Slots, Clear Enhancements, and Maximize Enhancements', type: 'feat' },
      { message: 'Multi-slot common IOs / HOs / SOs in one go! 😎 In Select Multiple mode, taps stack a count badge, bar fills empty slots in order', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
