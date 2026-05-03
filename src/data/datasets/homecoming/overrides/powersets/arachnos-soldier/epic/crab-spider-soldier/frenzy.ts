/**
 * Frenzy — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. Each field below is a value the previously-committed
 * composed file carried that the current CoD2-raw extraction does not.
 * Keep them — the CoD2 archive we convert from is a snapshot, and these
 * overrides are where current HC values live when they've drifted from
 * that snapshot. See src/data/README.md.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "description": "Your Crab Spider backpack arms go into a frenzy, striking all nearby foes with a barrage of attacks dealing heavy Energy damage in an area around you. Can also reduce the targets' Defense. Damage: Heavy",
  "shortHelp": "Melee(PBAoE), Heavy DMG(Energy), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "range": 7,
    "endurance": 18.2,
    "castTime": 2
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Energy",
    "scale": 2.1,
    "table": "Melee_Damage"
  },
  "effects": {}
};
