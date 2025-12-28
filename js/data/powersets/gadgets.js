/**
 * City of Heroes: Gadgets
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['gadgets'] = {
    name: "Gadgets",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Caltrops",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 1,
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
                    "name": "Toxic Web Grenade",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.37,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4,
                                "buffDuration": 8.2,
                                "rechargeBuff": 0.5,
                                "speedBuff": 0.5
                    }
        },
        {
                    "name": "Taser",
                    "available": 3,
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
                                "range": 20.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 1.96
                                }
                    }
        },
        {
                    "name": "Targeting Drone",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "endurance": 0.156,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 1.6
                                },
                                "buffDuration": 0.6,
                                "tohitBuff": 2.0
                    }
        },
        {
                    "name": "Smoke Grenade",
                    "available": 15,
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
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 7.8,
                                "cast": 1.37,
                                "tohitDebuff": 0.7,
                                "buffDuration": 60.0
                    }
        },
        {
                    "name": "Field Operative",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "cast": 0.73,
                                "buffDuration": 0.75,
                                "heal": 1.125
                    }
        },
        {
                    "name": "Trip Mine",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 30.0,
                                "endurance": 13.0,
                                "cast": 2.77,
                                "buffDuration": 260.0
                    }
        },
        {
                    "name": "Remote Bomb",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 2.0
                    }
        },
        {
                    "name": "Gun Drone",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 180.0,
                                "endurance": 39.0,
                                "cast": 1.0,
                                "buffDuration": 90.0
                    }
        }
    ]
};
