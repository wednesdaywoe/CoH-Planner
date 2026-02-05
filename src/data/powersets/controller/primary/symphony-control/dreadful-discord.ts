/**
 * Dreadful Discord
 * Ranged (Cone), DMG(Psionic), Foe Fear
 *
 * Source: controller_control/symphony_control/dreadful_discord.json
 */

import type { Power } from '@/types';

export const DreadfulDiscord: Power = {
  "name": "Dreadful Discord",
  "internalName": "Dreadful_Discord",
  "available": 7,
  "description": "Dreadful Discord is a terrifying song that will leave your audience shaking in fear.",
  "shortHelp": "Ranged (Cone), DMG(Psionic), Foe Fear",
  "icon": "symphonycontrol_fearaoe.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 70,
    "radius": 70,
    "arc": 0.7854,
    "recharge": 40,
    "endurance": 8.528,
    "castTime": 2.17,
    "maxTargets": 16
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Fear",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Fear",
    "Ranged AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": {
    "type": "Psionic",
    "scale": 0.5,
    "table": "Ranged_Damage"
  },
  "effects": {
    "fear": {
      "mag": 3,
      "scale": 15,
      "table": "Ranged_Fear"
    }
  }
};
