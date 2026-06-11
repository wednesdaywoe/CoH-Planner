/**
 * Shatter — OVERRIDES LAYER
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
  "description": "You attempt to Shatter the bones of your opponent by striking them with all your might. This attack will deal extreme damage and can knock foes back a great ways. NOTE: This power will deal critical damage if used after a successful Placate or while hidden. Damage: Extreme",
  "shortHelp": "Melee, Extreme DMG(Smash), Minor DoT(Toxic), Foe High Knockback",
  "allowedSetCategories": [
    "Knockback",
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "targetType": "Foe (Alive)"
};
