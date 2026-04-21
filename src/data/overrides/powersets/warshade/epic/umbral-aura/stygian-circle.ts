/**
 * Stygian Circle — OVERRIDES LAYER
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
  "description": "You can tap into your Nictus power to drain the remaining essence of all nearby defeated foes to heal yourself, and recover Endurance. The more defeated foes affected, the more you will be healed. Additionally, the more powerful the defeated foes you drain, the more health you will recover.  Recharge: Slow."
};
