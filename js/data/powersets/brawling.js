/**
 * City of Heroes: Brawling
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['brawling'] = {
    name: "Brawling",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Heavy Blow",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 5.0,
                                "endurance": 6.032,
                                "cast": 1.07
                    }
        },
        {
                    "name": "Initial Strike",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 3.0,
                                "endurance": 4.368,
                                "cast": 0.8
                    }
        },
        {
                    "name": "Sweeping Cross",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Combat Readiness",
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
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Rib Cracker",
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
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.33
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
                    "name": "Spinning Strike",
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
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 1.8
                    }
        },
        {
                    "name": "Shin Breaker",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.33,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Crushing Uppercut",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 13.0,
                                "recharge": 25.0,
                                "endurance": 14.352,
                                "cast": 2.17
                    }
        }
    ]
};
