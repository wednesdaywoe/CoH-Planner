/**
 * Pummel — OVERRIDES LAYER
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
  "description": "You can smash your opponents in close combat with the butt of your sub-machine gun to deal minor smashing damage. Pummel has a high chance to disorient your foe for a brief time. NOTE: This power will deal critical damage if used after a successful Placate or while the user is hidden with the Bane Spider Cloaking Device. Damage: Minor",
  "shortHelp": "Melee, Minor DMG(Smash)",
  "allowedSetCategories": [
    "Melee Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Stuns",
    "Universal Damage Sets"
  ],
  "targetType": "Foe (Alive)",
  "damage": {
    "type": "Smashing",
    "scale": 1,
    "table": "Melee_Damage"
  }
};
