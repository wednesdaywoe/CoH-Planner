/**
 * City of Heroes: Thugs
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['thugs'] = {
    name: "Thugs",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Call Thugs",
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
                                "cast": 1.67
                    }
        },
        {
                    "name": "Pistols",
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
                                "recharge": 3.0,
                                "endurance": 6.5,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Dual Wield",
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
                                "accuracy": 1.1,
                                "range": 80.0,
                                "recharge": 6.0,
                                "endurance": 8.58,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 0.66
                                }
                    }
        },
        {
                    "name": "Equip Thugs",
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
                                "cast": 1.3
                    }
        },
        {
                    "name": "Empty Clips",
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
                                "accuracy": 1.1,
                                "range": 40.0,
                                "recharge": 8.0,
                                "endurance": 18.98,
                                "cast": 1.83,
                                "damage": {
                                            "scale": 0.2633
                                }
                    }
        },
        {
                    "name": "Call Enforcer",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 10.0,
                                "endurance": 9.62,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Gang War",
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
                                "range": 60.0,
                                "recharge": 600.0,
                                "endurance": 13.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Call Bruiser",
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
                                "cast": 1.67
                    }
        },
        {
                    "name": "Upgrade Equipment",
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
                                "range": 30.0,
                                "recharge": 10.0,
                                "endurance": 11.375,
                                "cast": 1.67
                    }
        }
    ]
};
