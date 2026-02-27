/**
 * Force Field Generator
 * Place Drone: PBAoE, Team +DEF, +Res(Hold, Immobilize, Disorient)
 *
 * Source: corruptor_buff/traps/force_field_generator.json
 */

import type { Power } from '@/types';

export const ForceFieldGenerator: Power = {
  "name": "Force Field Generator",
  "internalName": "Force_Field_Generator",
  "available": 15,
  "description": "You can build a Force Field Generator Drone. The Drone will generate a Dispersion Bubble that gives all nearby allies increased Defense against all attacks including Psionic. The Dispersion Bubble also protects allies from Immobilization, Disorient, and Hold effects. The Done will follow you and can be buffed and healed or even destroyed like any friendly entity. However, the Drone is not a Henchman and cannot be given commands. You can only ever have one Force Field Generator.",
  "shortHelp": "Place Drone: PBAoE, Team +DEF, +Res(Hold, Immobilize, Disorient)",
  "icon": "traps_droppedaoebuffdefense.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 20,
    "recharge": 15,
    "endurance": 13,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Defense"
  ],
  "allowedSetCategories": [
    "Defense Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_Traps_FF_Generator",
      "duration": 240
    }
  }
};
