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
    date: '2026-04-15',
    items: [
      { message: 'Fixed Blaster Leviathan Mastery showing the wrong AT version', type: 'fix' },
      { message: 'Fixed type assignment for Chain powers', type: 'fix' },
      { message: 'Fixed end costs for a variety of power pool toggles that were missing activate_period', type: 'fix' },
      { message: 'Fixed Impervium Armor\'s registration with the Dashboard system', type: 'fix' },
      { message: 'You can now toggle info tooltips on/off with the T key', type: 'feat' },
      { message: 'Tooltip info for individual enhancements will now show all related set bonuses and their active/inactive status (if applicable)', type: 'feat' },
      { message: 'Added a gentle Onboarding beacon system to point out features for new users. Onboarding can be disabled or reset in the settings menu.', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
