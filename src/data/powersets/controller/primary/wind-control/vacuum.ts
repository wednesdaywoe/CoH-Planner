/**
 * Vacuum
 * Ranged (Targeted AoE), Hold (Foe), Moderate DoT (Lethal), -Movement(Foe), -Rech(Foe), -ToHit(Foe), Special(Pet), Pressure Consumer (Self)
 *
 * Source: controller_control/wind_control/vacuum.json
 */

import type { Power } from '@/types';

export const Vacuum: Power = {
  "name": "Vacuum",
  "internalName": "Vacuum",
  "available": 21,
  "description": "You release all Pressure to create a vacuum space around a target. With a foe target, the foe is held. Nearby foes may also be held. Foes in the field suffer lethal damage and persistent movement, attack speed, and chance to hit debuffs that grow stronger the longer they are in the field. If centered on an ally, the main target is not held, but foes are affected as normal. For each Pressure released, the Vacuum field persists for 2 seconds more. At your highest Pressure level, the main target will take extra damage and the field will persist long enough to reapply its hold. If Vacuum is targeted on your Vortex, you will gain the Clear Skies boon, but at the expense of using the power to harm foes. The boon lasts 5 seconds more for each Pressure released. Both Vacuum and Vortex are required to unlock Clear Skies.Damage: Minor.Recharge: Long.",
  "shortHelp": "Ranged (Targeted AoE), Hold (Foe), Moderate DoT (Lethal), -Movement(Foe), -Rech(Foe), -ToHit(Foe), Special(Pet), Pressure Consumer (Self)",
  "icon": "windcontrol_vacuum.png",
  "powerType": "Click",
  "effectArea": "SingleTarget",
  "stats": {
    "accuracy": 1,
    "range": 80,
    "recharge": 240,
    "endurance": 15.6,
    "castTime": 2.03
  },
  "allowedEnhancements": [
    "Hold",
    "Slow",
    "EnduranceReduction",
    "Range",
    "Recharge",
    "ToHit Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate To-Hit Debuff",
    "Controller Archetype Sets",
    "Holds",
    "Ranged AoE Damage",
    "Slow Movement",
    "To Hit Debuff",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 0.15,
      "table": "Ranged_Damage"
    },
    {
      "type": "Lethal",
      "scale": 0.15,
      "table": "Ranged_InherentDamage"
    },
    {
      "type": "Lethal",
      "scale": 0.161,
      "table": "Ranged_PvPDamage"
    },
    {
      "type": "Lethal",
      "scale": 0.0179,
      "table": "Ranged_PvPDamage"
    }
  ],
  "effects": {
    "summon": {
      "isPseudoPet": false,
      "entity": "Pets_WindControl_Vacuum_Controller",
      "duration": 8
    },
    "hold": {
      "mag": 4,
      "scale": 4,
      "table": "Ranged_Ones"
    }
  },
  "requires": "char>accesslevel >= 0"
};
