/**
 * City of Heroes: Energy Manipulation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['energy-manipulation'] = {
    name: "Energy Manipulation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Energy Punch",
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
                                "cast": 0.83,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Power Thrust",
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
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.4
                                }
                    }
        },
        {
                    "name": "Build Up",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
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
                    "name": "Bone Smasher",
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
                                "range": 7.0,
                                "recharge": 14.0,
                                "endurance": 13.52,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 1.82
                                }
                    }
        },
        {
                    "name": "Energize",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 120.0,
                                "endurance": 5.2,
                                "cast": 1.17,
                                "buffDuration": 60.0,
                                "heal": 1.125
                    }
        },
        {
                    "name": "Stun",
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
                                "range": 7.0,
                                "recharge": 12.0,
                                "endurance": 10.192,
                                "cast": 1.8
                    }
        },
        {
                    "name": "Power Boost",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "dotDamage": 0.66,
                                "dotTicks": 7,
                                "buffDuration": 15.0,
                                "speedBuff": 0.66,
                                "absorption": 0.66,
                                "tohitBuff": 0.66,
                                "defenseBuff": 0.66
                    }
        },
        {
                    "name": "Boost Range",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 13.0,
                                "cast": 1.17,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Total Focus",
                    "available": 29,
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
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.53,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        }
    ]
};
