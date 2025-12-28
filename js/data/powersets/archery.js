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
                                            "scale": 1.32
                                },
                                "dotDamage": 0.11,
                                "dotTicks": 4
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
                                            "scale": 0.84
                                },
                                "dotDamage": 0.066,
                                "dotTicks": 4
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
                                            "scale": 0.91
                                },
                                "dotDamage": 0.032,
                                "dotTicks": 4
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
                                            "scale": 1.96
                                },
                                "dotDamage": 0.125,
                                "dotTicks": 2
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
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5
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
                                            "scale": 0.45
                                },
                                "dotDamage": 0.02,
                                "dotTicks": 4
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
                                "cast": 1.67
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
                                            "scale": 0.25
                                },
                                "dotDamage": 0.066,
                                "dotTicks": 4
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
                                "cast": 2.0
                    }
        }
    ]
};
