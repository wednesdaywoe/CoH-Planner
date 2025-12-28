/**
 * City of Heroes: Ninja Training
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ninja-training'] = {
    name: "Ninja Training",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Immobilizing Dart",
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
                                "accuracy": 1.05,
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "speedBuff": 0.3,
                                "rechargeBuff": 0.3
                    }
        },
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
                                "recharge": 10.0,
                                "endurance": 6.03,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.96
                                },
                                "defenseDebuff": 1.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Choking Powder",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 60.0,
                                "recharge": 16.0,
                                "endurance": 11.388,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 2,
                                "buffDuration": 4.2
                    }
        },
        {
                    "name": "Shinobi",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "damage": {
                                            "scale": 2.0
                                },
                                "buffDuration": 0.75,
                                "tohitBuff": 0.5
                    }
        },
        {
                    "name": "The Lotus Drops",
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
                                "accuracy": 1.05,
                                "recharge": 14.0,
                                "endurance": 13.0,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.12,
                                "dotTicks": 1,
                                "buffDuration": 2.1,
                                "defenseDebuff": 1.0
                    }
        },
        {
                    "name": "Kuji-In Toh",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 200.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 105,
                                "heal": 1.125,
                                "buffDuration": 210.0
                    }
        },
        {
                    "name": "Smoke Flash",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.4,
                                "recharge": 90.0,
                                "endurance": 2.6,
                                "cast": 1.83,
                                "dotDamage": -1.5,
                                "dotTicks": 7,
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Blinding Powder",
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
                                "range": 25.0,
                                "recharge": 90.0,
                                "endurance": 7.8,
                                "cast": 1.07,
                                "tohitDebuff": 1.0,
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Golden Dragonfly",
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
                                "accuracy": 1.05,
                                "range": 10.0,
                                "recharge": 20.0,
                                "endurance": 11.856,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 3.56
                                },
                                "defenseDebuff": 1.0,
                                "buffDuration": 10.0
                    }
        }
    ]
};
