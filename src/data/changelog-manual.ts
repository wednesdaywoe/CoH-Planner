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
    date: '2026-03-27',
    items: [
      { message: 'Added comprehensive verbose logging for power calculations. Enable debug mode under Settings and open your browser console to check Sidekick\'s math', type: 'feat' },
      { message: 'Fixed KB protection and KB resistance to prevent them from getting merged', type: 'fix' },
      { message: 'Defense Debuff Res should now be mapped correctly', type: 'fix' },
      { message: 'Mez and debuff res from Super Reflexes autos should now register and factor into totals', type: 'fix' },
      { message: 'Added mapping for debuff resistance stats from set bonuses', type: 'fix' },
      { message: 'Added Prestige Enhancements just because SpectralShard asked nicely', type: 'feat' },
      { message: 'Added Slow enhancement to Storm Blast Cloudburst', type: 'fix' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
