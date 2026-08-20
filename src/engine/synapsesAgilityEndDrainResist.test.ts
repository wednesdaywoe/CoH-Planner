/**
 * Synapse's Agility's 6th piece grants its always-on global: 20% resistance to
 * endurance drain.
 *
 * Reported 2026-08-19 against the live Rebirth beta: the piece rendered as
 * "Empty" and slotting it did nothing. Two defects behind one symptom — the
 * extractor vintage couldn't resolve the piece's display name (io-sets-raw
 * carried name "Empty", aspects []), and nothing modeled the global the piece
 * grants. The bins grant it as an auto power gated on the F piece being
 * slotted (Set_Bonus.Challenge_Set_Bonus.Synapses_Agility), whose two
 * templates are 0.2×Melee_Ones on the Recovery and Endurance attribs — one
 * named 20% covering both drain axes.
 *
 * This runs the shipped engine: the piece (is_proc, resolved name) must land
 * +20 on BOTH debuff-resist axes, and only when slotted.
 */

import { describe, it, expect } from 'vitest';
import { engineArtifactsPresent, recalcJson } from './engine.node';

const suite = engineArtifactsPresent('rebirth') ? describe : describe.skip;
if (!engineArtifactsPresent('rebirth')) {
  console.warn('[synapsesAgilityEndDrainResist] engine artifacts missing — run `npm run build:engine`; suite skipped.');
}

const SYNAPSE_F = {
  id: 'synapses_agility-6',
  name: "Synapse's Agility #6",
  icon: '',
  level: 50,
  attuned: false,
  boost: 0,
  type: 'io-set',
  set_id: 'synapses_agility',
  set_name: "Synapse's Agility",
  piece_num: 6,
  aspects: [],
  is_proc: true,
  is_unique: false,
};

/** A Tanker whose only slotted power is Combat Jumping (a Universal Travel host). */
const state = (slots: unknown[]) =>
  JSON.stringify({
    name: 'synapses-agility',
    dataset: 'rebirth',
    archetype: { id: 'tanker', name: 'Tanker' },
    level: 50,
    primary: { id: 'tanker/electric-armor', name: 'Electric Armor', powers: [] },
    secondary: { id: 'tanker/ice-melee', name: 'Ice Melee', powers: [] },
    pools: [
      {
        id: 'leaping',
        name: 'Leaping',
        powers: [
          {
            internal_name: 'Combat_Jumping',
            power_set: 'leaping',
            level: 4,
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
    ],
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

function drainResists(slots: unknown[]): { endurance: number; recovery: number } {
  const out = JSON.parse(recalcJson('rebirth', state(slots))!) as {
    stats: { debuff_resist_endurance: number; debuff_resist_recovery: number };
  };
  return {
    endurance: out.stats.debuff_resist_endurance,
    recovery: out.stats.debuff_resist_recovery,
  };
}

suite("Synapse's Agility end-drain resist reaches the totals", () => {
  it('the slotted F piece adds 20 to both drain axes', () => {
    const base = drainResists([null]);
    const slotted = drainResists([SYNAPSE_F]);
    expect(slotted.endurance).toBeCloseTo(base.endurance + 20, 6);
    expect(slotted.recovery).toBeCloseTo(base.recovery + 20, 6);
  });
});
