/**
 * City of Heroes: Earth Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['earth-assault'] = {
    name: "Earth Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Stone Mallet",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.6,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Stone Spears",
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
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Tremor",
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
                                "recharge": 18.0,
                                "endurance": 16.848,
                                "cast": 2.53,
                                "damage": {
                                            "scale": 0.9969
                                }
                    }
        },
        {
                    "name": "Hurl Boulder",
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
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 2.28
                                },
                                "buffDuration": 15.0
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
                    "name": "Heavy Mallet",
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
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 1.63,
                                "damage": {
                                            "scale": 2.76
                                }
                    }
        },
        {
                    "name": "Seismic Smash",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "cast": 1.5,
                                "damage": {
                                            "scale": 3.56
                                }
                    }
        },
        {
                    "name": "Mud Pots",
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
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 1.04,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.13
                                },
                                "speedBuff": 0.5,
                                "buffDuration": 5.0,
                                "slow": 1.5
                    }
        },
        {
                    "name": "Fissure",
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
                                "range": 20.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 2.1,
                                "damage": {
                                            "scale": 1.17
                                }
                    }
        }
    ]
};
