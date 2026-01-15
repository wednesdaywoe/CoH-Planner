/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Fire Mastery
 * Archetype: Blaster
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\flame_mastery
 */

const EPIC_FLAME_MASTERY = {
  "id": "flame_mastery",
  "name": "Fire Mastery",
  "displayName": "Fire Mastery",
  "archetype": "blaster",
  "description": "You have Mastery over Fire and Flame to control your foes and to add some much needed armor and defense.",
  "icon": "flame_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Bonfire",
      "fullName": "Epic.Flame_Mastery.Bonfire",
      "rank": 1,
      "available": 34,
      "description": "You can create a Bonfire that knocks back and burns any foes who try to pass through it.",
      "shortHelp": "Ranged (Location AoE), DMG(Fire), Foe Knockback",
      "icon": "flamemastery_bonfire.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Blaster",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Knockback",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 70.0,
        "recharge": 120.0,
        "endurance": 16.25,
        "activationTime": 3.07,
        "effectArea": "Location"
      }
    },
    {
      "name": "Char",
      "fullName": "Epic.Flame_Mastery.Char",
      "rank": 2,
      "available": 34,
      "description": "Incapacitates a distant foe by Charring him with smoldering soot and cinders. The target is left helpless, choking on the soot.",
      "shortHelp": "Ranged, DoT(Fire), Foe Hold",
      "icon": "flamemastery_soot.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Blaster",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Hold",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Holds",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.07,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Fire",
          "scale": 0.4218,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Fire Shield",
      "fullName": "Epic.Flame_Mastery.Fire_Shield",
      "rank": 3,
      "available": 37,
      "description": "While this power is active, you get a good resistance to Lethal, Smashing and Fire damage. Fire Shield also provides minimal resistance to Cold damage. You must be level 38 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Fire, Lethal, Smash, Cold)",
      "icon": "flamingshield_flamingshield.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 8.0,
        "endurance": 0.1625,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "psionic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Melt Armor",
      "fullName": "Epic.Flame_Mastery.Melt_Armor",
      "rank": 4,
      "available": 40,
      "description": "The searing heat from this power is enough to melt the armor and defenses of all targets in the affected area. Melt Armor significantly weakens the Defense and Damage Resistance of the affected targets. You must be level 41 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), Foe -Res, -DEF",
      "icon": "flamemastery_meltarmor.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate Defense Debuff",
        "Defense Debuff"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 70.0,
        "recharge": 200.0,
        "endurance": 22.75,
        "activationTime": 1.5,
        "effectArea": "AoE",
        "radius": 10.0,
        "defense": {
          "all": {
            "scale": 2.0,
            "table": "Ranged_Debuff_Def"
          }
        },
        "resistance": {
          "smashing": {
            "scale": -3.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "lethal": {
            "scale": -3.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "fire": {
            "scale": -3.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "cold": {
            "scale": -3.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "energy": {
            "scale": -3.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "negative": {
            "scale": -3.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "psionic": {
            "scale": -3.0,
            "table": "Ranged_Debuff_Res_Dmg"
          },
          "toxic": {
            "scale": -3.0,
            "table": "Ranged_Debuff_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Rise of the Phoenix",
      "fullName": "Epic.Flame_Mastery.Rise_of_the_Phoenix",
      "rank": 5,
      "available": 43,
      "description": "If you are defeated, you can rise from the ashes. The fiery resurrection blasts nearby foes with an explosion and knocks them down. You will revive with about half of your Hit Points and Endurance. Rise of the Phoenix will actually leave you invulnerable for a brief time and protected from XP Debt for 20 seconds. You must be level 44 and have two other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Self Rez, Special",
      "icon": "flamingshield_riseofthephoenix.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Recharge",
        "Heal",
        "Damage"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing",
        "Melee AoE Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 300.0,
        "activationTime": 1.5,
        "effectArea": "Location",
        "damage": {
          "type": "Heal",
          "scale": 5.0,
          "table": "Melee_HealSelf"
        },
        "protection": {
          "immobilize": 50.0
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['flame_mastery'] = EPIC_FLAME_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
