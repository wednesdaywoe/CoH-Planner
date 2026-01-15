/**
 * City of Heroes: Homecoming - Power Pool
 * Pool: Medicine
 * 
 * Auto-generated from game data
 * Source: C:\Projects\Raw Data Homecoming\powers\pool\medicine
 */

const POOL_MEDICINE = {
  "id": "medicine",
  "name": "Medicine",
  "displayName": "Medicine",
  "description": "You become an adept field medic, and can assist your team with basic healing needs. These close range powers should be performed away from combat because they can be interrupted.",
  "icon": "medicine_set.png",
  "requires": "",
  "powers": [
    {
      "name": "Aid Other",
      "fullName": "Pool.Medicine.Aid_Other",
      "rank": 1,
      "available": 0,
      "description": "You heal a single targeted ally. This power is interruptible unless you have also trained Field Medic, in which case it is not interruptible.<br><br><color #fcfc95>Recharge: Moderate.</color>",
      "shortHelp": "Close, Heal(Ally)",
      "icon": "medicine_aid.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 25.0,
        "recharge": 10.0,
        "endurance": 6.5,
        "activationTime": 3.93,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Injection",
      "fullName": "Pool.Medicine.Stimulant",
      "rank": 2,
      "available": 0,
      "description": "You fire a small dart at a target. The dart is set up to release a beneficial serum or deleterious toxin, depending on whether it strikes friend or foe.<br><br>If striking a friend, the ally is freed from any Immobilization, Sleep, Disorient, Hold, Fear or Confuse effects and is resistant to such effects for a brief time.<br><br>If striking a foe, the enemy suffers reduced damage potential, attack speed and chance to hit.<br><br>The serum's effects will improve with multiple applications from you, but the toxin's do not. The toxin's effect is also shorter in duration than the serum's effect. Both serum and toxin improve as you advance in level.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Ranged, +Status Protection(Ally, PvE), +Status Resistance(Ally, PvP) OR -DMG(Foe, All), -Rech(Foe), -ToHit(Foe)",
      "icon": "medicine_injection.png",
      "powerType": "Click",
      "requires": "",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge",
        "Accuracy"
      ],
      "allowedSetCategories": [
        "Accurate To-Hit Debuff",
        "Slow Movement",
        "To Hit Debuff"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 40.0,
        "recharge": 12.0,
        "endurance": 13.0,
        "activationTime": 2.93,
        "effectArea": "SingleTarget",
        "protection": {
          "confuse": 1.0,
          "fear": 1.0,
          "hold": 1.0,
          "immobilize": 1.0,
          "stun": 1.0,
          "sleep": 1.0
        },
        "resistance": {}
      }
    },
    {
      "name": "Aid Self",
      "fullName": "Pool.Medicine.Aid_Self",
      "rank": 3,
      "available": 13,
      "description": "You are able to heal yourself. This hypo also leaves you wide awake and resistant to stun effects. If you have also trained Field Medic, this power will also grant you an unenhanceable, long duration endurance over time effect.<br><br>You must be at least level 14 and have one other Medicine powers before selecting Aid Self.<br><br><color #fcfc95>Recharge: Slow.</color>",
      "shortHelp": "Self, Heal, +Res(Stun), +EndGain(Synergy)",
      "icon": "medicine_selfadministration.png",
      "powerType": "Click",
      "requires": "Pool.Medicine.Aid_Other || Pool.Medicine.Stimulant",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "recharge": 20.0,
        "endurance": 13.0,
        "activationTime": 4.33,
        "effectArea": "SingleTarget",
        "damage": {
          "type": "Heal",
          "scale": 1.96,
          "table": "Melee_HealSelf"
        },
        "resistance": {}
      }
    },
    {
      "name": "Resuscitate",
      "fullName": "Pool.Medicine.Resuscitate",
      "rank": 4,
      "available": 13,
      "description": "You revive a fallen ally, restoring health, but not endurance, completely. The target will also be protected from incurring any XP Debt for 15 seconds. This power is interruptible.<br><br>You must be at least level 14 and have two other Medicine Powers before selecting Resuscitate.<br><br><color #fcfc95>Recharge: Long.</color>",
      "shortHelp": "Close, Resurrect(Ally)",
      "icon": "medicine_smellingsalts.png",
      "powerType": "Click",
      "requires": "Pool.Medicine.Aid_Other && Pool.Medicine.Aid_Self || Pool.Medicine.Aid_Other && Pool.Medicine.Stimulant || Pool.Medicine.Aid_Self && Pool.Medicine.Stimulant",
      "maxSlots": 6,
      "allowedEnhancements": [
        "InterruptReduction",
        "EnduranceReduction",
        "Recharge",
        "Heal"
      ],
      "allowedSetCategories": [
        "Healing"
      ],
      "effects": {
        "accuracy": 1.0,
        "range": 15.0,
        "recharge": 180.0,
        "endurance": 32.5,
        "activationTime": 7.33,
        "effectArea": "SingleTarget"
      }
    },
    {
      "name": "Field Medic",
      "fullName": "Pool.Medicine.Field_Medic",
      "rank": 5,
      "available": 13,
      "description": "Your skill as a Field Medic is unparalleled. In addition to permanently removing the interrupt time Aid Other and adding Endurance recovery to Aid Self, using this power will grant a powerful boost in the effectiveness of your healing powers and reduce your resistance to healing debuffs.<br><br>You must be at least level 14 and have trained any two other Medicine powers before you can train as a Field Medic.<br><br><color #fcfc95>Recharge: Very Long.</color>",
      "shortHelp": "Self, +Heal, -Res(Heal), Special",
      "icon": "medicine_fieldmedic.png",
      "powerType": "Click",
      "requires": "Pool.Medicine.Aid_Other && Pool.Medicine.Aid_Self || Pool.Medicine.Aid_Other && Pool.Medicine.Resuscitate || Pool.Medicine.Aid_Other && Pool.Medicine.Stimulant || Pool.Medicine.Aid_Self && Pool.Medicine.Resuscitate || Pool.Medicine.Aid_Self && Pool.Medicine.Stimulant || Pool.Medicine.Resuscitate && Pool.Medicine.Stimulant",
      "maxSlots": 6,
      "allowedEnhancements": [
        "EnduranceReduction",
        "Recharge"
      ],
      "allowedSetCategories": [],
      "effects": {
        "accuracy": 1.0,
        "recharge": 300.0,
        "endurance": 19.5,
        "activationTime": 3.33,
        "effectArea": "SingleTarget",
        "resistance": {}
      }
    }
  ]
};

// Register pool
if (typeof POWER_POOLS !== 'undefined') {
    POWER_POOLS['medicine'] = POOL_MEDICINE;
} else {
    console.error('POWER_POOLS registry not found. Make sure power-pools.js is loaded first.');
}
