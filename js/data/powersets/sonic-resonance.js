/**
 * City of Heroes: Sonic Resonance
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['sonic-resonance'] = {
    name: "Sonic Resonance",
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
                                "dotTicks": 120
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
                                "dotTicks": 15
                    }
        },
        {
                    "name": "Sonic Haven",
                    "available": 3,
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
                                "dotTicks": 120
                    }
        },
        {
                    "name": "Sonic Cage",
                    "available": 9,
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
                                "cast": 1.67
                    }
        },
        {
                    "name": "Disruption Field",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 0.26,
                                "cast": 2.7
                    }
        },
        {
                    "name": "Sonic Dispersion",
                    "available": 19,
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
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Sonic Repulsion",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 0.325,
                                "cast": 2.33
                    }
        },
        {
                    "name": "Clarity",
                    "available": 27,
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
                                "cast": 1.5
                    }
        },
        {
                    "name": "Liquefy",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 150.0,
                                "endurance": 23.4,
                                "cast": 2.67
                    }
        }
    ]
};
