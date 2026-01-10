/**
 * City of Heroes: Homecoming - Archetype Definitions
 * 
 * Complete archetype data including:
 * - Base stats (HP, endurance, recovery, etc.)
 * - Damage modifiers
 * - Available primary/secondary sets
 * - Inherent powers
 */

const ARCHETYPES = {
    // ============================================
    // HERO ARCHETYPES
    // ============================================
    
    'blaster': {
        name: 'Blaster',
        side: 'hero',
        description: 'Ranged damage specialist with high offensive power but low defenses',
        inherent: {
            name: 'Defiance',
            description: 'Build up damage bonus as health drops, attacks while mezzed'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.5,
                ranged: 1.125,
                aoe: 1.0
            },
            buffDebuffModifier: 0.625
        },
        primarySets: [
            'blaster/archery',
            'blaster/assault-rifle',
            'blaster/beam-rifle',
            'blaster/dark-blast',
            'blaster/dual-pistols',
            'blaster/electrical-blast',
            'blaster/energy-blast',
            'blaster/fire-blast',
            'blaster/ice-blast',
            'blaster/psychic-blast',
            'blaster/radiation-blast',
            'blaster/seismic-blast',
            'blaster/sonic-attack',
            'blaster/storm-blast',
            'blaster/water-blast'
        ],
        secondarySets: [
            'blaster/darkness-manipulation',
            'blaster/earth-manipulation',
            'blaster/electricity-manipulation',
            'blaster/energy-manipulation',
            'blaster/fire-manipulation',
            'blaster/gadgets',
            'blaster/ice-manipulation',
            'blaster/martial-manipulation',
            'blaster/mental-manipulation',
            'blaster/ninja-training',
            'blaster/plant-manipulation',
            'blaster/radiation-manipulation',
            'blaster/sonic-manipulation',
            'blaster/tactical-arrow',
            'blaster/temporal-manipulation'
        ]
    },
    
    'controller': {
        name: 'Controller',
        side: 'hero',
        description: 'Mezzes enemies and buffs/debuffs with strong team support',
        inherent: {
            name: 'Containment',
            description: 'Deal double damage to controlled enemies'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.55,
                ranged: 0.55,
                aoe: 0.5
            },
            buffDebuffModifier: 1.0
        },
        primarySets: [
            'controller/arsenal-control',
            'controller/darkness-control',
            'controller/earth-control',
            'controller/electric-control',
            'controller/fire-control',
            'controller/gravity-control',
            'controller/ice-control',
            'controller/illusion-control',
            'controller/mind-control',
            'controller/plant-control',
            'controller/pyrotechnic-control',
            'controller/symphony-control',
            'controller/wind-control'
        ],
        secondarySets: [
            'controller/cold-domination',
            'controller/darkness-affinity',
            'controller/empathy',
            'controller/force-field',
            'controller/kinetics',
            'controller/marine-affinity',
            'controller/nature-affinity',
            'controller/pain-domination',
            'controller/poison',
            'controller/radiation-emission',
            'controller/shock-therapy',
            'controller/sonic-debuff',
            'controller/storm-summoning',
            'controller/thermal-radiation',
            'controller/time-manipulation',
            'controller/traps',
            'controller/trick-arrow'
        ]
    },
    
    'defender': {
        name: 'Defender',
        side: 'hero',
        description: 'Support specialist with powerful buffs, debuffs, and healing',
        inherent: {
            name: 'Vigilance',
            description: 'Damage increases when team is wounded, endurance discount when solo'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.55,
                ranged: 0.65,
                aoe: 0.5
            },
            buffDebuffModifier: 1.25
        },
        primarySets: [
            'defender/cold-domination',
            'defender/dark-miasma',
            'defender/empathy',
            'defender/force-field',
            'defender/kinetics',
            'defender/marine-affinity',
            'defender/nature-affinity',
            'defender/pain-domination',
            'defender/poison',
            'defender/radiation-emission',
            'defender/shock-therapy',
            'defender/sonic-debuff',
            'defender/storm-summoning',
            'defender/thermal-radiation',
            'defender/time-manipulation',
            'defender/traps',
            'defender/trick-arrow'
        ],
        secondarySets: [
            'defender/archery',
            'defender/assault-rifle',
            'defender/beam-rifle',
            'defender/dark-blast',
            'defender/dual-pistols',
            'defender/electrical-blast',
            'defender/energy-blast',
            'defender/fire-blast',
            'defender/ice-blast',
            'defender/psychic-blast',
            'defender/radiation-blast',
            'defender/seismic-blast',
            'defender/sonic-attack',
            'defender/storm-blast',
            'defender/water-blast'
        ]
    },
    
    'scrapper': {
        name: 'Scrapper',
        side: 'hero',
        description: 'Melee damage dealer with good survivability through defense/resistance',
        inherent: {
            name: 'Critical Hit',
            description: 'Chance for critical hits (higher chance vs minions/underlings)'
        },
        stats: {
            baseHP: 1338.6,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 3.0,
            damageModifier: {
                melee: 1.125,
                ranged: 0.5,
                aoe: 0.8
            },
            buffDebuffModifier: 1.0
        },
        primarySets: [
            'scrapper/battle-axe',
            'scrapper/brawling',
            'scrapper/broad-sword',
            'scrapper/claws',
            'scrapper/dark-melee',
            'scrapper/dual-blades',
            'scrapper/electrical-melee',
            'scrapper/energy-melee',
            'scrapper/fiery-melee',
            'scrapper/ice-melee',
            'scrapper/katana',
            'scrapper/kinetic-attack',
            'scrapper/martial-arts',
            'scrapper/psionic-melee',
            'scrapper/quills',
            'scrapper/radiation-melee',
            'scrapper/savage-melee',
            'scrapper/staff-fighting',
            'scrapper/stone-melee',
            'scrapper/titan-weapons',
            'scrapper/war-mace'
        ],
        secondarySets: [
            'scrapper/bio-organic-armor',
            'scrapper/dark-armor',
            'scrapper/electric-armor',
            'scrapper/energy-aura',
            'scrapper/fiery-aura',
            'scrapper/ice-armor',
            'scrapper/invulnerability',
            'scrapper/ninjitsu',
            'scrapper/psionic-armor',
            'scrapper/radiation-armor',
            'scrapper/regeneration',
            'scrapper/shield-defense',
            'scrapper/stone-armor',
            'scrapper/super-reflexes',
            'scrapper/willpower'
        ]
    },
    
    'tanker': {
        name: 'Tanker',
        side: 'hero',
        description: 'Extremely tough with highest HP and strong defensive powers',
        inherent: {
            name: 'Gauntlet',
            description: 'All attacks taunt enemies, AoE punch-voke effect'
        },
        stats: {
            baseHP: 1874.1,
            maxHP: 2409.5,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 4.0,
            damageModifier: {
                melee: 0.8,
                ranged: 0.5,
                aoe: 0.7
            },
            buffDebuffModifier: 1.0
        },
        primarySets: [
            'tanker/bio-organic-armor',
            'tanker/dark-armor',
            'tanker/electric-armor',
            'tanker/energy-aura',
            'tanker/fiery-aura',
            'tanker/ice-armor',
            'tanker/invulnerability',
            'tanker/psionic-armor',
            'tanker/radiation-armor',
            'tanker/regeneration',
            'tanker/shield-defense',
            'tanker/stone-armor',
            'tanker/super-reflexes',
            'tanker/willpower'
        ],
        secondarySets: [
            'tanker/battle-axe',
            'tanker/brawling',
            'tanker/broad-sword',
            'tanker/claws',
            'tanker/dark-melee',
            'tanker/dual-blades',
            'tanker/electrical-melee',
            'tanker/energy-melee',
            'tanker/fiery-melee',
            'tanker/ice-melee',
            'tanker/katana',
            'tanker/kinetic-attack',
            'tanker/martial-arts',
            'tanker/psionic-melee',
            'tanker/radiation-melee',
            'tanker/savage-melee',
            'tanker/spines',
            'tanker/staff-fighting',
            'tanker/stone-melee',
            'tanker/super-strength',
            'tanker/titan-weapons',
            'tanker/war-mace'
        ]
    },
    
    'sentinel': {
        name: 'Sentinel',
        side: 'hero',
        description: 'Homecoming exclusive: Ranged damage with built-in armor for survivability',
        inherent: {
            name: 'Opportunity',
            description: 'Build up meter with attacks, consume for offensive/defensive stance'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 2.0,
            damageModifier: {
                melee: 0.65,
                ranged: 0.95,
                aoe: 0.8
            },
            buffDebuffModifier: 1.0
        },
        primarySets: [
            'sentinel/archery',
            'sentinel/assault-rifle',
            'sentinel/beam-rifle',
            'sentinel/dark-blast',
            'sentinel/dual-pistols',
            'sentinel/electrical-blast',
            'sentinel/energy-blast',
            'sentinel/fire-blast',
            'sentinel/ice-blast',
            'sentinel/psychic-blast',
            'sentinel/radiation-blast',
            'sentinel/seismic-blast',
            'sentinel/sonic-attack',
            'sentinel/storm-blast',
            'sentinel/water-blast'
        ],
        secondarySets: [
            'sentinel/bio-organic-armor',
            'sentinel/dark-armor',
            'sentinel/electric-armor',
            'sentinel/energy-aura',
            'sentinel/fiery-aura',
            'sentinel/ice-armor',
            'sentinel/invulnerability',
            'sentinel/ninjitsu',
            'sentinel/psionic-armor',
            'sentinel/radiation-armor',
            'sentinel/regeneration',
            'sentinel/stone-armor',
            'sentinel/super-reflexes',
            'sentinel/willpower'
        ]
    },
    
    /*
    // ============================================
    // EPIC ARCHETYPES (Disabled - Complex branching progression)
    // ============================================
    // TODO: Implement branching power trees for Epic ATs
    
    'peacebringer': {
        name: 'Peacebringer',
        side: 'hero',
        description: 'Kheldian shapeshifter with access to multiple forms',
        inherent: {
            name: 'Energy Flight',
            description: 'Transform between human, nova, and dwarf forms'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.85,
                ranged: 0.8,
                aoe: 0.7
            }
        },
        primarySets: ['luminous-blast'],
        secondarySets: ['luminous-aura']
    },
    
    'warshade': {
        name: 'Warshade',
        side: 'hero',
        description: 'Kheldian shapeshifter that feeds on defeated enemies',
        inherent: {
            name: 'Shadow Step',
            description: 'Transform between human, nova, and dwarf forms'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.85,
                ranged: 0.8,
                aoe: 0.7
            }
        },
        primarySets: ['umbral-blast'],
        secondarySets: ['umbral-aura']
    },
    
    'arachnos-soldier': {
        name: 'Soldier of Arachnos',
        side: 'villain',
        description: 'Versatile soldier with branching power choices',
        inherent: {
            name: 'Conditioning',
            description: 'Increased max HP'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 3.0,
            damageModifier: {
                melee: 0.75,
                ranged: 0.75,
                aoe: 0.65
            }
        },
        primarySets: ['arachnos-soldier'],
        secondarySets: ['training-and-gadgets']
    },
    
    'arachnos-widow': {
        name: 'Widow',
        side: 'villain',
        description: 'Versatile operative with branching power choices',
        inherent: {
            name: 'Conditioning',
            description: 'Increased max HP'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 3.0,
            damageModifier: {
                melee: 0.85,
                ranged: 0.65,
                aoe: 0.7
            }
        },
        primarySets: ['widow-training'],
        secondarySets: ['widow-teamwork']
    }
    */
    // End of Epic Archetypes comment block
    
    // ============================================
    // VILLAIN ARCHETYPES
    // ============================================
    
    'brute': {
        name: 'Brute',
        side: 'villain',
        description: 'High damage melee fighter that builds fury through combat',
        inherent: {
            name: 'Fury',
            description: 'Build up damage bonus by attacking and being attacked'
        },
        stats: {
            baseHP: 1606.4,
            maxHP: 2140.9,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 4.0,
            damageModifier: {
                melee: 0.75,
                ranged: 0.5,
                aoe: 0.65
            },
            buffDebuffModifier: 1.0
        },
        primarySets: [
            'brute/battle-axe',
            'brute/brawling',
            'brute/broad-sword',
            'brute/claws',
            'brute/dark-melee',
            'brute/dual-blades',
            'brute/electrical-melee',
            'brute/energy-melee',
            'brute/fiery-melee',
            'brute/ice-melee',
            'brute/katana',
            'brute/kinetic-attack',
            'brute/martial-arts',
            'brute/psionic-melee',
            'brute/radiation-melee',
            'brute/savage-melee',
            'brute/spines',
            'brute/staff-fighting',
            'brute/stone-melee',
            'brute/super-strength',
            'brute/titan-weapons',
            'brute/war-mace'
        ],
        secondarySets: [
            'brute/bio-organic-armor',
            'brute/dark-armor',
            'brute/electric-armor',
            'brute/energy-aura',
            'brute/fiery-aura',
            'brute/ice-armor',
            'brute/invulnerability',
            'brute/psionic-armor',
            'brute/radiation-armor',
            'brute/regeneration',
            'brute/shield-defense',
            'brute/stone-armor',
            'brute/super-reflexes',
            'brute/willpower'
        ]
    },
    
    'corruptor': {
        name: 'Corruptor',
        side: 'villain',
        description: 'Ranged damage dealer with debuffs and support abilities',
        inherent: {
            name: 'Scourge',
            description: 'Increased critical hit chance against low-health enemies'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.55,
                ranged: 0.75,
                aoe: 0.6
            },
            buffDebuffModifier: 0.75
        },
        primarySets: [
            'corruptor/archery',
            'corruptor/assault-rifle',
            'corruptor/beam-rifle',
            'corruptor/dark-blast',
            'corruptor/dual-pistols',
            'corruptor/electrical-blast',
            'corruptor/energy-blast',
            'corruptor/fire-blast',
            'corruptor/ice-blast',
            'corruptor/psychic-blast',
            'corruptor/radiation-blast',
            'corruptor/seismic-blast',
            'corruptor/sonic-attack',
            'corruptor/storm-blast',
            'corruptor/water-blast'
        ],
        secondarySets: [
            'corruptor/cold-domination',
            'corruptor/dark-miasma',
            'corruptor/empathy',
            'corruptor/force-field',
            'corruptor/kinetics',
            'corruptor/marine-affinity',
            'corruptor/nature-affinity',
            'corruptor/pain-domination',
            'corruptor/poison',
            'corruptor/radiation-emission',
            'corruptor/shock-therapy',
            'corruptor/sonic-resonance',
            'corruptor/storm-summoning',
            'corruptor/thermal-radiation',
            'corruptor/time-manipulation',
            'corruptor/traps',
            'corruptor/trick-arrow'
        ]
    },
    
    'dominator': {
        name: 'Dominator',
        side: 'villain',
        description: 'Control specialist with strong offensive capabilities',
        inherent: {
            name: 'Domination',
            description: 'Build meter to activate Domination for mag boost and endurance refill'
        },
        stats: {
            baseHP: 1017.4,
            maxHP: 1338.6,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.75,
                ranged: 0.75,
                aoe: 0.65
            },
            buffDebuffModifier: 0.9
        },
        primarySets: [
            'dominator/arsenal-control',
            'dominator/darkness-control',
            'dominator/earth-control',
            'dominator/electric-control',
            'dominator/fire-control',
            'dominator/gravity-control',
            'dominator/ice-control',
            'dominator/illusion-control',
            'dominator/mind-control',
            'dominator/plant-control',
            'dominator/pyrotechnic-control',
            'dominator/symphony-control',
            'dominator/wind-control'
        ],
        secondarySets: [
            'dominator/arsenal-assault',
            'dominator/dark-assault',
            'dominator/earth-assault',
            'dominator/electricity-manipulation',
            'dominator/energy-assault',
            'dominator/fiery-assault',
            'dominator/icy-assault',
            'dominator/martial-assault',
            'dominator/psionic-assault',
            'dominator/radioactive-assault',
            'dominator/savage-assault',
            'dominator/sonic-assault',
            'dominator/thorny-assault'
        ]
    },
    
    'mastermind': {
        name: 'Mastermind',
        side: 'villain',
        description: 'Pet commander with support abilities for minions',
        inherent: {
            name: 'Supremacy',
            description: 'Pets gain bonuses to accuracy, damage, and resistance when near you'
        },
        stats: {
            baseHP: 695.7,
            maxHP: 1070.8,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 1.0,
            damageModifier: {
                melee: 0.55,
                ranged: 0.55,
                aoe: 0.5
            },
            buffDebuffModifier: 0.75
        },
        primarySets: [
            'mastermind/beast-mastery',
            'mastermind/demon-summoning',
            'mastermind/mercenaries',
            'mastermind/necromancy',
            'mastermind/ninjas',
            'mastermind/robotics',
            'mastermind/thugs'
        ],
        secondarySets: [
            'mastermind/cold-domination',
            'mastermind/dark-miasma',
            'mastermind/empathy',
            'mastermind/force-field',
            'mastermind/kinetics',
            'mastermind/marine-affinity',
            'mastermind/nature-affinity',
            'mastermind/pain-domination',
            'mastermind/poison',
            'mastermind/radiation-emission',
            'mastermind/shock-therapy',
            'mastermind/sonic-debuff',
            'mastermind/storm-summoning',
            'mastermind/thermal-radiation',
            'mastermind/time-manipulation',
            'mastermind/traps',
            'mastermind/trick-arrow'
        ]
    },
    
    'stalker': {
        name: 'Stalker',
        side: 'villain',
        description: 'Stealthy assassin with critical strikes from hide',
        inherent: {
            name: 'Assassination',
            description: 'Massive critical strikes from hide, improved criticals'
        },
        stats: {
            baseHP: 1204.8,
            maxHP: 1606.4,
            baseEndurance: 100,
            baseRecovery: 1.67,
            baseThreat: 3.0,
            damageModifier: {
                melee: 1.0,
                ranged: 0.6,
                aoe: 0.7
            },
            buffDebuffModifier: 1.0
        },
        primarySets: [
            'stalker/brawling',
            'stalker/broad-sword',
            'stalker/claws',
            'stalker/dark-melee',
            'stalker/dual-blades',
            'stalker/electrical-melee',
            'stalker/energy-melee',
            'stalker/fiery-melee',
            'stalker/ice-melee',
            'stalker/kinetic-attack',
            'stalker/martial-arts',
            'stalker/ninja-sword',
            'stalker/psionic-melee',
            'stalker/radiation-melee',
            'stalker/savage-melee',
            'stalker/spines',
            'stalker/staff-fighting',
            'stalker/stone-melee'
        ],
        secondarySets: [
            'stalker/bio-organic-armor',
            'stalker/dark-armor',
            'stalker/electric-armor',
            'stalker/energy-aura',
            'stalker/fiery-aura',
            'stalker/ice-armor',
            'stalker/invulnerability',
            'stalker/ninjitsu',
            'stalker/psionic-armor',
            'stalker/radiation-armor',
            'stalker/regeneration',
            'stalker/shield-defense',
            'stalker/super-reflexes',
            'stalker/willpower'
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ARCHETYPES };
}
