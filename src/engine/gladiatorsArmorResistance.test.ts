/**
 * Gladiator's Armor reaches the totals, like every other Resist Damage set.
 *
 * Reported 2026-08-17 against 0.1.9.3-beta: with Gladiator's Armor slotted in
 * Charged Armor the power window showed the enhanced resistance but the
 * cumulative totals did not move, while Unbreakable Guard in the same power
 * behaved correctly. The two halves read different tables — the window reads
 * the planner's hand-curated `io-sets-raw`, the totals come from the engine's
 * contract bundle — and only the contract was wrong: the extractor labelled a
 * resist piece's collapsed aspect from the record's `Category`, which the game
 * leaves blank for PvP sets, so Gladiator's Armor's pieces exported as damage
 * enhancement (rebuild `src/data/io-set-resist-aspect.test.ts` guards the data).
 *
 * This is the A/B from the report, run through the real engine. The two sets
 * share a schedule and an aspect layout, so equal slotting must produce equal
 * resistance — an assertion that stays honest without pinning a magnitude the
 * next rebalance would move. It needs both arms: "GA is above base" alone would
 * pass on any nonzero contribution, including a wrong one.
 */

import { describe, it, expect } from 'vitest';
import { engineArtifactsPresent, recalcJson } from './engine.node';

const suite = engineArtifactsPresent('homecoming') ? describe : describe.skip;
if (!engineArtifactsPresent('homecoming')) {
  console.warn('[gladiatorsArmorResistance] engine artifacts missing — run `npm run build:engine`; suite skipped.');
}

const piece = (setId: string, setName: string, num: number, aspects: string[]) => ({
  id: `${setId}-${num}`,
  name: `${setName} #${num}`,
  icon: '',
  level: 50,
  attuned: false,
  boost: 0,
  type: 'io-set',
  set_id: setId,
  set_name: setName,
  piece_num: num,
  aspects,
  is_proc: false,
  is_unique: false,
});

const RES = ['Resistance'];
const RES_END = ['Resistance', 'EnduranceReduction'];

/** A Tanker whose only slotted power is Charged Armor. */
const state = (slots: unknown[]) =>
  JSON.stringify({
    name: 'gladiators-armor',
    dataset: 'homecoming',
    archetype: { id: 'tanker', name: 'Tanker' },
    level: 50,
    primary: {
      id: 'tanker/electric-armor',
      name: 'Electric Armor',
      powers: [
        {
          internal_name: 'Charged_Armor',
          power_set: 'tanker/electric-armor',
          level: 1,
          slots,
          is_active: true,
          active_sub_power: null,
          inherent_slot_count: 0,
          is_locked: false,
          inherent_category: null,
          targets_hit: null,
        },
      ],
    },
    secondary: { id: 'tanker/ice-melee', name: 'Ice Melee', powers: [] },
    pools: [],
    epic_pool: null,
    inherents: [],
    accolades: [],
    incarnates: { alpha: null, judgement: null, interface: null, destiny: null, lore: null, hybrid: null, genesis: null },
    slot_order: [],
    combat: {
      in_combat: false,
      enemy_level_offset: 0,
      fury_level: 0,
      vigilance_team_size: 1,
      target_class: null,
      target_is_player: false,
    },
  });

/** Smashing/lethal resistance total — what the dashboard's S/L ring reads. */
function resSL(slots: unknown[]): number {
  const out = JSON.parse(recalcJson('homecoming', state(slots))!) as { stats: { res_sl: number } };
  return out.stats.res_sl;
}

// Piece numbering differs between the two sets; these are the Resistance and
// Resistance/Endurance pieces of each, so both builds slot the same two aspects.
const GLADIATORS_ARMOR = [
  piece('gladiators_armor', "Gladiator's Armor", 5, RES),
  piece('gladiators_armor', "Gladiator's Armor", 1, RES_END),
];
const UNBREAKABLE_GUARD = [
  piece('unbreakable_guard', 'Unbreakable Guard', 1, RES),
  piece('unbreakable_guard', 'Unbreakable Guard', 2, RES_END),
];

suite('Gladiator’s Armor resistance reaches the totals', () => {
  it('enhances Charged Armor’s resistance at all', () => {
    expect(resSL(GLADIATORS_ARMOR)).toBeGreaterThan(resSL([null, null]));
  });

  it('enhances it by the same amount as Unbreakable Guard', () => {
    expect(resSL(GLADIATORS_ARMOR)).toBeCloseTo(resSL(UNBREAKABLE_GUARD), 6);
  });
});
