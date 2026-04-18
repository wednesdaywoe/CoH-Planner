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
    date: '2026-04-18',
    items: [
      { message: 'An absolutely bonkers amount of new mappings added for Mids import--473 new mappings added to get around typos, inconsistencies, unexpected prefixes and suffixes, abbreviations, aliases, and legacy names. This should significantly improve import accuracy', type: 'feat' },
      { message: 'Fixed some resistance caps, and now the Dashboard should report when you\'ve gone over', type: 'fix' },
      { message: 'Added a gentle Onboarding beacon system to point out features for new users. Onboarding can be disabled or reset in the settings menu.', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
