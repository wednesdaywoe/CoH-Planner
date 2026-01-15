/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Electricity Mastery
 * Archetype: Sentinel
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\sentinel_electricity_mastery
 */

const EPIC_SENTINEL_ELECTRICITY_MASTERY = {
  "id": "sentinel_electricity_mastery",
  "name": "Electricity Mastery",
  "displayName": "Electricity Mastery",
  "archetype": "sentinel",
  "description": "You have advance Mastery over Electricity and are able to control your foes and aid your allies with it.",
  "icon": "sentinel_electricity_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Chain Fences",
      "fullName": "Epic.Sentinel_Electricity_Mastery.Chain_Fences",
      "rank": 1,
      "available": 34,
      "description": "You can immobilize multiple foes in a chain of electricity, dealing minor damage to all foes in range and draining some endurance. This power also reduces Flight capacity in targets.",
      "shortHelp": "Ranged AoE, DMG(Energy), Foe Immobilize, -End, -Fly",
      "icon": "electriccontrol_chainfences.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Immobilize",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 16.0,
        "endurance": 10.751,
        "activationTime": 1.17,
        "effectArea": "AoE",
        "radius": 15.0,
        "protection": {
          "immobilize": 3.0
        },
        "damage": {
          "type": "Energy",
          "scale": 0.338,
          "table": "Ranged_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        },
        "resistance": {}
      }
    },
    {
      "name": "Havoc Punch",
      "fullName": "Epic.Sentinel_Electricity_Mastery.Havok_Punch",
      "rank": 2,
      "available": 34,
      "description": "The Havoc Punch is a slower attack than Charged Brawl, but makes up for it with a greater damage. Havoc Punch can may knock down targets, drain some Endurance from your target, or even overload their synapses, leaving them writhing for a moment. A portion of the drained Endurance may be given back to you. Disturbing an overloaded target will disperse the electrical charge and release them.",
      "shortHelp": "Melee, DMG(Smash/Energy), Foe Sleep, -End, Knock back",
      "icon": "electriccontrol_havokpunch.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Sentinel",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Sleep",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Knockback",
        "Melee Damage",
        "Sleep",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 28.0,
        "endurance": 16.9,
        "activationTime": 1.5,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 2.57,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "sleep": 3.0,
          "knockback": 1.0
        },
        "recovery": {
          "scale": -1.0,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Paralyzing Jolt",
      "fullName": "Epic.Sentinel_Electricity_Mastery.Paralyzing_Jolt",
      "rank": 3,
      "available": 37,
      "description": "You strike an enemy with a powerful jolt of electricity, disorienting him, draining some endurance and causing moderate damage over time. You must be level 38 and have one other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Energy), Foe Stun, -End",
      "icon": "electriccontrol_teslacage.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Ranged Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 16.0,
        "endurance": 10.66,
        "activationTime": 2.07,
        "effectArea": "SingleTarget",
        "protection": {
          "stun": 4.0
        },
        "damage": {
          "type": "Energy",
          "scale": 2.489,
          "table": "Ranged_PvPDamage"
        },
        "recovery": {
          "scale": -1.0,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Shocking Field",
      "fullName": "Epic.Sentinel_Electricity_Mastery.Lightning_Field",
      "rank": 4,
      "available": 40,
      "description": "While active, you emit a storm of electricity that constantly damages all nearby foes. Enemies shocked by this field will continue to take electric damage over time for a while. You must be level 41 and have one other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: PBAoE, DoT(Energy), Foe -End",
      "icon": "electriccontrol_lightningfield.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "Healing",
        "Melee AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 20.0,
        "endurance": 1.3,
        "activationTime": 2.03,
        "effectArea": "AoE",
        "radius": 10.0,
        "damage": {
          "type": "Energy",
          "scale": 0.17,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Rehabilitating Circuit",
      "fullName": "Epic.Sentinel_Electricity_Mastery.Rehabilitating_Circuit",
      "rank": 5,
      "available": 43,
      "description": "You can use your Rehabilitating Circuit to heal the wounds of your group. Although you can be healed by this power, you need to use it against an ally for the chain to affect you. You must be level 44 and have two other Electricity Mastery Powers before selecting this power.",
      "shortHelp": "Chain, Team +Heal",
      "icon": "electriccontrol_heal.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 16.25,
        "activationTime": 1.0,
        "effectArea": "Chain",
        "radius": 20.0,
        "damage": {
          "type": "Heal",
          "scale": 1.0,
          "table": "Ranged_Heal"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['sentinel_electricity_mastery'] = EPIC_SENTINEL_ELECTRICITY_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
