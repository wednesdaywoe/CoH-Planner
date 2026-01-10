/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Ice Mastery
 * Archetype: Dominator
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\ice_mastery_dominator
 */

const EPIC_ICE_MASTERY_DOMINATOR = {
  "id": "ice_mastery_dominator",
  "name": "Ice Mastery",
  "displayName": "Ice Mastery",
  "archetype": "dominator",
  "description": "You have Mastery over Ice to blast your foes and to add some much needed armor and defense.",
  "icon": "ice_mastery_dominator_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Sleet",
      "fullName": "Epic.Ice_Mastery_Dominator.Ice_Blast",
      "rank": 1,
      "available": 34,
      "description": "Summons a Sleet Storm at a targeted location. Sleet deals minimal Cold damage to anything that passes through the storm. It also Slows the affected foes and severely reduces their Defense and resistance to damage. Many foes may even slip and fall trying to escape the storm.",
      "shortHelp": "Ranged (Location AoE), Minor DoT(Cold), Foe -Speed, -Recharge, -DEF -Res",
      "icon": "ice_mastery_sleet.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Dominator",
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
        "Ranged AoE Damage",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 120.0,
        "endurance": 22.659,
        "activationTime": 2.03,
        "effectArea": "Location"
      }
    },
    {
      "name": "Hibernate",
      "fullName": "Epic.Ice_Mastery_Dominator.Hibernate",
      "rank": 2,
      "available": 34,
      "description": "When you activate this power, you encase yourself in a block of solid ice, making yourself invulnerable, though you are frozen solid and cannot act. While Hibernating within this block of ice, you heal damage and recover endurance at an incredible rate. You can emerge at will by deactivating the power, but you cannot Hibernate for more than 30 seconds. If you activate this power while in the air, you will fall.",
      "shortHelp": "Toggle: Self +Regeneration, +Recovery, Invulnerable; Self Hold",
      "icon": "ice_mastery_hibernate.png",
      "powerType": "Toggle",
      "requires": "$archetype == @Class_Dominator",
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
      "fullName": "Epic.Ice_Mastery_Dominator.Frozen_Armor",
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
      "name": "Hoarfrost",
      "fullName": "Epic.Ice_Mastery_Dominator.Frost_Breath",
      "rank": 4,
      "available": 40,
      "description": "Activating this power covers you in a thick layer of Hoarfrost. The frost can absorb the impact from enemy attacks, effectively increasing your maximum Hit Points for a short time. Hoarfrost also grants you resistance to Toxic Damage. You must be level 41 and have one other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Self Heal, +Max HP, Res(Toxic)",
      "icon": "ice_mastery_hoarfrost.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing",
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 540.0,
        "endurance": 18.2,
        "activationTime": 0.73,
        "effectArea": "SingleTarget",
        "resistance": {
          "toxic": {
            "scale": 1.5,
            "table": "Melee_Res_Dmg"
          }
        },
        "damage": {
          "type": "Heal",
          "scale": 3.0,
          "table": "Melee_HealSelf"
        }
      }
    },
    {
      "name": "Ice Storm",
      "fullName": "Epic.Ice_Mastery_Dominator.Ice_Storm",
      "rank": 5,
      "available": 43,
      "description": "Shred your foes with this Ice Storm. This power deals a lot of damage in a large area and can Slow all affected targets movement and attack speed. You must be level 44 and have two other Ice Mastery Powers before selecting this power. You must be level 44 and have two other Ice Mastery Powers before selecting this power.",
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
    EPIC_POOLS['ice_mastery_dominator'] = EPIC_ICE_MASTERY_DOMINATOR;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
