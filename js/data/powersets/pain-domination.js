/**
 * City of Heroes: Pain Domination
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['pain-domination'] = {
    name: "Pain Domination",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Nullify Pain",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 8.0,
                                "endurance": 13.0,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Soothe",
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
                                "cast": 2.27
                    }
        },
        {
                    "name": "Share Pain",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 0.52,
                                "cast": 2.27,
                                "damage": {
                                            "scale": 2.5
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 7,
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Conduit of Pain",
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
                                "range": 15.0,
                                "recharge": 180.0,
                                "endurance": 26.0,
                                "cast": 3.2,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 30,
                                "buffDuration": 0.5,
                                "rechargeBuff": 0.75,
                                "tohitBuff": 2.0,
                                "tohitDebuff": 2.0
                    }
        },
        {
                    "name": "Enforced Morale",
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
                                "range": 70.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "buffDuration": 90.0,
                                "rechargeBuff": 0.05,
                                "speedBuff": 0.05
                    }
        },
        {
                    "name": "Soothing Aura",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "endurance": 0.78,
                                "cast": 1.67
                    }
        },
        {
                    "name": "World of Pain",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 240.0,
                                "endurance": 10.192,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 1.5
                                },
                                "dotDamage": 1.5,
                                "dotTicks": 45,
                                "tohitBuff": 1.0,
                                "buffDuration": 90.0
                    }
        },
        {
                    "name": "Anguishing Cry",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 120.0,
                                "endurance": 13.0,
                                "cast": 1.97,
                                "dotDamage": -3.0,
                                "dotTicks": 15,
                                "defenseDebuff": 3.0,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Painbringer",
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
                                "range": 80.0,
                                "recharge": 300.0,
                                "endurance": 10.4,
                                "cast": 2.27,
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 45,
                                "buffDuration": 90.0,
                                "heal": 5.0
                    }
        }
    ]
};
