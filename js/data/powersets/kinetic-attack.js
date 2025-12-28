/**
 * City of Heroes: Kinetic Attack
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['kinetic-attack'] = {
    name: "Kinetic Attack",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Body Blow",
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
                                "recharge": 5.0,
                                "endurance": 6.032,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 0.87
                                },
                                "dotDamage": 0.75,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Quick Strike",
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
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.63
                                },
                                "dotDamage": 0.75,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Smashing Blow",
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
                                "recharge": 7.0,
                                "endurance": 7.696,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.75,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Power Siphon",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.2,
                                "recharge": 120.0,
                                "endurance": 5.2,
                                "cast": 1.93
                    }
        },
        {
                    "name": "Repulsing Torrent",
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
                                "range": 40.0,
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.825
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
                    "name": "Burst",
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
                                "recharge": 15.0,
                                "endurance": 14.3,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.75
                                },
                                "dotDamage": 1.5,
                                "dotTicks": 3
                    }
        },
        {
                    "name": "Focused Burst",
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
                                "range": 40.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 1.23
                                },
                                "dotDamage": 0.75,
                                "dotTicks": 3
                    }
        },
        {
                    "name": "Concentrated Strike",
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
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.83,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.75,
                                "dotTicks": 4
                    }
        }
    ]
};
