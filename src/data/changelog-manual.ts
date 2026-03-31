/**
 * Manually-maintained changelog for the WelcomeModal "What's New" list.
  * This is separate from the auto-generated changelog (changelog.ts) which is based on git history.
 */

export interface ManualChangelogGroup {
  date: string; // YYYY-MM-DD
  items: {
    message: string;
    type: 'feat' | 'fix' | 'update';
  }[];
}

/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ─── 2026-03-24 ────────────────────────────────────────────────────────────
  {
    date: '2026-03-31',
    items: [
      { message: 'Users who share public builds with lazy names will be punished 😈', type: 'feat' },
      { message: 'Removed Wind Control from Controller and Dominator, not available on Homecoming', type: 'fix' },
      { message: '...but hear me out HC, Rebirth, or Thunderspy -- Storm Armor! ⛈️ My ideas are free!', type: 'feat' },
      { message: 'Restored Adaption for Bio Armor', type: 'fix' }
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
