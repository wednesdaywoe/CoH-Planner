/**
 * Wolf Spider Armor — OVERRIDES LAYER
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
  "stats": {},
  "effects": {
    "durations": {
      "confuse": 10.25,
      "fear": 10.25,
      "hold": 10.25,
      "immobilize": 10.25,
      "resistance": 10.25,
      "sleep": 10.25,
      "stun": 10.25
    }
  }
};
