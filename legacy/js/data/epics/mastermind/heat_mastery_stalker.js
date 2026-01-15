/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Fire Mastery
 * Archetype: Mastermind
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\heat_mastery_stalker
 */

const EPIC_HEAT_MASTERY_STALKER = {
  "id": "heat_mastery_stalker",
  "name": "Fire Mastery",
  "displayName": "Fire Mastery",
  "archetype": "mastermind",
  "description": "You have Mastery over Fire and Flame to control your foes and to add some much needed armor and defense.",
  "icon": "heat_mastery_stalker_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Bonfire",
      "fullName": "Epic.Heat_Mastery_Stalker.Bonfire",
      "rank": 1,
      "available": 34,
      "description": "You can create a Bonfire that knocks back and burns any foes who try to pass through it. Cannot do critical hits.",
      "shortHelp": "Ranged (Location AoE), DMG(Fire), Foe Knockback",
      "icon": "heatmastery_bonfire.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Mastermind",
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
      "name": "Fire Blast",
      "fullName": "Epic.Heat_Mastery_Stalker.Fire_Blast",
      "rank": 2,
      "available": 34,
      "description": "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage.",
      "shortHelp": "Ranged, DMG(Fire)",
      "icon": "fireblast_fireblast.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Mastermind",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 1.889,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Fire Ball",
      "fullName": "Epic.Heat_Mastery_Stalker.Fire_Ball",
      "rank": 3,
      "available": 37,
      "description": "Hurls an exploding Fireball that consumes a targeted foe, and all nearby enemies. Anyone in that explosion is burned and set ablaze. You must be level 38 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Fire/Smash)",
      "icon": "fireblast_fireball.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.0,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Fire",
          "scale": 0.1,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Char",
      "fullName": "Epic.Heat_Mastery_Stalker.Melt_Armor",
      "rank": 4,
      "available": 40,
      "description": "Incapacitates a distant foe by Charring him with smoldering soot and cinders. The target is left helpless, choking on the soot. The target will take some fire damage from char, but the damage is very trivial. You must be level 41 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DoT(Fire), Foe Hold",
      "icon": "pyremastery_soot.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Rise of the Phoenix",
      "fullName": "Epic.Heat_Mastery_Stalker.Rise_of_the_Phoenix",
      "rank": 5,
      "available": 43,
      "description": "If you are defeated, you can rise from the ashes. The fiery resurrection blasts nearby foes with an explosion and knocks them down. You will revive with about half of your Hit Points and Endurance. Rise of the Phoenix will actually leave you invulnerable for a brief time and protected from XP Debt for 20 seconds. You must be level 44 and have two other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Self Rez, Special",
      "icon": "heatmastery_riseofthephoenix.png",
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
    EPIC_POOLS['heat_mastery_stalker'] = EPIC_HEAT_MASTERY_STALKER;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
