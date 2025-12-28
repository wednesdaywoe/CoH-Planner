/**
 * City of Heroes: Trick Arrow
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['trick-arrow'] = {
    name: "Trick Arrow",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Entangling Arrow",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "dotDamage": -2.0,
                                "dotTicks": 15,
                                "speedBuff": 0.1,
                                "buffDuration": 30.0,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Flash Arrow",
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
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 7.8,
                                "cast": 1.0,
                                "tohitDebuff": 0.5,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Glue Arrow",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 60.0,
                                "endurance": 7.8,
                                "cast": 1.16,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Ice Arrow",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 18.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.6
                                },
                                "dotDamage": 1.6,
                                "dotTicks": 30,
                                "speedBuff": 0.3,
                                "buffDuration": 10.0,
                                "rechargeBuff": 0.2
                    }
        },
        {
                    "name": "Poison Gas Arrow",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.5,
                                "range": 70.0,
                                "recharge": 45.0,
                                "endurance": 10.4,
                                "cast": 1.16,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 30,
                                "buffDuration": 20.0
                    }
        },
        {
                    "name": "Acid Arrow",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 20.0,
                                "endurance": 7.8,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 0.01
                                },
                                "dotDamage": 0.01,
                                "dotTicks": 10,
                                "buffDuration": 20.0,
                                "defenseDebuff": 2.0,
                                "rechargeBuff": 2.0,
                                "tohitDebuff": 2.0
                    }
        },
        {
                    "name": "Disruption Arrow",
                    "available": 17,
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
                                "recharge": 30.0,
                                "endurance": 14.56,
                                "cast": 1.16,
                                "buffDuration": 45.0
                    }
        },
        {
                    "name": "Oil Slick Arrow",
                    "available": 21,
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
                                "recharge": 180.0,
                                "endurance": 15.6,
                                "cast": 1.16,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "EMP Arrow",
                    "available": 25,
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
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 300.0,
                                "endurance": 23.4,
                                "cast": 1.83,
                                "buffDuration": 240.0
                    }
        }
    ]
};
