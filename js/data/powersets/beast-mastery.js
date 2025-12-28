/**
 * City of Heroes: Beast Mastery
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['beast-mastery'] = {
    name: "Beast Mastery",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Call Swarm",
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
                                "recharge": 3.0,
                                "endurance": 5.46,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.1848
                                },
                                "dotDamage": 0.1848,
                                "dotTicks": 1,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Summon Wolves",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
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
                                "cast": 1.97
                    }
        },
        {
                    "name": "Call Hawk",
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 6.0,
                                "endurance": 9.62,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.3256
                                }
                    }
        },
        {
                    "name": "Train Beasts",
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
                                "cast": 1.67
                    }
        },
        {
                    "name": "Call Ravens",
                    "available": 7,
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
                                "accuracy": 1.155,
                                "range": 40.0,
                                "recharge": 14.0,
                                "endurance": 16.9,
                                "cast": 2.17,
                                "damage": {
                                            "scale": 0.3036
                                },
                                "dotDamage": 0.3036,
                                "dotTicks": 1,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Summon Lions",
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
                    "name": "Fortify Pack",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 240.0,
                                "endurance": 16.25,
                                "cast": 2.27
                    }
        },
        {
                    "name": "Summon Dire Wolf",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Fear",
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
                    "name": "Tame Beasts",
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
                                "cast": 1.07
                    }
        }
    ]
};
