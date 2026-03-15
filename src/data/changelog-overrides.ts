/**
 * Manual overrides for auto-generated changelog entries.
 *
 * Map a short commit hash (7 chars) to a custom message and/or type.
 * These take priority over the auto-generated git commit messages.
 *
 * Example:
 *   'a1b2c3d': { message: 'Added dark mode support', type: 'feat' },
 *   'e4f5g6h': { message: 'Fixed login crash on mobile' },  // keeps original type
 *   'x9y8z7w': { hide: true },  // hide this commit from the changelog entirely
 */

export interface ChangelogOverride {
  message?: string;
  type?: 'feat' | 'fix' | 'update';
  hide?: boolean;
}

export const CHANGELOG_OVERRIDES: Record<string, ChangelogOverride> = {
  'a294a54': { message: 'Added icon for Rime', type: 'fix' },
  '3b6ade2': { message: 'Add activatePeriod field to power definitions and update calculations', type: 'fix',},
  'f301ff4': { message: '', type: 'fix', hide: true },
  '7e5a9fa': { message: '', type: 'fix', hide: true },
  '8c0d23f': { message: '', type: 'fix', hide: true },
  'e95a822': { message: '', type: 'fix', hide: true },
  'a346b0d': { message: '', type: 'fix', hide: true },
};
  // Add overrides here, keyed by short commit hash (first 7 chars)
  // 'a1b2c3d': { message: 'Better description here', type: 'feat' },

