/**
 * City of Heroes: Ninja Sword
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ninja-sword'] = {
    name: "Ninja Sword",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Sting of the Wasp",
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
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 5.0,
                                "endurance": 6.032,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.16
                                }
                    }
        },
        {
                    "name": "Gambler's Cut",
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
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 0.67,
                                "damage": {
                                            "scale": 0.42
                                }
                    }
        },
        {
                    "name": "Flashing Steel",
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
                                "recharge": 6.0,
                                "endurance": 6.032,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.99
                                }
                    }
        },
        {
                    "name": "Assassin's Blade",
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
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 3.67
                    }
        },
        {
                    "name": "Build Up",
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
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Placate",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 60.0,
                                "cast": 0.8
                    }
        },
        {
                    "name": "Divine Avalanche",
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
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.84
                                }
                    }
        },
        {
                    "name": "Soaring Dragon",
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
                                "range": 7.0,
                                "recharge": 9.0,
                                "endurance": 9.36,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 1.8
                                }
                    }
        },
        {
                    "name": "Golden Dragonfly",
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
                                "range": 10.0,
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 2.28
                                }
                    }
        }
    ]
};
