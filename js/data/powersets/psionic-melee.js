/**
 * City of Heroes: Psionic Melee
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['psionic-melee'] = {
    name: "Psionic Melee",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Mental Strike",
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
                                            "scale": 0.21
                                },
                                "dotDamage": 0.084,
                                "dotTicks": 1,
                                "rechargeDebuff": 0.1
                    }
        },
        {
                    "name": "Psi Blade",
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
                                "endurance": 5.928,
                                "cast": 1.33,
                                "damage": {
                                            "scale": 0.285
                                },
                                "dotDamage": 0.2285,
                                "dotTicks": 1,
                                "rechargeDebuff": 0.12
                    }
        },
        {
                    "name": "Telekinetic Blow",
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
                                "recharge": 9.0,
                                "endurance": 9.36,
                                "cast": 1.47,
                                "damage": {
                                            "scale": 0.45
                                },
                                "dotDamage": 0.18,
                                "dotTicks": 1
                    }
        },
        {
                    "name": "Concentration",
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
                    "name": "Psi Blade Sweep",
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
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 1.77,
                                "damage": {
                                            "scale": 0.36
                                },
                                "dotDamage": 0.236,
                                "dotTicks": 1,
                                "rechargeDebuff": 0.15
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
                    "name": "Boggle",
                    "available": 17,
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
                                "range": 40.0,
                                "recharge": 20.0,
                                "endurance": 7.8,
                                "cast": 2.0
                    }
        },
        {
                    "name": "Greater Psi Blade",
                    "available": 21,
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
                                "range": 7.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 0.69
                                },
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Mass Levitate",
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
                                "accuracy": 1.0,
                                "recharge": 20.0,
                                "endurance": 18.512,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 1.42
                                },
                                "dotDamage": 0.142,
                                "dotTicks": 1
                    }
        }
    ]
};
