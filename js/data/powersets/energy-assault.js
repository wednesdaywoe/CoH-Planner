/**
 * City of Heroes: Energy Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['energy-assault'] = {
    name: "Energy Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Bone Smasher",
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
                                "cast": 1.5,
                                "damage": {
                                            "scale": 0.784
                                },
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Power Bolt",
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
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.4
                                }
                    }
        },
        {
                    "name": "Power Push",
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
                                "accuracy": 1.4,
                                "range": 70.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.1,
                                "damage": {
                                            "scale": 0.656
                                }
                    }
        },
        {
                    "name": "Power Blast",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
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
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.49
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
                    "name": "Whirling Hands",
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
                                "cast": 2.5,
                                "damage": {
                                            "scale": 0.4601
                                }
                    }
        },
        {
                    "name": "Total Focus",
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
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 22.0,
                                "endurance": 20.176,
                                "cast": 2.53,
                                "damage": {
                                            "scale": 1.552
                                }
                    }
        },
        {
                    "name": "Sniper Blast",
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
                                "accuracy": 1.0,
                                "range": 150.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.33
                    }
        },
        {
                    "name": "Power Burst",
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
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.78
                                }
                    }
        }
    ]
};
