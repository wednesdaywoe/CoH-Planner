/**
 * City of Heroes: Fire Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['fire-manipulation'] = {
    name: "Fire Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Fire Sword",
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
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 1.96
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "buffDuration": 3.1,
                                "defenseDebuff": 0.5
                    }
        },
        {
                    "name": "Ring of Fire",
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
                                "range": 60.0,
                                "recharge": 6.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 4,
                                "buffDuration": 9.2
                    }
        },
        {
                    "name": "Combustion",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 13.0,
                                "cast": 2.4,
                                "damage": {
                                            "scale": 0.5
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 3,
                                "buffDuration": 7.1
                    }
        },
        {
                    "name": "Fire Sword Circle",
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
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.755
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1,
                                "buffDuration": 2.1
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
                    "name": "Cauterizing Aura",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.2
                                }
                    }
        },
        {
                    "name": "Consume",
                    "available": 23,
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
                                "recharge": 180.0,
                                "endurance": 0.52,
                                "cast": 2.03,
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Burn",
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
                                "recharge": 25.0,
                                "endurance": 5.2,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 1.44
                                }
                    }
        },
        {
                    "name": "Hot Feet",
                    "available": 29,
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
                                "recharge": 20.0,
                                "endurance": 2.08,
                                "cast": 1.47,
                                "damage": {
                                            "scale": 0.25
                                },
                                "buffDuration": 15.0,
                                "speedBuff": 0.7
                    }
        }
    ]
};
