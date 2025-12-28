/**
 * City of Heroes: Empathy
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['empathy'] = {
    name: "Empathy",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Heal Other",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 13.0,
                                "cast": 2.27
                    }
        },
        {
                    "name": "Healing Aura",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 8.0,
                                "endurance": 13.0,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Absorb Pain",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 0.52,
                                "cast": 2.27,
                                "dotDamage": 1.0,
                                "dotTicks": 10,
                                "buffDuration": 20.0
                    }
        },
        {
                    "name": "Resurrect",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 15.0,
                                "recharge": 180.0,
                                "endurance": 26.0,
                                "cast": 3.2,
                                "buffDuration": 0.5
                    }
        },
        {
                    "name": "Clear Mind",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "buffDuration": 90.0
                    }
        },
        {
                    "name": "Fortitude",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 10.4,
                                "cast": 2.27,
                                "damage": {
                                            "scale": 2.5
                                },
                                "dotDamage": 2.5,
                                "dotTicks": 60,
                                "tohitBuff": 1.5,
                                "buffDuration": 120.0
                    }
        },
        {
                    "name": "Recovery Aura",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 500.0,
                                "endurance": 26.0,
                                "cast": 2.03,
                                "buffDuration": 90.0
                    }
        },
        {
                    "name": "Regeneration Aura",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 500.0,
                                "endurance": 26.0,
                                "cast": 2.03,
                                "heal": 5.0,
                                "buffDuration": 90.0
                    }
        },
        {
                    "name": "Adrenalin Boost",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 300.0,
                                "endurance": 10.4,
                                "cast": 2.27,
                                "buffDuration": 90.0,
                                "heal": 5.0,
                                "rechargeBuff": 1.0,
                                "rechargeDebuff": 0.8,
                                "speedBuff": 0.8
                    }
        }
    ]
};
