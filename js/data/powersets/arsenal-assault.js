/**
 * City of Heroes: Arsenal Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['arsenal-assault'] = {
    name: "Arsenal Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Burst",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 90.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.27
                                },
                                "buffDuration": 0.91,
                                "defenseDebuff": 1.0
                    }
        },
        {
                    "name": "Buttstroke",
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
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Buckshot",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 40.0,
                                "recharge": 8.0,
                                "endurance": 10.192,
                                "cast": 0.9,
                                "damage": {
                                            "scale": 0.91
                                }
                    }
        },
        {
                    "name": "Elbow Strike",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 7.0,
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 2.28
                                }
                    }
        },
        {
                    "name": "Power Up",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 4.0
                                },
                                "dotDamage": 4.0,
                                "dotTicks": 5,
                                "buffDuration": 10.0,
                                "speedBuff": 0.5,
                                "absorption": 0.5,
                                "tohitBuff": 0.5,
                                "defenseBuff": 0.5
                    }
        },
        {
                    "name": "Trip Mine",
                    "available": 19,
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
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.93,
                                "buffDuration": 170.0
                    }
        },
        {
                    "name": "Targeting Drone",
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
                                "endurance": 0.156,
                                "cast": 1.17,
                                "tohitBuff": 2.0,
                                "buffDuration": 0.75
                    }
        },
        {
                    "name": "Sniper Rifle",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 150.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Ignite",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.15,
                                "range": 60.0,
                                "recharge": 12.0,
                                "endurance": 11.865,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.1254
                                },
                                "dotDamage": 0.1254,
                                "dotTicks": 2,
                                "buffDuration": 5.5
                    }
        }
    ]
};
