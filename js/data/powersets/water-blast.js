/**
 * City of Heroes: Water Blast
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['water-blast'] = {
    name: "Water Blast",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Aqua Bolt",
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
                                            "scale": 0.21
                                }
                    }
        },
        {
                    "name": "Hydro Blast",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
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
                                "recharge": 7.0,
                                "endurance": 7.696,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.37
                                },
                                "slow": 0.2
                    }
        },
        {
                    "name": "Water Burst",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 1.73,
                                "damage": {
                                            "scale": 0.225
                                },
                                "slow": 0.3
                    }
        },
        {
                    "name": "Whirlpool",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 60.0,
                                "endurance": 15.6,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.033
                                },
                                "dotDamage": 0.033,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Tidal Forces",
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
                                            "scale": 2.5
                                },
                                "dotDamage": 2.5,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Dehydrate",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.87,
                                "damage": {
                                            "scale": 0.25
                                },
                                "dotDamage": 0.1488,
                                "dotTicks": 2,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Water Jet",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.43
                    }
        },
        {
                    "name": "Steam Spray",
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
                                "accuracy": 1.2,
                                "range": 40.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.53,
                                "damage": {
                                            "scale": 0.835
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Geyser",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.4,
                                "range": 80.0,
                                "recharge": 125.0,
                                "endurance": 20.8,
                                "cast": 2.93,
                                "damage": {
                                            "scale": 0.5
                                },
                                "dotDamage": 0.1364,
                                "dotTicks": 2,
                                "slow": 0.33
                    }
        }
    ]
};
