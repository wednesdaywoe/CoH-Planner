/**
 * City of Heroes: Fire Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['fire-control'] = {
    name: "Fire Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Char",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "cast": 1.07,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Fire Cages",
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
                                "cast": 1.03,
                                "damage": {
                                            "scale": 0.11
                                },
                                "dotDamage": 0.11,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Smoke",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 7.8,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Hot Feet",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 2.08,
                                "cast": 1.47,
                                "damage": {
                                            "scale": 0.25
                                },
                                "slow": 0.7
                    }
        },
        {
                    "name": "Flashfire",
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
                                "accuracy": 0.8,
                                "range": 70.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 2.37,
                                "damage": {
                                            "scale": 0.06
                                },
                                "dotDamage": 0.06,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Cinders",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.07
                    }
        },
        {
                    "name": "Bonfire",
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
                                "range": 70.0,
                                "recharge": 60.0,
                                "endurance": 13.0,
                                "cast": 3.07
                    }
        },
        {
                    "name": "Fire Imps",
                    "available": 25,
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
                                "accuracy": 1.2,
                                "range": 60.0,
                                "recharge": 240.0,
                                "endurance": 26.0,
                                "cast": 2.03
                    }
        }
    ]
};
