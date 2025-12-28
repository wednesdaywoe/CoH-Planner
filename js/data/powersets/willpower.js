/**
 * City of Heroes: Willpower
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['willpower'] = {
    name: "Willpower",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "High Pain Tolerance",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "damage": {
                                            "scale": 0.75
                                },
                                "dotDamage": 0.75,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Mind Over Body",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.104,
                                "cast": 0.67,
                                "damage": {
                                            "scale": 2.25
                                }
                    }
        },
        {
                    "name": "Fast Healing",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Indomitable Will",
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
                                "endurance": 0.104,
                                "cast": 0.73,
                                "rechargeDebuff": 0.3,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Rise to the Challenge",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "endurance": 0.208,
                                "cast": 3.0
                    }
        },
        {
                    "name": "Quick Recovery",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Heightened Senses",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.104,
                                "cast": 0.67
                    }
        },
        {
                    "name": "Resurgence",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 300.0,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 4.0
                                },
                                "dotDamage": 4.0,
                                "dotTicks": 45,
                                "rechargeDebuff": 1.0
                    }
        },
        {
                    "name": "Strength of Will",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 300.0,
                                "endurance": 2.6,
                                "cast": 3.1,
                                "damage": {
                                            "scale": 2.5
                                },
                                "dotDamage": 2.5,
                                "dotTicks": 60
                    }
        }
    ]
};
