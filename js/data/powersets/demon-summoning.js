/**
 * City of Heroes: Demon Summoning
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['demon-summoning'] = {
    name: "Demon Summoning",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Corruption",
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
                                "recharge": 4.0,
                                "endurance": 6.5,
                                "cast": 1.23,
                                "damage": {
                                            "scale": 0.76
                                },
                                "dotDamage": 0.15,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Summon Demonlings",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 5.0,
                                "endurance": 5.46,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Lash",
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
                                "range": 20.0,
                                "recharge": 8.0,
                                "endurance": 10.66,
                                "cast": 1.8,
                                "damage": {
                                            "scale": 1.064
                                },
                                "dotDamage": 0.21,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Enchant Demon",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 50.0,
                                "recharge": 6.0,
                                "endurance": 11.375,
                                "cast": 2.17
                    }
        },
        {
                    "name": "Crack Whip",
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
                                "range": 30.0,
                                "recharge": 15.0,
                                "endurance": 17.94,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 1.13
                                },
                                "dotDamage": -1.25,
                                "dotTicks": 3
                    }
        },
        {
                    "name": "Summon Demons",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 10.0,
                                "endurance": 9.62,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Hell on Earth",
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
                                "range": 60.0,
                                "recharge": 600.0,
                                "endurance": 16.25,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 45
                    }
        },
        {
                    "name": "Summon Demon Prince",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "Slow",
                                "EnduranceReduction",
                                "Sleep",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 15.0,
                                "endurance": 13.18,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Abyssal Empowerment",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 30.0,
                                "recharge": 10.0,
                                "endurance": 11.375,
                                "cast": 2.07
                    }
        }
    ]
};
