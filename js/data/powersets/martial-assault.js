/**
 * City of Heroes: Martial Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['martial-assault'] = {
    name: "Martial Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Shuriken Throw",
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
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Thunder Kick",
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
                                "range": 7.0,
                                "recharge": 7.0,
                                "endurance": 7.696,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 1.48
                                }
                    }
        },
        {
                    "name": "Trick Shot",
                    "available": 3,
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
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 1.1
                                }
                    }
        },
        {
                    "name": "Spinning Kick",
                    "available": 9,
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
                                "range": 9.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.07,
                                "damage": {
                                            "scale": 1.3434
                                }
                    }
        },
        {
                    "name": "Envenomed Blades",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 160.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "tohitBuff": 0.12,
                                "buffDuration": 40.0
                    }
        },
        {
                    "name": "Dragon's Tail",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.05,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 0.8985
                                }
                    }
        },
        {
                    "name": "Caltrops",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 25.0,
                                "recharge": 45.0,
                                "endurance": 7.8,
                                "cast": 1.07,
                                "buffDuration": 45.0
                    }
        },
        {
                    "name": "Masterful Throw",
                    "available": 27,
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
                                "range": 150.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 1.33
                    }
        },
        {
                    "name": "Explosive Shuriken",
                    "available": 29,
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
                                "range": 80.0,
                                "recharge": 12.0,
                                "endurance": 11.856,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 2.28
                                }
                    }
        }
    ]
};
