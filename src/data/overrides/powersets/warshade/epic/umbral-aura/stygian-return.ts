/**
 * Stygian Return — OVERRIDES LAYER
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
  "description": "Should you fall in battle, your Stygian Return can drain the life force of all foes around you to bring yourself back from the brink of death. The more foes nearby, the more Ht Points and Endurance are restored to you. Stygian Return will actually leave you invulnerable for a brief time, and protected from XP Debt for 90 seconds. There must be at least one foe nearby to fuel the Transfer and revive yourself.  Damage: Light. Recharge: Very Long.",
  "effects": {}
};
