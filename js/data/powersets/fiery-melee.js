/**
 * City of Heroes: Fiery Melee
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['fiery-melee'] = {
    name: "Fiery Melee",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Fire Sword",
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
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 1.32
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Scorch",
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
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.84
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Cremate",
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
                                "cast": 1.5,
                                "damage": {
                                            "scale": 1.64
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
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
                    "name": "Breath of Fire",
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
                                "accuracy": 1.2,
                                "range": 15.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.68
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
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
                    "name": "Fire Sword Circle",
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
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 1.424
                                },
                                "dotDamage": 0.1,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Incinerate",
                    "available": 21,
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
                                "range": 7.0,
                                "recharge": 10.0,
                                "endurance": 6.864,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.25
                                },
                                "dotDamage": 0.25,
                                "dotTicks": 2
                    }
        },
        {
                    "name": "Greater Fire Sword",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 12.0,
                                "endurance": 12.688,
                                "cast": 1.37,
                                "damage": {
                                            "scale": 2.28
                                },
                                "dotDamage": 0.2,
                                "dotTicks": 2
                    }
        }
    ]
};
