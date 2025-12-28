/**
 * City of Heroes: Broad Sword
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['broad-sword'] = {
    name: "Broad Sword",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Hack",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Slash",
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
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Slice",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 1.23
                                }
                    }
        },
        {
                    "name": "Build Up",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.05,
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
                    "name": "Parry",
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
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.84
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
                    "name": "Whirling Sword",
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
                                "accuracy": 1.05,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 1.18
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Disembowel",
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
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.8,
                                "damage": {
                                            "scale": 1.96
                                }
                    }
        },
        {
                    "name": "Head Splitter",
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
                                "range": 10.0,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 2.6
                                }
                    }
        }
    ]
};
