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
    date: '2026-05-05',
    items: [
      { message: 'Fix for an issue with Rebirth Arachnos missing powers', type: 'fix' },
      { message: 'Rebirth Kheldians now have a form mode selector that routes the form buffs to the relevant powers', type: 'fix' },
      { message: 'Power pools unique to Rebirth are missing. Offering 100m INF for their safe return, unharmed', type: 'known-issue' },
      { message: 'There are some known issues with Rebirth powers having incorrect allowed enhancement types, its being investigated', type: 'known-issue' },
      { message: 'Updated Mids importer to support Rebirth builds', type: 'fix' },
      { message: 'The current roadmap for inclusion is Thunderspy, Unity, and New Dawn', type: 'update' },
      { message: 'New feature for build sharing: you can now search by author, and logged in users have a profile page for sharing your public builds. File > Profile Settings', type: 'feat' },
    ] 
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
