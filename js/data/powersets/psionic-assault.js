/**
 * City of Heroes: Psionic Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['psionic-assault'] = {
    name: "Psionic Assault",
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
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.96
                                },
                                "rechargeBuff": 0.4,
                                "buffDuration": 6.0
                    }
        },
        {
                    "name": "Psionic Dart",
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
                                "range": 100.0,
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.84
                                },
                                "rechargeBuff": 0.3,
                                "buffDuration": 5.0
                    }
        },
        {
                    "name": "Telekinetic Thrust",
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
                                "range": 7.0,
                                "recharge": 7.0,
                                "endurance": 7.696,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.37
                                }
                    }
        },
        {
                    "name": "Mental Blast",
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
                                "range": 100.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.64
                                },
                                "rechargeBuff": 0.3,
                                "buffDuration": 6.0
                    }
        },
        {
                    "name": "Psychic Scream",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 1.3
                                },
                                "rechargeBuff": 0.5,
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
                                "heal": 1.0,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Subdue",
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
                                "range": 100.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Psionic Lance",
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
                                "range": 175.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.33
                    }
        },
        {
                    "name": "Psychic Shockwave",
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
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.97,
                                "damage": {
                                            "scale": 1.0954
                                },
                                "rechargeBuff": 0.5,
                                "buffDuration": 20.0
                    }
        }
    ]
};
