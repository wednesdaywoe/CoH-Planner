/**
 * Bright Nova Blast — OVERRIDES LAYER
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
  "description": "A much more powerful, yet slower version of Bright Nova Bolt. Bright Nova Blast sends a focused blast of Kheldian energy at a foe that can knock him back and reduce his defense. This power is only available while in Bright Nova Form.  Damage: Light. Recharge: Fast.",
  "targetType": "Foe (Alive)",
  "requires": "Bright Nova"
};
