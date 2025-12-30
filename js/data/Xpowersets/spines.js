/**
 * City of Heroes: Spines
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['spines'] = {
    name: "Spines",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Barb Swipe",
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
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.84
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "slow": 0.2,
                                "rechargeDebuff": 0.1
                    }
        },
        {
                    "name": "Lunge",
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
                                "cast": 1.63,
                                "damage": {
                                            "scale": 1.32
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "slow": 0.2,
                                "rechargeDebuff": 0.1
                    }
        },
        {
                    "name": "Spine Burst",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 3.0,
                                "damage": {
                                            "scale": 0.9
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "slow": 0.2,
                                "rechargeDebuff": 0.1
                    }
        },
        {
                    "name": "Taunt",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 10.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Ripper",
                    "available": 15,
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 1.7
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 2,
                                "rechargeDebuff": 0.1,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Build Up",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 5.2,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Impale",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 40.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.43,
                                "damage": {
                                            "scale": 1.64
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 2,
                                "slow": 0.3,
                                "rechargeDebuff": 0.1
                    }
        },
        {
                    "name": "Quills",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 1.04,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 0.15
                                },
                                "rechargeDebuff": 0.1,
                                "slow": 0.2
                    }
        },
        {
                    "name": "Throw Spines",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 30.0,
                                "recharge": 12.0,
                                "endurance": 13.0,
                                "cast": 1.63,
                                "damage": {
                                            "scale": 0.1
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 2,
                                "slow": 0.5,
                                "rechargeDebuff": 0.2
                    }
        }
    ]
};
