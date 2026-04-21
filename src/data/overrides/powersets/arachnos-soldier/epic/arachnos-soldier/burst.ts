/**
 * Burst — OVERRIDES LAYER
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
  "description": "Quickly fires a Burst of rounds at a single target at long range. Damage is average, but the fire rate is fast. Can also reduce the target's defense. Damage: Moderate(DoT)",
  "shortHelp": "Ranged, Moderate DMG(Lethal), Foe -DEF",
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Defense Debuff",
    "Ranged Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Lethal",
    "scale": 0.5467,
    "table": "Ranged_Damage",
    "duration": 0.7,
    "tickRate": 0.3
  },
  "effects": {}
};
