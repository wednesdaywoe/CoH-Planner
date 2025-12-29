/**
 * City of Heroes: Archery
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['archery'] = {
    name: "Archery",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Aimed Shot",
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
                                "accuracy": 1.155,
                                "range": 80.0,
                                "recharge": 6.0,
                                "endurance": 5.2,
                                "cast": 1.67,
                                "damage": {
                                            "type": "Lethal",
                                            "scale": 3.1292
                                },
                                "buffDuration": 9.17
                    }
        },
        {
                    "name": "Snap Shot",
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
                                "accuracy": 1.155,
                                "range": 80.0,
                                "recharge": 2.0,
                                "endurance": 3.536,
                                "cast": 1.0,
                                "damage": {
                                            "type": "Lethal",
                                            "scale": 2.0202
                                },
                                "buffDuration": 8.5
                    }
        },
        {
                    "name": "Fistful of Arrows",
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
                                "accuracy": 1.155,
                                "range": 50.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.17,
                                "damage": {
                                            "type": "Lethal",
                                            "scale": 1.5382
                                },
                                "buffDuration": 8.67
                    }
        },
        {
                    "name": "Blazing Arrow",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.155,
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.83,
                                "damage": {
                                            "type": "Lethal",
                                            "scale": 4.0413
                                },
                                "dotDamage": {
                                            "type": "Fire",
                                            "scale": 0.125,
                                            "ticks": 4
                                },
                                "buffDuration": 4.125
                    }
        },
        {
                    "name": "Aim",
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
                                "tohitBuff": 5.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Explosive Arrow",
                    "available": 11,
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
                                "accuracy": 1.155,
                                "range": 80.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 1.0,
                                "damage": {
                                            "types": [
                                                        {
                                                                    "type": "Fire",
                                                                    "scale": 1.9633999999999998
                                                        },
                                                        {
                                                                    "type": "Lethal",
                                                                    "scale": 1.2067
                                                        }
                                            ],
                                            "scale": 3.1700999999999997
                                },
                                "buffDuration": 8.5
                    }
        },
        {
                    "name": "Ranged Shot",
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
                                "accuracy": 1.155,
                                "range": 150.0,
                                "recharge": 12.0,
                                "endurance": 14.352,
                                "cast": 1.67,
                                "damage": {
                                            "type": "Lethal",
                                            "scale": 0.0
                                }
                    }
        },
        {
                    "name": "Stunning Shot",
                    "available": 21,
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
                                "accuracy": 1.155,
                                "range": 60.0,
                                "recharge": 20.0,
                                "endurance": 10.192,
                                "cast": 1.0,
                                "damage": {
                                            "type": "Smashing",
                                            "scale": 0.25
                                },
                                "buffDuration": 8.5
                    }
        },
        {
                    "name": "Rain of Arrows",
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
                                "range": 90.0,
                                "recharge": 65.0,
                                "endurance": 20.8,
                                "cast": 2.0,
                                "dotDamage": {
                                            "type": "Lethal",
                                            "scale": 0.0,
                                            "ticks": 0
                                },
                                "buffDuration": 3.0
                    }
        }
    ]
};
