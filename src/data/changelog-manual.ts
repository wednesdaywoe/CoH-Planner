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
      { message: 'Added expandable information to Activation Time, so users can see both base and Arcantime values', type: 'feat' },
      { message: 'Added per-proc chance breakdown to the info panel. Expand for details and calculations on each slotted proc', type: 'feat' },
      { message: 'Added per-server inherent power rules and auto-granted slot handling', type: 'fix' },
      { message: 'Added a message to point out the searchable help system. You can disable this in settings. Also added a highlight to the Archetype/Powerset menu to help new users figure out how to get started', type: 'feat' },
      { message: 'Added a live link you can use to share builds (though fair warning, it\'s loooooooong). The url will update as you edit your build. File > Copy Live Link', type: 'feat' },
      { message: 'Power pools unique to Rebirth are missing. Offering 100m INF for their safe return, unharmed', type: 'known-issue' },
      { message: 'The current roadmap for inclusion is Thunderspy, Unity, and New Dawn', type: 'update' },
      { message: 'New feature for build sharing: you can now search by author, and logged in users have a profile page for sharing your public builds. File > Profile Settings', type: 'feat' },
    ] 
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
