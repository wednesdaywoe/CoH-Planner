/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Presence
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\manipulation
 */

const POOL_MANIPULATION = {
  "id": "manipulation",
  "name": "Presence",
  "displayName": "Presence",
  "description": "You have an impressive presence that manifests in a variety of ways. Whether through charm, persuasion or outright intimidation, you can manipulate your foes' desire to fight you. Though this is a challenging set to master, and can get you into trouble if used injudiciously, the potential benefits are great.",
  "icon": "manipulation_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Pacify",
      "fullName": "Pool.Manipulation.Challenge",
      "rank": 1,
      "available": 0,
      "description": "Through persuasion or subtle intimidation, you attempt to placate a single target for a short time. If successful, the affected target will no longer attack you. This persists until the effect expires or you attack the target. Unlike other placation effects, this power will not hide you or give any concealment bonuses.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Ranged, Placate (Foe)",
      "icon": "manipulation_placate.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Threat Duration"
      ],
      "effects": {
        "accuracy": 1.2,
        "range": 60.0,
        "recharge": 60.0,
        "endurance": 6.5,
        "activationTime": 1.67,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Provoke",
      "fullName": "Pool.Manipulation.Provoke",
      "rank": 2,
      "available": 0,
      "description": "When you have established that a fight is absolutely necessary, you step up to take the lead, provoking the attention of several targets at a targeted location. Use this to pull the attention of your foes off of an ally in trouble. This provocation effect is not as powerful as similar powers used by Tankers, and also has a chance to miss.<br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Targeted AoE, Taunt (Foe)",
      "icon": "manipulation_provoke.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "Range",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Threat Duration"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 10.0,
        "activationTime": 1.67,
        "effectArea": "AoE",
        "radius": 15.0
      }
    },
    {
      "name": "Intimidate",
      "fullName": "Pool.Manipulation.Intimidate",
      "rank": 3,
      "available": 13,
      "description": "When fully engaged in battle, you are a frightening presence and can use this to your advantage. You threaten a single foe and cause that foe to tremble helplessly in fear for a short time.<br><br>You must be at least level 14 and have one other Presence power before selecting Intimidate.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Ranged, Fear (Foe)",
      "icon": "manipulation_intimidate.png",
      "powerType": "Click",
      "requires": "Pool.Manipulation.Challenge || Pool.Manipulation.Provoke",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Range",
        "Recharge",
        "Fear",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Fear"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 60.0,
        "recharge": 30.0,
        "endurance": 10.0,
        "activationTime": 1.67,
        "effectArea": "SingleTarget",
        "protection": {
          "fear": 2.0
        }
      }
    },
    {
      "name": "Invoke Panic",
      "fullName": "Pool.Manipulation.Invoke_Panic",
      "rank": 4,
      "available": 13,
      "description": "When fully engaged in battle, you are a frightening presence and can use this to your advantage. This power causes sheer terror in all foes around you, causing them to tremble uncontrollably in fear.<br><br>You must be at least level 14 and have two other Presence powers before selecting Invoke Panic.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "PBAoE, Fear (Foe)",
      "icon": "manipulation_invokepanic.png",
      "powerType": "Click",
      "requires": "Pool.Manipulation.Challenge && Pool.Manipulation.Intimidate || Pool.Manipulation.Challenge && Pool.Manipulation.Provoke || Pool.Manipulation.Intimidate && Pool.Manipulation.Provoke",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Fear",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Fear"
      ],
      "effects": {
        "accuracy": 0.9,
        "recharge": 60.0,
        "endurance": 18.0,
        "activationTime": 1.97,
        "effectArea": "AoE",
        "radius": 20.0,
        "protection": {
          "fear": 2.0
        }
      }
    },
    {
      "name": "Unrelenting",
      "fullName": "Pool.Manipulation.Unrelenting",
      "rank": 5,
      "available": 13,
      "description": "You channel your inner confidence to become a relentless opponent, gaining significant boosts to your damage, recovery and attack speed for a short while. Additionally, you will be able to fight though the pain caused by opponents, healing continuously over time. You can also use this power to fight your way back to the living after defeat - if you are defeated when you use this power, you will be revived with 50% health.<br><br>You must be at least level 14 and have two other Presence powers before selecting Unrelenting.<br><br><color #fcfc95>Recharge: Very Long.</color>",
      "shortHelp": "Self, Heal over Time, +DMG(All), +Rech, +Rec, Self Resurrect (Special)",
      "icon": "manipulation_unrelenting.png",
      "powerType": "Click",
      "requires": "Pool.Manipulation.Challenge && Pool.Manipulation.Intimidate || Pool.Manipulation.Challenge && Pool.Manipulation.Invoke_Panic || Pool.Manipulation.Challenge && Pool.Manipulation.Provoke || Pool.Manipulation.Intimidate && Pool.Manipulation.Invoke_Panic || Pool.Manipulation.Intimidate && Pool.Manipulation.Provoke || Pool.Manipulation.Invoke_Panic && Pool.Manipulation.Provoke",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceModification",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Endurance Modification",
        "Healing"
      ],
      "effects": {
        "accuracy": 2.0,
        "recharge": 600.0,
        "activationTime": 1.97,
        "effectArea": "SingleTarget",
        "recovery": {
          "scale": 0.2,
          "table": "Melee_Ones"
        }
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['manipulation'] = POOL_MANIPULATION;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
