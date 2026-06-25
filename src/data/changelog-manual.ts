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
    date: '2026-06-25',

    items: [
      { message: 'Added Move Slot feature to shift-leftclick menu', type: 'feat' },
      { message: 'Updated Homecoming dataset to Issue 28 Page 3 Panel 3', type: 'update'},
      { message: 'Updated the Discord link', type: 'feat' },
      { message: 'Added collapsible set bonus view for mobile users', type: 'feat' },
      { message: 'The Incarnate crafting UI had a significant update to better reflect the crafting tree and node dependencies', type: 'update' },
      { message: 'Rebirth: Group Fly now unlocks from Aerobatics + Fly, and Afterburner from Dive Attack + Fly, in the reworked Flight pool', type: 'fix' },
      { message: 'Rebirth: removed Athletic Run from Inherents (Rebirth does not grant it)', type: 'fix' },
      { message: '+Damage buffs (Assault, Build Up, etc.) are no longer incorrectly scaled by Damage enhancements or global +Damage — the buff value is now flat, as in-game', type: 'fix' },
      { message: 'Fixed the Superior Ascendancy of the Dominator ATO showing a Controller set icon', type: 'fix' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
