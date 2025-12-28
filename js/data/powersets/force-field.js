/**
 * City of Heroes: Force Field
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['force-field'] = {
    name: "Force Field",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Deflection Shield",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 2.0,
                                "endurance": 7.8,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 4.0
                                },
                                "dotDamage": 4.0,
                                "dotTicks": 120,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Personal Force Field",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 0.13,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 4.0
                                },
                                "buffDuration": 0.75
                    }
        },
        {
                    "name": "Repulsion Bolt",
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
                                "accuracy": 1.4,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 10.192,
                                "cast": 1.1,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": -2.0,
                                "dotTicks": 15,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Insulation Shield",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 2.0,
                                "endurance": 7.8,
                                "cast": 2.07,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Detention Field",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.4,
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 10.4,
                                "cast": 2.07,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Dispersion Bubble",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 1.04,
                                "cast": 1.07,
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Repulsion Field",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 0.1625,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Force Bomb",
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
                                "accuracy": 1.2,
                                "range": 70.0,
                                "recharge": 30.0,
                                "endurance": 16.9,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.6
                                },
                                "dotDamage": -1.5,
                                "dotTicks": 15,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Damping Bubble",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 25.0,
                                "recharge": 90.0,
                                "endurance": 5.2,
                                "cast": 1.07,
                                "buffDuration": 45.0
                    }
        }
    ]
};
