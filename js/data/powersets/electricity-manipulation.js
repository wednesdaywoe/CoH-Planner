/**
 * City of Heroes: Electricity Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['electricity-manipulation'] = {
    name: "Electricity Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Charged Brawl",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
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
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.96
                                },
                                "dotDamage": 0.055,
                                "dotTicks": 4,
                                "buffDuration": 2.0
                    }
        },
        {
                    "name": "Electric Fence",
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
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "buffDuration": 8.2
                    }
        },
        {
                    "name": "Build Up",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
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
                    "name": "Havoc Punch",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
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
                                "cast": 1.5,
                                "damage": {
                                            "scale": 0.6
                                },
                                "dotDamage": 0.099,
                                "dotTicks": 4,
                                "buffDuration": 4.0
                    }
        },
        {
                    "name": "Thunder Strike",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.53,
                                "damage": {
                                            "scale": 0.078
                                },
                                "dotDamage": 0.078,
                                "dotTicks": 5,
                                "buffDuration": 10.8
                    }
        },
        {
                    "name": "Dynamo",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.17
                                }
                    }
        },
        {
                    "name": "Power Sink",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 13.0,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.048
                                },
                                "dotDamage": 0.048,
                                "dotTicks": 4,
                                "buffDuration": 4.0
                    }
        },
        {
                    "name": "Force of Thunder",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 30.0,
                                "endurance": 14.0,
                                "cast": 1.23,
                                "damage": {
                                            "scale": 0.025
                                },
                                "dotDamage": 0.025,
                                "dotTicks": 4,
                                "buffDuration": 8.73
                    }
        },
        {
                    "name": "Shocking Grasp",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 15.0,
                                "endurance": 18.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.3
                                },
                                "dotDamage": 0.3,
                                "dotTicks": 2,
                                "buffDuration": 5.1
                    }
        }
    ]
};
