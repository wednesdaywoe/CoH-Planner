/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Psionic Mastery
 * Archetype: Tanker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\tank_psionic_mastery
 */

const EPIC_TANK_PSIONIC_MASTERY = {
  "id": "tank_psionic_mastery",
  "name": "Psionic Mastery",
  "displayName": "Psionic Mastery",
  "archetype": "tanker",
  "description": "You have Mastery over Psionics and the mind to blast your foes, increase your power, and to add some much needed armor and defense.",
  "icon": "psionic_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Mesmerize",
      "fullName": "Epic.Tank_Psionic_Mastery.Mesmerize",
      "rank": 1,
      "available": 34,
      "description": "Mesmerize painfully assails a target with psychic energy, rendering them unconscious. The target will remain asleep for some time, but will awaken if attacked.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
      "shortHelp": "Ranged, DMG(Psionic), Foe Sleep",
      "icon": "psionic_mastery_mesmerize.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Brute) || ($archetype == @Class_Tanker)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Sleep",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged Damage",
        "Sleep",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.1,
        "range": 100.0,
        "recharge": 12.0,
        "endurance": 6.5,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Psionic",
          "scale": 1.809,
          "table": "Ranged_PvPDamage"
        },
        "protection": {
          "sleep": 4.0
        }
      }
    },
    {
      "name": "Dominate",
      "fullName": "Epic.Tank_Psionic_Mastery.Dominate",
      "rank": 2,
      "available": 34,
      "description": "Painfully tears at the mind of a single foe. Dominate deals Psionic damage and renders a foe helpless, lost in their own mind and unable to defend themselves.",
      "shortHelp": "Ranged, DMG(Psionic), Foe Hold",
      "icon": "psionic_mastery_dominate.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Brute) || ($archetype == @Class_Tanker)",
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
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 10.66,
        "activationTime": 1.1,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 4.0
        },
        "damage": {
          "type": "Psionic",
          "scale": 2.13,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Harmonic Mind",
      "fullName": "Epic.Tank_Psionic_Mastery.Harmonic_Mind",
      "rank": 3,
      "available": 37,
      "description": "By achieving perfect harmony of body, mind and spirit you are able to conserve and recover endurance slightly faster than normal. This power is always active and consumes no endurance. You must be level 38 and have one other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Auto: Self, +Recovery, Endurance Discount",
      "icon": "psionic_mastery_harmonicmind.png",
      "powerType": "Auto",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification"
      ],
      "allowedSetCategories": [
        "Endurance Modification"
      ],
      "effects": {
        "accuracy": 1.0,
        "effectArea": "SingleTarget",
        "recovery": {
          "scale": 0.125,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Mental Blast",
      "fullName": "Epic.Tank_Psionic_Mastery.Mental_Blast",
      "rank": 4,
      "available": 40,
      "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed. You must be level 41 and have one other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Psionic), Target -Recharge",
      "icon": "psionic_mastery_mentalblast.png",
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
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 100.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Psionic",
          "scale": 1.889,
          "table": "Melee_PvPDamage"
        }
      }
    },
    {
      "name": "Psionic Tornado",
      "fullName": "Epic.Tank_Psionic_Mastery.Psionic_Tornado",
      "rank": 5,
      "available": 43,
      "description": "Unleashes a whirlwind of Psionic energy on a target, tossing nearby foes into the air. The Psionic Tornado damages foes and Slows their attack speed. You must be level 44 and have two other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DoT(Psionic), Foe Knockback",
      "icon": "psionic_mastery_psionictornado.png",
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
        "range": 100.0,
        "recharge": 40.0,
        "endurance": 23.14,
        "activationTime": 1.83,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Psionic",
          "scale": 1.0095,
          "table": "Melee_PvPDamage"
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['tank_psionic_mastery'] = EPIC_TANK_PSIONIC_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
