/**
 * City of Heroes: Super Strength
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['super-strength'] = {
    name: "Super Strength",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Jab",
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
                                "recharge": 2.0,
                                "endurance": 3.536,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 0.68
                                }
                    }
        },
        {
                    "name": "Punch",
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
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Haymaker",
                    "available": 3,
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
                                "cast": 1.5,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Taunt",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 10.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Hand Clap",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 30.0,
                                "endurance": 13.0,
                                "cast": 1.23,
                                "damage": {
                                            "scale": 0.4871
                                }
                    }
        },
        {
                    "name": "Knockout Blow",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 13.2,
                                "recharge": 25.0,
                                "endurance": 18.512,
                                "cast": 2.23,
                                "damage": {
                                            "scale": 3.56
                                }
                    }
        },
        {
                    "name": "Rage",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 1.0,
                                "recharge": 240.0,
                                "endurance": 5.2,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 60,
                                "defenseDebuff": 0.2
                    }
        },
        {
                    "name": "Hurl",
                    "available": 27,
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
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 9.36,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Foot Stomp",
                    "available": 29,
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
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.1,
                                "damage": {
                                            "scale": 1.42
                                }
                    }
        }
    ]
};
