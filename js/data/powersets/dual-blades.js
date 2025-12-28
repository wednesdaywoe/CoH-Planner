/**
 * City of Heroes: Dual Blades
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['dual-blades'] = {
    name: "Dual Blades",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Nimble Slash",
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
                                "cast": 1.03,
                                "damage": {
                                            "scale": 0.42
                                }
                    }
        },
        {
                    "name": "Power Slice",
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
                                "recharge": 5.0,
                                "endurance": 6.032,
                                "cast": 1.4,
                                "damage": {
                                            "scale": 0.3867
                                }
                    }
        },
        {
                    "name": "Ablating Strike",
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
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.03,
                                "damage": {
                                            "scale": 0.66
                                }
                    }
        },
        {
                    "name": "Typhoon's Edge",
                    "available": 5,
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
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 2.27,
                                "damage": {
                                            "scale": 0.57
                                }
                    }
        },
        {
                    "name": "Blinding Feint",
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
                                "recharge": 12.0,
                                "endurance": 7.8,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 0.8
                                },
                                "dotDamage": 3.0,
                                "dotTicks": 5
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
                                "cast": 1.93
                    }
        },
        {
                    "name": "Vengeful Slice",
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
                                "range": 7.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.43,
                                "damage": {
                                            "scale": 0.41
                                }
                    }
        },
        {
                    "name": "Sweeping Strike",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 1.23,
                                "damage": {
                                            "scale": 1.7
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "One Thousand Cuts",
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
                                "endurance": 14.352,
                                "cast": 3.3,
                                "damage": {
                                            "scale": 0.151
                                },
                                "dotDamage": 0.151,
                                "dotTicks": 1
                    }
        }
    ]
};
