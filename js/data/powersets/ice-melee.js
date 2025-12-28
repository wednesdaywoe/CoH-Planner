/**
 * City of Heroes: Ice Melee
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ice-melee'] = {
    name: "Ice Melee",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Frozen Fists",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.1
                                },
                                "slow": 0.1,
                                "rechargeDebuff": 0.1
                    }
        },
        {
                    "name": "Ice Sword",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.5
                                },
                                "slow": 0.1,
                                "rechargeDebuff": 0.1
                    }
        },
        {
                    "name": "Frost",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 10.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 2.27,
                                "damage": {
                                            "scale": 0.27
                                },
                                "rechargeDebuff": 0.2,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Build Up",
                    "available": 5,
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
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Ice Patch",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 2.0,
                                "recharge": 35.0,
                                "endurance": 10.4,
                                "cast": 1.57
                    }
        },
        {
                    "name": "Confront",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 3.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Greater Ice Sword",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 0.96
                                },
                                "rechargeDebuff": 0.2,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Freezing Touch",
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
                                "range": 7.0,
                                "recharge": 16.0,
                                "endurance": 10.192,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.265
                                },
                                "dotDamage": 0.265,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Frozen Aura",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.1,
                                "damage": {
                                            "scale": 1.3809
                                }
                    }
        }
    ]
};
