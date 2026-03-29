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
    date: '2026-03-29',
    items: [
      { message: 'Fixed Paralyzing Blast icon AGAIN and punished it for regressing 🤬', type: 'feat' },
      { message: 'Click powers were incorrectly being divided by activatePeriod, doubling their costs', type: 'feat' },
      { message: 'Changed heuristic for setting powers as active by default to buffDuration >= 60', type: 'fix' },
      { message: 'Fixed controller ATO icon swap', type: 'fix' },
      { message: 'Fixed issue with VEAT base set ID overwriting the branch ID resulting in missing powers', type: 'fix' },
      { message: 'Fixed Phoenix Rising duplication in Fiery Aura', type: 'fix' },
      { message: 'Supressed auto tooltip on mobile', type: 'fix' },
      { message: 'Fixed Contagious Confusion proc registration', type: 'fix' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
