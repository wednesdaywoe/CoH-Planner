/**
 * Manually-maintained changelog for the WelcomeModal "What's New" list.
  * This is separate from the auto-generated changelog (changelog.ts) which is based on git history.
 */

export interface ManualChangelogGroup {
  date: string; // YYYY-MM-DD
  items: ManualChangelogItem[];
}

export interface ManualChangelogItem {
  /**
   * Stable, permanent identifier — the dedup key for the Discord publisher
   * (scripts/push-changelog-discord.ts). Must be unique across the whole file.
   *
   * Assign one when you add the entry and NEVER change it afterwards: the id is
   * what lets you reword or fix typos in `message` without the publisher treating
   * the entry as new and reposting it. Changing an id reposts the entry.
   */
  id: string;
  message: string;
  type: 'feat' | 'fix' | 'update' | 'known-issue';
}

/** Flat entry used by changelog.ts */
export interface ManualEntry {
  id: string;
  date: string;
  message: string;
  type: 'feat' | 'fix' | 'update' | 'known-issue';
}
/*When ready, npm run changelog:push -- --dry-run
*/
export const MANUAL_CHANGELOG_GROUPS: ManualChangelogGroup[] = [
  // ───────────────────────────────────────────────────────────────────────
  {
    date: '2026-07-26',

    items: [
      { id: 'rust-calc-engine', message: 'New calculation engine: Replaced the TypeScript math Sidekick has used until now. Despite being (hopefully) invisible to users, this is kind of a big deal, for reasons below...', type: 'update' },
      { id: 'parser-data-resync', message: 'This is the bigger part: Every power was re-read with a substantially corrected parser and re-converted: of the ~19,200 data modules, 3,956 were wrong in some way and 24 remain. Recovered along the way were seven power-header fields, Rebirth\'s special-attrib band, accolade and inherent data, and a one-field misalignment that mislabelled when an effect applies. So unlike the engine swap, this part you will (hopefully) see: powers whose effects were dropped or collapsed together, should now read correctly. I\'ve done everything I can on my end to get this working right, but because of how many powers and attributes there are, I can\'t personally verify every number.', type: 'fix' },
      { id: 'engine-offline-cache', message: 'The calculation engine and its game data are now cached, so going offline won\'t kill the calculations.', type: 'feat' },
      { id: 'engine-failure-visible', message: 'If the calculation engine fails to load, you get a red banner telling you so.', type: 'fix' },
      { id: 'jump-speed-base-mph', message: 'Jump speed was reading about 1.47x too fast due to a units mismatch.', type: 'fix' },
      { id: 'adaptation-stance-parent-desync', message: 'Bio Armor: fixed the Adaptation stance desyncing between the power-info picker and the header. On Scrapper/Brute/Tanker two powers share the internal name the stance binds to, and the picker was choosing between them by pick order — so taking Evolving Armor before Adaptation bound it to the wrong one.', type: 'fix' },
      { id: 'trip-mine-multi-detonation', message: 'Trip Mine on Blaster and Defender was reading roughly 13x too high 😅. Time Bomb, Seeker Drones, High Explosives and Photon Seekers had the issue.', type: 'fix' },
      { id: 'trip-mine-chance-weighting', message: 'Summoned-pet damage now weights partial-chance hits. Trip Mine\'s third Fire hit only lands half the time and was being counted in full.', type: 'fix' },
      { id: 'dominator-trip-mine-no-damage', message: 'Dominator Trip Mine showed no damage at all. Its built differently from the other ATs: the damage is only reachable through an "Info" power, which the converter was discarding as tooltip-only.', type: 'fix' },
      { id: 'adaptation-stance-tooltips', message: 'The Adaptation and Staff Form stance pickers in a power\'s info now have tooltips, saying what the stance does and what that particular power contributes to it (or that it contributes nothing).', type: 'fix' },
      { id: 'fly-speed-base-mph', message: 'Fly speed had the same units mistake, plus one of its own.', type: 'fix' },
      { id: 'accolade-values-corrected', message: 'Removed hardcoded values for Accolades, Sidekick now reads all of them from the game data. This also fixes the hero/villain pairing.', type: 'fix' },
    ]
  },
  {
    date: '2026-07-19',

    items: [
      { id: 'set-damage-bonus', message: 'Fixed a damage set bonus multiplier that was hardcoded for HC and inflating values for Rebirth', type: 'fix'},
      { id: 'belt-of-liberty', message: 'Rebirth: Added Belt of Liberty enhancement set', type: 'fix'},
      { id: 'ruleof5-per-bonus-override', message: 'You can now hide pesky Rule of 5 warnings at a per-set-bonus level, just open the Set Totals menu', type: 'feat' },
    ]
  },
  {
    date: '2026-07-17',

    items: [
      { id: 'dataset-lazy-load-slimdown', message: 'Sidekick went on a weight-loss program 🍩, and lost 26mb of entry chunk and 35mb precache.', type: 'update' },
      { id: 'bio-absorb-overstated', message: 'Fixed overstated absorb on Bio Armor caused by a stale override and a converter that summed a placeholder value. They now grant the 30% (Ablative) and 10% of Max HP per foe hit (Parasitic).', type: 'fix' },
      { id: 'parasitic-absorb-per-target', message: 'Parasitic Aura\'s absorb now grows with the number of foes hit (up to 10), instead of ignoring the targets-hit slider.', type: 'fix' },
      { id: 'targets-hit-slider-off', message: 'Fixed the targets-hit slider computing its 1-target value while displaying "Off". Evolving Armor, Parasitic Aura, DNA Siphon and every other power with a targets-hit slider now read 0 at "Off".', type: 'fix' },
      { id: 'offensive-adaptation-res-resisted', message: 'Bio Armor: Offensive Adaptation\'s -7.5% Resistance self-penalty is now reduced by your own resistance to each damage type.', type: 'fix' },
      { id: 'adaptation-stance-desync', message: 'Fixed the Adaptation stance occasionally desyncing from the sub-power stance display, including a case where importing a Stalker/Sentinel build dropped the stance entirely.', type: 'fix' },
    ]
  },
  {
    date: '2026-07-16',

    items: [
      { id: 'movement-speed-display-rates', message: 'Movement speeds in the info panel should now be displayed with rates instead of modifier values.', type: 'fix' },
      { id: 'attribmod-coverage-expansion', message: 'A broad swath of powers should now have attribMods to surface their effects correctly instead of being smooshed', type: 'fix' },
      { id: 'internal-name-collisions', message: 'Fix for internal name collisions that could result in powers accepting the wrong enhancements', type: 'fix' },
    ]
  },
  {
    date: '2026-07-14',

    items: [
      { id: 'calc-perf-per-instance', message: 'Fixed a slowdown on completed builds where toggling powers, adjusting sliders, or swapping enhancements had a ~0.5–1s delay before updating. The character totals were being recalculated once per power/slot instead of a single shared time. Most noticeable in Chrome.', type: 'fix'},
      { id: 'adaptations-by-level-subpowers', message: 'Adaptations now show as sub-powers of Adaptation in the By-Level layout, matching By-Powerset', type: 'fix'},
      { id: 'bio-adaptation-stance-leak', message: 'Fixed Bio Armor adaptations leaking into base powers — Evolving Armor\'s defense (Defensive) and regen/recovery (Efficient) now apply only in their stance, at full value', type: 'fix'},
      { id: 'stance-picker-double-click', message: 'Fixed the stance picker in the power info window needing a double-click to fill in the selected adaptation', type: 'fix'},
      { id: 'offensive-adaptation-self-penalty', message: 'Bio Armor: Offensive Adaptation now applies its -7.5% Resistance(all) self-penalty to your totals', type: 'fix'},
      { id: 'maxhp-two-halves', message: 'Fixed +MaxHP powers that grant their bonus in two halves — one enhanceable, one un-enhanceable (Inexhaustible, High Pain Tolerance, Dull Pain, Hoarfrost, Earth\'s Embrace, Revive, Serum, and more)', type: 'fix'},
      { id: 'rage-crash-defense-self', message: 'Rage\'s post-crash -20% Defense(All) is now correctly counted as a penalty to yourself rather than a debuff to enemies', type: 'fix'},
    ]
  },
  {
    date: '2026-07-13',

    items: [
      { id: 'movement-speed-oddities', message: 'Fixed some movement speed oddities', type: 'fix'},
      { id: 'travel-combat-suppression', message: 'Fixed combat suppression for travel powers', type: 'fix'},
      { id: 'removed-vertical-cell-adjustment', message: 'Removed vertical cell adjustment for now, it has some unintended consequences that are not great. Rearrange and expand/collapse remain', type: 'fix'},
      { id: 'dot-damage-overstated', message: 'Fix for DoT damage being overstated; this was widespread', type: 'fix'},
      { id: 'rebirth-martial-prowess-order', message: 'Fix for Rebirth\'s Tanker Martial Prowess epic pool, Art of War was listed as the first selectable power instead of Throwing Dagger and Battle Hardened', type: 'fix'},
      { id: 'buff-pet-aura-toggle', message: 'Added buff-pet aura toggle and calculations for character totals', type: 'feat'},
    ]
  },
  {
    date: '2026-07-10',

    items: [
      { id: 'planner-layout-rearrange', message: 'The Sidekick main planner surface can now be reorganized with drag-n-drop, adjustable borders, and show/hide (through the new Layout menu)', type: 'feat'},
      { id: 'import-illegal-build-guard', message: 'Added an import guard that warns you when the import has created an illegal build, and reports you to the PPD. This typically happens when importing from a Mids file and is caused by a name mismatch', type: 'feat'},
      { id: 'per-server-build-persistence', message: 'Switching servers now keeps a separate build for each one. Your Homecoming, Rebirth and Thunderspy builds are saved independently, so moving between datasets no longer clears your work. No account needed.', type: 'feat' },
      { id: 'shared-build-server-switch', message: 'Importing a shared build (or opening a .skif) made on a different server now correctly switches Sidekick to that server\'s dataset.', type: 'fix' },
      { id: 'build-load-dataset-order', message: 'Loaded builds should now load the appropriate server dataset BEFORE loading the rest of the build', type: 'fix'},
      { id: 'account-synced-favorites', message: 'Added account-synced favorites with local cache reconciliation', type: 'fix'},
      { id: 'system-atlas', message: 'Added a neat system atlas for the nerds 🤓: Menu > System Atlas', type: 'feat' },
      { id: 'absorb-stat', message: 'New "Absorb" stat — a trackable total for your absorb shield (the temporary HP layer that soaks damage before your health). Enable it under Settings → Stats → Survival & Mobility, or read it in the Detailed Totals sheet. It sums absorb from your active powers plus set-bonus/proc absorb.', type:'feat'},
      { id: 'absorb-maxhp-scaling', message: 'Absorb shields that scale off Max HP now compute correctly. Wild Bastion, Ablative Carapace, Parasitic Aura and Force Barrier deliver their absorb via a Max-HP formula the old converter dropped (keeping only the duration), so their shield amount never showed. These now read as a % of your current Max HP — growing with +HP accolades and with +Absorb strength from Power Boost / Clarion Radial — while flat shields like Psychokinetic Barrier stay fixed regardless of Max HP. A few conditional cases (e.g. Master Brawler\'s missing-HP formula) remain duration-only for now.', type:'fix'},
      { id: 'tspy-empty-powers-restored', message: 'Thunderspy: ~1,000 powers that were showing no effects should now display correctly. Resistance armors (Mind Over Body, Willpower, High Pain Tolerance, Absorption) and the +To-Hit portion of buffs (Aim, Build Up, Link Minds) stored their real data in a format the parser wasn\'t reading, so they came through empty', type:'fix'},
      { id: 'tspy-multi-type-defense', message: 'Thunderspy: multi-type defense powers now show all their defense types. Mind Link / Link Minds, Fade, Farsight, Invincibility, Energy Cloak and ~85 other powers were rendering as a single defense type (Mind Link showed Def(Melee) instead of Def(All)); the full set of types is now recovered.', type:'fix'},
      { id: 'tspy-resistance-mislabeled', message: 'Thunderspy: some damage-type resistances were mislabeled as damage. Glacial Shield\'s +Res(Cold) and the -Res(all) from Corrosive Sap / Enervating Field were being read as damage effects; they now correctly show as resistance.', type:'fix'},
      { id: 'stat-label-shortening', message: 'Shortened a few stat labels (healing and jump) so the totals panel reads more cleanly.', type:'update'},
    ]
  },
  {
    date: '2026-07-08',

    items: [
      { id: 'slotted-proc-controls', message: 'New "Slotted Procs" controls in the power info panel: each slotted proc now has its own on/off switch, plus a slider for variable procs. A stack slider for Might of the Tanker (0–3 stacks of +Res(All)) and an HP% slider for Reactive Defenses\' scaling +Res(All) (3%→12.9%). Settings save and share with the build', type: 'feat'},
      { id: 'might-of-tanker-proc-totals', message: 'Might of the Tanker\'s +Res(All) proc now contributes to your resistance totals (resolved at the correct 5%/stack via the slotted-power modifier, rather than the raw unscaled value). Defaults to 1 stack; slide to set your actual stack count. Procs in a toggled-off power correctly contribute nothing. This will move resistance numbers on builds slotting it.', type: 'update'},
      { id: 'tspy-gadgetry-utility-belt', message: 'Thunderspy: the Gadgetry power and Utility Belt pools are now available. It was present in the game data but wasn\'t being surfaced in the planner', type: 'feat'},
      { id: 'stance-mode-suppression', message: 'Stance and mode toggles should now correctly suppress the powers they disable', type: 'fix'},
      { id: 'tooltip-conditional-healing', message: 'Power hover-tooltips now show conditional, stance-gated healing (such as DNA Siphon) that previously only appeared in the full info panel.', type: 'fix'},
      { id: 'obscure-sustenance-recharge', message: 'Corrected Obscure Sustenance\'s recharge', type: 'update'},
      { id: 'converter-rewrite', message: '🚨 A very large and comprehensive data converter rewrite was implemented to address a large family of bugs related to the old converter flattening data and dropping important attributes before it reached the planner (ie: a power does energy/smashing damage, but in the planner you only see the smashing damage portion). If the change is successful, you won\'t notice anything has changed other than more information surfacing in the planner that was previously missing 🚨', type: 'fix'},
      { id: 'judgement-attack-chain', message: 'Added support for Incarnate Judgement power in attack chain calculations', type: 'feat'},
    ]
  },

];

/** Flatten groups into individual entries for changelog.ts consumption */
export const MANUAL_CHANGELOG: ManualEntry[] = MANUAL_CHANGELOG_GROUPS.flatMap(group =>
  group.items.map(item => ({ id: item.id, date: group.date, message: item.message, type: item.type }))
);
