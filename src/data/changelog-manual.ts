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
    date: '2026-04-21',
    items: [
      { message: 'Huge milestone for Sidekick: migration to new self-sourced dataset is complete. I expect some growing pains, but it will be worth it for keeping SK current with CoH development.', type: 'update' },
      { message: 'Fixes for Leadership end costs and VEAT branch logic', type: 'fix' },
      { message: 'Audit of tooltip hints across the app to ensure everthing has a helpful explaination of what it does', type: 'update' },
      { message: 'New tooltip comparision mode: hover over a power or enhancment and hold shift to keep its info displayed', type: 'feat' },
      { message: 'Audit of Help System to bring it up to date. Did you know there was a searchable Help system??? There is a searchable Help System! Look for the widget at the bottom', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
