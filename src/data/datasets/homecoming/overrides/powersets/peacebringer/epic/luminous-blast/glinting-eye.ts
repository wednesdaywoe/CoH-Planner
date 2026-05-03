/**
 * Glinting Eye — OVERRIDES LAYER
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
  "description": "You can emit a beam of Kheldian energy from your eyes, dealing moderate Energy damage and reducing a target's Defense. This power can be used while in Nova form at an increased range and with higher damage but slower recharge.  Damage: Moderate. Recharge: Fast.",
  "targetType": "Foe (Alive)"
};
