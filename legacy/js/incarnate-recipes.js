/**
 * Incarnate Crafting Recipes
 * Complete crafting costs for all Incarnate powers
 */

const IncarnateRecipes = {
    // Alpha Slot (Unique crafting path)
    alpha: {
        trees: ['Agility', 'Cardiac', 'Intuition', 'Musculature', 'Nerve', 'Resilient', 'Spiritual', 'Vigor'],
        tiers: {
            1: {
                // Tier 1: Boost (Common)
                name: 'Boost',
                threads: 20,
                // OR
                shards: 12,  // 3 Common Alpha Components
                components: ['3x Common Alpha Component'],
                requires: []
            },
            2: {
                // Tier 2: Core/Radial Boost OR Core/Radial Paragon (Uncommon)
                core: { name: 'Core Paragon' },
                radial: { name: 'Radial Paragon' },
                threads: 60,
                // OR
                shards: 32,  // 1 Uncommon + 2 Common + T1 consumed
                components: ['1x Uncommon Alpha Component', '2x Common Alpha Component'],
                requires: ['t1']  // Consumes T1
            },
            3: {
                // Tier 3: Partial Core/Radial Revamp (Rare) + Level Shift
                core: { name: 'Partial Core Revamp' },
                radial: { name: 'Partial Radial Revamp' },
                threads: 100,
                empyrean: 8,  // To craft Rare Component
                // OR
                noticeOfWell: 1,  // From Weekly Strike Target
                components: ['1x Rare Alpha Component'],
                requires: ['t2']  // Consumes T2 (Core or Radial)
            },
            4: {
                // Tier 4: Total Core/Radial Revamp (Very Rare)
                core: { name: 'Total Core Revamp' },
                radial: { name: 'Total Radial Revamp' },
                threads: 600,  // 300 per T3 variant
                empyrean: 60,  // 30 per T3 variant
                components: ['2x Very Rare Alpha Component'],
                requires: ['t3_core', 't3_radial']  // Need BOTH T3 variants
            }
        }
    },
    
    // Judgement Slot (Standard path)
    judgement: {
        trees: ['Cryonic', 'Ion', 'Pyronic', 'Void', 'Vorpal'],
        damageTypes: {
            Cryonic: 'Cold',
            Ion: 'Energy',
            Pyronic: 'Fire',
            Void: 'Negative',
            Vorpal: 'Lethal'
        },
        tiers: {
            1: {
                name: 'Judgement',
                threads: 60,
                components: ['1x Common Incarnate Component'],
                requires: []
            },
            2: {
                core: { name: 'Core Beam' },
                radial: { name: 'Radial Blast' },
                threads: 240,  // 4 Uncommon Components
                components: ['4x Uncommon Incarnate Component'],
                requires: ['t1']
            },
            3: {
                core: { name: 'Partial Core Invocation' },
                radial: { name: 'Partial Radial Invocation' },
                threads: 100,
                empyrean: 8,
                components: ['1x Rare Incarnate Component'],
                requires: ['t2']
            },
            4: {
                core: { name: 'Total Core Invocation' },
                radial: { name: 'Total Radial Invocation' },
                threads: 300,
                empyrean: 30,
                components: ['1x Very Rare Incarnate Component'],
                requires: ['t3_core', 't3_radial']
            }
        }
    },
    
    // Interface Slot (Standard path)
    interface: {
        trees: ['Cognitive', 'Degenerative', 'Diamagnetic', 'Gravitic', 'Paralytic', 'Preemptive', 'Reactive', 'Spectral'],
        effectTypes: {
            Cognitive: 'Confuse',
            Degenerative: '-Regen/-MaxHP',
            Diamagnetic: '-ToHit',
            Gravitic: '-DMG/-Speed',
            Paralytic: 'Hold',
            Preemptive: 'Placate',
            Reactive: '-Res/DoT',
            Spectral: 'Immob/-Rech'
        },
        tiers: {
            1: {
                name: 'Interface',
                threads: 60,
                components: ['1x Common Incarnate Component'],
                requires: []
            },
            2: {
                core: { name: 'Core Boost' },
                radial: { name: 'Radial Boost' },
                threads: 240,
                components: ['4x Uncommon Incarnate Component'],
                requires: ['t1']
            },
            3: {
                core: { name: 'Partial Core Improved' },
                radial: { name: 'Partial Radial Improved' },
                threads: 100,
                empyrean: 8,
                components: ['1x Rare Incarnate Component'],
                requires: ['t2']
            },
            4: {
                core: { name: 'Total Core Improved' },
                radial: { name: 'Total Radial Improved' },
                threads: 300,
                empyrean: 30,
                components: ['1x Very Rare Incarnate Component'],
                requires: ['t3_core', 't3_radial']
            }
        }
    },
    
    // Lore Slot (Standard path)
    lore: {
        trees: ['Arachnos', 'Banished', 'Carnival', 'Cimeroran', 'Clockwork', 'Drones', 'Elementals', 
               'IDF', 'Knives', 'Lights', 'Longbow', 'Nemesis', 'Phantoms', 'Rikti', 'Rularuu', 
               'Seers', 'Talons', 'Tsoo', 'Vanguard', 'WarWorks'],
        tiers: {
            1: {
                name: 'Ally',
                threads: 60,
                components: ['1x Common Incarnate Component'],
                requires: []
            },
            2: {
                core: { name: 'Core Ally' },
                radial: { name: 'Radial Ally' },
                threads: 240,
                components: ['4x Uncommon Incarnate Component'],
                requires: ['t1']
            },
            3: {
                core: { name: 'Core Superior Ally' },
                radial: { name: 'Radial Superior Ally' },
                threads: 100,
                empyrean: 8,
                components: ['1x Rare Incarnate Component'],
                requires: ['t2']
            },
            4: {
                core: { name: 'Core Final Judgement' },
                radial: { name: 'Radial Final Judgement' },
                threads: 300,
                empyrean: 30,
                components: ['1x Very Rare Incarnate Component'],
                requires: ['t3_core', 't3_radial']
            }
        }
    },
    
    // Destiny Slot (Standard path)
    destiny: {
        trees: ['Ageless', 'Barrier', 'Clarion', 'Incandescence', 'Rebirth'],
        effectTypes: {
            Ageless: 'Recharge/Recovery',
            Barrier: 'Defense/Resistance',
            Clarion: 'Mez Protection',
            Incandescence: 'Damage/ToHit',
            Rebirth: 'Heal/Regen'
        },
        tiers: {
            1: {
                name: 'Destiny',
                threads: 60,
                components: ['1x Common Incarnate Component'],
                requires: []
            },
            2: {
                core: { name: 'Core Boost' },
                radial: { name: 'Radial Boost' },
                threads: 240,
                components: ['4x Uncommon Incarnate Component'],
                requires: ['t1']
            },
            3: {
                core: { name: 'Partial Core Invocation' },
                radial: { name: 'Partial Radial Invocation' },
                threads: 100,
                empyrean: 8,
                components: ['1x Rare Incarnate Component'],
                requires: ['t2']
            },
            4: {
                core: { name: 'Total Core Epiphany' },
                radial: { name: 'Total Radial Epiphany' },
                threads: 300,
                empyrean: 30,
                components: ['1x Very Rare Incarnate Component'],
                requires: ['t3_core', 't3_radial']
            }
        }
    },
    
    // Hybrid Slot (Standard path)
    hybrid: {
        trees: ['Assault', 'Control', 'Melee', 'Support'],
        effectTypes: {
            Assault: 'Damage/ToHit',
            Control: 'Control Duration/Mag',
            Melee: 'Melee Damage/Defense',
            Support: 'Healing/Endurance'
        },
        tiers: {
            1: {
                name: 'Hybrid',
                threads: 60,
                components: ['1x Common Incarnate Component'],
                requires: []
            },
            2: {
                core: { name: 'Core Boost' },
                radial: { name: 'Radial Boost' },
                threads: 240,
                components: ['4x Uncommon Incarnate Component'],
                requires: ['t1']
            },
            3: {
                core: { name: 'Partial Core Embodiment' },
                radial: { name: 'Partial Radial Embodiment' },
                threads: 100,
                empyrean: 8,
                components: ['1x Rare Incarnate Component'],
                requires: ['t2']
            },
            4: {
                core: { name: 'Total Core Embodiment' },
                radial: { name: 'Total Radial Embodiment' },
                threads: 300,
                empyrean: 30,
                components: ['1x Very Rare Incarnate Component'],
                requires: ['t3_core', 't3_radial']
            }
        }
    },
    
    // Component conversion rates
    conversions: {
        threadsToEmpyrean: 0,  // Cannot convert threads to Empyrean
        empyreanToThreads: 20,  // 1 Empyrean = 20 Threads
        
        // Alpha-specific
        shardsToThreads: 5,  // 1 Shard = 5 Threads
        noticeOfWellToEmpyrean: 1,
        favorOfWellToEmpyrean: 2.5
    },
    
    /**
     * Calculate total costs for a power selection
     * @param {string} slot - alpha, judgement, etc.
     * @param {string} tree - Cardiac, Ion, etc.
     * @param {number} tier - 1-4
     * @param {string} variant - 'core' or 'radial' (for tier 2-4)
     * @returns {Object} Total costs including all prerequisites
     */
    calculateCost(slot, tree, tier, variant) {
        const slotData = this[slot];
        if (!slotData) return null;
        
        let totalThreads = 0;
        let totalEmpyrean = 0;
        let totalShards = 0;
        let components = [];
        
        // Add T1 cost
        if (tier >= 1) {
            const t1 = slotData.tiers[1];
            totalThreads += t1.threads || 0;
            totalShards += t1.shards || 0;
            if (t1.components) components.push(...t1.components);
        }
        
        // Add T2 cost
        if (tier >= 2) {
            const t2 = slotData.tiers[2];
            totalThreads += t2.threads || 0;
            totalShards += t2.shards || 0;
            if (t2.components) components.push(...t2.components);
        }
        
        // Add T3 cost
        if (tier >= 3) {
            const t3 = slotData.tiers[3];
            totalThreads += t3.threads || 0;
            totalEmpyrean += t3.empyrean || 0;
            if (t3.components) components.push(...t3.components);
        }
        
        // Add T4 cost (includes both T3 variants)
        if (tier === 4) {
            const t4 = slotData.tiers[4];
            const t3 = slotData.tiers[3];
            
            // T4 cost
            totalThreads += t4.threads || 0;
            totalEmpyrean += t4.empyrean || 0;
            if (t4.components) components.push(...t4.components);
            
            // Need to add the OTHER T3 variant's cost
            totalThreads += t3.threads || 0;
            totalEmpyrean += t3.empyrean || 0;
            if (t3.components) components.push(...t3.components);
        }
        
        return {
            slot,
            tree,
            tier,
            variant,
            totalThreads,
            totalEmpyrean,
            totalShards,
            components
        };
    },
    
    /**
     * Get full power name
     */
    getPowerName(slot, tree, tier, variant) {
        const slotData = this[slot];
        if (!slotData) return '';
        
        const tierData = slotData.tiers[tier];
        if (!tierData) return '';
        
        let tierName = '';
        if (tier === 1) {
            tierName = tierData.name;
        } else {
            tierName = tierData[variant]?.name || tierData.name;
        }
        
        return `${tree} ${tierName}`;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncarnateRecipes;
}
