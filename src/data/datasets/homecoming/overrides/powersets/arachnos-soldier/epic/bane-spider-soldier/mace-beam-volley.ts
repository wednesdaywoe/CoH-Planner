/**
 * Mace Beam Volley — OVERRIDES LAYER
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
  "description": "The Nullifier Mace can fire a volley of energy at all foes in front of the user. The Mace Beam Volley is a moderate damage area of effect cone attack with a chance to knock foes off their feet. Damage: Moderate",
  "shortHelp": "Ranged(Cone), Moderate DMG(Smash/Energy), Foe Knockback",
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "targetType": "Foe (Alive)"
};
