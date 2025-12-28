/**
 * City of Heroes: Shield Defense
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['shield-defense'] = {
    name: "Shield Defense",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Deflection",
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
                                "endurance": 0.104,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 1.5
                                }
                    }
        },
        {
                    "name": "Battle Agility",
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
                                "endurance": 0.104,
                                "cast": 1.5
                    }
        },
        {
                    "name": "True Grit",
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
                                "accuracy": 1.0,
                                "damage": {
                                            "scale": 1.5
                                },
                                "dotDamage": 1.5,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Active Defense",
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
                                "cast": 1.5,
                                "rechargeDebuff": 0.3,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Against All Odds",
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
                                "cast": 2.5,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Phalanx Fighting",
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
                    "name": "Grant Cover",
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
                                "endurance": 0.312,
                                "cast": 2.5,
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Shield Charge",
                    "available": 27,
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
                                "range": 60.0,
                                "recharge": 90.0,
                                "endurance": 13.52,
                                "cast": 1.5
                    }
        },
        {
                    "name": "One with the Shield",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 360.0,
                                "endurance": 2.6,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 60
                    }
        }
    ]
};
