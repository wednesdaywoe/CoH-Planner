/**
 * City of Heroes: Marine Affinity
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['marine-affinity'] = {
    name: "Marine Affinity",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Shoal Rush",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 10.4,
                                "cast": 2.17,
                                "defenseDebuff": 1.6,
                                "buffDuration": 20.0,
                                "speedBuff": 0.448,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Soothing Wave",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 45.0,
                                "recharge": 10.0,
                                "endurance": 13.52,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Toroidal Bubble",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 8.0,
                                "cast": 1.77,
                                "damage": {
                                            "scale": 2.5
                                },
                                "dotDamage": 2.5,
                                "dotTicks": 30,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Whitecap",
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
                                "range": 80.0,
                                "recharge": 30.0,
                                "endurance": 18.0,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Tide Pool",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 13.0,
                                "cast": 2.33,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Brine",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 7.0,
                                "cast": 2.07,
                                "dotDamage": -3.0,
                                "dotTicks": 30,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Shifting Tides",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 0.078,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.5
                                },
                                "buffDuration": 2.0,
                                "tohitBuff": 0.08
                    }
        },
        {
                    "name": "Barrier Reef",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 40.0,
                                "recharge": 30.0,
                                "endurance": 13.52,
                                "cast": 2.37,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Power of the Depths",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 240.0,
                                "endurance": 26.0,
                                "cast": 3.0,
                                "buffDuration": 60.0,
                                "heal": 2.0
                    }
        }
    ]
};
