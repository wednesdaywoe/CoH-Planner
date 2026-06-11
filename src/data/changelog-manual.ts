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
WheelEvent
/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update' | 'known-issue';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ───────────────────────────────────────────────────────────────────────
  {
    date: '2026-06-11',
    items: [
      { message: 'Fixed an issue where a build import that failed badly had no way to recover to a clean state, keeping the user stuck in the corrupted build state', type: 'fix' },
      { message: 'Massive under-the-hood cleanup to remove legacy code and audit the data pipeline, surfaced a bug that was affecting all melee damage', type: 'update' },
      { message: 'Added a new Attack Chain Builder tool! Look for it below the Dashboard', type: 'feat' },
      { message: 'Chain Builder drag-and-drop re-ordering is wired up now', type: 'feat' },
      { message: 'You can now save attack chains with your build and copy the chain sequence to clipboard', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
