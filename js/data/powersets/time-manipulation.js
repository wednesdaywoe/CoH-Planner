/**
 * City of Heroes: Time Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['time-manipulation'] = {
    name: "Time Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Temporal Mending",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 18.0,
                                "endurance": 13.0,
                                "cast": 2.03,
                                "dotDamage": 0.3,
                                "dotTicks": 3,
                                "rechargeDebuff": 0.2,
                                "speedBuff": 0.2,
                                "buffDuration": 30.0,
                                "heal": 1.0
                    }
        },
        {
                    "name": "Time Crawl",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 10.4,
                                "cast": 1.6,
                                "speedBuff": 0.5,
                                "buffDuration": 20.0,
                                "rechargeBuff": 0.6,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Time's Juncture",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "endurance": 0.39,
                                "cast": 0.67,
                                "damage": {
                                            "scale": 2.0
                                },
                                "tohitDebuff": 1.5,
                                "buffDuration": 1.0,
                                "speedBuff": 0.36,
                                "slow": 1.2
                    }
        },
        {
                    "name": "Temporal Selection",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 120.0,
                                "endurance": 10.4,
                                "cast": 2.27,
                                "damage": {
                                            "scale": 2.5
                                },
                                "dotDamage": 2.5,
                                "dotTicks": 60,
                                "rechargeBuff": 0.3,
                                "buffDuration": 120.0,
                                "heal": 1.5
                    }
        },
        {
                    "name": "Distortion Field",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 60.0,
                                "endurance": 14.56,
                                "cast": 2.03,
                                "buffDuration": 45.0
                    }
        },
        {
                    "name": "Time Stop",
                    "available": 11,
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
                                "endurance": 8.84,
                                "cast": 2.17,
                                "dotDamage": -0.25,
                                "dotTicks": 10,
                                "buffDuration": 20.0
                    }
        },
        {
                    "name": "Farsight",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 240.0,
                                "endurance": 15.6,
                                "cast": 2.03,
                                "buffDuration": 120.0,
                                "tohitBuff": 1.0
                    }
        },
        {
                    "name": "Slowed Response",
                    "available": 21,
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
                                "range": 80.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 2.27,
                                "dotDamage": -3.0,
                                "dotTicks": 15,
                                "buffDuration": 30.0,
                                "defenseDebuff": 2.5
                    }
        },
        {
                    "name": "Chrono Shift",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 360.0,
                                "endurance": 20.8,
                                "cast": 2.03,
                                "dotDamage": 0.2,
                                "dotTicks": 15,
                                "buffDuration": 30.0,
                                "rechargeBuff": 0.5
                    }
        }
    ]
};
