/**
 * City of Heroes: Darkness Affinity
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['darkness-affinity'] = {
    name: "Darkness Affinity",
    type: "primary",
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
                                "cast": 3.1
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
                                "dotTicks": 10
                    }
        },
        {
                    "name": "Darkest Night",
                    "available": 3,
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
                                }
                    }
        },
        {
                    "name": "Howling Twilight",
                    "available": 9,
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
                                "slow": 0.5,
                                "rechargeDebuff": 0.5
                    }
        },
        {
                    "name": "Shadow Fall",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "endurance": 0.26,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 2.0
                                }
                    }
        },
        {
                    "name": "Fade",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 210.0,
                                "endurance": 7.8,
                                "cast": 2.03,
                                "damage": {
                                            "scale": 1.25
                                },
                                "dotDamage": 1.25,
                                "dotTicks": 30
                    }
        },
        {
                    "name": "Soul Absorption",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.2,
                                "recharge": 160.0,
                                "cast": 3.0
                    }
        },
        {
                    "name": "Black Hole",
                    "available": 27,
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
                    "available": 29,
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
                                "cast": 3.17
                    }
        }
    ]
};
