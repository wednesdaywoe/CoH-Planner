/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Fire Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_fire_mastery
 */

const EPIC_SENTINEL_FIRE_MASTERY = {
  "id": "sentinel_fire_mastery",
  "name": "Fire Mastery",
  "displayName": "Fire Mastery",
  "archetype": "sentinel",
  "description": "You have Mastery over Fire and Flame to blast your foes and control your foes.",
  "icon": "sentinel_fire_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Fire Cages",
      "fullName": "Epic.Sentinel_Fire_Mastery.Fire_Cages",
      "rank": 1,
      "available": 34,
      "description": "Immobilizes a group of foes in Fire Cages, dealing Fire damage over time. More resilient foes may require multiple Fire Cages to Immobilize. Fire Cages is slower and less damaging than Ring of Fire, but can capture multiple targets.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Fire), Foe Immobilize",
      "icon": "firetrap_firecage.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Immobilize",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 16.0,
        "endurance": 10.751,
        "activationTime": 1.03,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Fire",
          "scale": 0.1067,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 5.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Cremate",
      "fullName": "Epic.Sentinel_Fire_Mastery.Cremate",
      "rank": 2,
      "available": 34,
      "description": "A slow but devastating attack. Cremate clobbers your foes with a massive 2 handed fiery smash that leaves your foe set on fire.",
      "shortHelp": "Melee, DMG(Smash/Fire)",
      "icon": "firetrap_punch.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 16.0,
        "endurance": 10.66,
        "activationTime": 1.5,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 2.09,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Char",
      "fullName": "Epic.Sentinel_Fire_Mastery.Char",
      "rank": 3,
      "available": 37,
      "description": "Incapacitates a distant foe by Charring him with smoldering soot and cinders. The target is left helpless, choking on the soot. The target will take some fire damage from char, but the damage is very trivial. You must be level 38 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DoT(Fire), Foe Hold",
      "icon": "firetrap_hold.png",
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
      "name": "Fire Sword Circle",
      "fullName": "Epic.Sentinel_Fire_Mastery.Fire_Sword_Circle",
      "rank": 4,
      "available": 40,
      "description": "Mastery of your Fire Sword has enabled you to make an attack on every foe within melee distance. This will slash and burn your enemies, dealing moderate damage and setting them ablaze. You must be level 41 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE Melee, DMG(Fire/Lethal)",
      "icon": "firetrap_pbaoe.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 2.67,
        "effectArea": "AoE",
        "radius": 10.0,
        "damage": {
          "type": "Fire",
          "scale": 1.5476,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Warmth",
      "fullName": "Epic.Sentinel_Fire_Mastery.Warmth",
      "rank": 5,
      "available": 43,
      "description": "You can use your Warmth to heal some of your wounds, and the wounds of your group. This power has a small radius, so your allies need to be near you if they wish to be affected. You must be level 44 and have two other Fire Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE, Team +Heal",
      "icon": "firetrap_heal.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 32.0,
        "endurance": 16.25,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 25.0,
        "damage": {
          "type": "Heal",
          "scale": 1.0,
          "table": "Ranged_Heal"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['sentinel_fire_mastery'] = EPIC_SENTINEL_FIRE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
