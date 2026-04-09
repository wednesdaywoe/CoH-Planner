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
    date: '2026-04-09',
    items: [
      { message: 'Fixed missing Universal Travel in allowedSetCategories for Sprint and prestige sprints', type: 'fix' },
      { message: 'Fixed duplicate bonus entry in Winters Gift', type: 'fix' },
      { message: 'I hate bio armor', type: 'feat' },
      { message: 'Improved mappings for Popmenu export', type: 'fix' },
      { message: 'Solved the mystery of Street Justices\' disappearance from melee sets', type: 'fix' },
      { message: 'Updates for the extensive changes made in the Feb 10th Panel 2 update are ongoing', type: 'known-issue' },
      { message: 'Fixed Arcane Bolt incorrectly multiplying its own damage', type: 'fix' },
      { message: 'Fixed...just a whole bunch of mismatched archetype IDs', type: 'fix' },
      ]
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
