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
    date: '2026-03-26',
    items: [
      { message: 'Added Prestige Enhancements just because SpectralShard asked nicely', type: 'feat' },
      { message: 'Added Slow enhancement to Storm Blast Cloudburst', type: 'fix' },
      { message: 'More fixes for internal power name collisions', type: 'feat' },
      { message: 'The info panel now persists the last-hovered power until you hover a different one', type: 'feat' },
      { message: 'enduranceDiscount should now be processed. 27 powerset powers plus the epic pool versions should now contribute to endurance discount', type: 'fix' },
      { message: 'Resilience missing icon: Fixed all 5 archetype variants and added an ICON_OVERRIDES map to the conversion script to prevent regressions', type: 'update' },
      { message: 'Fixed Hybrid Melee regeneration 250% → 30%. The regeneration values in the Hybrid Melee incarnate data were stored as raw multipliers instead of decimals', type: 'update' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
