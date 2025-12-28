/**
 * City of Heroes: Symphony Control
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['symphony-control'] = {
    name: "Symphony Control",
    type: "primary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Hymn of Dissonance",
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
                                            "scale": 1.889
                                },
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Melodic Binding",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 4.0,
                                "endurance": 7.8,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 1.61
                                },
                                "slow": 0.3
                    }
        },
        {
                    "name": "Aria of Stasis",
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
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 8.0,
                                "endurance": 13.0,
                                "cast": 1.5,
                                "damage": {
                                            "scale": 0.5206
                                },
                                "slow": 0.3
                    }
        },
        {
                    "name": "Impassioned Serenade",
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
                                "accuracy": 1.2,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.0,
                                "damage": {
                                            "scale": 0.65
                                },
                                "dotDamage": 0.04,
                                "dotTicks": 15
                    }
        },
        {
                    "name": "Dreadful Discord",
                    "available": 7,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 40.0,
                                "endurance": 8.528,
                                "cast": 2.17,
                                "damage": {
                                            "scale": 0.7437
                                }
                    }
        },
        {
                    "name": "Enfeebling Lullaby",
                    "available": 11,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 70.0,
                                "recharge": 45.0,
                                "endurance": 15.6,
                                "cast": 2.67,
                                "damage": {
                                            "scale": 0.2
                                },
                                "dotDamage": 2.0,
                                "dotTicks": 7
                    }
        },
        {
                    "name": "Confounding Chant",
                    "available": 17,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 70.0,
                                "recharge": 90.0,
                                "endurance": 15.6,
                                "cast": 2.33
                    }
        },
        {
                    "name": "Chords of Despair",
                    "available": 21,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "range": 80.0,
                                "recharge": 8.0,
                                "endurance": 8.528,
                                "cast": 2.67
                    }
        },
        {
                    "name": "Reverberant",
                    "available": 25,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "EnduranceReduction",
                                "Range",
                                "Sleep",
                                "Recharge",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 60.0,
                                "recharge": 240.0,
                                "endurance": 20.8,
                                "cast": 2.03
                    }
        }
    ]
};
