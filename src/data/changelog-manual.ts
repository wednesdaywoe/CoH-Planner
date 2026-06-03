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
    date: '2026-06-2',
    items: [
      { message: 'Rebirth users can now utilize the Genesis incarnate slot! (lucky 😤) Now, Genesis is complicated and I expect this first pass to be messy. Please manage your expectations accordingly, and report any issues you find!', type: 'feat' },
      { message: 'Added a Set Totals pop-up, just below the dashboard', type: 'feat' },
      { message: 'Fix for some auto-grant powers that were mangled by the previous data set regeneration', type: 'fix' },
      { message: 'You can now move slot levels around! Shift-Right-Click a slot and select "Move Slot Level", then just click the slot you want to swap levels with', type: 'feat' },
      { message: 'Pulled one thread on Power Boost and the whole sweater came apart...turned into a whole mess of data gaps. Many fixes ensued 🤕', type: 'fix' },
      { message: 'Fix for Blaster patron-pool selection', type: 'fix' },
      { message: 'Welcome Modal on page load has been retired, its now part of the the "New Update Available" banner, and can also be accessed through menus. Various small UI tweaks' , type: 'update' },
      { message: 'The display of global recharge can now be toggled between a simple sum of your bonuses (e.g. +25%), and the base-100% plus bonuses (e.g., 125%) Settings > Display', type: 'feat' },
      { message: 'Began work on building a Thunderspy dataset. Not enabled yet, but soon!', type: 'feat' },
      { message: 'Added a new Copy Short Link to the File menu. This generates a much friendlier link for sharing, but it does require authentication', type: 'feat' },
      { message: 'The Maximize Enhancements feature has been changed and extended to a new modal that allows bulk-editing of enhancement levels, attunement, and boosters across the entire build', type: 'feat' },
      { message: 'Added a helper to computeAllSlotLevels once and write one slotOrder to capture the respec-mode level as the stored level', type: 'feat' },
      { message: 'Improved build management options: menu items are now New Build, Clear Powers, Clear Slots, Clear Enhancements, and Maximize Enhancements', type: 'feat' },
      { message: 'Multi-slot common IOs / HOs / SOs in one go! 😎 In Select Multiple mode, taps stack a count badge, bar fills empty slots in order', type: 'feat' },
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
