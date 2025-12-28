/**
 * City of Heroes: Claws
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['claws'] = {
    name: "Claws",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Strike",
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
                                "recharge": 3.2,
                                "endurance": 4.16,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.08
                                }
                    }
        },
        {
                    "name": "Swipe",
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
                                "recharge": 1.7,
                                "endurance": 2.912,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.76
                                }
                    }
        },
        {
                    "name": "Slash",
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
                                "recharge": 4.8,
                                "endurance": 5.4912,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.66
                                }
                    }
        },
        {
                    "name": "Spin",
                    "available": 5,
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
                                "recharge": 9.2,
                                "endurance": 9.152,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 1.58
                                }
                    }
        },
        {
                    "name": "Follow Up",
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
                                "range": 7.0,
                                "recharge": 12.0,
                                "endurance": 7.8,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.8
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 5
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
                    "name": "Focus",
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
                                "accuracy": 1.0,
                                "range": 40.0,
                                "recharge": 6.4,
                                "endurance": 6.8224,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.39
                                }
                    }
        },
        {
                    "name": "Eviscerate",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 8.867,
                                "endurance": 8.875,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 1.99
                                }
                    }
        },
        {
                    "name": "Shockwave",
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
                                "accuracy": 1.0,
                                "range": 30.0,
                                "recharge": 12.1,
                                "endurance": 11.5648,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.05
                                }
                    }
        }
    ]
};
