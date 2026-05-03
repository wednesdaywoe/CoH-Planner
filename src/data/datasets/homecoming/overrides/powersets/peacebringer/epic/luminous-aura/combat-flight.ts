/**
 * Combat Flight — OVERRIDES LAYER
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
  "description": "For hovering and aerial combat. This power is much slower than Energy Flight, but provides some Defense, offers good air control, costs little Endurance, and has none of the penalties associated with Energy Flight. Switch to this mode when fighting other flying foes.  Combat Flight can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.",
  "stats": {
    "castTime": 0.5
  },
  "effects": {}
};
