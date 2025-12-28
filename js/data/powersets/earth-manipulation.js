/**
 * City of Heroes: Earth Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['earth-manipulation'] = {
    name: "Earth Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Heavy Mallet",
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
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 2.28
                                }
                    }
        },
        {
                    "name": "Stone Prison",
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
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.23,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "buffDuration": 9.2,
                                "defenseDebuff": 1.0
                    }
        },
        {
                    "name": "Salt Crystals",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 15.6,
                                "cast": 1.07,
                                "defenseDebuff": 1.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Build Up",
                    "available": 9,
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
                                "dotTicks": 5,
                                "tohitBuff": 2.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Tremor",
                    "available": 15,
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
                                "endurance": 13.52,
                                "cast": 2.53,
                                "damage": {
                                            "scale": 1.04
                                }
                    }
        },
        {
                    "name": "Mud Bath",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 2.03,
                                "speedBuff": 0.5,
                                "buffDuration": 5.0,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Beryl Crystals",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "cast": 0.73,
                                "buffDuration": 0.75,
                                "tohitBuff": 1.0
                    }
        },
        {
                    "name": "Fracture",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 70.0,
                                "recharge": 90.0,
                                "endurance": 10.4,
                                "cast": 1.0,
                                "defenseDebuff": 1.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Seismic Smash",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "cast": 1.5,
                                "damage": {
                                            "scale": 3.56
                                }
                    }
        }
    ]
};
