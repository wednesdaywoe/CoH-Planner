/**
 * City of Heroes: Earth Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['earth-control'] = {
    name: "Earth Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Fossilize",
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
                                "cast": 2.07,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Stone Prison",
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
                                "cast": 1.23,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Stone Cages",
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
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.1
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Quicksand",
                    "available": 5,
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
                                "range": 90.0,
                                "recharge": 30.0,
                                "endurance": 7.8,
                                "cast": 3.1
                    }
        },
        {
                    "name": "Salt Crystals",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 45.0,
                                "endurance": 15.6,
                                "cast": 1.07
                    }
        },
        {
                    "name": "Stalagmites",
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
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.25
                                }
                    }
        },
        {
                    "name": "Earthquake",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 90.0,
                                "endurance": 10.4,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Volcanic Gasses",
                    "available": 21,
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
                                "accuracy": 1.4,
                                "range": 60.0,
                                "recharge": 240.0,
                                "endurance": 18.2,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Animate Stone",
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
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 240.0,
                                "endurance": 20.8,
                                "cast": 3.2
                    }
        }
    ]
};
