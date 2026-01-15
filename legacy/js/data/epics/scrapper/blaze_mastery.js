/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Fire Mastery
 * Archetype: Scrapper
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\blaze_mastery
 */

const EPIC_BLAZE_MASTERY = {
  "id": "blaze_mastery",
  "name": "Fire Mastery",
  "displayName": "Fire Mastery",
  "archetype": "scrapper",
  "description": "You have Mastery over Fire and Flame to blast your foes and control your foes.",
  "icon": "blaze_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Ring of Fire",
      "fullName": "Epic.Blaze_Mastery.Ring_of_Fire",
      "rank": 1,
      "available": 34,
      "description": "Immobilizes your target in a Ring of Fire. Deals some damage over time. Useful for keeping villains at bay.",
      "shortHelp": "Ranged, DoT(Fire), Foe Immobilize",
      "icon": "pyremastery_ringoffire.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker)",
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
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 8.0,
        "endurance": 8.405,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Fire",
          "scale": 0.3078,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "immobilize": 3.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Char",
      "fullName": "Epic.Blaze_Mastery.Char",
      "rank": 2,
      "available": 34,
      "description": "Incapacitates a distant foe by Charring him with smoldering soot and cinders. The target is left helpless, choking on the soot. The target will take some fire damage from char, but the damage is very trivial.",
      "shortHelp": "Ranged, DoT(Fire), Foe Hold",
      "icon": "pyremastery_soot.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker)",
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
      "name": "Fire Blast",
      "fullName": "Epic.Blaze_Mastery.Fire_Blast",
      "rank": 3,
      "available": 37,
      "description": "Sends a Blast of Fire at a targeted foe and sets the target on fire for a short period of time. Slower recharge rate than Flares, but more damage. You must be level 38 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Fire)",
      "icon": "fireblast_fireblast.png",
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
          "scale": 1.0,
          "table": "Melee_InherentDamage"
        }
      }
    },
    {
      "name": "Melt Armor",
      "fullName": "Epic.Blaze_Mastery.Melt_Armor",
      "rank": 4,
      "available": 40,
      "description": "The searing heat from this power is enough to melt the armor and defenses of all targets in the affected area. Melt Armor significantly weakens the Defense and Damage Resistance of the affected targets. You must be level 41 and have one other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), Foe -Res, -DEF",
      "icon": "pyremastery_meltarmor.png",
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
      "name": "Fire Ball",
      "fullName": "Epic.Blaze_Mastery.Fire_Ball",
      "rank": 5,
      "available": 43,
      "description": "Hurls an exploding Fireball that consumes a targeted foe, and all nearby enemies. Anyone in that explosion is burned and set ablaze. You must be level 44 and have two other Fire Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Fire/Smash)",
      "icon": "fireblast_fireball.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
          "scale": 0.5712,
          "table": "Melee_PvPDamage"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['blaze_mastery'] = EPIC_BLAZE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
