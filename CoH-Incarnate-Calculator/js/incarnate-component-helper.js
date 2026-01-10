/**
 * Incarnate Component Helper
 * Bridges IncarnateData and IncarnateComponents
 */

// Map IncarnateData tree names to IncarnateComponents keys (especially for Lore)
function getComponentTreeKey(slot, treeName) {
    if (slot !== 'lore') {
        // For non-lore slots, just use the tree name as-is
        return treeName;
    }
    
    // For Lore, map the tree display names to component data keys
    // These are the exact keys as used in IncarnateComponents
    const loreMapping = {
        'Arachnos': 'Arachnos',
        'Banished': 'Banished',
        'Banished Pantheon': 'Banished',
        'Carnival': 'Carnival',
        'Carnival of Shadows': 'Carnival',
        'Cimeroran': 'Cimeroran',
        'Clockwork': 'Clockwork',
        'Drones': 'Robotic',
        'Robotic Drones': 'Robotic',
        'Elementals': 'Storm',
        'IDF': 'IDF',
        'Knives': 'Knives',
        'Knives of Artemis': 'Knives',
        'Lights': 'Polar',
        'Polar Lights': 'Polar',
        'Longbow': 'Longbow',
        'Nemesis': 'Nemesis',
        'Phantoms': 'Phantom',
        'Rikti': 'Rikti',
        'Rularuu': 'Rularuu',
        'Seers': 'Seers',
        'Talons': 'Talons',
        'Talons of Vengeance': 'Talons',
        'Tsoo': 'Tsoo',
        'Vanguard': 'Vanguard',
        'WarWorks': 'Warworks',
        'Praetorian Clockwork': 'Warworks'
    };
    
    return loreMapping[treeName] || treeName;
}

// Function to get salvage components for a given tier/variant
function getComponentsForNode(slot, tree, nodeId) {
    // Map node IDs to tiers and sub-variants
    const tierMap = {
        't1': { tier: 1, variant: 'core' },
        't2_core': { tier: 2, variant: 'core' },
        't2_radial': { tier: 2, variant: 'radial' },
        't3_core_1': { tier: 3, variant: 'core_1' },
        't3_core_2': { tier: 3, variant: 'core_2' },
        't3_radial_1': { tier: 3, variant: 'radial_1' },
        't3_radial_2': { tier: 3, variant: 'radial_2' },
        't4_core': { tier: 4, variant: 'core' },
        't4_radial': { tier: 4, variant: 'radial' }
    };
    
    const mapping = tierMap[nodeId];
    if (!mapping) return null;
    
    const { tier, variant } = mapping;
    
    // Access component data
    const tierKey = `tier${tier}`;
    const slotData = IncarnateComponents[slot.toLowerCase()];
    
    // Use the mapping function to get the correct tree key
    const componentTreeKey = getComponentTreeKey(slot, tree);
    
    if (!slotData || !slotData[componentTreeKey]) {
        console.warn(`getComponentsForNode: No component data for ${slot} - ${tree} (looked for: ${componentTreeKey})`);
        return null;
    }
    
    const tierData = slotData[componentTreeKey][tierKey];
    if (!tierData) {
        console.warn(`getComponentsForNode: No ${tierKey} for ${slot} - ${tree}`);
        return null;
    }
    
    // For tier3, try to get the specific variant (core_1, core_2, radial_1, radial_2)
    // For other tiers, just use core/radial
    let result = null;
    
    if (tier === 3 && tierData[variant]) {
        // Has specific sub-variant like core_1, core_2
        result = tierData[variant];
    } else if (tier !== 3 && tierData[variant]) {
        // Use standard variant mapping
        result = tierData[variant];
    } else if (tierData['core'] && (variant === 'core' || variant === 'core_1' || variant === 'core_2')) {
        // Fallback to generic core
        result = tierData['core'];
    } else if (tierData['radial'] && (variant === 'radial' || variant === 'radial_1' || variant === 'radial_2')) {
        // Fallback to generic radial
        result = tierData['radial'];
    }
    
    if (!result) {
        console.warn(`getComponentsForNode: No data for ${slot} - ${tree} - ${tierKey}.${variant}`);
        return null;
    }
    
    console.log(`getComponentsForNode(${slot}, ${tree}, ${nodeId}): tier${tier}.${variant} = salvage=[${result.salvage ? result.salvage.join(', ') : 'EMPTY'}]`);
    return result;
}

// Function to calculate cost for a single component
function getComponentCost(salvageName) {
    const rarity = getComponentRarity(salvageName);
    const costMap = {
        'common': { threads: 20, empyrean: 0 },
        'uncommon': { threads: 60, empyrean: 0 },
        'rare': { threads: 0, empyrean: 8 },
        'very-rare': { threads: 0, empyrean: 30 }
    };
    return costMap[rarity] || { threads: 0, empyrean: 0 };
}

// Function to calculate total cost for components in a tier
function calculateComponentsCost(components) {
    let totalThreads = 0;
    let totalEmpyrean = 0;
    
    if (!components || !Array.isArray(components)) {
        console.log(`calculateComponentsCost: No valid components array`);
        return { threads: totalThreads, empyrean: totalEmpyrean };
    }
    
    console.log(`calculateComponentsCost: Processing ${components.length} components`);
    
    components.forEach(comp => {
        // Parse quantity if present
        const match = comp.match(/^(\d+)x\s+(.+)$/) || comp.match(/^(.+)$/);
        const quantity = match[1] && !isNaN(match[1]) ? parseInt(match[1]) : 1;
        const name = match[2] || match[1];
        
        const cost = getComponentCost(name);
        const compTotal = {threads: cost.threads * quantity, empyrean: cost.empyrean * quantity};
        totalThreads += compTotal.threads;
        totalEmpyrean += compTotal.empyrean;
        
        console.log(`  ${comp} (qty:${quantity}, name:"${name}") -> {threads:${cost.threads}*${quantity}=${compTotal.threads}, emp:${cost.empyrean}*${quantity}=${compTotal.empyrean}}`);
    });
    
    console.log(`calculateComponentsCost TOTAL: {threads:${totalThreads}, empyrean:${totalEmpyrean}}`);
    
    return { threads: totalThreads, empyrean: totalEmpyrean };
}

// Function to calculate thread cost for a tier
function getThreadCost(tier) {
    const costs = {
        1: 20,   // Common
        2: 60,   // Uncommon  
        3: 0,    // Rare (uses Empyrean only)
        4: 0     // Very Rare (uses Empyrean only)
    };
    return costs[tier] || 0;
}

// Function to calculate Empyrean Merit cost for a tier
function getEmpyreanCost(tier) {
    const costs = {
        1: 0,
        2: 0,
        3: 8,    // Rare
        4: 30    // Very Rare
    };
    return costs[tier] || 0;
}

// Function to get component rarity from salvage name
function getComponentRarity(salvageName) {
    // Extract just the salvage name without quantity
    const name = salvageName.replace(/^\d+x\s+/, '');
    
    // Common components (20 threads each)
    const common = ['ArcaneCantrip', 'BiomorphicGoo', 'DetailedReports', 'EnchantedSand',
                    'GenomicAnalysis', 'MeditationTechniques', 'NanotechGrowthMedium', 'SuperchargedCapacitor'];
    
    // Uncommon components (60 threads each)
    const uncommon = ['CytoliticInfusion', 'DimensionalPocket',
                      'GluonCompound', 'WornSpellbook'];
    
    // Rare components (8 Empyrean each)
    const rare = ['AncientTexts', 'ExoticIsotope', 'SemiConsciousEnergy',
                  'SuperconductiveMembrane'];
    
    // Very Rare components (30 Empyrean each)
    const veryRare = ['FavoroftheWell', 'ForbiddenTechnique', 'InfiniteTessellation',
                      'LivingRelic', 'SelfEvolvingAlloy', 'ThaumicResonator'];
    
    if (common.includes(name)) return 'common';
    if (uncommon.includes(name)) return 'uncommon';
    if (rare.includes(name)) return 'rare';
    if (veryRare.includes(name)) return 'very-rare';
    
    return 'common'; // Default
}

// Function to colorize component names
function colorizeComponent(salvageName) {
    const rarity = getComponentRarity(salvageName);
    return `<span class="component-${rarity}">${salvageName}</span>`;
}

// Function to get formatted component list for display
function getFormattedComponents(slot, tree, nodeId) {
    const components = getComponentsForNode(slot, tree, nodeId);
    if (!components) return [];
    
    return components.salvage || [];
}

// Function to get all prerequisite powers
function getPrerequisites(slot, tree, nodeId) {
    const components = getComponentsForNode(slot, tree, nodeId);
    if (!components) return [];
    
    return components.prerequisites || [];
}

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getComponentsForNode,
        getThreadCost,
        getEmpyreanCost,
        getComponentRarity,
        getComponentCost,
        calculateComponentsCost,
        colorizeComponent,
        getFormattedComponents,
        getPrerequisites
    };
}
