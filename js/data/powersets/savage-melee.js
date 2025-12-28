/**
 * City of Heroes: Savage Melee
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['savage-melee'] = {
    name: "Savage Melee",
    type: "primary",
    description: "TODO: Add description",
    powers: [
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
                                "slow": 0.7
                    }
        },
        {
                    "name": "Savage Strike",
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
                                "recharge": 2.5,
                                "endurance": 3.952,
                                "cast": 0.8,
                                "damage": {
                                            "scale": 0.38
                                }
                    }
        },
        {
                    "name": "Shred",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 7.5,
                                "endurance": 8.11,
                                "cast": 2.17,
                                "damage": {
                                            "scale": 0.21
                                },
                                "dotDamage": 0.21,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Blood Thirst",
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
                                "endurance": 7.8,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 3.333
                                },
                                "dotDamage": 3.333,
                                "dotTicks": 7
                    }
        },
        {
                    "name": "Vicious Slash",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 9.0,
                                "endurance": 9.36,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.8
                                }
                    }
        },
        {
                    "name": "Confront",
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
                    "name": "Rending Flurry",
                    "available": 17,
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
                    "name": "Hemorrhage",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.76
                                },
                                "dotDamage": 0.1638,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Savage Leap",
                    "available": 25,
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
                                "range": 70.0,
                                "recharge": 40.0,
                                "endurance": 17.58,
                                "cast": 1.17
                    }
        }
    ]
};
