/**
 * City of Heroes: Battle Axe
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['battle-axe'] = {
    name: "Battle Axe",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Beheader",
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
                                "accuracy": 1.15,
                                "range": 7.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Chop",
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
                                "accuracy": 1.15,
                                "range": 7.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Gash",
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
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.27,
                                "damage": {
                                            "scale": 1.96
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
                                "accuracy": 1.05,
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
                    "name": "Pendulum",
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
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 1.3463
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
                    "name": "Swoop",
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
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.37,
                                "damage": {
                                            "scale": 2.28
                                }
                    }
        },
        {
                    "name": "Axe Cyclone",
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
                                "accuracy": 1.05,
                                "recharge": 18.0,
                                "endurance": 16.848,
                                "cast": 2.1,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Cleave",
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
                                "accuracy": 1.05,
                                "range": 40.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 2.76
                                }
                    }
        }
    ]
};
