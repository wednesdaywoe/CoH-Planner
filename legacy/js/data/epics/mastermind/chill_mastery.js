/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Ice Mastery
 * Archetype: Mastermind
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\chill_mastery
 */

const EPIC_CHILL_MASTERY = {
  "id": "chill_mastery",
  "name": "Ice Mastery",
  "displayName": "Ice Mastery",
  "archetype": "mastermind",
  "description": "You have Mastery over Ice and Cold to control your foes and to add some much needed armor and defense.",
  "icon": "chill_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Ice Blast",
      "fullName": "Epic.Chill_Mastery.Ice_Blast",
      "rank": 1,
      "available": 34,
      "description": "Ice Blast hurls shards of ice at foes and Slows their attacks and movement for a time. Slower recharge than Ice Bolt, but more damage.",
      "shortHelp": "Ranged, DMG(Cold), Foe -Recharge, -SPD",
      "icon": "ice_mastery_iceblast.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Mastermind",
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
      "name": "Flash Freeze",
      "fullName": "Epic.Chill_Mastery.Flash_Freeze",
      "rank": 2,
      "available": 34,
      "description": "You can Flash Freeze a large patch of ground beneath a targeted foe, instantly forming dozens of deadly ice shards that do Cold damage to all enemies in the area. The victims are left trapped within the icicles, but can break free if disturbed. Only targets near the ground can be affected.<br><br><color #fcfc95>Notes:<br>The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
      "shortHelp": "Ranged (Targeted AoE), DMG(Cold/Lethal), Foe Sleep",
      "icon": "ice_mastery_flashfreeze.png",
      "powerType": "Click",
      "requires": "$archetype == @Class_Mastermind",
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
        "Ranged AoE Damage",
        "Sleep",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 90.0,
        "endurance": 19.5,
        "activationTime": 2.37,
        "effectArea": "AoE",
        "radius": 25.0,
        "protection": {
          "sleep": 3.0
        },
        "damage": {
          "type": "Cold",
          "scale": 1.1914,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Hoarfrost",
      "fullName": "Epic.Chill_Mastery.Hoarfrost",
      "rank": 3,
      "available": 37,
      "description": "Activating this power covers you in a thick layer of Hoarfrost. The frost can absorb the impact from enemy attacks, effectively increasing your maximum Hit Points for a short time. Hoarfrost also grants you resistance to Toxic Damage. You must be level 38 and have one other Ice Mastery Powers before selecting this power.",
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
      "name": "Frozen Armor",
      "fullName": "Epic.Chill_Mastery.Snow_Storm",
      "rank": 4,
      "available": 40,
      "description": "While this power is active, you coat yourself in rock hard Frozen Armor. The hardness of the Frozen Armor offers good defense to Smashing and Lethal attack as well as reduces Cold damage. Also, Fire attacks deal slightly less damage. You must be level 41 and have one other Ice Mastery Powers before selecting this power.",
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
            "scale": 1.0,
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
      "name": "Hibernate",
      "fullName": "Epic.Chill_Mastery.Hibernate",
      "rank": 5,
      "available": 43,
      "description": "When you activate this power, you encase yourself in a block of solid ice, making yourself invulnerable, though you are frozen solid and cannot act. While Hibernating within this block of ice, you heal damage and recover endurance at an incredible rate. You can emerge at will by deactivating the power, but you cannot Hibernate for more than 30 seconds. If you activate this power while in the air, you will fall. You must be level 44 and have two other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Toggle: Self +Regeneration, +Recovery, Invulnerable; Self Hold",
      "icon": "ice_mastery_hibernate.png",
      "powerType": "Toggle",
      "requires": "ownPowerNum?(Epic) > 1",
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
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['chill_mastery'] = EPIC_CHILL_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
