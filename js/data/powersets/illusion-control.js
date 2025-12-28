/**
 * City of Heroes: Illusion Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['illusion-control'] = {
    name: "Illusion Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Blind",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
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
                                "range": 80.0,
                                "recharge": 9.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Spectral Wounds",
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
                                "accuracy": 1.1,
                                "range": 80.0,
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 1.64
                                },
                                "slow": 0.0
                    }
        },
        {
                    "name": "Deceive",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Flash",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 3.0
                    }
        },
        {
                    "name": "Superior Invisibility",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.182,
                                "cast": 0.73
                    }
        },
        {
                    "name": "Group Invisibility",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 240.0,
                                "endurance": 10.4,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Phantom Army",
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 240.0,
                                "endurance": 26.0,
                                "cast": 3.1
                    }
        },
        {
                    "name": "Spectral Terror",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 45.0,
                                "endurance": 16.64,
                                "cast": 3.2
                    }
        },
        {
                    "name": "Phantasm",
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
                                "endurance": 26.0,
                                "cast": 2.03
                    }
        }
    ]
};
