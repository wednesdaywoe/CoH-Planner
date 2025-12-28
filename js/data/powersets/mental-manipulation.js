/**
 * City of Heroes: Mental Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['mental-manipulation'] = {
    name: "Mental Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Mind Probe",
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
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.64
                                },
                                "dotDamage": 0.077,
                                "dotTicks": 4,
                                "rechargeBuff": 0.4,
                                "buffDuration": 6.0
                    }
        },
        {
                    "name": "Subdual",
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
                                "endurance": 7.8,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "buffDuration": 9.2
                    }
        },
        {
                    "name": "World of Confusion",
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
                                "recharge": 10.0,
                                "endurance": 0.52,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.12
                                }
                    }
        },
        {
                    "name": "Psychic Scream",
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
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 1.04
                                },
                                "dotDamage": 0.064,
                                "dotTicks": 5,
                                "rechargeBuff": 0.5,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Concentration",
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
                    "name": "Drain Psyche",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 120.0,
                                "endurance": 13.0,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.035
                                },
                                "dotDamage": 0.035,
                                "dotTicks": 4,
                                "heal": 0.75,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Scare",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 20.0,
                                "endurance": 10.4,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.176
                                },
                                "dotDamage": 0.176,
                                "dotTicks": 5,
                                "buffDuration": 10.17
                    }
        },
        {
                    "name": "Psychic Shockwave",
                    "available": 27,
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
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.97,
                                "damage": {
                                            "scale": 1.1
                                },
                                "dotDamage": 0.04,
                                "dotTicks": 4,
                                "rechargeBuff": 0.5,
                                "buffDuration": 20.0
                    }
        },
        {
                    "name": "Telekinetic Thrust",
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
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.46
                                },
                                "dotDamage": 0.137,
                                "dotTicks": 4,
                                "buffDuration": 9.57
                    }
        }
    ]
};
