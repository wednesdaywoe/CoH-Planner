/**
 * DNA Siphon — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()`. These are the fields where the previously-committed
 * composed file differed from the current generated extraction. Review
 * each to confirm it's a deliberate manual correction (retain) vs. the
 * converter producing the wrong value (candidate for a converter fix).
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.2,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.1,
      "table": "Melee_Damage",
      "duration": 2,
      "tickRate": 1
    },
    {
      "type": "Heal",
      "scale": 1.25,
      "table": "Melee_HealSelf"
    }
  ],
  "effects": {}
};
