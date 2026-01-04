/**
 * City of Heroes Planner - Stats Dashboard
 * 
 * Functions for the stats dashboard row
 */

// ============================================
// STAT DEFINITIONS
// ============================================

const STAT_CATEGORIES = {
    offense: {
        name: 'Offense',
        stats: {
            damage: { name: 'Damage', format: '+{value}%', color: 'stat-damage' },
            accuracy: { name: 'Accuracy', format: '+{value}%', color: 'stat-accuracy' },
            tohit: { name: 'To-Hit', format: '+{value}%', color: 'stat-tohit' },
            recharge: { name: 'Recharge', format: '+{value}%', color: 'stat-recharge' },
            endrdx: { name: 'End Reduction', format: '+{value}%', color: 'stat-endurance' }
        }
    },
    defense: {
        name: 'Defense',
        stats: {
            defMelee: { name: 'Def (Melee)', format: '{value}%', color: 'stat-defense' },
            defRanged: { name: 'Def (Ranged)', format: '{value}%', color: 'stat-defense' },
            defAoE: { name: 'Def (AoE)', format: '{value}%', color: 'stat-defense' },
            defSmashing: { name: 'Def (S)', format: '{value}%', color: 'stat-defense' },
            defLethal: { name: 'Def (L)', format: '{value}%', color: 'stat-defense' },
            defFire: { name: 'Def (F)', format: '{value}%', color: 'stat-defense' },
            defCold: { name: 'Def (C)', format: '{value}%', color: 'stat-defense' },
            defEnergy: { name: 'Def (E)', format: '{value}%', color: 'stat-defense' },
            defNegative: { name: 'Def (N)', format: '{value}%', color: 'stat-defense' },
            defPsionic: { name: 'Def (P)', format: '{value}%', color: 'stat-defense' },
            defToxic: { name: 'Def (T)', format: '{value}%', color: 'stat-defense' }
        }
    },
    resistance: {
        name: 'Resistance',
        stats: {
            resSmashing: { name: 'Res (S)', format: '{value}%', color: 'stat-resistance' },
            resLethal: { name: 'Res (L)', format: '{value}%', color: 'stat-resistance' },
            resFire: { name: 'Res (F)', format: '{value}%', color: 'stat-resistance' },
            resCold: { name: 'Res (C)', format: '{value}%', color: 'stat-resistance' },
            resEnergy: { name: 'Res (E)', format: '{value}%', color: 'stat-resistance' },
            resNegative: { name: 'Res (N)', format: '{value}%', color: 'stat-resistance' },
            resPsionic: { name: 'Res (P)', format: '{value}%', color: 'stat-resistance' },
            resToxic: { name: 'Res (T)', format: '{value}%', color: 'stat-resistance' }
        }
    },
    recovery: {
        name: 'Recovery & HP',
        stats: {
            recovery: { name: 'Recovery', format: '+{value}%', color: 'stat-recovery' },
            regeneration: { name: 'Regeneration', format: '+{value}%', color: 'stat-regeneration' },
            maxhp: { name: 'Max HP', format: '+{value}%', color: 'stat-healing' },
            maxend: { name: 'Max End', format: '+{value}%', color: 'stat-endurance' }
        }
    },
    baseline: {
        name: 'Baseline Stats',
        stats: {
            baselineEndurance: { name: 'Base Endurance', format: '{value}', color: 'stat-endurance' },
            baselineRecovery: { name: 'Base Recovery', format: '{value} /sec', color: 'stat-recovery' },
            baselineHealth: { name: 'Base Health', format: '{value} HP', color: 'stat-healing' },
            baselineMaxHealth: { name: 'Max Health', format: '{value} HP', color: 'stat-healing' }
        }
    },
    movement: {
        name: 'Movement',
        stats: {
            runspeed: { name: 'Run Speed', format: '+{value}%', color: 'stat-speed' },
            flyspeed: { name: 'Fly Speed', format: '+{value}%', color: 'stat-fly' },
            jumpspeed: { name: 'Jump Speed', format: '+{value}%', color: 'stat-jump' },
            jumpheight: { name: 'Jump Height', format: '+{value}%', color: 'stat-jump' }
        }
    }
};

// Default enabled stats (what shows on dashboard initially)
const DEFAULT_ENABLED_STATS = [
    'damage',
    'accuracy',
    'recharge',
    'defRanged',
    'defEnergy',
    'defNegative',
    'runspeed',
    'maxhp',
    'regeneration',
    'maxend',
    'recovery',
];

// User's enabled stats (stored in Build object)
if (!Build.settings.enabledStats) {
    Build.settings.enabledStats = [...DEFAULT_ENABLED_STATS];
}

// Character's actual stat values (calculated from enhancements and set bonuses)
const CharacterStats = {
    // Offense
    damage: 0,
    accuracy: 0,
    tohit: 0,
    recharge: 0,
    endrdx: 0,
    
    // Defense (Positional)
    defMelee: 0,
    defRanged: 0,
    defAoE: 0,
    
    // Defense (Typed)
    defSmashing: 0,
    defLethal: 0,
    defFire: 0,
    defCold: 0,
    defEnergy: 0,
    defNegative: 0,
    defPsionic: 0,
    defToxic: 0,
    
    // Resistance
    resSmashing: 0,
    resLethal: 0,
    resFire: 0,
    resCold: 0,
    resEnergy: 0,
    resNegative: 0,
    resPsionic: 0,
    resToxic: 0,
    
    // Recovery & HP
    recovery: 0,
    regeneration: 0,
    maxhp: 0,
    maxend: 0,
    
    // Movement
    runspeed: 0,
    flyspeed: 0,
    jumpspeed: 0,
    jumpheight: 0
};

// Baseline stats (before enhancements and set bonuses)
const BaselineStats = {
    baselineEndurance: 0,
    baselineRecovery: 0,
    baselineHealth: 0,
    baselineMaxHealth: 0
};

// ============================================
// STATS SELECTOR MODAL
// ============================================

/**
 * Open stats selector modal
 * Allows user to choose which stats to display on dashboard
 */
function openStatsSelector() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'simple-modal';
    modal.id = 'statsSelectorModal';
    
    // Create modal content
    const content = document.createElement('div');
    content.className = 'simple-modal-content';
    content.style.maxWidth = '700px';
    content.style.maxHeight = '80vh';
    
    // Header
    const header = document.createElement('h3');
    header.textContent = 'Configure Dashboard Stats';
    content.appendChild(header);
    
    const subtitle = document.createElement('p');
    subtitle.style.fontSize = '12px';
    subtitle.style.color = 'var(--text-secondary)';
    subtitle.style.marginBottom = '16px';
    subtitle.textContent = 'Select which stats to display on the dashboard (max 8 recommended)';
    content.appendChild(subtitle);
    
    // Scrollable stats list
    const statsContainer = document.createElement('div');
    statsContainer.style.flex = '1';
    statsContainer.style.overflowY = 'auto';
    statsContainer.style.marginBottom = '16px';
    
    // Build category sections
    Object.entries(STAT_CATEGORIES).forEach(([categoryId, category]) => {
        const section = document.createElement('div');
        section.style.marginBottom = '20px';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.style.fontWeight = '600';
        categoryHeader.style.fontSize = '12px';
        categoryHeader.style.color = 'var(--accent)';
        categoryHeader.style.textTransform = 'uppercase';
        categoryHeader.style.letterSpacing = '0.05em';
        categoryHeader.style.marginBottom = '10px';
        categoryHeader.style.paddingBottom = '4px';
        categoryHeader.style.borderBottom = '1px solid var(--border)';
        categoryHeader.textContent = category.name;
        section.appendChild(categoryHeader);
        
        const statsGrid = document.createElement('div');
        statsGrid.style.display = 'grid';
        statsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        statsGrid.style.gap = '8px';
        
        Object.entries(category.stats).forEach(([statId, stat]) => {
            const statOption = document.createElement('label');
            statOption.style.display = 'flex';
            statOption.style.alignItems = 'center';
            statOption.style.gap = '8px';
            statOption.style.padding = '6px 8px';
            statOption.style.background = 'var(--bg-tertiary)';
            statOption.style.border = '1px solid var(--border)';
            statOption.style.borderRadius = '4px';
            statOption.style.cursor = 'pointer';
            statOption.style.fontSize = '12px';
            statOption.style.transition = 'all 0.15s';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = statId;
            checkbox.checked = Build.settings.enabledStats.includes(statId);
            checkbox.onchange = () => updateStatSelection(statId, checkbox.checked);
            
            const label = document.createElement('span');
            label.textContent = stat.name;
            
            statOption.appendChild(checkbox);
            statOption.appendChild(label);
            
            statOption.onmouseenter = () => {
                statOption.style.borderColor = 'var(--accent)';
            };
            statOption.onmouseleave = () => {
                statOption.style.borderColor = 'var(--border)';
            };
            
            statsGrid.appendChild(statOption);
        });
        
        section.appendChild(statsGrid);
        statsContainer.appendChild(section);
    });
    
    content.appendChild(statsContainer);
    
    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    
    const resetBtn = document.createElement('button');
    resetBtn.textContent = 'Reset to Defaults';
    resetBtn.onclick = () => {
        Build.settings.enabledStats = [...DEFAULT_ENABLED_STATS];
        closeStatsSelector();
        openStatsSelector(); // Reopen to show updated checkboxes
        updateStatsDashboard();
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Done';
    closeBtn.style.marginLeft = 'auto';
    closeBtn.onclick = () => {
        closeStatsSelector();
        updateStatsDashboard();
    };
    
    buttonContainer.appendChild(resetBtn);
    buttonContainer.appendChild(closeBtn);
    content.appendChild(buttonContainer);
    
    modal.appendChild(content);
    
    // Close on background click
    modal.onclick = (e) => {
        if (e.target === modal) {
            closeStatsSelector();
            updateStatsDashboard();
        }
    };
    
    document.body.appendChild(modal);
}

/**
 * Update stat selection when checkbox is toggled
 */
function updateStatSelection(statId, enabled) {
    if (enabled) {
        if (!Build.settings.enabledStats.includes(statId)) {
            Build.settings.enabledStats.push(statId);
        }
    } else {
        Build.settings.enabledStats = Build.settings.enabledStats.filter(id => id !== statId);
    }
}

/**
 * Close stats selector modal
 */
function closeStatsSelector() {
    const modal = document.getElementById('statsSelectorModal');
    if (modal) modal.remove();
}

// ============================================
// BASELINE STATS CALCULATION
// ============================================

/**
 * Get baseline endurance for current archetype and level
 * @returns {number} Baseline endurance value
 */
function getBaselineEndurance() {
    if (!Build.archetype || !ARCHETYPES[Build.archetype]) {
        return 100;
    }
    
    const archetype = ARCHETYPES[Build.archetype];
    const baseEnd = archetype.stats.baseEndurance || 100;
    
    // Endurance scales slightly with level (approximately +1% per level after level 1)
    const levelMultiplier = 1 + ((Build.level - 1) * 0.01);
    return baseEnd * levelMultiplier;
}

/**
 * Get baseline recovery for current archetype and level
 * Recovery = endurance recovered per second
 * @returns {number} Baseline recovery value
 */
function getBaselineRecovery() {
    if (!Build.archetype || !ARCHETYPES[Build.archetype]) {
        return 1.67;
    }
    
    const archetype = ARCHETYPES[Build.archetype];
    const baseRecovery = archetype.stats.baseRecovery || 1.67;
    
    // Recovery scales with level (approximately +2% per level after level 1)
    const levelMultiplier = 1 + ((Build.level - 1) * 0.02);
    return baseRecovery * levelMultiplier;
}

/**
 * Get baseline health for current archetype and level
 * Health is adjusted by archetype modifiers
 * @returns {object} Object with baseHealth and maxHealth values
 */
function getBaselineHealth() {
    if (!Build.archetype || !ARCHETYPES[Build.archetype]) {
        return {
            baseHealth: 1204.8,
            maxHealth: 1606.4
        };
    }
    
    const archetype = ARCHETYPES[Build.archetype];
    const baseHP = archetype.stats.baseHP || 1204.8;
    const maxHP = archetype.stats.maxHP || 1606.4;
    
    // HP scales with level (approximately +1.5% per level after level 1)
    const levelMultiplier = 1 + ((Build.level - 1) * 0.015);
    
    return {
        baseHealth: baseHP * levelMultiplier,
        maxHealth: maxHP * levelMultiplier
    };
}

/**
 * Update baseline stats based on current build
 * Called whenever archetype or level changes
 */
function updateBaselineStats() {
    BaselineStats.baselineEndurance = getBaselineEndurance();
    BaselineStats.baselineRecovery = getBaselineRecovery();
    
    const health = getBaselineHealth();
    BaselineStats.baselineHealth = health.baseHealth;
    BaselineStats.baselineMaxHealth = health.maxHealth;
}

// ============================================
// STATS DASHBOARD UPDATE
// ============================================

/**
 * Update the stats dashboard with current values
 */
function updateStatsDashboard() {
    const container = document.querySelector('.stats-dashboard-items');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Get all stat definitions
    const allStats = {};
    Object.values(STAT_CATEGORIES).forEach(category => {
        Object.assign(allStats, category.stats);
    });
    
    // Show enabled stats
    Build.settings.enabledStats.forEach(statId => {
        const statDef = allStats[statId];
        if (!statDef) return;
        
        // Get value from appropriate source
        let value;
        if (statId.startsWith('baseline')) {
            // Get baseline stats
            value = BaselineStats[statId] || 0;
        } else {
            // Get character stats (from enhancements and set bonuses)
            value = CharacterStats[statId] || 0;
        }
        
        // Format the value (baseline stats are absolute values, not percentages)
        const formattedValue = statDef.format.replace('{value}', 
            statId.startsWith('baseline') ? value.toFixed(0) : value.toFixed(1)
        );
        
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';
        statItem.style.cursor = 'help'; // Show help cursor on hover
        
        const label = document.createElement('div');
        label.className = 'stat-label';
        label.textContent = statDef.name;
        
        // Apply color scheme if available
        if (typeof applyDashboardStatStyle === 'function') {
            applyDashboardStatStyle(label, statId);
        } else {
            // Fallback to legacy class-based styling
            label.className += ` ${statDef.color}`;
        }
        
        const statValue = document.createElement('div');
        statValue.className = 'stat-value';
        statValue.textContent = formattedValue;
        
        // Apply color to the value if color scheme is available
        if (typeof getStatColor === 'function') {
            statValue.style.color = getStatColor(statId);
        }
        
        statItem.appendChild(label);
        statItem.appendChild(statValue);
        
        // Add tooltip handlers (using unified tooltip system)
        statItem.onmouseenter = (e) => {
            if (typeof showStatTooltip === 'function') {
                showStatTooltip(e, statDef.name, statId, value);
            }
        };
        statItem.onmouseleave = () => {
            if (typeof hideTooltip === 'function') {
                hideTooltip();
            }
        };
        
        container.appendChild(statItem);
    });
}

// ============================================
// DETAILED STATS VIEW
// ============================================

/**
 * Open detailed stats view modal
 * Shows comprehensive breakdown of all character statistics
 */
function openStatsDetail() {
    alert('Detailed Stats View Modal - Coming soon!');
    // TODO: Build comprehensive stats breakdown modal
    // Will show:
    // - All stats with sources
    // - Active set bonuses
    // - Power enhancements
    // - Archetype modifiers
}

// ============================================
// STAT CALCULATION
// ============================================

/**
 * Recalculate all character stats from enhancements and set bonuses
 * Uses Rule of 5 system for accurate bonus tracking
 */
function recalculateStats() {
    // Update baseline stats first
    updateBaselineStats();
    
    // Reset all stats to 0
    Object.keys(CharacterStats).forEach(key => {
        CharacterStats[key] = 0;
    });
    
    // Use Rule of 5 system if available (aggregates bonuses properly)
    if (typeof getAggregatedSetBonuses === 'function') {
        const setBonuses = getAggregatedSetBonuses();
        Object.entries(setBonuses).forEach(([stat, value]) => {
            if (CharacterStats.hasOwnProperty(stat)) {
                CharacterStats[stat] += value;
            }
        });
        console.log('Stats recalculated with Rule of 5:', CharacterStats);
        console.log('Bonus tracking:', BonusTracking);
    } else {
        // Fallback to old system
        const setBonuses = calculateSetBonuses();
        Object.entries(setBonuses).forEach(([stat, value]) => {
            if (CharacterStats.hasOwnProperty(stat)) {
                CharacterStats[stat] += value;
            }
        });
        console.log('Stats recalculated (old system):', CharacterStats);
    }
    
    // TODO: Add enhancement bonuses from slotted enhancements
    
    // Log baseline stats for debugging
    console.log('Baseline Stats:', BaselineStats);
    
    // Update dashboard display
    updateStatsDashboard();
}

// Initialize dashboard on page load
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateStatsDashboard();
    }, 200);
});
