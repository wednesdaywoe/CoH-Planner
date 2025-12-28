/**
 * City of Heroes: Electric Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['electric-control'] = {
    name: "Electric Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Electric Fence",
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
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 4
                    }
        },
        {
                    "name": "Tesla Cage",
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
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.0
                                }
                    }
        },
        {
                    "name": "Chain Fences",
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
                                "endurance": 15.6,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.3
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Jolting Chain",
                    "available": 5,
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
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 10.4,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 0.7272
                                }
                    }
        },
        {
                    "name": "Conductive Aura",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 15.0,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Static Field",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 40.0,
                                "endurance": 15.6,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Tesla Coil",
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
                                "cast": 1.67
                    }
        },
        {
                    "name": "Synaptic Overload",
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
                                "range": 80.0,
                                "recharge": 6.0,
                                "endurance": 15.6,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Gremlins",
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
