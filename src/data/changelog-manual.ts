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
    date: '2026-04-10',
    items: [
      { message: 'Added new "Perma-Tracked Powers" feature to pin perma-tracked powers to a new bar in the Dashboard', type: 'feat' },
      { message: 'Fixed MBD importer incorrectly marking all non-boosted crafted IOs as attuned', type: 'fix' },
      { message: 'Fixed missing Universal Travel in allowedSetCategories for Sprint and prestige sprints', type: 'fix' },
      { message: 'Fixed duplicate bonus entry in Winters Gift', type: 'fix' },
      ]
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
