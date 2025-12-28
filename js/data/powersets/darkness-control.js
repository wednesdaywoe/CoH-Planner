/**
 * City of Heroes: Darkness Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['darkness-control'] = {
    name: "Darkness Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Dark Grasp",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Shadowy Binds",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Living Shadows",
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
                                "range": 60.0,
                                "recharge": 8.0,
                                "endurance": 13.0,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.13
                                },
                                "dotDamage": 0.13,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Possess",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.33
                    }
        },
        {
                    "name": "Fearsome Stare",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 40.0,
                                "endurance": 8.528,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Heart of Darkness",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.07
                                },
                                "dotDamage": 0.07,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Haunt",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 210.0,
                                "endurance": 10.4,
                                "cast": 2.33
                    }
        },
        {
                    "name": "Shadow Field",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 240.0,
                                "endurance": 15.6,
                                "cast": 2.67
                    }
        },
        {
                    "name": "Umbra Beast",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 50.0,
                                "recharge": 240.0,
                                "endurance": 26.0,
                                "cast": 2.33
                    }
        }
    ]
};
