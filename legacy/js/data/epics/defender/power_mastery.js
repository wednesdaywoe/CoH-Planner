/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Energy Mastery
 * Archetype: Defender
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\power_mastery
 */

const EPIC_POWER_MASTERY = {
  "id": "power_mastery",
  "name": "Energy Mastery",
  "displayName": "Energy Mastery",
  "archetype": "defender",
  "description": "You have Mastery over Power and Energy to defeat your foes, increase your power, and to add some much needed armor and defense.",
  "icon": "power_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Conserve Power",
      "fullName": "Epic.Power_Mastery.Conserve_Power",
      "rank": 1,
      "available": 34,
      "description": "You can focus for a moment to conserve your Endurance. After activating this power, you expend less Endurance on all other powers for a while.",
      "shortHelp": "Self Endurance Discount",
      "icon": "energymanipulation_conservepower.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 600.0,
        "endurance": 9.75,
        "activationTime": 1.17,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Power Build Up",
      "fullName": "Epic.Power_Mastery.Power_Build_Up",
      "rank": 2,
      "available": 34,
      "description": "Your mastery of power and energy allows you to greatly increase the damage you deal for a few seconds, as well as slightly increasing your Accuracy Additionally, Power Build Up greatly boosts the secondary effects of your powers. Your powers effects like Heals, Defense Buffs, Endurance Drains, Disorients, Holds, Immobilizes, Knockbacks and more, are all improved.",
      "shortHelp": "Self +DMG, +ACC, +Special",
      "icon": "powermastery_powerbuildup.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "To Hit Buff"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 240.0,
        "endurance": 13.0,
        "activationTime": 1.17,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Temp Invulnerability",
      "fullName": "Epic.Power_Mastery.Temp_Invulnerability",
      "rank": 3,
      "available": 37,
      "description": "When you toggle on this power, you become highly resistant to Smashing and Lethal damage. You must be level 38 and have one other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal)",
      "icon": "powermastery_tempinvulnerability.png",
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
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "psionic": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          }
        }
      }
    },
    {
      "name": "Force of Nature",
      "fullName": "Epic.Power_Mastery.Force_of_Nature",
      "rank": 4,
      "available": 40,
      "description": "When you activate this power, you become highly resistant to all damage types except psionics. Your Endurance recovery is also increased. Force of Nature costs little Endurance to activate, but when it wears off you are left exhausted, and drained of almost all Endurance, and unable to recover Endurance for a short while. You must be level 41 and have one other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Self, +Res(All DMG but Psionics)",
      "icon": "powermastery_forceofnature.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 1000.0,
        "endurance": 3.25,
        "activationTime": 3.1,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "lethal": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "cold": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "energy": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "negative": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          },
          "toxic": {
            "scale": 5.0,
            "table": "Melee_Res_Dmg"
          }
        },
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Total Focus",
      "fullName": "Epic.Power_Mastery.Total_Focus",
      "rank": 5,
      "available": 43,
      "description": "Total Focus is complete mastery over Energy Melee. This is a very slow, but incredibly devastating attack that can knock out most opponents, leaving them Disoriented. Due to the exhausting nature of Total Focus, recharge time is very long. You must be level 44 and have two other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Melee, Extreme DMG(Energy/Smash), Foe Disorient",
      "icon": "energymanipulation_totalfocus.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 7.0,
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 2.53,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 3.771,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "stun": 3.0
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['power_mastery'] = EPIC_POWER_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
