/**
 * City of Heroes: Cold Domination
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['cold-domination'] = {
    name: "Cold Domination",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Ice Shield",
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
                                "recharge": 2.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.25
                                },
                                "dotDamage": 1.25,
                                "dotTicks": 120,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Infrigidate",
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
                                "cast": 1.0,
                                "damage": {
                                            "scale": 3.0
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 10,
                                "speedBuff": 0.7,
                                "buffDuration": 20.0,
                                "rechargeBuff": 0.7,
                                "defenseDebuff": 2.5,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Snow Storm",
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
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 0.26,
                                "cast": 2.03,
                                "speedBuff": 0.5,
                                "buffDuration": 0.75,
                                "rechargeBuff": 0.5,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Glacial Shield",
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
                                "recharge": 2.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.25
                                },
                                "dotDamage": 1.25,
                                "dotTicks": 120,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Frostwork",
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
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 14.56,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 60,
                                "buffDuration": 120.0
                    }
        },
        {
                    "name": "Arctic Fog",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 0.26,
                                "cast": 1.87,
                                "damage": {
                                            "scale": 2.0
                                },
                                "buffDuration": 0.75,
                                "rechargeDebuff": 0.6,
                                "speedBuff": 0.6
                    }
        },
        {
                    "name": "Benumb",
                    "available": 17,
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
                                "range": 70.0,
                                "recharge": 120.0,
                                "endurance": 13.0,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 15,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Sleet",
                    "available": 21,
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
                                "range": 60.0,
                                "recharge": 60.0,
                                "endurance": 18.2,
                                "cast": 2.03,
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Heat Loss",
                    "available": 25,
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
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 360.0,
                                "endurance": 15.6,
                                "cast": 2.17
                    }
        }
    ]
};
