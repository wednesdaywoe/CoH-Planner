/**
 * City of Heroes Planner - Invention Origin Sets Library
 * 
 * Contains all IO set data including:
 * - Standard IO sets
 * - Purple (Very Rare) sets
 * - Event sets (Winter, Halloween, etc.)
 * - Archetype Origin sets (ATOs)
 * 
 * Each set includes:
 * - Name and category
 * - Level range
 * - Set bonuses
 * - Individual enhancement pieces with values
 * - Unique piece markers
 */

const IO_SETS = {
    // ============================================
    // STANDARD IO SETS
    // ============================================
    
    'positrons': {
        name: "Positron's Blast",
        category: "io-set",
        minLevel: 20,
        maxLevel: 50,
        bonuses: [
            { pieces: 2, stat: 'recovery', value: 1.5, desc: "+1.5% Recovery" },
            { pieces: 3, stat: 'accuracy', value: 9.0, desc: "+9% Accuracy" },
            { pieces: 4, stat: 'recharge', value: 5.0, desc: "+5% Recharge" },
            { pieces: 5, stat: 'defRanged', value: 6.25, desc: "+6.25% Ranged Defense" }
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+26.5% Acc, +26.5% Dmg" },
            { num: 2, name: "Damage/Endurance", values: "+26.5% Dmg, +26.5% End" },
            { num: 3, name: "Damage/Recharge", values: "+26.5% Dmg, +26.5% Rech" },
            { num: 4, name: "Accuracy/Damage/Endurance", values: "+21.2% Acc, +42.4% Dmg, +21.2% End" },
            { num: 5, name: "Damage/Range", values: "+42.4% Dmg, +26.5% Rng" }
        ]
    },
    
    'bombardment': {
        name: "Bombardment",
        category: "io-set",
        minLevel: 30,
        maxLevel: 50,
        bonuses: [
            "2 pieces: +3% Damage",
            "3 pieces: +9% Accuracy",
            "4 pieces: +7% Recharge",
            "5 pieces: +4% Ranged Defense",
            "6 pieces: +5% AoE Defense"
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+31.8% Acc, +31.8% Dmg" },
            { num: 2, name: "Damage/Endurance", values: "+31.8% Dmg, +31.8% End" },
            { num: 3, name: "Damage/Recharge", values: "+31.8% Dmg, +31.8% Rech" },
            { num: 4, name: "Accuracy/Damage/Recharge", values: "+25.4% Acc, +50.9% Dmg, +25.4% Rech" },
            { num: 5, name: "Accuracy/Damage/Endurance/Recharge", values: "+19.1% Acc, +38.2% Dmg, +19.1% End, +19.1% Rech" },
            { num: 6, name: "Chance for Fire Damage", values: "Proc: +Fire Dmg" }
        ]
    },
    
    'thunderstrike': {
        name: "Thunderstrike",
        category: "io-set",
        minLevel: 30,
        maxLevel: 50,
        bonuses: [
            { pieces: 2, stat: 'recovery', value: 2.0, desc: "+2% Recovery" },
            { pieces: 3, stat: 'defEnergy', value: 2.5, desc: "+2.5% Energy Defense" },
            { pieces: 3, stat: 'defNegative', value: 2.5, desc: "+2.5% Negative Energy Defense" },
            { pieces: 3, stat: 'defRanged', value: 2.5, desc: "+2.5% Ranged Defense" },
            { pieces: 4, stat: 'accuracy', value: 9.0, desc: "+9% Accuracy" },
            { pieces: 5, stat: 'runspeed', value: 5.0, desc: "+5% Run Speed" },
            { pieces: 5, stat: 'flyspeed', value: 5.0, desc: "+5% Fly Speed" },
            { pieces: 5, stat: 'jumpspeed', value: 5.0, desc: "+5% Jump Speed" },
            { pieces: 6, stat: 'defEnergy', value: 3.75, desc: "+3.75% Energy Defense" },
            { pieces: 6, stat: 'defNegative', value: 3.75, desc: "+3.75% Negative Energy Defense" },
            { pieces: 6, stat: 'defRanged', value: 3.75, desc: "+3.75% Ranged Defense" }
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+31.8% Acc, +31.8% Dmg" },
            { num: 2, name: "Damage/Endurance", values: "+31.8% Dmg, +31.8% End" },
            { num: 3, name: "Damage/Recharge", values: "+31.8% Dmg, +31.8% Rech" },
            { num: 4, name: "Accuracy/Damage/Recharge", values: "+25.4% Acc, +50.9% Dmg, +25.4% Rech" },
            { num: 5, name: "Accuracy/Damage/Endurance", values: "+25.4% Acc, +50.9% Dmg, +25.4% End" },
            { num: 6, name: "Damage/Endurance/Recharge", values: "+38.2% Dmg, +38.2% End, +38.2% Rech" }
        ]
    },
    
    'crushing-impact': {
        name: "Crushing Impact",
        category: "io-set",
        minLevel: 30,
        maxLevel: 50,
        bonuses: [
            { pieces: 2, stat: 'accuracy', value: 12.0, desc: "+12% Accuracy" },
            { pieces: 3, stat: 'maxend', value: 7.0, desc: "+7% Max Endurance" },
            { pieces: 4, stat: 'maxhp', value: 2.0, desc: "+2% Max HP" },
            { pieces: 5, stat: 'defMelee', value: 5.0, desc: "+5% Melee Defense" }
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+31.8% Acc, +31.8% Dmg" },
            { num: 2, name: "Damage/Endurance", values: "+31.8% Dmg, +31.8% End" },
            { num: 3, name: "Damage/Recharge", values: "+31.8% Dmg, +31.8% Rech" },
            { num: 4, name: "Accuracy/Damage/Recharge", values: "+25.4% Acc, +50.9% Dmg, +25.4% Rech" },
            { num: 5, name: "Damage/Endurance/Recharge", values: "+38.2% Dmg, +38.2% End, +38.2% Rech" }
        ]
    },
    
    'eradication': {
        name: "Eradication",
        category: "io-set",
        minLevel: 30,
        maxLevel: 50,
        bonuses: [
            { pieces: 2, stat: 'damage', value: 2.5, desc: "+2.5% Damage" },
            { pieces: 3, stat: 'recharge', value: 8.75, desc: "+8.75% Recharge" },
            { pieces: 4, stat: 'defAoE', value: 5.0, desc: "+5% AoE Defense" },
            { pieces: 5, stat: 'maxhp', value: 2.5, desc: "+2.5% Max HP" },
            { pieces: 6, stat: 'recovery', value: 2.5, desc: "+2.5% Recovery" }
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+31.8% Acc, +31.8% Dmg" },
            { num: 2, name: "Accuracy/Recharge", values: "+31.8% Acc, +31.8% Rech" },
            { num: 3, name: "Damage/Recharge", values: "+31.8% Dmg, +31.8% Rech" },
            { num: 4, name: "Accuracy/Damage/Recharge", values: "+25.4% Acc, +50.9% Dmg, +25.4% Rech" },
            { num: 5, name: "Accuracy/Damage/Endurance/Recharge", values: "+19.1% Acc, +38.2% Dmg, +19.1% End, +19.1% Rech" },
            { num: 6, name: "Chance for Energy Damage", values: "Proc: +Energy Dmg", unique: true }
        ]
    },
    
    'ruin': {
        name: "Ruin",
        category: "io-set",
        minLevel: 25,
        maxLevel: 40,
        bonuses: [
            { pieces: 2, stat: 'recovery', value: 1.0, desc: "+1% Recovery" },
            { pieces: 3, stat: 'maxhp', value: 1.13, desc: "+1.13% Max HP" }
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+29.0% Acc, +29.0% Dmg" },
            { num: 2, name: "Damage/Endurance", values: "+29.0% Dmg, +29.0% End" },
            { num: 3, name: "Damage/Recharge", values: "+29.0% Dmg, +29.0% Rech" }
        ]
    },
    
    // ============================================
    // PURPLE SETS (VERY RARE)
    // ============================================
    
    'apocalypse': {
        name: "Apocalypse",
        category: "very-rare",
        purple: true,
        minLevel: 50,
        maxLevel: 50,
        bonuses: [
            "2 pieces: +10% Recharge",
            "3 pieces: +3% Max HP",
            "4 pieces: +4% Damage",
            "5 pieces: +5% Recharge",
            "6 pieces: +20% Regeneration"
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+53% Acc, +53% Dmg" },
            { num: 2, name: "Damage/Recharge", values: "+53% Dmg, +53% Rech" },
            { num: 3, name: "Accuracy/Recharge", values: "+53% Acc, +53% Rech" },
            { num: 4, name: "Damage/Endurance", values: "+53% Dmg, +53% End" },
            { num: 5, name: "Accuracy/Damage/Recharge", values: "+33.9% Acc, +67.8% Dmg, +33.9% Rech" },
            { num: 6, name: "Chance for Negative Damage", values: "Proc: +Negative Dmg", unique: true }
        ]
    },
    
    'ragnarok': {
        name: "Ragnarok",
        category: "very-rare",
        purple: true,
        minLevel: 50,
        maxLevel: 50,
        bonuses: [
            "2 pieces: +10% Recharge",
            "3 pieces: +3% Max HP",
            "4 pieces: +4% Damage",
            "5 pieces: +5% Recharge",
            "6 pieces: +20% Regeneration"
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+53% Acc, +53% Dmg" },
            { num: 2, name: "Damage/Recharge", values: "+53% Dmg, +53% Rech" },
            { num: 3, name: "Accuracy/Recharge", values: "+53% Acc, +53% Rech" },
            { num: 4, name: "Damage/Endurance", values: "+53% Dmg, +53% End" },
            { num: 5, name: "Accuracy/Damage/Recharge", values: "+33.9% Acc, +67.8% Dmg, +33.9% Rech" },
            { num: 6, name: "Chance for Knockdown", values: "Proc: Knockdown", unique: true }
        ]
    },
    
    // ============================================
    // EVENT SETS (WINTER)
    // ============================================
    
    'avalanche': {
        name: "Avalanche",
        category: "event",
        minLevel: 10,
        maxLevel: 50,
        bonuses: [
            "2 pieces: +8% Slow Resistance",
            "3 pieces: +9% Accuracy",
            "4 pieces: +3% Cold/Fire Defense",
            "5 pieces: +3.75% Energy/Negative Defense",
            "6 pieces: +6.25% Recharge"
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+26.5% Acc, +26.5% Dmg" },
            { num: 2, name: "Damage/Endurance", values: "+26.5% Dmg, +26.5% End" },
            { num: 3, name: "Accuracy/Damage/Recharge", values: "+21.2% Acc, +42.4% Dmg, +21.2% Rech" },
            { num: 4, name: "Accuracy/Damage/Endurance", values: "+21.2% Acc, +42.4% Dmg, +21.2% End" },
            { num: 5, name: "Accuracy/Damage/Endurance/Recharge", values: "+15.9% Acc, +31.8% Dmg, +31.8% End, +31.8% Rech" },
            { num: 6, name: "Chance for Cold Damage", values: "Proc: +Cold Dmg", unique: true }
        ]
    },
    
    'winters-bite': {
        name: "Winter's Bite",
        category: "event",
        minLevel: 10,
        maxLevel: 50,
        bonuses: [
            "2 pieces: +8% Slow Resistance",
            "3 pieces: +1.88% Max HP",
            "4 pieces: +2% Energy/Negative Defense",
            "5 pieces: +3.13% Melee Defense",
            "6 pieces: +6.25% Recharge"
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+26.5% Acc, +26.5% Dmg" },
            { num: 2, name: "Damage/Recharge", values: "+26.5% Dmg, +26.5% Rech" },
            { num: 3, name: "Accuracy/Damage/Endurance", values: "+21.2% Acc, +42.4% Dmg, +21.2% End" },
            { num: 4, name: "Accuracy/Damage/Recharge", values: "+21.2% Acc, +42.4% Dmg, +21.2% Rech" },
            { num: 5, name: "Damage/Endurance/Accuracy/Recharge", values: "+15.9% Acc, +31.8% Dmg, +31.8% End, +31.8% Rech" },
            { num: 6, name: "Chance for -Recharge, -Speed", values: "Proc: -Rech, -Speed", unique: true }
        ]
    },
    
    // ============================================
    // ARCHETYPE SETS (BLASTER ATOs)
    // ============================================
    
    'blasters-wrath': {
        name: "Blaster's Wrath",
        category: "archetype",
        minLevel: 10,
        maxLevel: 50,
        bonuses: [
            "2 pieces: +2% Damage",
            "3 pieces: +4% Ranged Defense",
            "4 pieces: +6% Recharge",
            "5 pieces: +3.13% Melee Defense",
            "6 pieces: +3.75% Fire/Cold Defense"
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+26.5% Acc, +26.5% Dmg" },
            { num: 2, name: "Damage/Endurance", values: "+26.5% Dmg, +26.5% End" },
            { num: 3, name: "Damage/Recharge", values: "+26.5% Dmg, +26.5% Rech" },
            { num: 4, name: "Accuracy/Damage/Recharge", values: "+21.2% Acc, +42.4% Dmg, +21.2% Rech" },
            { num: 5, name: "Accuracy/Damage/Endurance/Recharge", values: "+15.9% Acc, +31.8% Dmg, +31.8% End, +31.8% Rech" },
            { num: 6, name: "Chance for Fire Damage", values: "Proc: +Fire Dmg", unique: true }
        ]
    },
    
    'defiant-barrage': {
        name: "Defiant Barrage",
        category: "archetype",
        minLevel: 10,
        maxLevel: 50,
        bonuses: [
            "2 pieces: +3% Damage",
            "3 pieces: +9% Accuracy",
            "4 pieces: +5% Recharge",
            "5 pieces: +3.75% Energy/Negative Defense",
            "6 pieces: +5% AoE Defense"
        ],
        pieces: [
            { num: 1, name: "Accuracy/Damage", values: "+26.5% Acc, +26.5% Dmg" },
            { num: 2, name: "Damage/Endurance", values: "+26.5% Dmg, +26.5% End" },
            { num: 3, name: "Damage/Recharge", values: "+26.5% Dmg, +26.5% Rech" },
            { num: 4, name: "Accuracy/Damage/Endurance", values: "+21.2% Acc, +42.4% Dmg, +21.2% End" },
            { num: 5, name: "Accuracy/Damage/Endurance/Recharge", values: "+15.9% Acc, +31.8% Dmg, +31.8% End, +31.8% Rech" },
            { num: 6, name: "Chance to Build Defiance", values: "Proc: +Defiance", unique: true }
        ]
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IO_SETS;
}
