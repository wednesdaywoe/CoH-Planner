/**
 * City of Heroes: Ice Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ice-manipulation'] = {
    name: "Ice Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Chilblain",
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
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "buffDuration": 9.2,
                                "speedBuff": 0.2,
                                "rechargeBuff": 0.2
                    }
        },
        {
                    "name": "Frozen Fists",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 1.0
                                },
                                "speedBuff": 0.1,
                                "buffDuration": 5.0,
                                "rechargeBuff": 0.1
                    }
        },
        {
                    "name": "Ice Sword",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.96
                                },
                                "rechargeBuff": 0.1,
                                "buffDuration": 8.0,
                                "speedBuff": 0.1
                    }
        },
        {
                    "name": "Frigid Protection",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 2,
                                "speedBuff": 0.7,
                                "buffDuration": 5.0,
                                "rechargeBuff": 0.4
                    }
        },
        {
                    "name": "Build Up",
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
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 5,
                                "tohitBuff": 2.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Ice Patch",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 2.0,
                                "recharge": 35.0,
                                "endurance": 10.4,
                                "cast": 1.57,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Shiver",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 12.0,
                                "endurance": 10.4,
                                "cast": 2.17,
                                "rechargeBuff": 0.325,
                                "buffDuration": 18.0,
                                "speedBuff": 0.325,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Freezing Touch",
                    "available": 27,
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.19
                                },
                                "dotDamage": 0.19,
                                "dotTicks": 5,
                                "buffDuration": 6.0
                    }
        },
        {
                    "name": "Frozen Aura",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.1,
                                "damage": {
                                            "scale": 1.068
                                }
                    }
        }
    ]
};
