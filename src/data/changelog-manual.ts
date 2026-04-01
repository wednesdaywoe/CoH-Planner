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
    date: '2026-04-01',
    items: [
      { message: 'Introducing $idekick+ subscription model', type: 'feat' },
      { message: 'Generic: Free, access to Single Origin enhancements', type: 'feat' },
      { message: '$idekick+ Pro: $5/month, access to Common IOs', type: 'feat' },
      { message: '$idekick+ Elite: $15/month, access IO sets and Universal sets', type: 'feat' },
      { message: '$idekick+ Elite Platinum: $20/month, access to Very Rare and Winter sets', type: 'feat' },
      { message: '$idekick+ Elite Platinum Plus: $30/month, access to all sets including Hamidon, Titan, and Hydra', type: 'feat' },
    ],
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
