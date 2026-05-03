/**
 * Proton Scatter — OVERRIDES LAYER
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
  "description": "Proton Scatter sends bolts of Kheldian energy to multiple targets at once within a cone area in front of the caster. Proton Scatter deals moderate Energy damage to each affected target and reduces their Defense.  Damage: Light. Recharge: Slow.",
  "targetType": "Foe (Alive)"
};
