/**
 * City of Heroes: Regeneration
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['regeneration'] = {
    name: "Regeneration",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Fast Healing",
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
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Reconstruction",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 10.4,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 30
                    }
        },
        {
                    "name": "Quick Recovery",
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
                    "name": "Ailment Resistance",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "dotDamage": -0.15,
                                "dotTicks": 5,
                                "slow": 0.2,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Integration",
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
                                "endurance": 0.13,
                                "cast": 3.1,
                                "rechargeDebuff": 0.3,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Resilience",
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
                                "accuracy": 1.0,
                                "damage": {
                                            "scale": 1.25
                                },
                                "dotDamage": 1.25,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Instant Healing",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 650.0,
                                "endurance": 10.4,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Reactive Regeneration",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "endurance": 0.52,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Second Wind",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 360.0,
                                "endurance": 10.4,
                                "cast": 0.73
                    }
        },
        {
                    "name": "Moment of Glory",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 240.0,
                                "endurance": 2.6,
                                "cast": 1.5
                    }
        }
    ]
};
