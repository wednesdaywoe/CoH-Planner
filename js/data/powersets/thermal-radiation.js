/**
 * City of Heroes: Thermal Radiation
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['thermal-radiation'] = {
    name: "Thermal Radiation",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Thermal Shield",
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
                                "recharge": 2.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 120,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Warmth",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 8.0,
                                "endurance": 13.0,
                                "cast": 2.03
                    }
        },
        {
                    "name": "Cauterize",
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
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 13.0,
                                "cast": 2.27
                    }
        },
        {
                    "name": "Plasma Shield",
                    "available": 5,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 2.0,
                                "endurance": 7.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 2.0
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 120,
                                "buffDuration": 240.0
                    }
        },
        {
                    "name": "Power of the Phoenix",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Damage"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 15.0,
                                "recharge": 300.0,
                                "endurance": 49.4,
                                "cast": 1.67,
                                "buffDuration": 0.5
                    }
        },
        {
                    "name": "Thaw",
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
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 2.17,
                                "damage": {
                                            "scale": 1.0
                                },
                                "dotDamage": 1.0,
                                "dotTicks": 45,
                                "buffDuration": 90.0,
                                "rechargeDebuff": 0.8,
                                "speedBuff": 0.8
                    }
        },
        {
                    "name": "Forge",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 80.0,
                                "recharge": 60.0,
                                "endurance": 10.4,
                                "cast": 2.27,
                                "damage": {
                                            "scale": 4.0
                                },
                                "dotDamage": 4.0,
                                "dotTicks": 60,
                                "tohitBuff": 2.0,
                                "buffDuration": 120.0
                    }
        },
        {
                    "name": "Heat Exhaustion",
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
                                "range": 70.0,
                                "recharge": 120.0,
                                "endurance": 13.0,
                                "cast": 2.07,
                                "damage": {
                                            "scale": 5.0
                                },
                                "dotDamage": 5.0,
                                "dotTicks": 20,
                                "buffDuration": 40.0
                    }
        },
        {
                    "name": "Melt Armor",
                    "available": 25,
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
                                "range": 70.0,
                                "recharge": 100.0,
                                "endurance": 18.2,
                                "cast": 1.5,
                                "dotDamage": -3.0,
                                "dotTicks": 20,
                                "defenseDebuff": 2.0,
                                "buffDuration": 40.0
                    }
        }
    ]
};
