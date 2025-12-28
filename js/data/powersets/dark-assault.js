/**
 * City of Heroes: Dark Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['dark-assault'] = {
    name: "Dark Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Dark Blast",
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
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                },
                                "tohitDebuff": 0.75,
                                "buffDuration": 6.0
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 0.97,
                                "damage": {
                                            "scale": 0.4
                                },
                                "tohitDebuff": 0.75,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Gloom",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.1,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 1,
                                "buffDuration": 3.6,
                                "tohitDebuff": 0.75
                    }
        },
        {
                    "name": "Night Fall",
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
                                "range": 60.0,
                                "recharge": 14.0,
                                "endurance": 17.3829,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.1459
                                },
                                "dotDamage": 0.1459,
                                "dotTicks": 1,
                                "buffDuration": 2.8,
                                "tohitDebuff": 0.75
                    }
        },
        {
                    "name": "Gather Shadows",
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
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 4.0
                                },
                                "dotDamage": 4.0,
                                "dotTicks": 5,
                                "buffDuration": 10.0,
                                "speedBuff": 0.5,
                                "absorption": 0.5,
                                "tohitBuff": 0.5,
                                "defenseBuff": 0.5
                    }
        },
        {
                    "name": "Engulfing Darkness",
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
                                "recharge": 18.0,
                                "endurance": 16.848,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "tohitDebuff": 0.75
                    }
        },
        {
                    "name": "Life Drain",
                    "available": 23,
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
                                "range": 60.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.93,
                                "damage": {
                                            "scale": 1.64
                                },
                                "tohitDebuff": 0.75,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Moon Beam",
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
                                "range": 150.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.33
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
                                "recharge": 15.0,
                                "endurance": 11.96,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 2.21
                                },
                                "dotDamage": 0.11,
                                "dotTicks": 1,
                                "tohitDebuff": 0.75,
                                "buffDuration": 20.0
                    }
        }
    ]
};
