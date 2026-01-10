/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Speed
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\speed
 */

const POOL_SPEED = {
  "id": "speed",
  "name": "Speed",
  "displayName": "Speed",
  "description": "Grants you various feats of super speed.",
  "icon": "speed_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Flurry",
      "fullName": "Pool.Speed.Flurry",
      "rank": 1,
      "available": 0,
      "description": "Unleashes a super fast Flurry of punches to pummel your foe. Flurry is so dizzying that it has a chance to Disorient the target.<br><br><color #fcfc95>Damage: Light.</color><br><color #fcfc95>Recharge: Very Fast.</color>",
      "shortHelp": "Melee, Light DMG(Smash), Foe Disorient",
      "icon": "superspeed_flurry.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Damage",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Melee Damage",
        "Stuns",
        "Universal Damage Sets"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 7.0,
        "recharge": 3.0,
        "endurance": 5.46,
        "activationTime": 3.07,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Smashing",
          "scale": 2.669,
          "table": "Melee_PvPDamage"
        },
        "protection": {
          "stun": 2.0
        }
      }
    },
    {
      "name": "Hasten",
      "fullName": "Pool.Speed.Hasten",
      "rank": 2,
      "available": 0,
      "description": "You can reduce the recharge time of all powers for 2 minutes. Although Hasten does not cost any Endurance to activate, you can tire easily since your Endurance does not recover more rapidly. After Hasten wears off, you become tired and will lose some Endurance.<br><br><color #fcfc95>Recharge: Very Long.</color>",
      "shortHelp": "Self +Recharge",
      "icon": "superspeed_acceleratedcombat.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 450.0,
        "activationTime": 0.73,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Super Speed",
      "fullName": "Pool.Speed.Super_Speed",
      "rank": 3,
      "available": 4,
      "description": "You can run at super-human speeds! While running at such speeds, you are a blur, and many foes will not even notice you as you speed past them. As you run, you build momentum, allowing you to jump great distances, but only for a limited time. If you attack a target while this power is on, you will temporarily be slowed to normal speed. Super Speed also increases your maximum run speed by 30% and gives you access to the Speed Phase power whilst it is active.<br><br>Super Speed can be active at the same time as other run speed toggles, but only the strongest run speed buff will apply.",
      "shortHelp": "Toggle: Self +Speed",
      "icon": "superspeed_superspeed.png",
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
        },
        "jumpHeight": {
          "scale": 0.1,
          "table": "Melee_Leap"
        },
        "jumpSpeed": {
          "scale": 0.075,
          "table": "Melee_SpeedJumping"
        }
      }
    },
    {
      "name": "Speed Phase",
      "fullName": "Pool.Speed.SpeedPhase",
      "rank": 4,
      "available": -1,
      "description": "Speed Phase allows you to vibrate the atoms in your own body so quickly that you can pass straight through both allies and enemies. Whilst in this state you are unable to affect anyone but yourself, but can still be attacked by foes.",
      "shortHelp": "Self Phase (Special)",
      "icon": "superspeed_speedphase.png",
      "powerType": "Toggle",
      "requires": "Pool.Speed.Super_Speed",
      "maxSlots": 6,
      "allowedEnhancements": [],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "endurance": 0.3333,
        "activationTime": 0.5,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Whirlwind",
      "fullName": "Pool.Speed.Whirlwind",
      "rank": 5,
      "available": 13,
      "description": "You spin around at an amazing speed to create a Whirlwind around yourself. Any foes that enter this Whirlwind will be tossed into the air.<br><br>You must be at least level 14 and have two other Speed Powers before selecting Whirlwind.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Toggle: PBAoE, Foe Knockback",
      "icon": "superspeed_whirlwind.png",
      "powerType": "Toggle",
      "requires": "Pool.Speed.Flurry && Pool.Speed.Hasten || Pool.Speed.Flurry && Pool.Speed.Super_Speed || Pool.Speed.Hasten && Pool.Speed.Super_Speed",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [
        "Knockback"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 20.0,
        "endurance": 0.4875,
        "activationTime": 1.0,
        "effectArea": "AoE",
        "radius": 7.0,
        "runSpeed": {
          "scale": -0.3,
          "table": "Melee_Ones"
        }
      }
    },
    {
      "name": "Burnout",
      "fullName": "Pool.Speed.Burnout",
      "rank": 6,
      "available": 13,
      "description": "Burnout allows you to instantly recharge all of your Primary and Secondary powers. Burnout is very expensive in terms of endurance, and reduces your maximum endurance slightly for 60 seconds after use.<br><br>You must be at least level 14 and have two other Speed Powers before selecting Burnout.<br><br><color #fcfc95>Recharge: Extremely Long.</color>",
      "shortHelp": "Self +Recharge",
      "icon": "superspeed_burnout.png",
      "powerType": "Click",
      "requires": "Pool.Speed.Flurry && Pool.Speed.Hasten || Pool.Speed.Flurry && Pool.Speed.Super_Speed || Pool.Speed.Hasten && Pool.Speed.Super_Speed",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 1800.0,
        "endurance": 48.75,
        "activationTime": 1.0,
        "effectArea": "SingleTarget"
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['speed'] = POOL_SPEED;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
