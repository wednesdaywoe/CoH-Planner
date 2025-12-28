/**
 * City of Heroes: Temporal Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['temporal-manipulation'] = {
    name: "Temporal Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Aging Touch",
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
                                "range": 7.0,
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.02
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Time Wall",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.6,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.106,
                                "dotTicks": 4,
                                "slow": -1.0,
                                "rechargeDebuff": 0.6
                    }
        },
        {
                    "name": "Time Stop",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 16.0,
                                "endurance": 11.388,
                                "cast": 2.17,
                                "damage": {
                                            "scale": 0.143
                                },
                                "dotDamage": -0.25,
                                "dotTicks": 10
                    }
        },
        {
                    "name": "Chronos",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 10.4,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5,
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "End of Time",
                    "available": 15,
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
                                "range": 7.0,
                                "recharge": 17.0,
                                "endurance": 16.016,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.924
                                },
                                "dotDamage": 0.054,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Temporal Healing",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "cast": 2.03,
                                "slow": 0.2,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Future Pain",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 18.0,
                                "endurance": 16.848,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 3.24
                                },
                                "dotDamage": 0.11,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Time Shift",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 70.0,
                                "recharge": 90.0,
                                "endurance": 20.18,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.033
                                },
                                "dotDamage": 0.033,
                                "dotTicks": 4,
                                "slow": 0.4
                    }
        },
        {
                    "name": "Time Lord",
                    "available": 29,
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
                                "rechargeDebuff": 0.3,
                                "slow": 0.3
                    }
        }
    ]
};
