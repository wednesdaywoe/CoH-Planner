/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Psionic Mastery
 * Archetype: Defender
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\psychic_mastery
 */

const EPIC_PSYCHIC_MASTERY = {
  "id": "psychic_mastery",
  "name": "Psionic Mastery",
  "displayName": "Psionic Mastery",
  "archetype": "defender",
  "description": "Your Psychic Mastery allows you to dominate and control your foes, and to add some much needed defense.",
  "icon": "psychic_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Dominate",
      "fullName": "Epic.Psychic_Mastery.Dominate",
      "rank": 1,
      "available": 34,
      "description": "Painfully tears at the mind of a single foe. Dominate deals Psionic damage and renders a foe helpless, lost in his own mind and unable to defend himself.",
      "shortHelp": "Ranged, DMG(Psionic), Foe Hold",
      "icon": "mentalcontrol_command.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
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
        "range": 80.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.1,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Psionic",
          "scale": 2.13,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Mass Hypnosis",
      "fullName": "Epic.Psychic_Mastery.Mass_Hypnosis",
      "rank": 2,
      "available": 34,
      "description": "Hypnotizes a group of foes at a distance and puts them to Sleep. The targets will remain asleep for some time, but will awaken if attacked. This power deals no damage, but if done discreetly, the targets will never be aware of your presence.<br><br><color #fcfc95>Notes:<br>The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
      "shortHelp": "Ranged (Targeted AoE), Foe Sleep",
      "icon": "mentalcontrol_masshypnosis.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Sleep",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Sleep"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 90.0,
        "endurance": 19.5,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 25.0,
        "protection": {
          "sleep": 3.0
        }
      }
    },
    {
      "name": "Mind Over Body",
      "fullName": "Epic.Psychic_Mastery.Mind_Over_Body",
      "rank": 3,
      "available": 37,
      "description": "When you toggle on this power, you empower your Mind Over Body to become highly resistant to Smashing, Lethal and Psionic damage. You must be level 38 and have one other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Res(Smash, Lethal, Psionics)",
      "icon": "psychicmastery_mindoverbody.png",
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
          "psionic": {
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
          "negative": {
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
      "name": "World of Confusion",
      "fullName": "Epic.Psychic_Mastery.World_of_Confusion",
      "rank": 4,
      "available": 40,
      "description": "This toggle power allows you to cause psionic damage and cause confusion within a group of foes, creating chaos. The chance of confusing an enemy is lower than then chance of damaging them, and it may take multiple hits to affect stronger opponents. All affected foes within the area will turn and attack each other, ignoring all heroes. You must have two other Psychic Mastery powers to select this power. You will not receive any Experience Points for foes defeated by Confused enemies. You must be level 41 and have one other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: PBAoE, DoT(Psionic), Foe Confuse",
      "icon": "psychicmastery_worldofconfusion.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Confuse",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Confuse",
        "Melee AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 10.0,
        "endurance": 1.3,
        "activationTime": 1.67,
        "effectArea": "AoE",
        "radius": 8.0,
        "protection": {
          "confuse": 2.0
        },
        "damage": {
          "type": "Psionic",
          "scale": 0.12,
          "table": "Ranged_Damage"
        }
      }
    },
    {
      "name": "Telekinesis",
      "fullName": "Epic.Psychic_Mastery.Telekinesis",
      "rank": 5,
      "available": 43,
      "description": "Lifts a foe, and any nearby foes, off the ground and repels them. The targets are helpless, unable to move, and will continue to hover away, picking up any passing targets, as long as you keep this power active. Keeping up this level of concentration costs a lot of Endurance. You must be level 44 and have two other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Ranged (Targeted AoE), Foe Immobilize, Repel",
      "icon": "mentalcontrol_telekinesis.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Immobilize"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 180.0,
        "endurance": 0.325,
        "activationTime": 1.13,
        "effectArea": "AoE",
        "radius": 10.0,
        "resistance": {},
        "protection": {
          "immobilize": 4.0
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['psychic_mastery'] = EPIC_PSYCHIC_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
