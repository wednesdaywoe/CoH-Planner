/**
 * City of Heroes: Radioactive Assault
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['radioactive-assault'] = {
    name: "Radioactive Assault",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Contaminated Strike",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 0.83,
                                "damage": {
                                            "scale": 0.41
                                },
                                "defenseDebuff": 1.39,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Neutrino Bolt",
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
                                },
                                "defenseDebuff": 1.0,
                                "buffDuration": 3.0
                    }
        },
        {
                    "name": "X-Ray Beam",
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
                                "range": 80.0,
                                "recharge": 11.0,
                                "endurance": 11.024,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 2.12
                                },
                                "defenseDebuff": 2.0,
                                "buffDuration": 6.0
                    }
        },
        {
                    "name": "Electron Haze",
                    "available": 9,
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
                                "range": 40.0,
                                "recharge": 16.0,
                                "endurance": 15.184,
                                "cast": 2.37,
                                "damage": {
                                            "scale": 1.35
                                },
                                "defenseDebuff": 2.0,
                                "buffDuration": 8.0
                    }
        },
        {
                    "name": "Fusion",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 90.0,
                                "endurance": 5.2,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 5,
                                "tohitBuff": 2.0,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Radiation Siphon",
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
                                "accuracy": 1.0,
                                "range": 7.0,
                                "recharge": 12.0,
                                "endurance": 10.192,
                                "cast": 2.23,
                                "damage": {
                                            "scale": 0.57
                                },
                                "dotDamage": 0.67,
                                "dotTicks": 1,
                                "defenseDebuff": 1.5,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Atom Smasher",
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
                                "recharge": 22.0,
                                "endurance": 20.176,
                                "cast": 2.93,
                                "damage": {
                                            "scale": 0.39
                                },
                                "defenseDebuff": 1.2,
                                "buffDuration": 10.0
                    }
        },
        {
                    "name": "Proton Volley",
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
                    "name": "Devastating Blow",
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
                                "accuracy": 1.2,
                                "range": 7.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.89
                                },
                                "defenseDebuff": 2.0,
                                "buffDuration": 10.0
                    }
        }
    ]
};
