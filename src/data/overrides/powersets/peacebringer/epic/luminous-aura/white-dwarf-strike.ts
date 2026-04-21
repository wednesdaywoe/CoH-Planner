/**
 * White Dwarf Strike — OVERRIDES LAYER
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
  "description": "The White Dwarf Strike is a moderate melee attack that releases Kheldian light on impact, which can Knock Down foes, and reduce a target's Defense. This power is only available while in White Dwarf Form.  Damage: Light. Recharge: Very Fast.",
  "targetType": "Foe (Alive)",
  "requires": "White Dwarf",
  "effects": {}
};
