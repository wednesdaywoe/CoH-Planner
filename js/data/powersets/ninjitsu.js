/**
 * City of Heroes: Ninjitsu
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ninjitsu'] = {
    name: "Ninjitsu",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Danger Sense",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "cast": 0.83
                    }
        },
        {
                    "name": "Ninja Reflexes",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "cast": 1.53
                    }
        },
        {
                    "name": "Shinobi-Iri",
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
                                "endurance": 0.13
                    }
        },
        {
                    "name": "Kuji-In Rin",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 200.0,
                                "endurance": 10.4,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 60,
                                "rechargeDebuff": 0.3,
                                "slow": 0.1
                    }
        },
        {
                    "name": "Seishinteki Kyoyo",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "cast": 1.83
                    }
        },
        {
                    "name": "Kuji-In Sha",
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
                                "endurance": 10.4,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 30
                    }
        },
        {
                    "name": "Bo Ryaku",
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
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Blinding Powder",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 25.0,
                                "recharge": 120.0,
                                "endurance": 7.8,
                                "cast": 1.07
                    }
        },
        {
                    "name": "Kuji-In Retsu",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 1000.0,
                                "endurance": 2.6,
                                "cast": 1.83,
                                "slow": 0.5
                    }
        }
    ]
};
