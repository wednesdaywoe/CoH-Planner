/**
 * City of Heroes: Sonic Debuff
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['sonic-debuff'] = {
    name: "Sonic Debuff",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Sonic Barrier",
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
                                "cast": 1.33,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 120,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Sonic Siphon",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 16.0,
                                "endurance": 8.528,
                                "cast": 2.17,
                                "dotDamage": -3.0,
                                "dotTicks": 15,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Sonic Haven",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 2.0,
                                "endurance": 7.8,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 120,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Sonic Cage",
                    "available": 5,
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
                                "endurance": 12.48,
                                "cast": 1.67,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Disruption Field",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 0.26,
                                "cast": 2.7,
                                "buffDuration": 0.75
                    }
        },
        {
                    "name": "Sonic Dispersion",
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
                                "cast": 2.03,
                                "damage": {
                                            "scale": 1.5
                                },
                                "dotDamage": 1.5,
                                "dotTicks": 1,
                                "buffDuration": 2.25
                    }
        },
        {
                    "name": "Sonic Repulsion",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 0.325,
                                "cast": 2.33,
                                "buffDuration": 0.5
                    }
        },
        {
                    "name": "Clarity",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.5,
                                "buffDuration": 90.0
                    }
        },
        {
                    "name": "Liquefy",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "recharge": 150.0,
                                "endurance": 23.4,
                                "cast": 2.67,
                                "buffDuration": 30.0
                    }
        }
    ]
};
