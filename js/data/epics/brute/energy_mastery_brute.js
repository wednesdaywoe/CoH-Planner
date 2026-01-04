/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Energy Mastery
 * Archetype: Brute
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\energy_mastery_brute
 */

const EPIC_ENERGY_MASTERY_BRUTE = {
  "id": "energy_mastery_brute",
  "name": "Energy Mastery",
  "displayName": "Energy Mastery",
  "archetype": "brute",
  "description": "You have Mastery over your bodies Energy to increase your power and even hurl energy at your foes.",
  "icon": "energy_mastery_brute_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Superior Conditioning",
      "fullName": "Epic.Energy_Mastery_Brute.Conserve_Power",
      "rank": 1,
      "available": 34,
      "description": "Your Superior Condition has increased your maximum endurance by 5%.",
      "shortHelp": "Self +Endurance",
      "icon": "energymastery_conservepower.png",
      "powerType": "Auto",
      "requires": "$archetype == @Class_Brute",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification"
      ],
      "allowedSetCategories": [
        "Endurance Modification"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 10.0,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Focused Accuracy",
      "fullName": "Epic.Energy_Mastery_Brute.Focused_Accuracy",
      "rank": 2,
      "available": 34,
      "description": "When this power is activated, the Hero focuses his senses to dramatically improve his accuracy. Additionally, Focused Accuracy increase your Perception, allowing you to better see stealthy foes. It also grants you resistance to powers that DeBuff your Accuracy. Focused Accuracy is a toggle power and must be activated and deactivated manually. Like all toggle powers, while active, Focused Accuracy drains Endurance while active.",
      "shortHelp": "Toggle: Self +To Hit, +ACC, +Perception, Res(DeBuff To Hit)",
      "icon": "energymastery_focusedaccuracy.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Brute",
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
        "recharge": 10.0,
        "endurance": 0.195,
        "activationTime": 1.17,
        "effectArea": "SingleTarget",
        "resistance": {}
      }
    },
    {
      "name": "Laser Beam Eyes",
      "fullName": "Epic.Energy_Mastery_Brute.Laser_Beam_Eyes",
      "rank": 3,
      "available": 37,
      "description": "You can emit Laser Beams from your eyes, dealing moderate Energy damage. This attack can not miss and will reduce the target's Defense. Damage inflicted will fluctuate the current hit roll. You must be level 38 and have one other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Energy), Foe -DEF",
      "icon": "energymastery_laserbeameyes.png",
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
        "Accurate Defense Debuff",
        "Defense Debuff",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.67,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Physical Perfection",
      "fullName": "Epic.Energy_Mastery_Brute.Physical_Perfection",
      "rank": 4,
      "available": 40,
      "description": "By achieving perfect harmony of body, mind and spirit you are able to regenerate health and endurance slightly faster than normal. This power is always active and consumes no endurance. You must be level 41 and have one other Energy Mastery Powers before selecting this power.<br>",
      "shortHelp": "Auto: Self, +Regeneration, +Recovery",
      "icon": "energymastery_physicalperfection.png",
      "powerType": "Auto",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Heal"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "effectArea": "SingleTarget",
        "regeneration": {
          "scale": 0.2,
          "table": "Melee_Ones"
        },
        "recovery": {
          "scale": 0.125,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Energy Torrent",
      "fullName": "Epic.Energy_Mastery_Brute.Energy_Torrent",
      "rank": 5,
      "available": 43,
      "description": "Energy Torrent unleashes a cone of powerful energy that can smash foes and possibly send them flying. You must be level 44 and have two other Energy Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Cone), DMG(Energy/Smash), Foe Knockback",
      "icon": "powerblast_energytorrent.png",
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
        "range": 40.0,
        "recharge": 24.0,
        "endurance": 14.82,
        "activationTime": 1.07,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 0.7854,
        "damage": {
          "type": "Fire",
          "scale": 0.432,
          "table": "Melee_Damage"
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
    EPIC_POOLS['energy_mastery_brute'] = EPIC_ENERGY_MASTERY_BRUTE;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
