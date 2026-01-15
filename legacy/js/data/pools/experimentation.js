/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Experimentation
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\experimentation
 */

const POOL_EXPERIMENTATION = {
  "id": "experimentation",
  "name": "Experimentation",
  "displayName": "Experimentation",
  "description": "Experimentation gives you access to poisonous ranged attacks as well as powers that boost your attack power and the survivability of your allies. This pool's travel power is Speed of Sound. While active, this power allows you to run at incredible speeds and also gives you access to the Jaunt power. Jaunt allows you to quickly teleport long distances once every so often.",
  "icon": "experimentation_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Experimental Injection",
      "fullName": "Pool.Experimentation.Experimental_Injection",
      "rank": 1,
      "available": 0,
      "description": "You inject an ally with a compound that greatly boosts their regeneration, recovery and resistance to status effects for a short time.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Melee Ranged, Ally +Regeneration, +Recovery, +Res(Status)",
      "icon": "experimentation_experimentalinjection.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 10.0,
        "recharge": 180.0,
        "endurance": 10.4,
        "activationTime": 1.36,
        "effectArea": "SingleTarget",
        "protection": {
          "confuse": 1.0,
          "fear": 1.0,
          "hold": 1.0,
          "immobilize": 1.0,
          "stun": 1.0,
          "sleep": 1.0
        },
        "resistance": {},
        "regeneration": {
          "scale": 0.5,
          "table": "Ranged_Ones"
        },
        "recovery": {
          "scale": 0.25,
          "table": "Ranged_Ones"
        }
      }
    },
    {
      "name": "Toxic Dart",
      "fullName": "Pool.Experimentation.Toxic_Dart",
      "rank": 2,
      "available": 0,
      "description": "You fire a toxic dart at your target causing an very minor amount of immediate lethal damage followed by a High amount of toxic damage over time.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Fast.</color>",
      "shortHelp": "Ranged, Light DMG(Lethal), High(Toxic)",
      "icon": "experimentation_toxicdart.png",
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
        "Ranged Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 4.0,
        "endurance": 6.5,
        "activationTime": 1.07,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Lethal",
          "scale": 1.309,
          "table": "Ranged_PvPDamage"
        }
      }
    },
    {
      "name": "Speed of Sound",
      "fullName": "Pool.Experimentation.Speed_of_Sound",
      "rank": 3,
      "available": 4,
      "description": "Your experiments have yielded incredible results. By activating this power, you're able to run at incredible speeds. In fact, while this power is active, you gain access to the Jaunt power. Jaunt allows you to teleport to a distant location once every short while. Speed of Sound also increases your maximum run speed by 30% whilst it is active.<br><br>Speed of Sound can be active at the same time as other run speed toggles, but only the strongest run speed buff will apply.",
      "shortHelp": "Toggle: Self +Speed, (Special)",
      "icon": "experimentation_speedofsound.png",
      "powerType": "Toggle",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction"
      ],
      "allowedSetCategories": [
        "Running",
        "Running & Sprints",
        "Universal Travel"
      ],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.2275,
        "effectArea": "SingleTarget",
        "runSpeed": {
          "scale": 1.938,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Jaunt",
      "fullName": "Pool.Experimentation.Jaunt",
      "rank": 4,
      "available": -1,
      "description": "Clicking on this power and then selecting a location will cause the caster to vanish and reappear at their target location.<br><br><color #fcfc95>Notes: In PvP, this power will recharge in 20s.<br><br>Jaunt is unaffected by Recharge Time changes.</color><br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Click, Self Teleport",
      "icon": "experimentation_jaunt.png",
      "powerType": "Click",
      "requires": "Pool.Experimentation.Speed_of_Sound",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "range": 200.0,
        "recharge": 10.0,
        "endurance": 13.0,
        "activationTime": 1.0,
        "effectArea": "Location"
      }
    },
    {
      "name": "Corrosive Vial",
      "fullName": "Pool.Experimentation.Corrosive_Vial",
      "rank": 5,
      "available": 13,
      "description": "You hurl a vial of toxic fluid that explodes upon impact leaving a corrosive puddle at your target's feet. Any foe that stands within the puddle will take toxic damage and have their defense reduced for a short while.<br><br><br><br>You must be at least level 14 and have two other Experimentation powers before selecting Corrosive Vial.<br><br><color #fcfc95>Damage: High (DoT).</color><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Ranged (Targeted AoE), High DoT(Toxic), -Defense",
      "icon": "experimentation_corrosivevial.png",
      "powerType": "Click",
      "requires": "Pool.Experimentation.Experimental_Injection && Pool.Experimentation.Speed_of_Sound || Pool.Experimentation.Experimental_Injection && Pool.Experimentation.Toxic_Dart || Pool.Experimentation.Speed_of_Sound && Pool.Experimentation.Toxic_Dart",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Damage"
      ],
      "allowedSetCategories": [
        "Defense Debuff",
        "Ranged AoE Damage",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 80.0,
        "recharge": 60.0,
        "endurance": 20.8,
        "activationTime": 1.53,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Adrenal Booster",
      "fullName": "Pool.Experimentation.Adrenal_Booster",
      "rank": 6,
      "available": 19,
      "description": "You inject yourself with a concentrated experimental serum that boosts your damage, recharge, chance to hit and secondary effects for a short time.<br><br>You must be at least level 20 and have two other Experimentation powers before selecting Adrenal Booster.<br><br><color #fcfc95>Recharge: Very Long.</color>",
      "shortHelp": "Self, +To Hit, +Recharge, +Damage, +Special",
      "icon": "experimentation_adrenalbooster.png",
      "powerType": "Click",
      "requires": "Pool.Experimentation.Experimental_Injection && Pool.Experimentation.Speed_of_Sound || Pool.Experimentation.Experimental_Injection && Pool.Experimentation.Toxic_Dart || Pool.Experimentation.Speed_of_Sound && Pool.Experimentation.Toxic_Dart",
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
        "recharge": 600.0,
        "endurance": 2.6,
        "activationTime": 1.3,
        "effectArea": "SingleTarget",
        "runSpeed": {
          "scale": 1.0,
          "table": "Melee_Res_Boolean"
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['experimentation'] = POOL_EXPERIMENTATION;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
