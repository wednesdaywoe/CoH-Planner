/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Dark Mastery
 * Archetype: Mastermind
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\mastermind_dark_mastery
 */

const EPIC_MASTERMIND_DARK_MASTERY = {
  "id": "mastermind_dark_mastery",
  "name": "Dark Mastery",
  "displayName": "Dark Mastery",
  "archetype": "mastermind",
  "description": "You have Mastery over Darkness to control and blast your foes.",
  "icon": "sentinel_dark_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Murky Cloud",
      "fullName": "Epic.Mastermind_Dark_Mastery.Murky_Cloud",
      "rank": 1,
      "available": 34,
      "description": "You create a Murky Cloud enshrouding you. This cloud can absorb all forms of energy, making you more resistant to Fire, Cold, Energy, and Negative Energy attacks.",
      "shortHelp": "Toggle: Self +Res(Fire, Cold, Energy, Negative)",
      "icon": "dark_mastery_murkycloud.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Mastermind",
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
      "name": "Shadowy Binds",
      "fullName": "Epic.Mastermind_Dark_Mastery.Shadowy_Binds",
      "rank": 2,
      "available": 34,
      "description": "You take control of your victim's shadow causing it to entangle and bind its owner thus leaving them immobilized and suffering from negative energy damage over time and reducing their chance to hit. Immobilized foes cannot move but can still attack.",
      "shortHelp": "Ranged, Moderate DoT(Negative), Foe Immobilize, -To Hit, -Fly",
      "icon": "dark_mastery_penumbralgrasp.png",
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
        "Accurate To-Hit Debuff",
        "Immobilize",
        "Ranged Damage",
        "To Hit Debuff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 50.0,
        "recharge": 8.0,
        "endurance": 8.405,
        "activationTime": 1.2,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Negative",
          "scale": 0.312,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "immobilize": 5.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Dark Pit",
      "fullName": "Epic.Mastermind_Dark_Mastery.Dark_Pit",
      "rank": 3,
      "available": 37,
      "description": "Envelops a targeted foe and any nearby enemies in a pit of Negative Energy. The attack deals no damage, but Disorients all affected foes for a good while. You must be level 38 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), Foe Disorient",
      "icon": "dark_mastery_darkpit.png",
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
        "Stuns"
      ],
      "effects": {
        "accuracy": 0.8,
        "range": 70.0,
        "recharge": 180.0,
        "endurance": 25.225,
        "activationTime": 1.07,
        "effectArea": "AoE",
        "radius": 20.0,
        "protection": {
          "stun": 3.0
        }
      }
    },
    {
      "name": "Possess",
      "fullName": "Epic.Mastermind_Dark_Mastery.Possess",
      "rank": 4,
      "available": 40,
      "description": "You cause your targeted foe to be possessed by a dark entity from the Netherworld causing them to be confused for a short period of time. While confused they will be unable to tell the difference between friend or foe and will attack nearby allies. Possess will also hinder the target's abilities, lowering their chance ToHit, Damage, Healing, and the strength of their buffs, You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, Target Confuse, -ToHit, -Damage, -Healing, -Special",
      "icon": "dark_mastery_possess.png",
      "powerType": "Click",
      "requires": "Epic.Mastermind_Dark_Mastery.Murky_Cloud + Epic.Mastermind_Dark_Mastery.Shadowy_Binds > 0",
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
      "name": "Soul Consumption",
      "fullName": "Epic.Mastermind_Dark_Mastery.Soul_Consumption",
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
    EPIC_POOLS['mastermind_dark_mastery'] = EPIC_MASTERMIND_DARK_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
