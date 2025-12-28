/**
 * City of Heroes: Bio Organic Armor
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['bio-organic-armor'] = {
    name: "Bio Organic Armor",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Defensive Adaptation",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 1.0
                    }
        },
        {
                    "name": "Efficient Adaptation",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 0.67
                    }
        },
        {
                    "name": "Offensive Adaptation",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 0.67
                    }
        },
        {
                    "name": "Hardened Carapace",
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
                                            "scale": 2.5
                                }
                    }
        },
        {
                    "name": "Inexhaustible",
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
                                "slow": 0.3,
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Environmental Modification",
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
                                "cast": 0.73
                    }
        },
        {
                    "name": "Adaptation",
                    "available": 9,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Ablative Carapace",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 10.4,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Evolving Armor",
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
                                "endurance": 0.26,
                                "cast": 2.93
                    }
        },
        {
                    "name": "DNA Siphon",
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
                                "recharge": 90.0,
                                "endurance": 13.0,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Genetic Contamination",
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
                                "cast": 1.07,
                                "damage": {
                                            "scale": 0.15
                                },
                                "dotDamage": 1.5,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Parasitic Aura",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.5,
                                "recharge": 270.0,
                                "endurance": 18.2,
                                "cast": 1.87,
                                "damage": {
                                            "scale": 2.66
                                },
                                "dotDamage": 2.66,
                                "dotTicks": 15
                    }
        }
    ]
};
