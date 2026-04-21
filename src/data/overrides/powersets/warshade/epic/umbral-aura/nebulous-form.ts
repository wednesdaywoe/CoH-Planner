/**
 * Nebulous Form — OVERRIDES LAYER
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
  "description": "You can Phase Shift to become out of sync with normal space. Although you do not become completely Invisible, you are translucent and hard to see. You are intangible, and cannot affect or be affected by those in normal space. Even gravity has a weak hold on you. You can jump great distances while in Nebulous Form. However, after 30 seconds the phase out effect will wear off. 30 seconds later, if this power is still active the user will become phased out once again. Cannot be used with Rest.  Nebulous Form can be active at the same time as other jumping toggles, but only the strongest jump buff will apply.  Recharge: Slow.",
  "stats": {},
  "effects": {
    "stealth": {
      "translucency": {
        "scale": 0.1,
        "table": "Melee_Ones"
      },
      "stealthPvE": {
        "scale": 20,
        "table": "Melee_Ones"
      },
      "stealthPvP": {
        "scale": 222,
        "table": "Melee_Ones"
      }
    },
    "durations": {
      "movement": 0.75,
      "stealth": 0.75,
      "threatDebuff": 0.75
    }
  }
};
