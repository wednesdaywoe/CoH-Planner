/**
 * Arm Lash — OVERRIDES LAYER
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
  "description": "Your Crab Spider backpack arms lash out in a wide arc, striking all foes in front of you for high Lethal damage. Can also reduce the targets' Defense. Damage: High",
  "shortHelp": "Melee(Cone), High DMG(Lethal), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "stats": {
    "range": 7,
    "recharge": 12,
    "endurance": 13,
    "castTime": 1.5,
    "arc": 90,
    "maxTargets": 10
  },
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Lethal",
    "scale": 2.1,
    "table": "Melee_Damage"
  },
  "effects": {}
};
