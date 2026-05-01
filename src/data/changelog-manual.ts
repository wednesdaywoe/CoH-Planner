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
    date: '2026-05-31',
    items: [
      { message: 'New feature for build sharing: you can now search by author, and logged in users have a profile page for sharing your public builds. File > Profile Settings', type: 'feat' },
      { message: 'Fix for some toggle powers that were not picked up by endurance accounting, resulting in no end costs', type: 'fix' },
      { message: 'Rebirth dataset is in the works!', type: 'update' },
      { message: 'Began work on the plumbing to support multiple datasets. Stuff might break',type: "feat"},
      { message: 'You can now collapse and expand the dashboard (press D or use the arrow), and L toggles infopanel lock', type: 'feat' },
    ] 
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
