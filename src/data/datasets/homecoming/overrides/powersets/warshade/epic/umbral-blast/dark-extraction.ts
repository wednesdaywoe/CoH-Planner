/**
 * Dark Extraction — OVERRIDES LAYER
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
  "description": "Defeated foes are ripe for the picking. A Warshade can extract the essence from a defeated villain and infuse it with Nictus energy. The extracted energy is an echo of the target's life force, and although it is not sentient, the infused Nictus energy does give it a rudimentary spark of life. Eventually, the extracted entity will fade away into nothingness.  Recharge: Long.",
  "targetType": "Foe (Dead)"
};
