/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Dark Mastery
 * Archetype: Defender
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\dark_mastery
 */

const EPIC_DARK_MASTERY = {
  "id": "dark_mastery",
  "name": "Dark Mastery",
  "displayName": "Dark Mastery",
  "archetype": "defender",
  "description": "You have Mastery over Darkness to weaken your foes, and to add some much needed defense.",
  "icon": "dark_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Oppressive Gloom",
      "fullName": "Epic.Dark_Mastery.Oppressive_Gloom",
      "rank": 1,
      "available": 34,
      "description": "The Netherworld has many mutable properties, such as the Oppressive Gloom. This power allows you to use your own Hit Points to keep enemies near you Disoriented and unable to use any powers. Endurance cost for this is minimal, but the power can be dangerous to use.",
      "shortHelp": "Toggle: PBAoE, Foe Disorient, Self -HP",
      "icon": "dark_mastery_oppressivegloom.png",
      "powerType": "Toggle",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Stuns"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 16.0,
        "endurance": 0.195,
        "activationTime": 1.17,
        "effectArea": "AoE",
        "radius": 12.0,
        "protection": {
          "stun": 2.0
        },
        "damage": {
          "type": "Special",
          "scale": 0.1521,
          "table": "Melee_Damage"
        }
      }
    },
    {
      "name": "Dark Consumption",
      "fullName": "Epic.Dark_Mastery.Dark_Consumption",
      "rank": 2,
      "available": 34,
      "description": "The dark power of the Netherworld allows you to tap the essence of your foe's soul and transfer it to yourself. This will drain the Hit Points of your enemy and add to your Endurance.",
      "shortHelp": "PBAoE DMG(Negative), Self +End",
      "icon": "dark_mastery_darkconsumption.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Melee AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 360.0,
        "endurance": 0.65,
        "activationTime": 1.03,
        "effectArea": "AoE",
        "radius": 8.0,
        "damage": {
          "type": "Negative",
          "scale": 0.8,
          "table": "Melee_InherentDamage"
        }
      }
    },
    {
      "name": "Dark Embrace",
      "fullName": "Epic.Dark_Mastery.Dark_Embrace",
      "rank": 3,
      "available": 37,
      "description": "You tap into the energy of the Netherworld to protect yourself from damage. This Dark Embrace shrouds you and grants resistance to Lethal, Smashing, Toxic, and Negative Energy damage. You must be level 38 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Negative, Toxic)",
      "icon": "dark_mastery_darkembrace.png",
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
        "activationTime": 0.67,
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
          "negative": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          },
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
          "psionic": {
            "scale": 2.75,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Soul Transfer",
      "fullName": "Epic.Dark_Mastery.Soul_Transfer",
      "rank": 4,
      "available": 40,
      "description": "Should you fall in battle, you can perform a Soul Transfer, sucking the life force of all foes around you to bring yourself back from the brink of death. The more foes nearby, the more life is restored to you. Drained foes are left Disoriented. The dark effects of this Soul Transfer will actually leave you invulnerable for a brief time, and protected from XP Debt for 90 seconds. There must be at least one foe nearby to fuel the Transfer and revive yourself. You must be level 41 and have one other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Self Rez, Special",
      "icon": "dark_mastery_soultransfer.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "recharge": 450.0,
        "activationTime": 1.17,
        "effectArea": "AoE",
        "radius": 25.0,
        "damage": {
          "type": "Heal",
          "scale": 3.0,
          "table": "Melee_Heal"
        },
        "protection": {
          "immobilize": 50.0,
          "stun": 30.0
        }
      }
    },
    {
      "name": "Spirit Drain",
      "fullName": "Epic.Dark_Mastery.Soul_Drain",
      "rank": 5,
      "available": 43,
      "description": "Using this power, you can drain the spirits of your foes, thus increasing your own strength. Each affected foe will lose some Hit Points and add to your Damage and Accuracy. You must be level 44 and have two other Dark Mastery Powers before selecting this power.",
      "shortHelp": "Damged AoE, DMG(Negative), Self +DMG, +ACC",
      "icon": "dark_mastery_spiritdrain.png",
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
        "To Hit Buff",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 60.0,
        "recharge": 120.0,
        "endurance": 19.5,
        "activationTime": 2.37,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Negative",
          "scale": 0.29,
          "table": "Melee_PvPDamage"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['dark_mastery'] = EPIC_DARK_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
