/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Earth Mastery
 * Archetype: Tanker
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\earth_mastery
 */

const EPIC_EARTH_MASTERY = {
  "id": "earth_mastery",
  "name": "Earth Mastery",
  "displayName": "Earth Mastery",
  "archetype": "tanker",
  "description": "You have Mastery over Earth and stone to crush your foes and control your foes.",
  "icon": "earth_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Stone Prison",
      "fullName": "Epic.Earth_Mastery.Stone_Prison",
      "rank": 1,
      "available": 34,
      "description": "Immobilizes a single target within an earthy formation and deals some Smashing damage over time. Some more resilient foes may require multiple attacks to Immobilize. Stone Prison can also reduce a target's Defense.",
      "shortHelp": "Ranged, DoT(Smash), Foe Immobilize, -DEF, -Fly",
      "icon": "earth_mastery_stoneprison.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Brute) || ($archetype == @Class_Tanker)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Immobilize",
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 50.0,
        "recharge": 8.0,
        "endurance": 8.405,
        "activationTime": 1.23,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 0.3162,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "immobilize": 4.0
        },
        "resistance": {},
        "defense": {
          "all": {
            "scale": 2.0,
            "table": "Ranged_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "Salt Crystals",
      "fullName": "Epic.Earth_Mastery.Salt_Crystals",
      "rank": 2,
      "available": 34,
      "description": "Attempts to encrust all nearby foes in a Pillar of Salt. The victims will remain encased within the salt for quite a while, but will automatically break free if attacked. Affected targets have reduced defense for a while, even if they break free.<br><br><color #fcfc95>Notes: The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
      "shortHelp": "PBAoE, Foe Sleep, -DEF",
      "icon": "earth_mastery_saltcrystals.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Brute) || ($archetype == @Class_Tanker)",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Sleep",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Sleep"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 90.0,
        "endurance": 19.5,
        "activationTime": 1.07,
        "effectArea": "AoE",
        "radius": 30.0,
        "protection": {
          "sleep": 3.0
        },
        "defense": {
          "all": {
            "scale": 2.0,
            "table": "Ranged_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "Fossilize",
      "fullName": "Epic.Earth_Mastery.Fossilize",
      "rank": 3,
      "available": 37,
      "description": "Encases a single target within solid stone. The stone slowly crushes the victim, dealing Smashing damage. The Fossilized victim is held helpless and unable to defend himself. You must be level 38 and have one other Earth Mastery Powers before selecting this power.",
      "shortHelp": "Ranged, DMG(Smash), Foe Hold, -DEF",
      "icon": "earth_mastery_fossilize.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "activationTime": 2.07,
        "effectArea": "SingleTarget",
        "protection": {
          "hold": 3.0
        },
        "damage": {
          "type": "Smashing",
          "scale": 2.809,
          "table": "Melee_PvPDamage"
        },
        "defense": {
          "all": {
            "scale": 2.0,
            "table": "Ranged_Debuff_Def"
          }
        }
      }
    },
    {
      "name": "Quicksand",
      "fullName": "Epic.Earth_Mastery.Quick_Sand",
      "rank": 4,
      "available": 40,
      "description": "You can cause the ground to liquefy like Quicksand at a targeted location. Any foes that pass through the Quicksand will become snared, their movement will be dramatically Slowed, and their Defense reduced. Foes trapped in the Quicksand cannot jump or Fly. You must be level 41 and have one other Earth Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Location AoE), Foe -Speed, -Jump, -Fly, -DEF",
      "icon": "earth_mastery_quicksand.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Slow Movement"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 90.0,
        "recharge": 60.0,
        "endurance": 9.75,
        "activationTime": 3.1,
        "effectArea": "Location"
      }
    },
    {
      "name": "Stalagmites",
      "fullName": "Epic.Earth_Mastery.Stalagmites",
      "rank": 5,
      "available": 43,
      "description": "You can cause Stalagmites to erupt all around an enemy, slicing all nearby foes. The Stalagmites deal Lethal damage, and reduce the affected targets Defense. Some affected foes may be Disorient for a short while. You must be on the ground to activate this power. You must be level 44 and have two other Earth Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Targeted AoE), DMG(Lethal), Foe -DEF, Minor Disorient",
      "icon": "earth_mastery_rangedaoe.png",
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
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 1.0,
        "effectArea": "AoE",
        "radius": 15.0,
        "damage": {
          "type": "Lethal",
          "scale": 0.8985,
          "table": "Ranged_Damage"
        },
        "defense": {
          "all": {
            "scale": 2.0,
            "table": "Ranged_Debuff_Def"
          }
        }
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['earth_mastery'] = EPIC_EARTH_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
