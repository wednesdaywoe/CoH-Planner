/**
 * City of Heroes: Psychic Blast
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['psychic-blast'] = {
    name: "Psychic Blast",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Mental Blast",
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
                                "range": 100.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.64
                                },
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Dominate Will",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 100.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Telekinetic Blast",
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
                                "range": 100.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.46
                                }
                    }
        },
        {
                    "name": "Psionic Darts",
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
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.8321
                                },
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Psychic Focus",
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
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Psionic Lance",
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
                                "range": 175.0,
                                "recharge": 12.0,
                                "endurance": 14.352,
                                "cast": 1.33
                    }
        },
        {
                    "name": "Psionic Tornado",
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
                                "range": 100.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 1.1
                                },
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Scramble Minds",
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
                                "accuracy": 1.0,
                                "range": 100.0,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Psychic Wail",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.5,
                                "recharge": 145.0,
                                "endurance": 27.716,
                                "cast": 1.97,
                                "damage": {
                                            "scale": 4.0
                                },
                                "rechargeDebuff": 0.7
                    }
        }
    ]
};
