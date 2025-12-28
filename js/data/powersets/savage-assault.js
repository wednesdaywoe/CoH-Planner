/**
 * City of Heroes: Savage Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['savage-assault'] = {
    name: "Savage Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Call Swarm",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 5.46,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "defenseDebuff": 1.0,
                                "speedBuff": 0.2
                    }
        },
        {
                    "name": "Maiming Slash",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 5.0,
                                "endurance": 6.03,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.16
                                },
                                "dotDamage": 0.209,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "speedBuff": 0.7
                    }
        },
        {
                    "name": "Vicious Slash",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 2.12
                                },
                                "dotDamage": 0.3816,
                                "dotTicks": 1,
                                "buffDuration": 3.1
                    }
        },
        {
                    "name": "Unkindness",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.155,
                                "range": 40.0,
                                "recharge": 14.0,
                                "endurance": 16.9,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.241
                                },
                                "dotDamage": 0.241,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "defenseDebuff": 1.0,
                                "speedBuff": 0.2
                    }
        },
        {
                    "name": "Spot Prey",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 5.2,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5,
                                "tohitBuff": 5.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Rending Flurry",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 2.17
                    }
        },
        {
                    "name": "Blood Craze",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 180.0,
                                "endurance": 7.8,
                                "cast": 2.0,
                                "dotDamage": 0.25,
                                "dotTicks": 4,
                                "buffDuration": 9.1
                    }
        },
        {
                    "name": "Call Hawk",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 14.0,
                                "endurance": 10.9702,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.52
                                },
                                "dotDamage": 0.2429,
                                "dotTicks": 2,
                                "buffDuration": 1.3,
                                "tohitDebuff": 0.75
                    }
        },
        {
                    "name": "Feral Charge",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 10.19,
                                "cast": 1.1667
                    }
        }
    ]
};
