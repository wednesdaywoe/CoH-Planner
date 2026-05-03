/**
 * Placate — OVERRIDES LAYER
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
  "description": "Allows you to trick a foe to no longer attack you. A successful Placate will also Hide you. The Hide is very brief, and offers no Defense bonus, but it will allow you to deliver a Critical Hit. However, if you attack a Placated Foe, he will be able to attack you back. Recharge: Long",
  "shortHelp": "Melee, Foe Placate, Self Hide",
  "effectArea": "SingleTarget",
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Taunt"
  ],
  "stats": {
    "range": 7,
    "recharge": 60,
    "endurance": 10.4,
    "castTime": 1
  },
  "targetType": "Foe (Alive)"
};
