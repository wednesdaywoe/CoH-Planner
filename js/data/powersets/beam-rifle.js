/**
 * City of Heroes: Beam Rifle
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['beam-rifle'] = {
    name: "Beam Rifle",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Charged Shot",
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
                                "accuracy": 1.05,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Single Shot",
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
                                "accuracy": 1.05,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Cutting Beam",
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
                                "accuracy": 1.05,
                                "range": 50.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.9,
                                "damage": {
                                            "scale": 0.919
                                },
                                "dotDamage": 0.101,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Disintegrate",
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
                                "accuracy": 1.1,
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.9,
                                "damage": {
                                            "scale": 0.216
                                },
                                "dotDamage": 0.216,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Aim",
                    "available": 7,
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
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Lancer Shot",
                    "available": 11,
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
                                "accuracy": 1.05,
                                "range": 80.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 1.9,
                                "damage": {
                                            "scale": 2.12
                                }
                    }
        },
        {
                    "name": "Penetrating Ray",
                    "available": 17,
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
                                "accuracy": 1.05,
                                "range": 150.0,
                                "recharge": 12.0,
                                "endurance": 14.352,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Piercing Beam",
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
                                "accuracy": 1.05,
                                "range": 80.0,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 2.17
                                },
                                "dotDamage": -2.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Overcharge",
                    "available": 25,
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
                                "accuracy": 1.4,
                                "range": 80.0,
                                "recharge": 125.0,
                                "endurance": 20.8,
                                "cast": 2.9,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 2
                    }
        }
    ]
};
