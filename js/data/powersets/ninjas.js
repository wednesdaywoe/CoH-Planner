/**
 * City of Heroes: Ninjas
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['ninjas'] = {
    name: "Ninjas",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Call Genin",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 5.0,
                                "endurance": 5.46,
                                "cast": 1.7
                    }
        },
        {
                    "name": "Snap Shot",
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
                                "accuracy": 1.155,
                                "range": 80.0,
                                "recharge": 2.0,
                                "endurance": 4.42,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.68
                                }
                    }
        },
        {
                    "name": "Aimed Shot",
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
                                "accuracy": 1.155,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 6.5,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Train Ninjas",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 50.0,
                                "recharge": 6.0,
                                "endurance": 11.375,
                                "cast": 2.37
                    }
        },
        {
                    "name": "Fistful of Arrows",
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
                                "accuracy": 1.155,
                                "range": 40.0,
                                "recharge": 8.0,
                                "endurance": 10.66,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.91
                                }
                    }
        },
        {
                    "name": "Call Jounin",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Sleep",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 10.0,
                                "endurance": 9.62,
                                "cast": 1.7
                    }
        },
        {
                    "name": "Smoke Flash",
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
                                "range": 100.0,
                                "recharge": 90.0,
                                "endurance": 15.0,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Oni",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 15.0,
                                "endurance": 13.18,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Kuji-In Zen",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 50.0,
                                "recharge": 10.0,
                                "endurance": 11.375,
                                "cast": 2.37
                    }
        }
    ]
};
