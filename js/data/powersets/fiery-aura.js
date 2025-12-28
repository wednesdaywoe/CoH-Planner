/**
 * City of Heroes: Fiery Aura
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['fiery-aura'] = {
    name: "Fiery Aura",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Blazing Aura",
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
                                "recharge": 4.0,
                                "endurance": 1.04,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.22
                                }
                    }
        },
        {
                    "name": "Fire Shield",
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
                                "cast": 1.67,
                                "damage": {
                                            "scale": 3.0
                                }
                    }
        },
        {
                    "name": "Phoenix Rising",
                    "available": 0,
                    "maxSlots": 0,
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
                    "name": "Healing Flames",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 40.0,
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
                    "name": "Temperature Protection",
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
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 5,
                                "slow": 0.2,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Plasma Shield",
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
                                "cast": 3.0,
                                "damage": {
                                            "scale": 3.0
                                },
                                "rechargeDebuff": 0.3,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Consume",
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
                                "recharge": 180.0,
                                "endurance": 0.52,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Burn",
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
                                "recharge": 25.0,
                                "endurance": 5.2,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 1.44
                                }
                    }
        },
        {
                    "name": "Fiery Embrace",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 180.0,
                                "endurance": 7.8,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 10.0
                                },
                                "dotDamage": 10.0,
                                "dotTicks": 10
                    }
        },
        {
                    "name": "Phoenix Rising",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 300.0,
                                "cast": 2.0
                    }
        }
    ]
};
