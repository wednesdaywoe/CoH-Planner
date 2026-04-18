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
  // ─── 2026-03-24 ────────────────────────────────────────────────────────────
  {
    date: '2026-04-17',
    items: [
      { message: 'Fixed some resistance caps, and now the Dashboard should report when you\'ve gone over', type: 'fix' },
      { message: 'Fixed a number of invalid enhancement UIDs in the Popmenu export', type: 'fix' },
      { message: 'Added a new Enhancement shopping list for your Wentworths shopping pleasure! 🛍️ Look for it in the Dashboard quickbar. Functions as a checklist by clicking/touching each item to reduce by 1. At 0, the item is crossed off. Click again to reset.', type: 'feat' },
      { message: 'Fixed Blaster Leviathan Mastery showing the wrong AT version', type: 'fix' },
      { message: 'Added a gentle Onboarding beacon system to point out features for new users. Onboarding can be disabled or reset in the settings menu.', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
