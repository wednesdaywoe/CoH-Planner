/**
 * City of Heroes: Stone Armor
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['stone-armor'] = {
    name: "Stone Armor",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Rock Armor",
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
                                "cast": 0.73
                    }
        },
        {
                    "name": "Stone Skin",
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
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Earth's Embrace",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 120.0,
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
                    "name": "Mud Pots",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 1.04,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.18
                                },
                                "slow": -1.0
                    }
        },
        {
                    "name": "Rooted",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.104,
                                "cast": 1.17,
                                "rechargeDebuff": 0.3,
                                "slow": -0.9
                    }
        },
        {
                    "name": "Crystal Armor",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.104,
                                "cast": 1.0
                    }
        },
        {
                    "name": "Minerals",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.104,
                                "cast": 0.73,
                                "rechargeDebuff": 0.15
                    }
        },
        {
                    "name": "Brimstone Armor",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.104,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 3.0
                                }
                    }
        },
        {
                    "name": "Geode",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 180.0,
                                "endurance": 0.026,
                                "cast": 0.07
                    }
        }
    ]
};
