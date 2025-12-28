/**
 * City of Heroes: Martial Arts
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['martial-arts'] = {
    name: "Martial Arts",
    type: "primary",
    description: "TODO: Add description",
    powers: [
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
                                "cast": 0.83,
                                "damage": {
                                            "scale": 1.32
                                }
                    }
        },
        {
                    "name": "Thunder Kick",
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
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.84
                                }
                    }
        },
        {
                    "name": "Cobra Strike",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.96
                                }
                    }
        },
        {
                    "name": "Focus Chi",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 5.2,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Crane Kick",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.96
                                }
                    }
        },
        {
                    "name": "Warriors Challenge",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 3.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Crippling Axe Kick",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 1.6,
                                "damage": {
                                            "scale": 2.12
                                },
                                "slow": 0.5
                    }
        },
        {
                    "name": "Dragon's Tail",
                    "available": 21,
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
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 1.1818
                                }
                    }
        },
        {
                    "name": "Eagles Claw",
                    "available": 25,
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
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 2.53,
                                "damage": {
                                            "scale": 2.28
                                }
                    }
        }
    ]
};
