/**
 * City of Heroes: Poison
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['poison'] = {
    name: "Poison",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Alkaloid",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 13.0,
                                "cast": 1.53,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 30,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Envenom",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 12.0,
                                "endurance": 10.4,
                                "cast": 1.33,
                                "dotDamage": 2.0,
                                "dotTicks": 15,
                                "defenseDebuff": 1.5,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Weaken",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 16.0,
                                "endurance": 10.4,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 15,
                                "buffDuration": 30.0,
                                "tohitDebuff": 0.75
                    }
        },
        {
                    "name": "Neurotoxic Breath",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 30.0,
                                "endurance": 10.4,
                                "cast": 2.67,
                                "rechargeBuff": 0.65,
                                "buffDuration": 20.0,
                                "speedBuff": 0.65,
                                "slow": 1.5
                    }
        },
        {
                    "name": "Elixir of Life",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 15.0,
                                "recharge": 180.0,
                                "endurance": 26.0,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 4.0
                                },
                                "dotDamage": 4.0,
                                "dotTicks": 45,
                                "buffDuration": 0.5,
                                "rechargeBuff": 1.0,
                                "tohitBuff": 3.0,
                                "tohitDebuff": 3.0
                    }
        },
        {
                    "name": "Antidote",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.53,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 45,
                                "buffDuration": 90.0,
                                "rechargeDebuff": 0.5,
                                "speedBuff": 0.5
                    }
        },
        {
                    "name": "Paralytic Poison",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 16.0,
                                "endurance": 7.8,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Poison Trap",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 10.4,
                                "cast": 1.0,
                                "buffDuration": 260.0
                    }
        },
        {
                    "name": "Venomous Gas",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 0.26,
                                "cast": 2.03,
                                "buffDuration": 0.75,
                                "defenseDebuff": 1.0,
                                "tohitDebuff": 1.0
                    }
        }
    ]
};
