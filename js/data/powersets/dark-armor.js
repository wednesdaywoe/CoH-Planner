/**
 * City of Heroes: Dark Armor
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['dark-armor'] = {
    name: "Dark Armor",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Dark Embrace",
                    "available": 0,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 1,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.104,
                                "cast": 0.67,
                                "damage": {
                                            "scale": 3.0
                                }
                    }
        },
        {
                    "name": "Death Shroud",
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
                                "recharge": 4.0,
                                "endurance": 1.04,
                                "cast": 2.47,
                                "damage": {
                                            "scale": 0.2
                                }
                    }
        },
        {
                    "name": "Murky Cloud",
                    "available": 3,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 2,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 2.0,
                                "endurance": 0.104,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 3.0
                                }
                    }
        },
        {
                    "name": "Obsidian Shield",
                    "available": 9,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 3,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 4.0,
                                "endurance": 0.104,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 5.0
                                },
                                "rechargeDebuff": 0.3,
                                "slow": 0.5
                    }
        },
        {
                    "name": "Dark Regeneration",
                    "available": 15,
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
                                "recharge": 30.0,
                                "endurance": 33.8,
                                "cast": 1.17,
                                "damage": {
                                            "scale": 0.2
                                }
                    }
        },
        {
                    "name": "Obscure Sustenance",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 2.0,
                                "recharge": 60.0,
                                "endurance": 10.4,
                                "cast": 1.93
                    }
        },
        {
                    "name": "Cloak of Darkness",
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
                                "cast": 1.17
                    }
        },
        {
                    "name": "Cloak of Fear",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Fear",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 4.0,
                                "endurance": 0.26,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Oppressive Gloom",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 8.0,
                                "endurance": 0.156,
                                "cast": 1.17
                    }
        },
        {
                    "name": "Soul Transfer",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 10.0,
                                "endurance": 10.4,
                                "cast": 1.17
                    }
        }
    ]
};
