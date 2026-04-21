/**
 * Luminous Detonation — OVERRIDES LAYER
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
  "description": "You hurl a large blast of Kheldian energy that violently explodes on impact, damaging all foes near the target, and reducing their Defense. Some affected targets may get knocked back.  Damage: Light. Recharge: Slow.",
  "targetType": "Foe (Alive)"
};
