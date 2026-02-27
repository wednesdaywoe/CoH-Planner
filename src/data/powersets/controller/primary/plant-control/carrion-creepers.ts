/**
 * Carrion Creepers
 * Summon Creepers, Ranged (Location AoE), Target -Speed, -Fly, -Jump,
 *
 * Source: controller_control/plant_control/carrion_creepers.json
 */

import type { Power } from '@/types';

export const CarrionCreepers: Power = {
  "name": "Carrion Creepers",
  "internalName": "Carrion_Creepers",
  "available": 21,
  "description": "You can create a Creeper patch at a targeted location. The patch will snag foes, slowing their movement, and preventing them from jumping or flying. Additionally, a Creeper Vine will burst from under each live and defeated foe in the area and start attacking your enemies. Creeper Vines do minimal damage, but they can knock down your enemies and its poisonous thorns can slow your foes. Any foes that are defeated in the Creeper patch will also produce a growth of Entangle Roots that will Immobilize any enemies near the defeated foe.",
  "shortHelp": "Summon Creepers, Ranged (Location AoE), Target -Speed, -Fly, -Jump,",
  "icon": "plantcontrol_carrioncreeper.png",
  "powerType": "Click",
  "targetType": "Location",
  "effectArea": "Location",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 360,
    "endurance": 26,
    "castTime": 1.17
  },
  "allowedEnhancements": [
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "Knockback",
    "Immobilize",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Controller Archetype Sets",
    "Immobilize",
    "Knockback",
    "Ranged AoE Damage",
    "Slow Movement",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "effects": {
    "summon": {
      "isPseudoPet": true,
      "displayName": "Carrion Creeper",
      "powers": [
        "Pets.ResistAll.ResistAll",
        "Villain_Pets.Creeper_Patch.Carrion_Creepers",
        "Villain_Pets.Creeper_Patch.Vines",
        "Villain_Pets.Creeper_Patch.Bramble",
        "Villain_Pets.Creeper_Patch.FX"
      ],
      "duration": 120
    }
  }
};
