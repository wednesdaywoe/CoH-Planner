/**
 * City of Heroes: Sonic Attack
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['sonic-attack'] = {
    name: "Sonic Attack",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Scream",
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
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.47,
                                "damage": {
                                            "scale": 0.132
                                },
                                "dotDamage": -1.5,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Shriek",
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
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.42
                                },
                                "dotDamage": -1.5,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Howl",
                    "available": 1,
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
                                "range": 50.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.6,
                                "damage": {
                                            "scale": 0.3347
                                },
                                "dotDamage": -1.5,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Shockwave",
                    "available": 5,
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
                                "range": 50.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.4326
                                }
                    }
        },
        {
                    "name": "Shout",
                    "available": 7,
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
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.98
                                },
                                "dotDamage": -1.5,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Amplify",
                    "available": 11,
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
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Sirens Song",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 40.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 1.86,
                                "damage": {
                                            "scale": 0.9546
                                }
                    }
        },
        {
                    "name": "Screech",
                    "available": 21,
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
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 1.14
                                },
                                "dotDamage": -1.5,
                                "dotTicks": 7
                    }
        },
        {
                    "name": "Dreadful Wail",
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
                                "accuracy": 1.4,
                                "recharge": 145.0,
                                "endurance": 27.716,
                                "cast": 1.97,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": -1.5,
                                "dotTicks": 10
                    }
        }
    ]
};
