/**
 * Starless Step — OVERRIDES LAYER
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
  "description": "You can Teleport moderate distances extremely quickly. These quick teleports surprise foes, giving your next attack a small ToHit advantage. This power can be used up to 3 times in a row before it starts recharging. Note that Starless is unaffected by Range changes.  Notes: Starless Step is unaffected by Range changes.  Recharge: Fast.",
  "targetType": "Location (Teleport)",
  "effects": {}
};
