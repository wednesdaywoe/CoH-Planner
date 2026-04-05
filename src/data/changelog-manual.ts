/**
 * Manually-maintained changelog for the WelcomeModal "What's New" list.
  * This is separate from the auto-generated changelog (changelog.ts) which is based on git history.
 */

export interface ManualChangelogGroup {
  date: string; // YYYY-MM-DD
  items: {
    message: string;
    type: 'feat' | 'fix' | 'update';
  }[];
}

/** Flat entry used by changelog.ts */
export interface ManualEntry {
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update';
}

export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ─── 2026-03-24 ────────────────────────────────────────────────────────────
  {
    date: '2026-04-05',
    items: [
      { message: 'Fixed Destiny and Hybrid to report to the Dashboard correctly', type: 'fix' },
      { message: 'Added a bunch of missing power icons', type: 'fix' },
      { message: 'Added padding and gutter to give Android/mobile users a dead zone on the right side of the enhancement picker where they can touch to scroll', type: 'fix' },
      { message: 'Deactivated UI Scale control on mobile, as CSS zoom is unreliable on mobile browsers and users should use pinch-to-zoom gestures instead', type: 'feat' },
      { message: 'Continued work on implementing changes from Issue 28, Page 3, Panel 2', type: 'fix' },
      ]
  },
];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
