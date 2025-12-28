/**
 * City of Heroes: Icy Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['icy-assault'] = {
    name: "Icy Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Ice Bolt",
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
                                "range": 80.0,
                                "recharge": 5.0,
                                "endurance": 6.032,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.232
                                },
                                "speedBuff": 0.2,
                                "buffDuration": 6.0,
                                "rechargeBuff": 0.2
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
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.7649
                                },
                                "speedBuff": 0.1,
                                "buffDuration": 8.0,
                                "rechargeBuff": 0.1
                    }
        },
        {
                    "name": "Ice Sword Circle",
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
                                "recharge": 22.0,
                                "endurance": 20.176,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.595
                                },
                                "speedBuff": 0.1,
                                "buffDuration": 8.0,
                                "rechargeBuff": 0.1
                    }
        },
        {
                    "name": "Ice Blast",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.32
                                },
                                "rechargeBuff": 0.2,
                                "buffDuration": 10.0,
                                "speedBuff": 0.2
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
                    "name": "Frost Breath",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 40.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.7
                                },
                                "buffDuration": 0.6,
                                "rechargeBuff": 0.2,
                                "speedBuff": 0.2
                    }
        },
        {
                    "name": "Chilling Embrace",
                    "available": 23,
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
                                "recharge": 2.0,
                                "endurance": 0.52,
                                "cast": 0.73,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 2,
                                "speedBuff": 0.4,
                                "buffDuration": 5.0,
                                "rechargeBuff": 0.4
                    }
        },
        {
                    "name": "Ice Slash",
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
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 17.0,
                                "endurance": 16.016,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 1.54
                                },
                                "rechargeBuff": 0.2,
                                "buffDuration": 10.0,
                                "speedBuff": 0.2
                    }
        },
        {
                    "name": "Bitter Ice Blast",
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
                                "range": 80.0,
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 1.0
                                },
                                "tohitDebuff": 1.0,
                                "buffDuration": 6.0,
                                "rechargeBuff": 0.2,
                                "speedBuff": 0.2
                    }
        }
    ]
};
