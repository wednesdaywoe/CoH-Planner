/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Ice Mastery
 * Archetype: Controller
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\ice_mastery
 */

const EPIC_ICE_MASTERY = {
  "id": "ice_mastery",
  "name": "Ice Mastery",
  "displayName": "Ice Mastery",
  "archetype": "controller",
  "description": "You have Mastery over Ice to blast your foes and to add some much needed armor and defense.",
  "icon": "ice_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Ice Blast",
      "fullName": "Epic.Ice_Mastery.Ice_Blast",
      "rank": 1,
      "available": 34,
      "description": "Ice Blast hurls shards of ice at foes and Slows their attacks and movement for a time. Slower recharge than Ice Bolt, but more damage.",
      "shortHelp": "Ranged, DMG(Cold), Foe -Recharge, -SPD",
      "icon": "ice_mastery_iceblast.png",
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
        "Ranged Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 8.0,
        "endurance": 6.5,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Cold",
          "scale": 1.889,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Hibernate",
      "fullName": "Epic.Ice_Mastery.Hibernate",
      "rank": 2,
      "available": 34,
      "description": "When you activate this power, you encase yourself in a block of solid ice, making yourself invulnerable, though you are frozen solid and cannot act. While Hibernating within this block of ice, you heal damage and recover endurance at an incredible rate. You can emerge at will by deactivating the power, but you cannot Hibernate for more than 30 seconds. If you activate this power while in the air, you will fall.",
      "shortHelp": "Toggle: Self +Regeneration, +Recovery, Invulnerable; Self Hold",
      "icon": "ice_mastery_hibernate.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Controller",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 240.0,
        "endurance": 0.1625,
        "activationTime": 0.07,
        "effectArea": "SingleTarget",
        "regeneration": {
          "scale": 10.0,
          "table": "Melee_Ones"
        },
        "recovery": {
          "scale": 4.0,
          "table": "Melee_Ones"
        },
        "resistance": {},
        "protection": {
          "knockup": 1.0,
          "knockback": 1.0,
          "immobilize": 1000.0
        }
      }
    },
    {
      "name": "Frozen Armor",
      "fullName": "Epic.Ice_Mastery.Frozen_Armor",
      "rank": 3,
      "available": 37,
      "description": "While this power is active, you coat yourself in rock hard Frozen Armor. The hardness of the Frozen Armor offers good defense to Smashing and Lethal attack as well as reduces Cold damage. Also, Fire attacks deal slightly less damage. You must be level 38 and have one other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Def(Smash, Lethal), +Res(Cold, Fire)",
      "icon": "ice_mastery_frozenarmor.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Defense Sets",
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 8.0,
        "endurance": 0.1625,
        "activationTime": 0.73,
        "effectArea": "SingleTarget",
        "resistance": {
          "cold": {
            "scale": 3.0,
            "table": "Melee_Res_Dmg"
          },
          "fire": {
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
      "name": "Frost Breath",
      "fullName": "Epic.Ice_Mastery.Frost_Breath",
      "rank": 4,
      "available": 40,
      "description": "Unleashes a cone of frosty breath that can Slow your opponents' movement and attacks. Very accurate and very deadly at medium range. You must have two other Ice Mastery power to select this power. You must be level 41 and have one other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Close (Cone), DoT(Cold), Foe -Recharge, -SPD",
      "icon": "ice_mastery_frostbreath.png",
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
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 40.0,
        "recharge": 32.0,
        "endurance": 18.98,
        "activationTime": 2.67,
        "effectArea": "Cone",
        "radius": 40.0,
        "arc": 0.5236,
        "damage": {
          "type": "Cold",
          "scale": 0.5477,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Ice Storm",
      "fullName": "Epic.Ice_Mastery.Ice_Storm",
      "rank": 5,
      "available": 43,
      "description": "Shred your foes with this Ice Storm. This power deals a lot of damage in a large area and can Slow all affected targets movement and attack speed. You must be level 44 and have two other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Ranged (Location AoE), DoT(Cold), Foe -Recharge, -SPD",
      "icon": "ice_mastery_icestorm.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage"
      ],
      "allowedSetCategories": [
        "Ranged AoE Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 2.0,
        "range": 60.0,
        "recharge": 120.0,
        "endurance": 19.5,
        "activationTime": 2.03,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['ice_mastery'] = EPIC_ICE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
