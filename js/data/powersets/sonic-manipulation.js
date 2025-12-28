/**
 * City of Heroes: Sonic Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['sonic-manipulation'] = {
    name: "Sonic Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Sonic Thrust",
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
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.4
                                },
                                "buffDuration": 2.0
                    }
        },
        {
                    "name": "Strident Echo",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.1767
                                },
                                "dotDamage": 0.1767,
                                "dotTicks": 1,
                                "buffDuration": 2.1
                    }
        },
        {
                    "name": "Echo Chamber",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 16.0,
                                "endurance": 11.388,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Sound Booster",
                    "available": 9,
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
                                            "scale": 6.0
                                },
                                "dotDamage": 6.0,
                                "dotTicks": 5,
                                "tohitBuff": 2.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Deafening Wave",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.5477
                                }
                    }
        },
        {
                    "name": "Sound Barrier",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "cast": 2.7,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 1,
                                "buffDuration": 2.25,
                                "absorption": 0.15
                    }
        },
        {
                    "name": "Disruption Aura",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "endurance": 1.04,
                                "cast": 1.97,
                                "dotDamage": -2.0,
                                "dotTicks": 1,
                                "buffDuration": 2.25
                    }
        },
        {
                    "name": "Sound Cannon",
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
                                "range": 45.0,
                                "recharge": 90.0,
                                "endurance": 20.18,
                                "cast": 1.5
                    }
        },
        {
                    "name": "Earsplitter",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.97,
                                "damage": {
                                            "scale": 1.78
                                }
                    }
        }
    ]
};
