/**
 * Light Form — OVERRIDES LAYER
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
  "description": "When you activate Light Form, you become pure Kheldian energy and are extremely resistant to most damage. You are also partially protected from some Disorient, Immobilization, Hold, Sleep, Knockback and Repel effects. Endurance recovery is also increased. Light Form costs little Endurance to activate, but when it wears off you are left exhausted, and drained of Hit Points and Endurance.  Recharge: Very Long.",
  "effects": {
    "durations": {
      "hold": 90,
      "immobilize": 90,
      "knockback": 90,
      "knockup": 90,
      "protection": 90,
      "recoveryBuff": 90,
      "repel": 90,
      "resistance": 90,
      "sleep": 90,
      "stun": 90
    }
  }
};
