/**
 * City of Heroes: Energy Melee
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['energy-melee'] = {
    name: "Energy Melee",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Barrage",
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
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.5
                                }
                    }
        },
        {
                    "name": "Energy Punch",
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
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.812
                                }
                    }
        },
        {
                    "name": "Bone Smasher",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.27,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Build Up",
                    "available": 5,
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
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Power Crash",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 10.0,
                                "recharge": 9.0,
                                "endurance": 9.36,
                                "cast": 1.8,
                                "damage": {
                                            "scale": 0.5054
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
                    "name": "Whirling Hands",
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
                                "recharge": 14.0,
                                "endurance": 13.0,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 0.4964
                                }
                    }
        },
        {
                    "name": "Total Focus",
                    "available": 21,
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
                                "cast": 2.53,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Energy Transfer",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 10.0,
                                "cast": 2.67
                    }
        }
    ]
};
