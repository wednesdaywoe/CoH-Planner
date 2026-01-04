/**
 * City of Heroes: Homecoming - Epic Power Pool
 * Pool: Ice Mastery
 * Archetype: Defender
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\epic\defender_ice_mastery
 */

const EPIC_DEFENDER_ICE_MASTERY = {
  "id": "defender_ice_mastery",
  "name": "Ice Mastery",
  "displayName": "Ice Mastery",
  "archetype": "defender",
  "description": "You have Mastery over Ice and Cold to control your foes and to add some much needed armor and defense.",
  "icon": "chill_mastery_set.png",
  "requires": "",
  "minLevel": 35,
  "powers": [
    {
      "name": "Frozen Armor",
      "fullName": "Epic.Defender_Ice_Mastery.Frozen_Armor",
      "rank": 1,
      "available": 34,
      "description": "While this power is active, you coat yourself in rock hard Frozen Armor. The hardness of the Frozen Armor offers good defense to Smashing and Lethal attack as well as reduces Cold damage. Also, Fire attacks deal slightly less damage.",
      "shortHelp": "Toggle: Self +Def(Smash, Lethal), +Res(Cold, Fire)",
      "icon": "ice_mastery_frozenarmor.png",
      "powerType": "Toggle",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
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
      "name": "Flash Freeze",
      "fullName": "Epic.Defender_Ice_Mastery.Flash_Freeze",
      "rank": 2,
      "available": 34,
      "description": "You can Flash Freeze a large patch of ground beneath a targeted foe, instantly forming dozens of deadly ice shards that do Cold damage to all enemies in the area. The victims are left trapped within the icicles, but can break free if disturbed. Only targets near the ground can be affected.<br><br><color #fcfc95>Notes:<br>The Sleep component of this power is Auto Hit against regular enemies, but a To Hit check is required to against AVs and players, as well as to make secondary effects apply.</color>",
      "shortHelp": "Ranged (Targeted AoE), DMG(Cold), Foe Sleep",
      "icon": "ice_mastery_flashfreeze.png",
      "powerType": "Click",
      "requires": "($archetype == @Class_Corruptor) || ($archetype == @Class_Defender)",
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
        "damage": {
          "type": "Cold",
          "scale": 0.2,
          "table": "Ranged_Damage"
        },
        "protection": {
          "sleep": 4.0
        }
      }
    },
    {
      "name": "Hoarfrost",
      "fullName": "Epic.Defender_Ice_Mastery.Hoarfrost",
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
      "name": "Build Up",
      "fullName": "Epic.Defender_Ice_Mastery.Ice_Slick",
      "rank": 4,
      "available": 40,
      "description": "Greatly increases the amount of damage you deal for a few seconds, as well as slightly increasing your Accuracy.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Self +DMG, +To Hit",
      "icon": "ice_mastery_buildup.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 0",
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
        "recharge": 180.0,
        "endurance": 6.5,
        "activationTime": 1.17,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Ice Elemental",
      "fullName": "Epic.Defender_Ice_Mastery.Ice_Elemental",
      "rank": 5,
      "available": 43,
      "description": "You can create a very powerful entity of animated ice at a targeted location. Ice Elemental possesses several ice powers to attack any nearby foes and can be healed and buffed like any teammate. You must be level 44 and have two other Ice Mastery Powers before selecting this power.",
      "shortHelp": "Summon Ice Elemental: Melee DMG(Lethal/Cold)",
      "icon": "ice_mastery_iceelemental.png",
      "powerType": "Click",
      "requires": "ownPowerNum?(Epic) > 1",
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
        "Pet Damage",
        "Recharge Intensive Pets",
        "Slow Movement",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 900.0,
        "endurance": 26.0,
        "activationTime": 1.87,
        "effectArea": "Location"
      }
    }
  ]
};

// Register epic pool
if (typeof EPIC_POOLS !== 'undefined') {
    EPIC_POOLS['defender_ice_mastery'] = EPIC_DEFENDER_ICE_MASTERY;
} else {
    console.error('EPIC_POOLS registry not found. Make sure epic-pools.js is loaded first.');
}
