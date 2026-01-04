/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Dark Mastery
 * Archetype: Dominator
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\dominator_dark_mastery
 */

const EPIC_DOMINATOR_DARK_MASTERY = {
  "id": "dominator_dark_mastery",
  "name": "Dark Mastery",
  "displayName": "Dark Mastery",
  "archetype": "dominator",
  "description": "You have Mastery over Darkness to control and blast your foes.",
  "icon": "sentinel_dark_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Murky Cloud",
      "fullName": "Epic.Dominator_Dark_Mastery.Murky_Cloud",
      "rank": 1,
      "available": 34,
      "description": "You create a Murky Cloud enshrouding you. This cloud can absorb all forms of energy, making you more resistant to Fire, Cold, Energy, and Negative Energy attacks.",
      "shortHelp": "Toggle: Self +Res(Fire, Cold, Energy, Negative)",
      "icon": "dark_mastery_murkycloud.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Dominator",
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
      "name": "Tar Patch",
      "fullName": "Epic.Dominator_Dark_Mastery.Tar_Patch",
      "rank": 2,
      "available": 34,
      "description": "Drops a large patch of viscous Negative Energy which dramatically slows down enemies that run through it and reduces their damage resistance. Affected targets stuck in the Tar Patch cannot jump or fly.",
      "shortHelp": "Ranged (Location AoE), Target -Speed, -Res, -Fly",
      "icon": "dark_mastery_tarpatch.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Dominator",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Slow Movement"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 180.0,
        "endurance": 9.75,
        "activationTime": 3.1,
        "effectArea": "Location"
      }
    },
    {
      "name": "Darkest Night",
      "fullName": "Epic.Dominator_Dark_Mastery.Darkest_Night",
      "rank": 3,
      "available": 37,
      "description": "While active, you channel Negative Energy onto a targeted foe. Darkest Night decreases the damage potential and chance to hit of the target, and all foes nearby, as long as you keep the power active. You must be level 38 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Ranged (Targeted AoE), Foe -DMG -To Hit",
      "icon": "dark_mastery_darkestnight.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge"
      ],
      "allowedSetCategories": [
        "To Hit Debuff"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 70.0,
        "recharge": 20.0,
        "endurance": 0.325,
        "activationTime": 3.17,
        "effectArea": "AoE",
        "radius": 15.0
      }
    },
    {
      "name": "Umbral Torrent",
      "fullName": "Epic.Dominator_Dark_Mastery.Torrent",
      "rank": 4,
      "available": 40,
      "description": "You summon a wave of mire that sweeps away foes within its arc. The attack deals minimal Negative Energy damage, but sends foes flying and reduces their chance to hit. You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
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
      "name": "Soul Consumption",
      "fullName": "Epic.Dominator_Dark_Mastery.Soul_Consumption",
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
        "recharge": 600.0,
        "endurance": 0.65,
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
    EPIC_POOLS['dominator_dark_mastery'] = EPIC_DOMINATOR_DARK_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
