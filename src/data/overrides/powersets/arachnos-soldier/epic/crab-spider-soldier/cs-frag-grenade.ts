/**
 * Frag Grenade — OVERRIDES LAYER
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
  "internalName": "Cs_Frag_Grenade",
  "description": "Launches a Frag Grenade at long range from your Crab Spider backpack. The explosion from this grenade affects all within the blast and can knock them back. Damage: Moderate",
  "shortHelp": "Ranged(Targeted AoE), Moderate DMG(Lethal/Fire), Foe Knockback",
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.5,
      "table": "Ranged_Damage"
    },
    {
      "type": "Fire",
      "scale": 0.67,
      "table": "Ranged_Damage"
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.75,
      "table": "Ranged_Knockback"
    }
  }
};
