/**
 * City of Heroes: Fiery Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['fiery-assault'] = {
    name: "Fiery Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Flares",
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
                                "range": 80.0,
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.588
                                }
                    }
        },
        {
                    "name": "Incinerate",
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
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.212
                                },
                                "dotDamage": 0.212,
                                "dotTicks": 2,
                                "buffDuration": 4.6
                    }
        },
        {
                    "name": "Fire Breath",
                    "available": 3,
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
                                "accuracy": 1.2,
                                "range": 40.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.585
                                },
                                "dotDamage": 0.585,
                                "dotTicks": 1,
                                "buffDuration": 2.1
                    }
        },
        {
                    "name": "Fire Blast",
                    "available": 9,
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 1.64
                                },
                                "dotDamage": 0.15,
                                "dotTicks": 1,
                                "buffDuration": 3.1
                    }
        },
        {
                    "name": "Embrace of Fire",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 180.0,
                                "endurance": 7.8,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 10.0
                                },
                                "dotDamage": 10.0,
                                "dotTicks": 15,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Combustion",
                    "available": 19,
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
                                "recharge": 17.0,
                                "endurance": 15.964,
                                "cast": 3.0,
                                "damage": {
                                            "scale": 0.5
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 3,
                                "buffDuration": 7.1
                    }
        },
        {
                    "name": "Consume",
                    "available": 23,
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
                                "recharge": 180.0,
                                "endurance": 0.52,
                                "cast": 2.03,
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Blazing Bolt",
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
                                "range": 150.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Blaze",
                    "available": 29,
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
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 2.28
                                },
                                "dotDamage": 0.225,
                                "dotTicks": 2,
                                "buffDuration": 4.1
                    }
        }
    ]
};
