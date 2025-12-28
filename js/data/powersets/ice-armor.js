/**
 * City of Heroes: Ice Armor
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ice-armor'] = {
    name: "Ice Armor",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Hoarfrost",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 360.0,
                                "endurance": 14.56,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 60
                    }
        },
        {
                    "name": "Frozen Armor",
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
                                "cast": 0.73,
                                "damage": {
                                            "scale": 3.0
                                }
                    }
        },
        {
                    "name": "Rime",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
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
                    "name": "Chilling Embrace",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.13,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 2,
                                "slow": -1.0,
                                "rechargeDebuff": 0.4
                    }
        },
        {
                    "name": "Wet Ice",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.13,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 3.0
                                },
                                "slow": 0.5,
                                "rechargeDebuff": 0.5
                    }
        },
        {
                    "name": "Glacial Armor",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.13,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 3.0
                                }
                    }
        },
        {
                    "name": "Energy Absorption",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 13.0,
                                "cast": 1.33
                    }
        },
        {
                    "name": "Permafrost",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 5,
                                "slow": 0.2,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Icicles",
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
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 1.04,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.2
                                }
                    }
        },
        {
                    "name": "Icy Bastion",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 300.0,
                                "endurance": 0.1085
                    }
        }
    ]
};
