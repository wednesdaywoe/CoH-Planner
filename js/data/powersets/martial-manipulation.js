/**
 * City of Heroes: Martial Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['martial-manipulation'] = {
    name: "Martial Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Reach for the Limit",
                    "available": -1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Ki Push",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.055,
                                "dotTicks": 4,
                                "buffDuration": 2.0
                    }
        },
        {
                    "name": "Storm Kick",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 1.32
                                },
                                "dotDamage": 0.071,
                                "dotTicks": 4,
                                "buffDuration": 1.5
                    }
        },
        {
                    "name": "Reach for the Limit",
                    "available": 3,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "buffDuration": 10.25
                    }
        },
        {
                    "name": "Burst of Speed",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 200.0,
                                "recharge": 90.0,
                                "endurance": 13.52,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.026
                                },
                                "dotDamage": 0.026,
                                "dotTicks": 4,
                                "buffDuration": 2.0
                    }
        },
        {
                    "name": "Dragon's Tail",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.05,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 1.18
                                },
                                "dotDamage": 0.045,
                                "dotTicks": 4,
                                "buffDuration": 9.0
                    }
        },
        {
                    "name": "Reaction Time",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "cast": 1.83,
                                "speedBuff": 1.0,
                                "buffDuration": 5.0,
                                "rechargeBuff": 0.4,
                                "slow": 0.7,
                                "rechargeDebuff": 0.4
                    }
        },
        {
                    "name": "Inner Will",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 180.0,
                                "cast": 1.03,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Throw Sand",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 40.0,
                                "recharge": 90.0,
                                "endurance": 20.18,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 0.029
                                },
                                "dotDamage": 0.029,
                                "dotTicks": 4,
                                "buffDuration": 20.0
                    }
        },
        {
                    "name": "Eagles Claw",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 18.0,
                                "endurance": 16.848,
                                "cast": 2.53,
                                "damage": {
                                            "scale": 3.24
                                },
                                "dotDamage": 0.5,
                                "dotTicks": 2,
                                "buffDuration": 5.0,
                                "rechargeDebuff": 0.25
                    }
        }
    ]
};
