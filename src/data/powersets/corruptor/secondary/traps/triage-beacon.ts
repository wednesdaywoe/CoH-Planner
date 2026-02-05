/**
 * Triage Beacon
 * Place Beacon: PBAoE +Regen
 *
 * Source: corruptor_buff/traps/triage_beacon.json
 */

import type { Power } from '@/types';

export const TriageBeacon: Power = {
  "name": "Triage Beacon",
  "internalName": "Triage_Beacon",
  "available": 3,
  "description": "You can plant a Triage Beacon into the ground. The Beacon is immobile, but it emits a powerful healing aura. The Regeneration Rate of you, or your allies, will be greatly increased as long as you are near the Triage Beacon. The Beacon is invulnerable.",
  "shortHelp": "Place Beacon: PBAoE +Regen",
  "icon": "traps_droppedaoebuffregen.png",
  "powerType": "Click",
  "targetType": "Self",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "recharge": 200,
    "endurance": 13,
    "castTime": 2.77
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Healing"
  ],
  "allowedSetCategories": [
    "Healing"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Traps_Triage_Beacon",
      "duration": 90
    }
  }
};
