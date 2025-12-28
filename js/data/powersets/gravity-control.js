/**
 * City of Heroes: Gravity Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['gravity-control'] = {
    name: "Gravity Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Crush",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Lift",
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
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.03,
                                "damage": {
                                            "scale": 1.32
                                }
                    }
        },
        {
                    "name": "Gravity Distortion",
                    "available": 1,
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
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 2,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Propel",
                    "available": 5,
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
                                "range": 60.0,
                                "recharge": 8.0,
                                "endurance": 9.36,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 1.96
                                }
                    }
        },
        {
                    "name": "Crushing Field",
                    "available": 7,
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
                                "accuracy": 0.9,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 15.6,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.1
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 2,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Dimension Shift",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 15.6,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Gravity Distortion Field",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 80.0,
                                "recharge": 240.0,
                                "endurance": 15.6,
                                "cast": 1.83
                    }
        },
        {
                    "name": "Wormhole",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 3.0
                    }
        },
        {
                    "name": "Singularity",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "cast": 2.03
                    }
        }
    ]
};
