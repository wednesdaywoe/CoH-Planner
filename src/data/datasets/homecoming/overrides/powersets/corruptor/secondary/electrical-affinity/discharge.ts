/**
 * Galvanic Sentinel — OVERRIDES LAYER
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
  "description": "Summons a Galvanic Sentinel to your aid. The Galvanic Sentinel shocks and weakens your foes, draining some endurance and reducing their regeneration, recovery, and damage output. The Galvanic Sentinel can be buffed and healed, and may be targeted with your Circuit powers.Recharge: Slow.",
  "allowedSetCategories": [
    "Endurance Modification"
  ],
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_GalvanicSentinel",
      "duration": 120,
      "copyBoosts": true
    }
  }
};
