/**
 * City of Heroes: Tactical Arrow
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['tactical-arrow'] = {
    name: "Tactical Arrow",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Electrified Net Arrow",
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
                                "accuracy": 1.2,
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "slow": 1.0,
                                "buffDuration": 0.75,
                                "rechargeBuff": 0.1,
                                "speedBuff": 0.1
                    }
        },
        {
                    "name": "Glue Arrow",
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
                                "recharge": 45.0,
                                "endurance": 7.8,
                                "cast": 1.16
                    }
        },
        {
                    "name": "Ice Arrow",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "range": 60.0,
                                "recharge": 16.0,
                                "endurance": 11.388,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.05
                                },
                                "dotDamage": 0.05,
                                "dotTicks": 2,
                                "speedBuff": 0.3,
                                "buffDuration": 10.0,
                                "rechargeBuff": 0.1
                    }
        },
        {
                    "name": "Upshot",
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
                                "endurance": 5.2,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 6.5
                                },
                                "dotDamage": 6.5,
                                "dotTicks": 5,
                                "tohitBuff": 1.5,
                                "buffDuration": 10.0,
                                "rechargeBuff": 0.15
                    }
        },
        {
                    "name": "Flash Arrow",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 7.8,
                                "cast": 1.0,
                                "buffDuration": 60.0,
                                "tohitDebuff": 0.7
                    }
        },
        {
                    "name": "Eagle Eye",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "cast": 1.17,
                                "tohitBuff": 2.0,
                                "buffDuration": 0.75,
                                "heal": 1.125
                    }
        },
        {
                    "name": "Gymnastics",
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
                                "endurance": 0.13,
                                "buffDuration": 0.5,
                                "rechargeBuff": 0.2,
                                "speedBuff": 0.4,
                                "rechargeDebuff": 0.4
                    }
        },
        {
                    "name": "ESD Arrow",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "cast": 1.83,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Oil Slick Arrow",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 1.16,
                                "buffDuration": 30.0
                    }
        }
    ]
};
