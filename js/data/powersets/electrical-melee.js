/**
 * City of Heroes: Electrical Melee
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['electrical-melee'] = {
    name: "Electrical Melee",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Charged Brawl",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
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
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.5
                                }
                    }
        },
        {
                    "name": "Havoc Punch",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 0.8
                                }
                    }
        },
        {
                    "name": "Jacobs Ladder",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.5
                                }
                    }
        },
        {
                    "name": "Build Up",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 5.2,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 8.0
                                },
                                "dotDamage": 8.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Thunder Strike",
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
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.53
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
                                "cast": 1.67
                    }
        },
        {
                    "name": "Chain Induction",
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
                                "recharge": 14.0,
                                "endurance": 10.192,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.32
                                }
                    }
        },
        {
                    "name": "Lightning Clap",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 30.0,
                                "endurance": 13.0,
                                "cast": 1.23
                    }
        },
        {
                    "name": "Lightning Rod",
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
                                "recharge": 90.0,
                                "endurance": 13.52,
                                "cast": 2.57
                    }
        }
    ]
};
