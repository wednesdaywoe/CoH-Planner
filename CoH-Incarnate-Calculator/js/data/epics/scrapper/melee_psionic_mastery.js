/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Psionic Mastery
 * Archetype: Scrapper
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\melee_psionic_mastery
 */

const EPIC_MELEE_PSIONIC_MASTERY = {
  "id": "melee_psionic_mastery",
  "name": "Psionic Mastery",
  "displayName": "Psionic Mastery",
  "archetype": "scrapper",
  "description": "You have Mastery over Psionics and the mind to blast your foes, increase your power, and to add some much needed armor and defense.",
  "icon": "psionic_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Mental Blast",
      "fullName": "Epic.Melee_Psionic_Mastery.Mental_Blast",
      "rank": 1,
      "available": 34,
      "description": "This basic attack does moderate Psionic damage, and can slightly reduce a target's attack speed. You must be level 41 and have one other Psionic Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Psionic), Target -Recharge",
      "icon": "psionic_mastery_mentalblast.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker)",
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
      "name": "Psionic Lance",
      "fullName": "Epic.Melee_Psionic_Mastery.Psionic_Lance",
      "rank": 2,
      "available": 34,
      "description": "This extremely long range Psionic attack has a bonus to Accuracy, and can Slow a target's attack rate. This is a sniper attack, and is best fired from a distance as it can be interrupted. If you are engaged in battle this attack becomes instant-cast. If you are not engaged, it will do bonus damage.",
      "shortHelp": "Sniper, DMG(Psionic), Target -Recharge",
      "icon": "psionic_mastery_psioniclance.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Scrapper) || ($archetype == @Class_Stalker)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Ranged Damage",
        "Sniper Attacks",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 175.0,
        "recharge": 24.0,
        "endurance": 16.646,
        "activationTime": 1.33,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Psychic Scream",
      "fullName": "Epic.Melee_Psionic_Mastery.Psychic_Scream",
      "rank": 3,
      "available": 37,
      "description": "This howl of Psionic energy resonates in the minds of all foes within its conical area of effect, inflicting moderate damage.",
      "shortHelp": "Ranged (Cone), DMG(Psionic), Foe -Recharge",
      "icon": "psionic_mastery_psychicscream.png",
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
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 24.0,
        "endurance": 16.646,
        "activationTime": 1.87,
        "effectArea": "Cone",
        "radius": 60.0,
        "arc": 0.5236,
        "damage": {
          "type": "Psionic",
          "scale": 0.9741,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Harmonic Mind",
      "fullName": "Epic.Melee_Psionic_Mastery.Harmonic_Mind",
      "rank": 4,
      "available": 40,
      "description": "By achieving perfect harmony of body, mind and spirit you are able to conserve and recover endurance slightly faster than normal. This power is always active and consumes no endurance. You must be level 41 and have one other Psionic Mastery Powers before selecting this power.",
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
      "name": "Psionic Nexus",
      "fullName": "Epic.Melee_Psionic_Mastery.Psionic_Nexus",
      "rank": 5,
      "available": 43,
      "description": "You create a nexus of psionic energy at your location.",
      "shortHelp": "Summon Psionic Nexus: Ranged DMG(Psionic)",
      "icon": "psionic_mastery_psionicnexus.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "Immobilize",
        "Knockback",
        "Pet Damage",
        "Recharge Intensive Pets",
        "Sleep",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 900.0,
        "endurance": 26.0,
        "activationTime": 2.0,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['melee_psionic_mastery'] = EPIC_MELEE_PSIONIC_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
