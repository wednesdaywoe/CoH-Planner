/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Energy Mastery
 * Archetype: Controller
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\primal_forces_mastery
 */

const EPIC_PRIMAL_FORCES_MASTERY = {
  "id": "primal_forces_mastery",
  "name": "Energy Mastery",
  "displayName": "Energy Mastery",
  "archetype": "controller",
  "description": "You have Mastery over Primal Forces and energy to blast your foes, increase your power, and to add some much needed armor and defense.",
  "icon": "primal_forces_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Power Blast",
      "fullName": "Epic.Primal_Forces_Mastery.Power_Blast",
      "rank": 1,
      "available": 34,
      "description": "A much more powerful, yet slower version of Power Bolt. Power Blast sends a focused beam of energy at a foe that can knock him back.",
      "shortHelp": "Ranged, DMG(Energy/Smash), Foe Knockback",
      "icon": "powerblast_powerblast.png",
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
        "Knockback",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 10.66,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 1.889,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Conserve Power",
      "fullName": "Epic.Primal_Forces_Mastery.Conserve_Power",
      "rank": 2,
      "available": 34,
      "description": "You can focus for a moment to conserve your Endurance. After activating this power, you expend less Endurance on all other powers for a while.",
      "shortHelp": "Self Endurance Discount",
      "icon": "primalforcesmastery_conservepower.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Controller",
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
      "name": "Temp Invulnerability",
      "fullName": "Epic.Primal_Forces_Mastery.Temp_Invulnerability",
      "rank": 3,
      "available": 37,
      "description": "When you toggle on this power, you become highly resistant to Smashing and Lethal damage. You must be level 38 and have one other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal)",
      "icon": "primalforcesmastery_temporaryinvulnerabilty.png",
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
      "name": "Energy Torrent",
      "fullName": "Epic.Primal_Forces_Mastery.Energy_Torrent",
      "rank": 4,
      "available": 40,
      "description": "Energy Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying. You must be level 41 and have one other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
      "icon": "primalforcesmastery_energytorrent.png",
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
        "Knockback",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 40.0,
        "recharge": 24.0,
        "endurance": 14.82,
        "activationTime": 1.07,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 0.7854,
        "damage": {
          "type": "Energy",
          "scale": 0.8861,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    },
    {
      "name": "Power Boost",
      "fullName": "Epic.Primal_Forces_Mastery.Power_Boost",
      "rank": 5,
      "available": 43,
      "description": "Greatly boosts the secondary effects of your powers. Your powers effects like Disorients, Holds, Immobilizes, Heals, Defense Buffs, Endurance Drains, Knockbacks and more, are all improved. The effects of Power Boost last a short while, and only the next couple of attacks will be boosted. You must be level 44 and have two other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Self +Special",
      "icon": "primalforcesmastery_powerboost.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 120.0,
        "endurance": 9.75,
        "activationTime": 1.17,
        "effectArea": "SingleTarget"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['primal_forces_mastery'] = EPIC_PRIMAL_FORCES_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
