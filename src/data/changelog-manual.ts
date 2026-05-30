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
    date: '2026-05-30',
    items: [
      
      { message: 'Rebirth: Rolling Barrage, Imperial Might, Winter Storm, Guardian ATOs, and other Rebirth-only IO sets now report their full ladder of set bonuses (Range, Damage, Movement, KB Protection, mez duration, and more). Full audit closed ~1,100 silently-dropped bonus tiers caused by Rebirth attrib-index divergences from Homecoming.', type: 'fix' },
      { message: 'Rebirth: Forced Indoctrination (universal control duration set) is now offered as a slottable IO set on every Confuse / Hold / Sleep / Fear / Stun / Immobilize-allowing power across all archetypes. Previously dropped during extraction due to an empty category field in the binary.', type: 'fix' },
      { message: 'Rebirth: Halloween & ATO proc pieces (Endless Nightmare, Witchcraft, Vampire\'s Bite, The Haunting, Guardian\'s Gift, etc.) are now correctly recognised as procs with descriptive names like "Recharge/Chance for Fear, Psionic Damage". Added PPM/mechanics entries for Endless Nightmare & Superior Endless Nightmare (both 2.5 PPM).', type: 'fix' },
      { message: 'Rebirth: Spirit Ward now reports its real absorb total (5×10% per stack = 0.5) instead of an inflated 5.5 that came from double-counting engine-side absorb-cap expressions. HC sustains (Wild Fortress, Sound Barrier, etc.) verified unchanged.', type: 'fix' },
      { message: 'Spirit Ward and similar multi-stack absorb powers now surface per-stack scale + stacking slider (1..5 stacks @ 10% each, "every 3s" cadence shown on the slider label). Absorb powers with *_Ones tables (Spirit Ward on Rebirth; Ablative Carapace, Parasitic Aura, Wild Bastion on HC) now display as a % of Max HP rather than a bare 0.1-style value.', type: 'feat' },
      { message: 'Power Info: debuff/buff effect rows now show their duration in (Xs) form (e.g. "-Recharge (15s)") instead of hiding it. Conditional extras (e.g. Acid Arrow Acid Burn adding -Recharge to Entangling Arrow) now show their value as a proper signed % instead of a raw 0.08-style scale, and also show the duration.', type: 'fix' },
      { message: 'Power Boost (Rebirth Controller Epic, HC Blaster Energy Manipulation, Dominator Assault variants, Sonic Melee Build Up, etc.): no longer shows nonsensical "Mag 1 Hold/Stun/Sleep for 15s" entries or a phantom "+66% Endurance" caster gain. The aspect=Strength templates that buff your applied mez/heal/absorb/movement/endurance-mod strength now correctly route to the "+Special" section rather than masquerading as direct caster effects.', type: 'fix' },
      { message: 'Enhancement Picker: the IO crafting Level and Boost dials now accept typed input (click the number, type, Enter to commit) and vertical drag (drag up/down on the number, ~one step per 6px). The +/- buttons are still there.', type: 'feat' },
      { message: 'New "Forum Post" export under Save/Share → Export: generates a forum-ready build summary in Plain Text, BBCode, or Markdown so you can paste it into Reddit, Discord, Homecoming forums, etc. Optional set-bonus and incarnate sections. A separate "Copy Short Link" button surfaces the shareable URL for wrapping in the forum\'s link tool.', type: 'feat' },
      { message: 'Bookmarking ?serverId=rebirth (or =homecoming) now reliably lands on that dataset. Previously the URL, dataset badge, and archetype dropdown could disagree if your last build was on a different server.', type: 'fix' },
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
