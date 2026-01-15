/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Energy Mastery
 * Archetype: Dominator
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\primal_forces_mastery_dominator
 */

const EPIC_PRIMAL_FORCES_MASTERY_DOMINATOR = {
  "id": "primal_forces_mastery_dominator",
  "name": "Energy Mastery",
  "displayName": "Energy Mastery",
  "archetype": "dominator",
  "description": "You have Mastery over Primal Forces and energy to blast your foes, increase your power, and to add some much needed armor and defense.",
  "icon": "primal_forces_mastery_dominator_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Energy Transfer",
      "fullName": "Epic.Primal_Forces_Mastery_Dominator.Energy_Transfer",
      "rank": 1,
      "available": 34,
      "description": "Mastery of Energy Melee begins with the ability to transfer your own Hit Points into a punch that deals extreme damage. Energy Transfer has a good chance of Disorienting the target.",
      "shortHelp": "Melee, DMG(Energy/Smash), Foe Disorient, Self -HP",
      "icon": "primalforcesmasterydominator_energytransfer.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Dominator",
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
        "recharge": 20.0,
        "endurance": 19.11,
        "activationTime": 2.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Special",
          "scale": 3.0,
          "table": "Melee_Damage"
        },
        "protection": {
          "stun": 3.0
        }
      }
    },
    {
      "name": "Conserve Power",
      "fullName": "Epic.Primal_Forces_Mastery_Dominator.Conserve_Power",
      "rank": 2,
      "available": 34,
      "description": "You can focus for a moment to conserve your Endurance. After activating this power, you expend less Endurance on all other powers for a while.",
      "shortHelp": "Self Endurance Discount",
      "icon": "primalforcesmastery_conservepower.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Dominator",
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
      "fullName": "Epic.Primal_Forces_Mastery_Dominator.Temp_Invulnerability",
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
      "fullName": "Epic.Primal_Forces_Mastery_Dominator.Energy_Torrent",
      "rank": 4,
      "available": 40,
      "description": "Energy Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying. You must be level 41 and have one other Energy Mastery Powers before selecting this power.<br>",
      "shortHelp": "Ranged (Cone), Light DMG(Energy/Smash), Foe Knockback",
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
      "name": "Explosive Blast",
      "fullName": "Epic.Primal_Forces_Mastery_Dominator.Explosive_Blast",
      "rank": 5,
      "available": 43,
      "description": "You hurl a blast of charged energy that violently explodes on impact, damaging all foes near the target. Explosive Blast may knock targets backwards. You must be level 44 and have two other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Smash/Energy), Foe Knockback",
      "icon": "primalforcesmasterydominator_explosiveblast.png",
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
        "Knockback",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.67,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Energy",
          "scale": 0.6797,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "knockback": 1.0
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['primal_forces_mastery_dominator'] = EPIC_PRIMAL_FORCES_MASTERY_DOMINATOR;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
