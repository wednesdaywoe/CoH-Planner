/**
 * Bright Nova — OVERRIDES LAYER
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
  "description": "Kheldians are masters of energy and matter. A Peacebringer can transform into a flying energy beast known as a Bright Nova. When you choose this power, you will have access to 4 very powerful ranged attacks that can only be used while in this form. You will not be able to use any other powers while in Bright Nova form. Bright Nova can fly, has increased Accuracy, and improved Endurance Recovery, but has no defense.  Recharge: Very Fast.",
  "stats": {},
  "effects": {}
};
