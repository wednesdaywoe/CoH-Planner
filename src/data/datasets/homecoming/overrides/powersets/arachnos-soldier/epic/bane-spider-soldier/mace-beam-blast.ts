/**
 * Mace Beam Blast — OVERRIDES LAYER
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
  "description": "The Nullifier Mace is capable of firing a tremendous bolt of force from the end of it. The Mace Beam Blast is a light damage area of effect attack. Foes struck by the blast may be knocked back. Damage: Light",
  "shortHelp": "Ranged(Targeted AoE), Light DMG(Smash/Energy), Foe Knockback",
  "allowedSetCategories": [
    "Knockback",
    "Ranged AoE Damage",
    "Soldiers of Arachnos Archetype Sets",
    "Universal Damage Sets"
  ],
  "targetType": "Foe (Alive)"
};
