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
    date: '2026-03-19',
    items: [
      { message: 'SK builds created before level recalculation was added imported with multiple \
        powers assigned to the same level. Migration now detects when multiple powers share the \
        same pick level. When duplicates are found, the migration reassigns levels correctly', type: 'fix' },
      { message: 'Inherent fitness slots lost on .skif export: .skif export now preserves \
        inherents that have extra empty slots, not just those with slotted enhancements', type: 'fix' },
      { message: 'Catalyzed non-ATO sets now correctly cap at their sets maxLevel when \
        computing enhancement values. Previously they resolved at level 50 because the \
        attuned path bypassed the maxLevel cap', type: 'fix' },
      

    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
