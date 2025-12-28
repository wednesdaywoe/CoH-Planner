/**
 * City of Heroes: Dark Melee
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['dark-melee'] = {
    name: "Dark Melee",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Shadow Punch",
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
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.34
                                }
                    }
        },
        {
                    "name": "Smite",
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
                                "cast": 0.97,
                                "damage": {
                                            "scale": 0.32
                                }
                    }
        },
        {
                    "name": "Shadow Maul",
                    "available": 1,
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
                                "range": 7.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 2.37,
                                "damage": {
                                            "scale": 0.2023
                                },
                                "dotDamage": 0.2023,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Touch of Fear",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.97
                    }
        },
        {
                    "name": "Siphon Life",
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
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.93,
                                "damage": {
                                            "scale": 1.96
                                }
                    }
        },
        {
                    "name": "Confront",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 3.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Dark Consumption",
                    "available": 17,
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
                                "recharge": 180.0,
                                "endurance": 0.52,
                                "cast": 1.03,
                                "damage": {
                                            "scale": 0.8
                                }
                    }
        },
        {
                    "name": "Soul Drain",
                    "available": 21,
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
                                "recharge": 120.0,
                                "endurance": 15.6,
                                "cast": 2.37,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 0.8,
                                "dotTicks": 15
                    }
        },
        {
                    "name": "Midnight Grasp",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 15.0,
                                "endurance": 11.96,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 2.21
                                },
                                "dotDamage": 0.11,
                                "dotTicks": 1
                    }
        }
    ]
};
