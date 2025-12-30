/**
 * City of Heroes: Wind Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['wind-control'] = {
    name: "Wind Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Clear Skies",
                    "available": 0,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "rechargeDebuff": 0.25
                    }
        },
        {
                    "name": "Downdraft",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.87,
                                "damage": {
                                            "scale": 1.0
                                },
                                "slow": 0.3,
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Updraft",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.03,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Breathless",
                    "available": 1,
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
                                "accuracy": 0.9,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 15.6,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 0.3
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 7,
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Wind Shear",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 2.08,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 1.25
                                },
                                "dotDamage": 1.25,
                                "dotTicks": 1,
                                "slow": -1.0
                    }
        },
        {
                    "name": "Thundergust",
                    "available": 7,
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
                                "recharge": 30.0,
                                "endurance": 10.4,
                                "cast": 2.17,
                                "damage": {
                                            "scale": 0.24
                                }
                    }
        },
        {
                    "name": "Microburst",
                    "available": 11,
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
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 2.37,
                                "damage": {
                                            "scale": 0.2
                                },
                                "slow": 0.3,
                                "rechargeDebuff": 0.3
                    }
        },
        {
                    "name": "Keening Winds",
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
                                "accuracy": 0.8,
                                "range": 80.0,
                                "recharge": 120.0,
                                "endurance": 10.4,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Vacuum",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "recharge": 240.0,
                                "endurance": 15.6,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 0.15
                                }
                    }
        },
        {
                    "name": "Vortex",
                    "available": 25,
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
                                "recharge": 240.0,
                                "endurance": 20.8,
                                "cast": 1.87
                    }
        }
    ]
};
