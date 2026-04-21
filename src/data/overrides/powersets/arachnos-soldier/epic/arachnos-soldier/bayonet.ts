/**
 * Bayonet — OVERRIDES LAYER
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
  "description": "Your weapon includes a bayonet attachment which you can use to stab at your enemies for lethal damage as well as causing them to bleed losing health over time. NOTE: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Bane Spider Cloaking Device. Damage: Moderate",
  "shortHelp": "Melee, Moderate DMG(Lethal), DoT(Lethal)",
  "allowedSetCategories": [
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "targetType": "Foe (Alive)",
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.44,
      "table": "Melee_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.12,
      "table": "Melee_Damage",
      "duration": 5.1,
      "tickRate": 1
    }
  ]
};
