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
    date: '2026-04-14',
    items: [
      { message: 'Enhanced VEAT branch powerset handling in Mids import process', type: 'fix' },
      { message: 'Fixed a large number of powersets that had their level 0 powers incorrectly ordered', type: 'fix' },
      { message: 'Added a gentle Onboarding beacon system to point out features for new users. Onboarding can be disabled or reset in the settings menu.', type: 'feat' },
      { message: 'Added handling for Prestige enhancement UIDs to all import methods', type: 'feat' },
      { message: 'Fixed recovery end/sec display double-counting the base 100 endurance', type: 'fix' },
      { message: 'Fixed permatracker to use the same calculation as InfoPanel for Alpha incarnate bonuses instead of doing its own thing', type: 'fix' },
      ]
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
