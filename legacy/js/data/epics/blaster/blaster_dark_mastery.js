/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Dark Mastery
 * Archetype: Blaster
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\blaster_dark_mastery
 */

const EPIC_BLASTER_DARK_MASTERY = {
  "id": "blaster_dark_mastery",
  "name": "Dark Mastery",
  "displayName": "Dark Mastery",
  "archetype": "blaster",
  "description": "You have Mastery over Darkness to control and blast your foes.",
  "icon": "sentinel_dark_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Murky Cloud",
      "fullName": "Epic.Blaster_Dark_Mastery.Murky_Cloud",
      "rank": 1,
      "available": 34,
      "description": "You create a Murky Cloud enshrouding you. This cloud can absorb all forms of energy, making you more resistant to Fire, Cold, Energy, and Negative Energy attacks.",
      "shortHelp": "Toggle: Self +Res(Fire, Cold, Energy, Negative)",
      "icon": "dark_mastery_murkycloud.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Blaster",
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
      "name": "Fearsome Stare",
      "fullName": "Epic.Blaster_Dark_Mastery.Fearsome_Stare",
      "rank": 2,
      "available": 34,
      "description": "Instills tremendous Fear within a cone area in front of you, causing all affected targets to tremble in Terror uncontrollably.",
      "shortHelp": "Ranged (Cone), Foe Fear, -To Hit",
      "icon": "dark_mastery_fearsomestare.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Blaster",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Fear",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Fear",
        "To Hit Debuff"
      ],
      "effects": {
        "accuracy": 0.8,
        "range": 50.0,
        "recharge": 100.0,
        "endurance": 10.66,
        "activationTime": 2.03,
        "effectArea": "Cone",
        "radius": 50.0,
        "arc": 0.7854,
        "protection": {
          "fear": 3.0
        }
      }
    },
    {
      "name": "Possess",
      "fullName": "Epic.Blaster_Dark_Mastery.Possess",
      "rank": 3,
      "available": 37,
      "description": "You cause your targeted foe to be possessed by a dark entity from the Netherworld causing them to be confused for a short period of time. While confused they will be unable to tell the difference between friend or foe and will attack nearby allies. Possess will also hinder the target's abilities, lowering their chance ToHit, Damage, Healing, and the strength of their buffs, You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, Target Confuse, -ToHit, -Damage, -Healing, -Special",
      "icon": "dark_mastery_possess.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Confuse",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Confuse"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 2.33,
        "effectArea": "SingleTarget",
        "protection": {
          "confuse": 3.0
        }
      }
    },
    {
      "name": "Black Hole",
      "fullName": "Epic.Blaster_Dark_Mastery.Black_Hole",
      "rank": 4,
      "available": 40,
      "description": "Opens up a Black Hole to the Netherworld that temporarily pulls in all foes within its grasp. Victims that are immune to the pull become phase shifted and are completely intangible. They are hard to see, and cannot affect or be affected by those in normal space. You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), Foe Intangible",
      "icon": "dark_mastery_blackhole.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 240.0,
        "endurance": 16.25,
        "activationTime": 1.03,
        "effectArea": "AoE",
        "radius": 10.0
      }
    },
    {
      "name": "Soul Consumption",
      "fullName": "Epic.Blaster_Dark_Mastery.Soul_Consumption",
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
    EPIC_POOLS['blaster_dark_mastery'] = EPIC_BLASTER_DARK_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
