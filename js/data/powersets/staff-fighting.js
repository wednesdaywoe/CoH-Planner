/**
 * City of Heroes: Staff Fighting
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['staff-fighting'] = {
    name: "Staff Fighting",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Form of the Body",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 0.63
                    }
        },
        {
                    "name": "Form of the Mind",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 0.63
                    }
        },
        {
                    "name": "Form of the Soul",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 0.63
                    }
        },
        {
                    "name": "Mercurial Blow",
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
                                "accuracy": 1.05,
                                "range": 9.0,
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 1.0
                    }
        },
        {
                    "name": "Precise Strike",
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
                                "accuracy": 1.1,
                                "range": 9.0,
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.13
                    }
        },
        {
                    "name": "Guarded Spin",
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
                                "accuracy": 1.05,
                                "range": 9.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.83
                    }
        },
        {
                    "name": "Eye of the Storm",
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
                                "accuracy": 1.05,
                                "recharge": 17.0,
                                "endurance": 16.016,
                                "cast": 2.57
                    }
        },
        {
                    "name": "Staff Mastery",
                    "available": 7,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0
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
                                "cast": 2.0
                    }
        },
        {
                    "name": "Serpent's Reach",
                    "available": 17,
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
                                "accuracy": 1.05,
                                "range": 40.0,
                                "recharge": 9.0,
                                "endurance": 9.36,
                                "cast": 1.77,
                                "damage": {
                                            "scale": 1.9989
                                }
                    }
        },
        {
                    "name": "Innocuous Strikes",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.05,
                                "range": 9.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 2.17
                    }
        },
        {
                    "name": "Sky Splitter",
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
                                "accuracy": 1.05,
                                "range": 9.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 2.83
                    }
        }
    ]
};
