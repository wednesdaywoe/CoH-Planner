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
  // ───────────────────────────────────────────────────────────────────────
  {
    date: '2026-05-07',
    items: [
      { message: 'UI adjustments to the info panel and dashboard', type: 'update' },
      { message: 'Added expandable information to Activation Time, so users can see both base and Arcantime values', type: 'feat' },
      { message: 'Added per-proc chance breakdown to the info panel. Expand for details and calculations on each slotted proc', type: 'feat' },
      { message: 'Added per-server inherent power rules and auto-granted slot handling', type: 'fix' },
      { message: 'Added a message to point out the searchable help system. You can disable this in settings. Also added a highlight to the Archetype/Powerset menu to help new users figure out how to get started', type: 'feat' },
    ] 
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
