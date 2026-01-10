/**
 * City of Heroes: Homecoming - Inherent Powers
 * 
 * Powers that all characters start with or receive automatically.
 * 
 * Categories:
 * 1. Universal Inherents (all characters get these)
 * 2. Archetype-Specific Inherents
 * 3. Fitness Pool (auto-granted)
 */

const INHERENT_POWERS = {
    // ============================================
    // UNIVERSAL INHERENTS
    // ============================================
    
    'brawl': {
        name: 'Brawl',
        category: 'universal',
        description: 'When all else fails, you have only your two fists to depend on.',
        shortHelp: 'Melee, Minor DMG(Smashing), Fighting Synergy',
        icon: 'inherent_brawl.png',
        powerType: 'Click',
        autoGranted: true,
        level: 0,
        maxSlots: 6,
        allowedEnhancements: ['Damage', 'Accuracy', 'Recharge'],
        allowedSetCategories: ['Melee Damage', 'Universal Damage Sets'],
        effects: {
            damage: {
                type: 'Smashing',
                scale: 0.36
            },
            accuracy: 1.0,
            recharge: 2.0,
            endurance: 0.0,
            range: 7.0
        }
    },
    
    'sprint': {
        name: 'Sprint',
        category: 'universal',
        description: 'Sprint allows you to run faster for a brief period of time. Endurance cost is continuous.',
        shortHelp: 'Toggle: Self +Speed, -End',
        icon: 'inherent_sprint.png',
        powerType: 'Toggle',
        autoGranted: true,
        level: 0,
        maxSlots: 6,
        allowedEnhancements: ['EnduranceReduction', 'Run'],
        allowedSetCategories: ['Running'],
        effects: {
            runSpeed: 0.5,
            enduranceCost: 0.13,
            activateEnd: 0.0
        }
    },
    
    'rest': {
        name: 'Rest',
        category: 'universal',
        description: 'Activate Rest to heal Hit Points and recover Endurance. While Resting you cannot attack, and you are extremely vulnerable.',
        shortHelp: 'Self Heal Recover, -DEF',
        icon: 'inherent_rest.png',
        powerType: 'Toggle',
        autoGranted: true,
        level: 1,
        maxSlots: 6,
        allowedEnhancements: ['Heal', 'EnduranceModification', 'InterruptReduction'],
        allowedSetCategories: [],
        effects: {
            regeneration: 19.0,
            recovery: 4.25,
            defenseDebuff: -1000,
            interruptTime: 6.0
        }
    },
    
    'walk': {
        name: 'Walk',
        category: 'universal',
        description: 'Toggle walk on and off. Walking is slower than running, but may be more appropriate in certain environments.',
        shortHelp: 'Toggle: Self Walk',
        icon: 'inherent_walk.png',
        powerType: 'Toggle',
        autoGranted: true,
        level: 0,
        maxSlots: 0, // Cannot be slotted
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            walkMode: true
        }
    },
    
    // ============================================
    // FITNESS POOL (Auto-granted)
    // ============================================
    
    'swift': {
        name: 'Swift',
        category: 'fitness',
        description: 'You can run slightly faster than normal. This ability is always on and does not cost any Endurance.',
        shortHelp: 'Auto: Self +Speed',
        icon: 'fitness_swift.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 6,
        allowedEnhancements: ['Run', 'Flight'],
        allowedSetCategories: ['Running', 'Flight'],
        effects: {
            runSpeed: 0.2,
            flySpeed: 0.2
        }
    },
    
    'hurdle': {
        name: 'Hurdle',
        category: 'fitness',
        description: 'You can jump slightly higher and farther than normal. This ability is always on and does not cost any Endurance.',
        shortHelp: 'Auto: Self +Jump',
        icon: 'fitness_hurdle.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 6,
        allowedEnhancements: ['Jump'],
        allowedSetCategories: ['Leaping'],
        effects: {
            jumpHeight: 0.5,
            jumpSpeed: 0.2
        }
    },
    
    'health': {
        name: 'Health',
        category: 'fitness',
        description: 'You heal slightly faster than normal. This ability is always on and does not cost any Endurance.',
        shortHelp: 'Auto: Self +Regen',
        icon: 'fitness_health.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 6,
        allowedEnhancements: ['Heal'],
        allowedSetCategories: ['Healing'],
        effects: {
            regeneration: 0.4
        }
    },
    
    'stamina': {
        name: 'Stamina',
        category: 'fitness',
        description: 'You recover Endurance slightly more quickly than normal. This ability is always on and does not cost any Endurance.',
        shortHelp: 'Auto: Self +Recovery',
        icon: 'fitness_stamina.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 6,
        allowedEnhancements: ['EnduranceModification'],
        allowedSetCategories: ['Endurance Modification'],
        effects: {
            recovery: 0.25
        }
    },
    
    // ============================================
    // ARCHETYPE-SPECIFIC INHERENTS
    // ============================================
    
    'defiance': {
        name: 'Defiance',
        category: 'archetype',
        archetype: 'blaster',
        description: 'Build up damage bonus as health drops, attacks while mezzed.',
        shortHelp: 'Passive: +DMG as HP drops, attack while mezzed',
        icon: 'inherent_defiance.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            defiance: true
        }
    },
    
    'vigilance': {
        name: 'Vigilance',
        category: 'archetype',
        archetype: 'defender',
        description: 'Endurance discount based on team health, damage buff when solo.',
        shortHelp: 'Passive: -End Cost (Team), +DMG (Solo)',
        icon: 'inherent_vigilance.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            vigilance: true
        }
    },
    
    'gauntlet': {
        name: 'Gauntlet',
        category: 'archetype',
        archetype: 'tanker',
        description: 'All Tanker attacks automatically Taunt the target and nearby enemies.',
        shortHelp: 'Passive: Auto-taunt on attacks',
        icon: 'inherent_gauntlet.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            gauntlet: true
        }
    },
    
    'scourge': {
        name: 'Scourge',
        category: 'archetype',
        archetype: 'corruptor',
        description: 'Chance for double damage increases as enemy health drops.',
        shortHelp: 'Passive: Chance for 2x DMG on low HP enemies',
        icon: 'inherent_scourge.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            scourge: true
        }
    },
    
    'supremacy': {
        name: 'Supremacy',
        category: 'archetype',
        archetype: 'mastermind',
        description: 'Your presence bolsters the effectiveness of your henchmen.',
        shortHelp: 'Passive: Pet +ToHit, +DMG, +Res',
        icon: 'inherent_supremacy.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            supremacy: true
        }
    },
    
    'containment': {
        name: 'Containment',
        category: 'archetype',
        archetype: 'controller',
        description: 'Bonus damage against controlled enemies (Held, Immobilized, Stunned, Slept, Confused, Terrified).',
        shortHelp: 'Passive: +DMG vs controlled enemies',
        icon: 'inherent_containment.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            containment: true
        }
    },
    
    'fury': {
        name: 'Fury',
        category: 'archetype',
        archetype: 'brute',
        description: 'Build Fury bar by attacking and being attacked, increasing damage.',
        shortHelp: 'Passive: Build Fury for +DMG',
        icon: 'inherent_rage.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            fury: true
        }
    },
    
    'assassination': {
        name: 'Assassination',
        category: 'archetype',
        archetype: 'stalker',
        description: 'Critical hits from Hide, Build Up effect when leaving Hide.',
        shortHelp: 'Passive: Crit from Hide, +DMG leaving Hide',
        icon: 'inherent_assassination.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            assassination: true
        }
    },
    
    'critical-hit': {
        name: 'Critical Hit',
        category: 'archetype',
        archetype: 'scrapper',
        description: 'Chance for critical hits. Higher chance when teamed.',
        shortHelp: 'Passive: Chance for Critical Hit',
        icon: 'inherent_critical_hit.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            criticalHit: true
        }
    },
    
    'domination': {
        name: 'Domination',
        category: 'archetype',
        archetype: 'dominator',
        description: 'Build Domination bar, activate for +Mag, +DMG, full endurance.',
        shortHelp: 'Click: Activate Domination mode',
        icon: 'inherent_domination.png',
        powerType: 'Click',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            domination: true
        }
    },
    
    'sentinel-critical': {
        name: 'Critical Strikes',
        category: 'archetype',
        archetype: 'sentinel',
        description: 'Chance for critical hits on damaged enemies.',
        shortHelp: 'Passive: Chance for Critical Hit',
        icon: 'inherent_critical_hit.png',
        powerType: 'Auto',
        autoGranted: true,
        level: 0,
        maxSlots: 0,
        allowedEnhancements: [],
        allowedSetCategories: [],
        effects: {
            opportunityCritical: true
        }
    }
};

/**
 * Get all inherent powers for a specific archetype
 * @param {string} archetypeId - The archetype ID
 * @returns {Array} Array of inherent power objects
 */
function getInherentPowersForArchetype(archetypeId) {
    const inherents = [];
    
    Object.entries(INHERENT_POWERS).forEach(([id, power]) => {
        // Add universal and fitness inherents
        if (power.category === 'universal' || power.category === 'fitness') {
            inherents.push({
                id: id,
                ...power
            });
        }
        // Add archetype-specific inherent
        else if (power.category === 'archetype' && power.archetype === archetypeId) {
            inherents.push({
                id: id,
                ...power
            });
        }
    });
    
    return inherents;
}

/**
 * Initialize inherent powers for a build
 * @param {string} archetypeId - The archetype ID
 * @returns {Array} Array of power objects ready for Build.inherents
 */
function initializeInherentPowers(archetypeId) {
    const inherents = getInherentPowersForArchetype(archetypeId);
    
    return inherents.map(power => ({
        id: power.id,
        name: power.name,
        level: power.level,
        category: power.category,
        powerSet: power.category === 'fitness' ? 'Fitness' : 'Inherent',
        slots: [null], // Start with 1 empty slot
        maxSlots: power.maxSlots,
        allowedEnhancements: power.allowedEnhancements,
        allowedSetCategories: power.allowedSetCategories,
        effects: power.effects,
        powerType: power.powerType,
        icon: power.icon,
        description: power.description,
        shortHelp: power.shortHelp
    }));
}

// ============================================
// FITNESS POOL (Inherent Pool Group)
// ============================================

const FITNESS_POOL = {
    id: 'fitness',
    name: 'Fitness',
    category: 'inherent-pool',
    description: 'Auto-granted fitness pool. These are your inherent fitness abilities.',
    powers: [
        {
            name: 'Swift',
            description: 'You can run slightly faster than normal. This ability is always on and does not cost any Endurance.',
            shortHelp: 'Auto: Self +Speed',
            powerType: 'Auto',
            rank: 1,
            autoGranted: true,
            level: 0,
            maxSlots: 6,
            allowedEnhancements: ['Run', 'Flight'],
            allowedSetCategories: ['Running', 'Flight'],
            effects: {
                runSpeed: 0.2,
                flySpeed: 0.2
            }
        },
        {
            name: 'Hurdle',
            description: 'You can jump slightly higher and farther than normal. This ability is always on and does not cost any Endurance.',
            shortHelp: 'Auto: Self +Jump',
            powerType: 'Auto',
            rank: 1,
            autoGranted: true,
            level: 0,
            maxSlots: 6,
            allowedEnhancements: ['Jump'],
            allowedSetCategories: ['Leaping'],
            effects: {
                jumpHeight: 0.5,
                jumpSpeed: 0.2
            }
        },
        {
            name: 'Health',
            description: 'You heal slightly faster than normal. This ability is always on and does not cost any Endurance.',
            shortHelp: 'Auto: Self +Regen',
            powerType: 'Auto',
            rank: 1,
            autoGranted: true,
            level: 0,
            maxSlots: 6,
            allowedEnhancements: ['Heal'],
            allowedSetCategories: ['Healing'],
            effects: {
                regeneration: 0.4
            }
        },
        {
            name: 'Stamina',
            description: 'You recover Endurance slightly more quickly than normal. This ability is always on and does not cost any Endurance.',
            shortHelp: 'Auto: Self +Recovery',
            powerType: 'Auto',
            rank: 1,
            autoGranted: true,
            level: 0,
            maxSlots: 6,
            allowedEnhancements: ['EnduranceModification'],
            allowedSetCategories: ['Endurance Modification'],
            effects: {
                recovery: 0.25
            }
        }
    ]
};

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.INHERENT_POWERS = INHERENT_POWERS;
    window.FITNESS_POOL = FITNESS_POOL;
    window.getInherentPowersForArchetype = getInherentPowersForArchetype;
}
