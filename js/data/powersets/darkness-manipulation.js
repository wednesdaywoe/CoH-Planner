/**
 * City of Heroes: Darkness Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['darkness-manipulation'] = {
    name: "Darkness Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Penumbral Grasp",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "buffDuration": 9.2,
                                "tohitDebuff": 0.75
                    }
        },
        {
                    "name": "Smite",
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
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 0.97,
                                "damage": {
                                            "scale": 0.49
                                },
                                "dotDamage": 0.064,
                                "dotTicks": 4,
                                "tohitDebuff": 0.75,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Death Shroud",
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
                                "recharge": 4.0,
                                "endurance": 1.04,
                                "cast": 2.47,
                                "damage": {
                                            "scale": 0.2
                                }
                    }
        },
        {
                    "name": "Shadow Maul",
                    "available": 9,
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
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 3.07,
                                "damage": {
                                            "scale": 0.325
                                },
                                "dotDamage": 0.325,
                                "dotTicks": 1,
                                "buffDuration": 2.0,
                                "tohitDebuff": 0.75
                    }
        },
        {
                    "name": "Soul Drain",
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
                                "accuracy": 1.2,
                                "recharge": 120.0,
                                "endurance": 15.6,
                                "cast": 2.37,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.8,
                                "dotTicks": 15,
                                "tohitBuff": 1.0,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Touch of the Beyond",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Fear",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 5.2,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Dark Consumption",
                    "available": 23,
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
                                "recharge": 180.0,
                                "endurance": 0.52,
                                "cast": 1.03,
                                "damage": {
                                            "scale": 0.8
                                },
                                "dotDamage": 0.031,
                                "dotTicks": 4,
                                "buffDuration": 8.53
                    }
        },
        {
                    "name": "Dark Pit",
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
                                "range": 70.0,
                                "recharge": 90.0,
                                "endurance": 20.18,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 0.018
                                },
                                "dotDamage": 0.018,
                                "dotTicks": 4,
                                "buffDuration": 8.57
                    }
        },
        {
                    "name": "Midnight Grasp",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 18.0,
                                "endurance": 11.96,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 2.74
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "tohitDebuff": 0.75
                    }
        }
    ]
};
