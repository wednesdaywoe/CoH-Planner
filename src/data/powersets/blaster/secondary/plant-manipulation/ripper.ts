/**
 * Ripper
 * Melee (Cone), DMG(Lethal), DoT(Toxic), Foe Knockdown, -DEF
 *
 * Source: blaster_support/plant_manipulation/ripper.json
 */

import type { Power } from '@/types';

export const Ripper: Power = {
  "name": "Ripper",
  "internalName": "Ripper",
  "available": 23,
  "description": "You can unleash a spectacular slashing maneuver that attacks all foes in a wide arc directly in front of you. Ripper deals massive damage and poisons multiple targets. It can even knock foes down. Thorn poison deals additional Toxic damage and can reduce your foes Defense.Damage: Superior.Recharge: Slow.",
  "shortHelp": "Melee (Cone), DMG(Lethal), DoT(Toxic), Foe Knockdown, -DEF",
  "icon": "plantmanipulation_ripper.png",
  "powerType": "Click",
  "effectArea": "Cone",
  "stats": {
    "accuracy": 1,
    "range": 7,
    "radius": 7,
    "arc": 1.5708,
    "recharge": 13,
    "endurance": 12.688,
    "castTime": 2.33,
    "maxTargets": 5
  },
  "allowedEnhancements": [
    "EnduranceReduction",
    "Recharge",
    "Knockback",
    "Defense Debuff",
    "Damage",
    "Accuracy"
  ],
  "allowedSetCategories": [
    "Accurate Defense Debuff",
    "Blaster Archetype Sets",
    "Defense Debuff",
    "Knockback",
    "Melee AoE Damage",
    "Universal Damage Sets"
  ],
  "maxSlots": 6,
  "damage": [
    {
      "type": "Lethal",
      "scale": 1.95,
      "table": "Melee_Damage"
    },
    {
      "type": "Toxic",
      "scale": 0.2,
      "table": "Melee_Damage",
      "duration": 4.1,
      "tickRate": 1
    }
  ],
  "effects": {
    "knockback": {
      "scale": 0.67,
      "table": "Melee_Ones"
    },
    "defenseDebuff": {
      "scale": 3,
      "table": "Melee_Debuff_Def"
    },
    "damageBuff": {
      "scale": 0,
      "table": "Ranged_Ones"
    }
  }
};
