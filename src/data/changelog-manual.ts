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
  // ─── 2026-04-23 (evening) ─────────────────────────────────────────────────
  {
    date: '2026-04-23',
    items: [
      { message: '⚠️🚨⚠️ Please be patient for the next day or so while I fix the thousands of things that are currently on fire ⚠️🚨⚠️', type: 'known-issue' },
      { message: 'What happened: SK migrated over to a fully self-source set of data, but the new data is structured differently than the old data that SK was originally buiit around. The migration was important in order to allow SK to remain current and up-to-date with CoH development, so in the long run it will be worth the momentary pain', type: 'update' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
