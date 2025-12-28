/**
 * City of Heroes: Assault Rifle
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['assault-rifle'] = {
    name: "Assault Rifle",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Burst",
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
                                "range": 90.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.27
                                }
                    }
        },
        {
                    "name": "Slug",
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
                                "range": 100.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.4,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Buckshot",
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
                                "accuracy": 1.05,
                                "range": 40.0,
                                "recharge": 8.0,
                                "endurance": 10.192,
                                "cast": 0.9,
                                "damage": {
                                            "scale": 0.91
                                }
                    }
        },
        {
                    "name": "M30 Grenade",
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
                                "accuracy": 1.05,
                                "range": 80.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.45
                                }
                    }
        },
        {
                    "name": "Beanbag",
                    "available": 7,
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
                                "accuracy": 1.05,
                                "range": 60.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 0.9,
                                "damage": {
                                            "scale": 0.98
                                }
                    }
        },
        {
                    "name": "Sniper Rifle",
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
                                "accuracy": 1.0,
                                "range": 150.0,
                                "recharge": 12.0,
                                "endurance": 14.352,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Flamethrower",
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
                                "accuracy": 1.3,
                                "range": 40.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 0.3872
                                },
                                "dotDamage": 0.3872,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Ignite",
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
                                "accuracy": 1.15,
                                "range": 60.0,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.1022,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Full Auto",
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
                                "accuracy": 1.35,
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 15.6,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.2754,
                                "dotTicks": 1
                    }
        }
    ]
};
