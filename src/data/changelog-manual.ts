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
  // ─── 2026-03-18 ────────────────────────────────────────────────────────────
  {
    date: '2026-03-18',
    items: [
      { message: 'Reorganized the Save/Load/Import/Export', type: 'update' },
      { message: 'Compare Slotting now has a spot on the Dashboard to make it more discoverable ', type: 'update' },
      { message: 'Accuracy calculations show the actual value after the capped value', type: 'update' },
      { message: 'Corrected more Sentinel modifiers', type: 'fix' },
      { message: 'Fixed Enhancement selection modal sorting memory issue', type: 'fix' },
      { message: 'Fixed importer skipping inherents with only the default slot', type: 'fix' },
      { message: 'Created the missing Hami-Os (the game doesnt have distinct icons but this is prettier and helps visually differentiate them)', type: 'fix' },
      { message: 'Corrected some Brute melee sets to accept ATOs  ', type: 'fix' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
