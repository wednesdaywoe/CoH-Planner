/**
 * City of Heroes: Radiation Armor
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['radiation-armor'] = {
    name: "Radiation Armor",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Alpha Barrier",
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
                                "endurance": 0.13,
                                "cast": 0.67,
                                "damage": {
                                            "scale": 3.0
                                }
                    }
        },
        {
                    "name": "Gamma Boost",
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
                    "name": "Proton Armor",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.13,
                                "cast": 0.67,
                                "damage": {
                                            "scale": 4.0
                                }
                    }
        },
        {
                    "name": "Fallout Shelter",
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
                                "damage": {
                                            "scale": 0.5
                                },
                                "slow": 1.05,
                                "rechargeDebuff": 1.05
                    }
        },
        {
                    "name": "Radiation Therapy",
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
                                "accuracy": 1.2,
                                "recharge": 60.0,
                                "endurance": 13.0,
                                "cast": 1.03
                    }
        },
        {
                    "name": "Beta Decay",
                    "available": 19,
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
                                "cast": 0.67,
                                "rechargeDebuff": 0.025
                    }
        },
        {
                    "name": "Particle Shielding",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 120.0,
                                "endurance": 10.4,
                                "cast": 0.73
                    }
        },
        {
                    "name": "Ground Zero",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.2,
                                "recharge": 90.0,
                                "endurance": 13.0,
                                "cast": 3.0
                    }
        },
        {
                    "name": "Meltdown",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 480.0,
                                "endurance": 2.6,
                                "cast": 2.93,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 30
                    }
        }
    ]
};
