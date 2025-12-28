/**
 * City of Heroes: Energy Aura
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['energy-aura'] = {
    name: "Energy Aura",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Dampening Field",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "damage": {
                                            "scale": 1.25
                                },
                                "dotDamage": 1.25,
                                "dotTicks": 5
                    }
        },
        {
                    "name": "Kinetic Shield",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "cast": 0.73
                    }
        },
        {
                    "name": "Power Shield",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.13,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Entropic Aura",
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
                                "endurance": 0.52,
                                "cast": 0.73,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Energy Protection",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "damage": {
                                            "scale": 1.25
                                },
                                "dotDamage": 1.25,
                                "dotTicks": 5,
                                "slow": 0.2,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Energy Cloak",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.13,
                                "cast": 0.73
                    }
        },
        {
                    "name": "Energize",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 120.0,
                                "endurance": 10.4,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Energy Drain",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 13.0,
                                "cast": 2.37
                    }
        },
        {
                    "name": "Overload",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 1000.0,
                                "endurance": 2.6,
                                "cast": 3.0
                    }
        }
    ]
};
