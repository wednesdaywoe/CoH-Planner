/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Sorcery
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\sorcery
 */

const POOL_SORCERY = {
  "id": "sorcery",
  "name": "Sorcery",
  "displayName": "Sorcery",
  "description": "Sorcery grants you access to several arcane powers that both weaken foes and empower allies. This power pool also grants you access to Mystic Flight as its travel power. Mystic Flight allows you to fly at moderate speeds. While this power is active you also gain access to Translocation, which allows you to teleport to distant locations.",
  "icon": "sorcery_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Spirit Ward",
      "fullName": "Pool.Sorcery.Spirit_Ward",
      "rank": 1,
      "available": 0,
      "description": "You encompass an ally in a mystical Spirit Ward, which causes them to gain a moderate amount of damage absorption instantly, in addition to a small amount of damage absorption every few seconds while the power is active.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Toggle: Ally, +Absorb over time",
      "icon": "sorcerypool_spiritward.png",
      "powerType": "Toggle",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 15.0,
        "endurance": 0.78,
        "activationTime": 2.0,
        "effectArea": "AoE"
      }
    },
    {
      "name": "Arcane Bolt",
      "fullName": "Pool.Sorcery.Arcane_Bolt",
      "rank": 2,
      "available": 0,
      "description": "You channel arcane energies into a concentrated blast and release them upon your target dealing Moderate energy damage and possibly knocking them down. <br><br>When you acquire this power, any power you activate will have a chance to grant you Arcane Power. When empowered with Arcane Power, Arcane Bolt will be recharged and using it will inflict bonus damage.<br><br><color #fcfc95>Damage: Moderate.</color><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Ranged, Moderate DMG(Energy), Foe Knockdown",
      "icon": "sorcerypool_arcanebolt.png",
      "powerType": "Click",
      "requires": "",
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
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 7.0,
        "endurance": 9.62,
        "activationTime": 1.73,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Energy",
          "scale": 1.891,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Arcane Power",
      "fullName": "Pool.Sorcery.Arcane_Proc",
      "rank": 3,
      "available": -1,
      "description": "Fate has granted you with a boost to your Arcane Power, empowering your next use of Arcane Bolt",
      "shortHelp": "Special",
      "icon": "sorcerypool_arcanebolt.png",
      "powerType": "Auto",
      "requires": "Pool.Sorcery.Arcane_Bolt",
      "maxSlots": 0,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 7.0,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Mystic Flight",
      "fullName": "Pool.Sorcery.Mystic_Flight",
      "rank": 4,
      "available": 4,
      "description": "Using powerful magic you are able to lift yourself from the ground and fly. While Mystic Flight is active you can use Translocation to teleport to a distant location. Mystic Flight also increases your maximum flying speed by 50% whilst it is active.<br><br>Mystic Flight can be active at the same time as other flight toggles, but only the strongest flight speed buff will apply.",
      "shortHelp": "Toggle: Self Fly, (Special)",
      "icon": "sorcerypool_mysticflight.png",
      "powerType": "Toggle",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction"
      ],
      "allowedSetCategories": [
        "Flight",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.2275,
        "effectArea": "SingleTarget",
        "flySpeed": {
          "scale": 2.0475,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Translocation",
      "fullName": "Pool.Sorcery.Translocation",
      "rank": 5,
      "available": -1,
      "description": "Clicking on this power and then selecting a location will cause the caster to vanish and reappear at their target location.",
      "shortHelp": "Click, Self Teleport",
      "icon": "sorcerypool_translocation.png",
      "powerType": "Click",
      "requires": "Pool.Sorcery.Mystic_Flight",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "range": 350.0,
        "endurance": 9.75,
        "activationTime": 1.57,
        "effectArea": "Location"
      }
    },
    {
      "name": "Enflame",
      "fullName": "Pool.Sorcery.Enflame",
      "rank": 6,
      "available": 13,
      "description": "This ritual allows you to imbue an ally or curse a foe with a fiery spell. If Enflame is cast on an ally or a foe they will leave a fiery trail behind them that will damage foes.<br><br>You can cancel this power at any time, or it will automatically end after 60 seconds.<br><br>You must be at least level 14 and have two other Sorcery powers before selecting Enflame.<br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Toggle: Ranged Friend/Foe, Special",
      "icon": "sorcerypool_enflame.png",
      "powerType": "Toggle",
      "requires": "Pool.Sorcery.Arcane_Bolt + Pool.Sorcery.Mystic_Flight + Pool.Sorcery.Spirit_Ward > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
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
        "range": 80.0,
        "recharge": 10.0,
        "endurance": 1.56,
        "activationTime": 2.07,
        "effectArea": "AoE",
        "radius": 8.0
      }
    },
    {
      "name": "Rune of Protection",
      "fullName": "Pool.Sorcery.Rune_of_Protection",
      "rank": 7,
      "available": 19,
      "description": "You cast a Rune of Projection upon yourself granting you protection from Hold, Sleep, Immobilize, Knockdown and Disorient effects as well as granting you a measure of damage resistance against all forms of damage for a short time.<br><br>You must be at least level 20 and have two other Sorcery powers before selecting Rune of Protection.<br><br><color #fcfc95>Notes: Rune of Protection is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Self, +Res(All Dmg, Hold, Sleep, Immobilize, Knockdown, Disorient)",
      "icon": "sorcerypool_runeofprotection.png",
      "powerType": "Click",
      "requires": "Pool.Sorcery.Arcane_Bolt + Pool.Sorcery.Mystic_Flight + Pool.Sorcery.Spirit_Ward > 1",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Resistance",
        "EnduranceReduction"
      ],
      "allowedSetCategories": [
        "Resist Damage"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 180.0,
        "endurance": 2.6,
        "activationTime": 2.03,
        "effectArea": "SingleTarget",
        "resistance": {
          "smashing": {
            "scale": 2.5,
            "table": "Ranged_Res_Dmg"
          },
          "lethal": {
            "scale": 2.5,
            "table": "Ranged_Res_Dmg"
          },
          "fire": {
            "scale": 2.5,
            "table": "Ranged_Res_Dmg"
          },
          "cold": {
            "scale": 2.5,
            "table": "Ranged_Res_Dmg"
          },
          "energy": {
            "scale": 2.5,
            "table": "Ranged_Res_Dmg"
          },
          "negative": {
            "scale": 2.5,
            "table": "Ranged_Res_Dmg"
          },
          "psionic": {
            "scale": 2.5,
            "table": "Ranged_Res_Dmg"
          },
          "toxic": {
            "scale": 2.5,
            "table": "Ranged_Res_Dmg"
          }
        },
        "protection": {
          "hold": 1.0,
          "immobilize": 1.0,
          "stun": 1.0,
          "sleep": 1.0,
          "knockup": 1.0,
          "knockback": 1.0
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['sorcery'] = POOL_SORCERY;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
