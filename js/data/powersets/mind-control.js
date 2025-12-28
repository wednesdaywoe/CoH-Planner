/**
 * City of Heroes: Mind Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['mind-control'] = {
    name: "Mind Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Levitate",
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
                                "cast": 1.87,
                                "damage": {
                                            "scale": 1.32
                                }
                    }
        },
        {
                    "name": "Mesmerize",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.1,
                                "range": 100.0,
                                "recharge": 6.0,
                                "endurance": 5.2,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.809
                                }
                    }
        },
        {
                    "name": "Dominate",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "cast": 1.1,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Confuse",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Mass Hypnosis",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 45.0,
                                "endurance": 15.6,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Telekinesis",
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
                                "range": 50.0,
                                "recharge": 90.0,
                                "endurance": 0.26,
                                "cast": 1.13
                    }
        },
        {
                    "name": "Total Domination",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Terrify",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 40.0,
                                "endurance": 20.8,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Mass Confusion",
                    "available": 25,
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67
                    }
        }
    ]
};
