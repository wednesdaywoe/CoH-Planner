/**
 * City of Heroes: Storm Summoning
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['storm-summoning'] = {
    name: "Storm Summoning",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Gale",
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
                                "accuracy": 0.9,
                                "range": 50.0,
                                "recharge": 8.0,
                                "endurance": 7.8,
                                "cast": 2.17,
                                "damage": {
                                            "scale": 0.1
                                }
                    }
        },
        {
                    "name": "O2 Boost",
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
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 13.0,
                                "cast": 2.27,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Snow Storm",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 0.26,
                                "cast": 2.03,
                                "speedBuff": 0.5,
                                "buffDuration": 0.75,
                                "rechargeBuff": 0.5,
                                "slow": 1.0
                    }
        },
        {
                    "name": "Steamy Mist",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 0.26,
                                "cast": 1.87,
                                "damage": {
                                            "scale": 2.0
                                },
                                "buffDuration": 0.75
                    }
        },
        {
                    "name": "Freezing Rain",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 60.0,
                                "endurance": 18.2,
                                "cast": 2.03,
                                "buffDuration": 15.0
                    }
        },
        {
                    "name": "Hurricane",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "endurance": 0.1625,
                                "cast": 2.03,
                                "tohitDebuff": 3.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Thunder Clap",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 45.0,
                                "endurance": 10.4,
                                "cast": 2.37
                    }
        },
        {
                    "name": "Tornado",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.3,
                                "range": 60.0,
                                "recharge": 60.0,
                                "endurance": 20.8,
                                "cast": 1.17,
                                "buffDuration": 30.0
                    }
        },
        {
                    "name": "Lightning Storm",
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
                                "accuracy": 1.4,
                                "recharge": 90.0,
                                "endurance": 31.2,
                                "cast": 2.03,
                                "buffDuration": 60.0
                    }
        }
    ]
};
