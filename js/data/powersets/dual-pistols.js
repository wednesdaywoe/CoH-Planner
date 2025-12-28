/**
 * City of Heroes: Dual Pistols
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['dual-pistols'] = {
    name: "Dual Pistols",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Chemical Ammunition",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 0.63
                    }
        },
        {
                    "name": "Cryo Ammunition",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 0.63
                    }
        },
        {
                    "name": "Incendiary Ammunition",
                    "available": -1,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "cast": 0.63
                    }
        },
        {
                    "name": "Dual Wield",
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
                                "accuracy": 1.1,
                                "range": 80.0,
                                "recharge": 6.0,
                                "endurance": 6.864,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.924
                                },
                                "dotDamage": 0.113,
                                "dotTicks": 1,
                                "slow": 0.15,
                                "rechargeDebuff": 0.15
                    }
        },
        {
                    "name": "Pistols",
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
                                "accuracy": 1.1,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 5.2,
                                "cast": 1.0,
                                "damage": {
                                            "scale": 0.7
                                },
                                "dotDamage": 0.113,
                                "dotTicks": 1,
                                "slow": 0.12,
                                "rechargeDebuff": 0.12
                    }
        },
        {
                    "name": "Empty Clips",
                    "available": 1,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.1,
                                "range": 40.0,
                                "recharge": 10.0,
                                "endurance": 10.192,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.182
                                },
                                "dotDamage": 0.113,
                                "dotTicks": 1,
                                "slow": 0.15,
                                "rechargeDebuff": 0.15
                    }
        },
        {
                    "name": "Swap Ammo",
                    "available": 5,
                    "maxSlots": 0,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Bullet Rain",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.1,
                                "range": 80.0,
                                "recharge": 18.0,
                                "endurance": 16.848,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 0.233
                                },
                                "dotDamage": 0.113,
                                "dotTicks": 1,
                                "slow": 0.15,
                                "rechargeDebuff": 0.15
                    }
        },
        {
                    "name": "Suppressive Fire",
                    "available": 11,
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
                                "accuracy": 1.1,
                                "range": 60.0,
                                "recharge": 20.0,
                                "endurance": 10.192,
                                "cast": 1.5
                    }
        },
        {
                    "name": "Executioner's Shot",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.25,
                                "range": 80.0,
                                "recharge": 10.0,
                                "endurance": 10.4,
                                "cast": 1.67,
                                "damage": {
                                            "scale": 1.484
                                },
                                "dotDamage": 0.169,
                                "dotTicks": 1,
                                "slow": 0.15,
                                "rechargeDebuff": 0.15
                    }
        },
        {
                    "name": "Piercing Rounds",
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
                                "accuracy": 1.1,
                                "range": 80.0,
                                "recharge": 15.0,
                                "endurance": 14.352,
                                "cast": 2.5,
                                "damage": {
                                            "scale": 1.61
                                },
                                "dotDamage": 0.169,
                                "dotTicks": 1,
                                "slow": 0.15,
                                "rechargeDebuff": 0.15
                    }
        },
        {
                    "name": "Hail of Bullets",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Slow",
                                "EnduranceReduction",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.4,
                                "recharge": 105.0,
                                "endurance": 20.8,
                                "cast": 2.47,
                                "damage": {
                                            "scale": 0.3178
                                },
                                "dotDamage": 0.3178,
                                "dotTicks": 1,
                                "slow": 0.2,
                                "rechargeDebuff": 0.2
                    }
        }
    ]
};
