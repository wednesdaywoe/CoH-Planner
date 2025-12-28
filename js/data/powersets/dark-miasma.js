/**
 * City of Heroes: Dark Miasma
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['dark-miasma'] = {
    name: "Dark Miasma",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Tar Patch",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 90.0,
                                "recharge": 90.0,
                                "endurance": 7.8,
                                "cast": 3.1,
                                "buffDuration": 45.0
                    }
        },
        {
                    "name": "Twilight Grasp",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 7.8,
                                "cast": 2.37,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 10,
                                "tohitDebuff": 0.5,
                                "buffDuration": 20.0
                    }
        },
        {
                    "name": "Darkest Night",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 10.0,
                                "endurance": 0.26,
                                "cast": 3.17,
                                "damage": {
                                            "scale": 3.0
                                },
                                "buffDuration": 0.75,
                                "tohitDebuff": 1.5
                    }
        },
        {
                    "name": "Howling Twilight",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 180.0,
                                "endurance": 26.0,
                                "cast": 3.17,
                                "damage": {
                                            "scale": 0.25
                                },
                                "speedBuff": 0.5,
                                "buffDuration": 30.0,
                                "rechargeBuff": 0.5
                    }
        },
        {
                    "name": "Shadow Fall",
                    "available": 7,
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
                                "cast": 2.03,
                                "damage": {
                                            "scale": 2.0
                                },
                                "buffDuration": 0.75
                    }
        },
        {
                    "name": "Fearsome Stare",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 40.0,
                                "endurance": 8.528,
                                "cast": 2.03,
                                "tohitDebuff": 1.5,
                                "buffDuration": 20.0
                    }
        },
        {
                    "name": "Petrifying Gaze",
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
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 16.0,
                                "endurance": 7.8,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Black Hole",
                    "available": 21,
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
                                "range": 50.0,
                                "recharge": 120.0,
                                "endurance": 13.0,
                                "cast": 1.03
                    }
        },
        {
                    "name": "Dark Servant",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 240.0,
                                "endurance": 26.0,
                                "cast": 3.17,
                                "buffDuration": 240.0
                    }
        }
    ]
};
