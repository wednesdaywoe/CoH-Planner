/**
 * City of Heroes: Dark Blast
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['dark-blast'] = {
    name: "Dark Blast",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Dark Blast",
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
                    "name": "Gloom",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.1,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Umbral Torrent",
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 1.03,
                                "damage": {
                                            "scale": 0.96
                                }
                    }
        },
        {
                    "name": "Aim",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 5.2,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Moonbeam",
                    "available": 7,
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
                                "range": 150.0,
                                "recharge": 12.0,
                                "endurance": 14.352,
                                "cast": 1.33
                    }
        },
        {
                    "name": "Tenebrous Tentacles",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 40.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.1
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 3
                    }
        },
        {
                    "name": "Abyssal Gaze",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.707
                                },
                                "dotDamage": 0.707,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Life Drain",
                    "available": 21,
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
                                "range": 60.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.93,
                                "damage": {
                                            "scale": 1.64
                                }
                    }
        },
        {
                    "name": "Blackstar",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.4,
                                "recharge": 145.0,
                                "endurance": 27.7316,
                                "cast": 3.0,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        }
    ]
};
