/**
 * City of Heroes: Psionic Armor
 * 
 * Extracted from raw_data_homecoming-20250617_6916
 */

POWERSETS['psionic-armor'] = {
    name: "Psionic Armor",
    type: "secondary",
    description: "TODO: Add description",
    powers: [
        {
                    "name": "Psionic Shield",
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
                                "cast": 1.17
                    }
        },
        {
                    "name": "Psychic Wall",
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
                    "name": "Mask Presence",
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
                                "endurance": 0.104,
                                "cast": 0.73
                    }
        },
        {
                    "name": "Impenetrable Mind",
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
                                "cast": 0.73
                    }
        },
        {
                    "name": "Devour Psyche",
                    "available": 15,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "range": 40.0,
                                "recharge": 60.0,
                                "endurance": 10.5,
                                "cast": 1.0
                    }
        },
        {
                    "name": "Psychokinetic Barrier",
                    "available": 19,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "EnduranceReduction",
                                "Recharge"
                    ],
                    "tier": 4,
                    "effects": {
                                "accuracy": 1.0,
                                "recharge": 60.0,
                                "endurance": 10.4,
                                "cast": 1.17,
                                "rechargeDebuff": 0.2
                    }
        },
        {
                    "name": "Precognition",
                    "available": 23,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Damage",
                                "Accuracy",
                                "Recharge",
                                "EnduranceReduction"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.0
                    }
        },
        {
                    "name": "Aura of Insanity",
                    "available": 27,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Hold",
                                "Sleep",
                                "Recharge",
                                "Fear",
                                "Damage",
                                "Accuracy"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 0.8,
                                "recharge": 10.0,
                                "cast": 1.67
                    }
        },
        {
                    "name": "Memento Mori",
                    "available": 29,
                    "maxSlots": 6,
                    "allowedEnhancements": [
                                "Recharge",
                                "Fear"
                    ],
                    "tier": 5,
                    "effects": {
                                "accuracy": 1.2,
                                "recharge": 300.0,
                                "endurance": 18.2,
                                "cast": 1.33
                    }
        }
    ]
};
