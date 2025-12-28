/**
 * City of Heroes: Plant Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['plant-control'] = {
    name: "Plant Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Entangle",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.2,
                                "damage": {
                                            "scale": 0.1
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Strangler",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 0.22
                                },
                                "dotDamage": 0.22,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Roots",
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
                                "accuracy": 0.9,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 13.0,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.1
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Spore Burst",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 45.0,
                                "endurance": 13.0,
                                "cast": 1.37
                    }
        },
        {
                    "name": "Seeds of Confusion",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 50.0,
                                "recharge": 6.0,
                                "endurance": 15.6,
                                "cast": 1.07
                    }
        },
        {
                    "name": "Spirit Tree",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 120.0,
                                "endurance": 13.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Vines",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 80.0,
                                "recharge": 240.0,
                                "endurance": 15.6,
                                "cast": 2.1
                    }
        },
        {
                    "name": "Carrion Creepers",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
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
                                "recharge": 360.0,
                                "endurance": 26.0,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Fly Trap",
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
                                "range": 50.0,
                                "recharge": 240.0,
                                "endurance": 26.0,
                                "cast": 1.17
                    }
        }
    ]
};
