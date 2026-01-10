/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Dark Mastery
 * Archetype: Controller
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\controller_dark_mastery
 */

const EPIC_CONTROLLER_DARK_MASTERY = {
  "id": "controller_dark_mastery",
  "name": "Dark Mastery",
  "displayName": "Dark Mastery",
  "archetype": "controller",
  "description": "You have Mastery over Darkness to control and blast your foes.",
  "icon": "sentinel_dark_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Murky Cloud",
      "fullName": "Epic.Controller_Dark_Mastery.Murky_Cloud",
      "rank": 1,
      "available": 34,
      "description": "You create a Murky Cloud enshrouding you. This cloud can absorb all forms of energy, making you more resistant to Fire, Cold, Energy, and Negative Energy attacks.",
      "shortHelp": "Toggle: Self +Res(Fire, Cold, Energy, Negative)",
      "icon": "dark_mastery_murkycloud.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Controller",
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
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "resistance": {
          "fire": {
            "scale": 2.75,
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
          "smashing": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
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
      "name": "Dark Blast",
      "fullName": "Epic.Controller_Dark_Mastery.Dark_Blast",
      "rank": 2,
      "available": 34,
      "description": "A long range blast of dark energy. Deals moderate Negative Energy damage and reduces the target's Accuracy.",
      "shortHelp": "Ranged, DMG(Negative), Foe -ACC",
      "icon": "dark_mastery_darkblast.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Controller",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Ranged Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.0,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Negative",
          "scale": 1.42,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Umbral Torrent",
      "fullName": "Epic.Controller_Dark_Mastery.Torrent",
      "rank": 3,
      "available": 37,
      "description": "You summon a wave of mire that sweeps away foes within its arc. The attack deals minimal Negative Energy damage, but sends foes flying and reduces their chance to hit. You must be level 38 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Smashing), Foe -To Hit, Knockback",
      "icon": "dark_mastery_umbraltorrent.png",
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
        "Accurate To-Hit Debuff",
        "Knockback",
        "Ranged AoE Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 30.0,
        "endurance": 17.94,
        "activationTime": 1.03,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.5236,
        "damage": {
          "type": "Negative",
          "scale": 0.8471,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Midnight Grasp",
      "fullName": "Epic.Controller_Dark_Mastery.Gather_Shadows",
      "rank": 4,
      "available": 40,
      "description": "Mastery over the forces of the Netherworld allows you to create dark tentacles that can Immobilize a foe, reduce their chance to hit and continuously drain their life force. You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Melee, Superior DMG(Negative), Foe Immobilize, -To Hit",
      "icon": "dark_mastery_midnightgrasp.png",
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
        "Accurate To-Hit Debuff",
        "Immobilize",
        "Melee Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 30.0,
        "endurance": 17.94,
        "activationTime": 2.07,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Negative",
          "scale": 0.11,
          "table": "Melee_Damage"
        },
        "protection": {
          "immobilize": 3.0
        }
      }
    },
    {
      "name": "Soul Consumption",
      "fullName": "Epic.Controller_Dark_Mastery.Soul_Consumption",
      "rank": 5,
      "available": 43,
      "description": "You consume life and soul from all enemies nearby, thus siginficantly increasing your maximum hitpoints and endurance. The more foes affected, the stronger the effect. You must be level 44 and have two other Dark Mastery Powers before selecting this power.",
      "shortHelp": "PBAoE Self +Max HP, +Max End, Foe: -Max HP, -Max End",
      "icon": "dark_mastery_soulconsumption.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge",
        "Heal",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate Healing",
        "Endurance Modification",
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 15.0,
        "recharge": 1000.0,
        "endurance": 3.25,
        "activationTime": 1.17,
        "effectArea": "AoE",
        "radius": 15.0,
        "regeneration": {
          "scale": -0.6,
          "table": "Melee_Ones"
        },
        "damage": {
          "type": "Heal",
          "scale": 0.4,
          "table": "Melee_HealSelf"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['controller_dark_mastery'] = EPIC_CONTROLLER_DARK_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
