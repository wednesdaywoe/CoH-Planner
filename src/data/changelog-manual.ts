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
    date: '2026-07-14',

    items: [
      { message: 'Dear writer who wrote this gem: "Change how people log in. Your system of logging in sucks." Here is my sincere response: 🖕', type: 'feat' },
    ]
  },
  {
    date: '2026-07-17',

    items: [
      { message: 'Fixed overstated absorb on Bio Armor caused by a stale override and a converter that summed a placeholder value. They now grant the 30% (Ablative) and 10% of Max HP per foe hit (Parasitic).', type: 'fix' },
      { message: 'Parasitic Aura\'s absorb now grows with the number of foes hit (up to 10), instead of ignoring the targets-hit slider.', type: 'fix' },
      { message: 'Fixed the targets-hit slider computing its 1-target value while displaying "Off". Evolving Armor, Parasitic Aura, DNA Siphon and every other power with a targets-hit slider now read 0 at "Off".', type: 'fix' },
      { message: 'Bio Armor: Offensive Adaptation\'s -7.5% Resistance self-penalty is now reduced by your own resistance to each damage type.', type: 'fix' },
      { message: 'Fixed the Adaptation stance occasionally desyncing from the sub-power stance display, including a case where importing a Stalker/Sentinel build dropped the stance entirely.', type: 'fix' },
    ]
  },
  {
    date: '2026-07-16',

    items: [
      { message: 'Movement speeds in the info panel should now be displayed with rates instead of modifer values.', type: 'fix' },
      { message: 'A broad swath of powers should now have attribMods to surface their effects correctly instead of being smooshed', type: 'fix' },  
      { message: 'Fix for internal name collisions that could result in powers accepting the wrong enhancments', type: 'fix' },
    ]
  },
  {
    date: '2026-07-14',

    items: [
      { message: 'Fixed a slowdown on completed builds where toggling powers, adjusting sliders, or swapping enhancements had a ~0.5–1s delay before updating. The character totals were being recalculated once per power/slot instead of a single shared time. Most noticeable in Chrome.', type: 'fix'},
      { message: 'Adaptations now show as sub-powers of Adaptation in the By-Level layout, matching By-Powerset', type: 'fix'},
      { message: 'Fixed Bio Armor adaptations leaking into base powers — Evolving Armor\'s defense (Defensive) and regen/recovery (Efficient) now apply only in their stance, at full value', type: 'fix'},
      { message: 'Fixed the stance picker in the power info window needing a double-click to fill in the selected adaptation', type: 'fix'},
      { message: 'Bio Armor: Offensive Adaptation now applies its -7.5% Resistance(all) self-penalty to your totals', type: 'fix'},
      { message: 'Fixed +MaxHP powers that grant their bonus in two halves — one enhanceable, one unenhanceable (Inexhaustible, High Pain Tolerance, Dull Pain, Hoarfrost, Earth\'s Embrace, Revive, Serum, and more)', type: 'fix'},
      { message: 'Rage\'s post-crash -20% Defense(All) is now correctly counted as a penalty to yourself rather than a debuff to enemies', type: 'fix'},
    ]
  },
  {
    date: '2026-07-13',

    items: [
      { message: 'Fixed some movement speed oddities', type: 'fix'},
      { message: 'Fixed combat suppression for travel powers', type: 'fix'},
      { message: 'Removed vertical cell adjustment for now, it has some unintended consequences that are not great. Rearrange and expand/collapse remain', type: 'fix'},
      { message: 'Fix for DoT damage being overstated; this was widespread', type: 'fix'},
      { message: 'Fix for Rebirth\'s Tanker Martial Prowess epic pool, Art of War was listed as the first selectable power instead of Throwing Dagger and Battle Hardened', type: 'fix'},
      { message: 'Added buff-pet aura toggle and calculations for character totals', type: 'feat'},


    ]
  },
  {
    date: '2026-07-10',

    items: [
      { message: 'The Sidekick main planner surface can now be reorganized with drag-n-drop, adjustable borders, and show/hide (through the new Layout menu)', type: 'feat'},
      { message: 'Added an import guard that warns you when the import has created an illegal build, and reports you to the PPD. This typically happens when importing from a Mids file and is caused by a name mismatch', type: 'feat'},
      { message: 'Switching servers now keeps a separate build for each one. Your Homecoming, Rebirth and Thunderspy builds are saved independently, so moving between datasets no longer clears your work. No account needed.', type: 'feat' },
      { message: 'Importing a shared build (or opening a .skif) made on a different server now correctly switches Sidekick to that server\'s dataset.', type: 'fix' },
      { message: 'Loaded builds should now load the appropriate server dataset BEFORE loading the rest of the build', type: 'fix'},
      { message: 'Added account-synced favorites with local cache reconciliation', type: 'fix'},
      { message: 'Added a neat system atlas for the nerds 🤓: Menu > System Atlas', type: 'feat' },
      { message: 'New "Absorb" stat — a trackable total for your absorb shield (the temporary HP layer that soaks damage before your health). Enable it under Settings → Stats → Survival & Mobility, or read it in the Detailed Totals sheet. It sums absorb from your active powers plus set-bonus/proc absorb.', type:'feat'},
      { message: 'Absorb shields that scale off Max HP now compute correctly. Wild Bastion, Ablative Carapace, Parasitic Aura and Force Barrier deliver their absorb via a Max-HP formula the old converter dropped (keeping only the duration), so their shield amount never showed. These now read as a % of your current Max HP — growing with +HP accolades and with +Absorb strength from Power Boost / Clarion Radial — while flat shields like Psychokinetic Barrier stay fixed regardless of Max HP. A few conditional cases (e.g. Master Brawler\'s missing-HP formula) remain duration-only for now.', type:'fix'},
      { message: 'Thunderspy: ~1,000 powers that were showing no effects should now display correctly. Resistance armors (Mind Over Body, Willpower, High Pain Tolerance, Absorption) and the +To-Hit portion of buffs (Aim, Build Up, Link Minds) stored their real data in a format the parser wasn\'t reading, so they came through empty', type:'fix'},
      { message: 'Thunderspy: multi-type defense powers now show all their defense types. Mind Link / Link Minds, Fade, Farsight, Invincibility, Energy Cloak and ~85 other powers were rendering as a single defense type (Mind Link showed Def(Melee) instead of Def(All)); the full set of types is now recovered.', type:'fix'},
      { message: 'Thunderspy: some damage-type resistances were mislabeled as damage. Glacial Shield\'s +Res(Cold) and the -Res(all) from Corrosive Sap / Enervating Field were being read as damage effects; they now correctly show as resistance.', type:'fix'},
      { message: 'Shortened a few stat labels (healing and jump) so the totals panel reads more cleanly.', type:'update'},
    ]
  },
  {
    date: '2026-07-08',

    items: [
      { message: 'New "Slotted Procs" controls in the power info panel: each slotted proc now has its own on/off switch, plus a slider for variable procs. A stack slider for Might of the Tanker (0–3 stacks of +Res(All)) and an HP% slider for Reactive Defenses\' scaling +Res(All) (3%→12.9%). Settings save and share with the build', type: 'feat'},
      { message: 'Might of the Tanker\'s +Res(All) proc now contributes to your resistance totals (resolved at the correct 5%/stack via the slotted-power modifier, rather than the raw unscaled value). Defaults to 1 stack; slide to set your actual stack count. Procs in a toggled-off power correctly contribute nothing. This will move resistance numbers on builds slotting it.', type: 'update'},
      { message: 'Thunderspy: the Gadgetry power and Utility Belt pools are now available. It was present in the game data but wasn\'t being surfaced in the planner', type: 'feat'},
      { message: 'Stance and mode toggles should now correctly suppress the powers they disable', type: 'fix'},
      { message: 'Power hover-tooltips now show conditional, stance-gated healing (such as DNA Siphon) that previously only appeared in the full info panel.', type: 'fix'},
      { message: 'Corrected Obscure Sustenance\'s recharge', type: 'update'},
      { message: '🚨 A very large and comprehensive data converter rewrite was implemented to address a large family of bugs related to the old coverter flattening data and dropping important attributes before it reached the planner (ie: a power does energy/smashing damage, but in the planner you only see the smashing damage portion). If the change is successful, you won\'t notice anything has changed other than more information surfacing in the planner that was previously missing 🚨', type: 'fix'},
      { message: 'Added support for Incarnate Judgement power in attack chain calculations', type: 'feat'},
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ date: group.date, message: item.message, type: item.type }))
);
