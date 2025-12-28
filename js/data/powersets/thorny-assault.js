/**
 * City of Heroes: Thorny Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['thorny-assault'] = {
    name: "Thorny Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Skewer",
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
                                "cast": 0.83,
                                "damage": {
                                            "scale": 1.32
                                },
                                "dotDamage": 0.0805,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "defenseDebuff": 2.0
                    }
        },
        {
                    "name": "Thorny Darts",
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.0595,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "defenseDebuff": 2.0
                    }
        },
        {
                    "name": "Fling Thorns",
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
                                "accuracy": 1.0,
                                "range": 30.0,
                                "recharge": 10.0,
                                "endurance": 11.1754,
                                "cast": 1.63,
                                "damage": {
                                            "scale": 0.7747
                                },
                                "dotDamage": 0.086,
                                "dotTicks": 2,
                                "buffDuration": 4.1,
                                "defenseDebuff": 2.0
                    }
        },
        {
                    "name": "Impale",
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
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.433,
                                "damage": {
                                            "scale": 1.96
                                },
                                "dotDamage": 0.1195,
                                "dotTicks": 3,
                                "buffDuration": 15.0,
                                "speedBuff": 0.3,
                                "defenseDebuff": 3.0
                    }
        },
        {
                    "name": "Build Up",
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
                                "endurance": 5.2,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 5,
                                "tohitBuff": 2.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Thorn Burst",
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
                                "recharge": 17.0,
                                "endurance": 16.016,
                                "cast": 3.0,
                                "damage": {
                                            "scale": 0.95
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "defenseDebuff": 3.0
                    }
        },
        {
                    "name": "Thorntrops",
                    "available": 23,
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
                                "range": 25.0,
                                "recharge": 45.0,
                                "endurance": 7.8,
                                "cast": 1.63,
                                "buffDuration": 45.0
                    }
        },
        {
                    "name": "Ripper",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 2.33,
                                "damage": {
                                            "scale": 2.3
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 2,
                                "buffDuration": 4.1,
                                "defenseDebuff": 3.0
                    }
        },
        {
                    "name": "Thorn Barrage",
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 18.0,
                                "endurance": 15.5765,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.81
                                },
                                "dotDamage": 0.1529,
                                "dotTicks": 1,
                                "buffDuration": 1.75,
                                "defenseDebuff": 3.0
                    }
        }
    ]
};
