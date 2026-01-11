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
            defSL: { name: 'Def (S/L)', format: '{value}%', color: 'stat-defense' },
            defFC: { name: 'Def (F/C)', format: '{value}%', color: 'stat-defense' },
            defEN: { name: 'Def (E/N)', format: '{value}%', color: 'stat-defense' },
            defPsionic: { name: 'Def (Psy)', format: '{value}%', color: 'stat-defense' },
            defToxic: { name: 'Def (Tox)', format: '{value}%', color: 'stat-defense' }
        }
    },
    resistance: {
        name: 'Resistance',
        stats: {
            resSL: { name: 'Res (S/L)', format: '{value}%', color: 'stat-resistance' },
            resFC: { name: 'Res (F/C)', format: '{value}%', color: 'stat-resistance' },
            resEN: { name: 'Res (E/N)', format: '{value}%', color: 'stat-resistance' },
            resPsionic: { name: 'Res (Psy)', format: '{value}%', color: 'stat-resistance' },
            resToxic: { name: 'Res (Tox)', format: '{value}%', color: 'stat-resistance' }
        }
    },
    recovery: {
        name: 'Recovery & HP',
        stats: {
            maxend: { name: 'Max End', format: '{absValue} (+{value}%)', color: 'stat-endurance', dualDisplay: true },
            recovery: { name: 'Recovery', format: '{absValue} /sec (+{value}%)', color: 'stat-recovery', dualDisplay: true },
            maxhp: { name: 'Max HP', format: '{absValue} HP (+{value}%)', color: 'stat-healing', dualDisplay: true },
            regeneration: { name: 'Regeneration', format: '{absValue} HP/sec (+{value}%)', color: 'stat-regeneration', dualDisplay: true }
        }
    },
    movement: {
        name: 'Movement',
        stats: {
            runspeed: { name: 'Run Speed', format: '{absValue} mph (+{value}%)', color: 'stat-speed', dualDisplay: true },
            flyspeed: { name: 'Fly Speed', format: '+{value}%', color: 'stat-fly' },
            jumpspeed: { name: 'Jump Speed', format: '+{value}%', color: 'stat-jump' },
            jumpheight: { name: 'Jump Height', format: '+{value}%', color: 'stat-jump' }
        }
    }
};

// Default enabled stats (what shows on dashboard initially)
const DEFAULT_ENABLED_STATS = [
    'damage',
    'tohit',
    'maxhp',
    'regeneration',
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
    
    // Defense (Typed - Combined)
    defSL: 0,
    defFC: 0,
    defEN: 0,
    defPsionic: 0,
    defToxic: 0,
    
    // Resistance (Combined)
    resSL: 0,
    resFC: 0,
    resEN: 0,
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
    content.style.maxWidth = '1000px';
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
        statsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        statsGrid.style.gap = '8px';
        
        Object.entries(category.stats).forEach(([statId, stat]) => {
            const statOption = document.createElement('div');
            statOption.style.display = 'flex';
            statOption.style.alignItems = 'center';
            statOption.style.gap = '12px';
            statOption.style.padding = '8px 12px';
            statOption.style.background = 'var(--bg-tertiary)';
            statOption.style.border = '1px solid var(--border)';
            statOption.style.borderRadius = '4px';
            statOption.style.cursor = 'pointer';
            statOption.style.fontSize = '12px';
            statOption.style.transition = 'all 0.15s';
            
            // Create toggle switch
            const toggleLabel = document.createElement('label');
            toggleLabel.className = `switch stat-toggle-${statId}`;
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = statId;
            checkbox.checked = Build.settings.enabledStats.includes(statId);
            checkbox.onchange = () => updateStatSelection(statId, checkbox.checked);
            
            const slider = document.createElement('span');
            slider.className = 'slider round';
            
            toggleLabel.appendChild(checkbox);
            toggleLabel.appendChild(slider);
            
            const label = document.createElement('span');
            label.textContent = stat.name;
            label.style.flex = '1';
            label.className = `stat-${statId}`;
            
            statOption.appendChild(toggleLabel);
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
        
        // Get value from CharacterStats (from enhancements and set bonuses)
        let value = CharacterStats[statId] || 0;
        
        // Format the value
        let formattedValue;
        if (statDef.dualDisplay) {
            // For stats that show both absolute value and percentage
            let absValue = 0;
            
            // Calculate absolute value based on stat type using standard CoH baselines
            if (statId === 'maxhp') {
                // Max HP = 40 baseline (at level 50) + (40 * percentage bonus)
                const baselineMaxHP = 40;
                absValue = baselineMaxHP * (1 + value / 100);
            } else if (statId === 'maxend') {
                // Max Endurance = 100 baseline + (100 * percentage bonus)
                const baselineMaxEnd = 100;
                absValue = baselineMaxEnd * (1 + value / 100);
            } else if (statId === 'regeneration') {
                // Regeneration is based on 5% of max health every 12 seconds
                const baselineMaxHP = 40;
                const maxHealth = baselineMaxHP * (1 + (CharacterStats.maxhp || 0) / 100);
                const baseRegenRate = 0.05; // 5% per 12 seconds
                const baseRegenPerSecond = (maxHealth * baseRegenRate) / 12;
                
                // Apply percentage bonuses
                const bonusMultiplier = (1 + value / 100);
                absValue = baseRegenPerSecond * bonusMultiplier;
            } else if (statId === 'recovery') {
                // Recovery = 1.0 baseline + (1.0 * percentage bonus)
                const baselineRecovery = 1.0;
                absValue = baselineRecovery * (1 + value / 100);
            } else if (statId === 'runspeed') {
                // Run speed: base is 12.50 mph (City of Heroes standard)
                const baseRunSpeed = 12.50;
                absValue = baseRunSpeed * (1 + value / 100);
            }
            
            // Replace both {value} (percentage) and {absValue} (absolute)
            formattedValue = statDef.format
                .replace('{absValue}', absValue.toFixed(2))
                .replace('{value}', value.toFixed(1));
        } else {
            // Standard single value formatting
            formattedValue = statDef.format.replace('{value}', value.toFixed(1));
        }
        
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
 * Calculate bonuses from inherent and pool powers
 * @returns {Object} Object with stat bonuses keyed by stat name
 */
function calculatePoolPowerBonuses() {
    const bonuses = {};
    const allPowers = [];
    
    console.log('calculatePoolPowerBonuses called, Build.inherents:', Build.inherents, 'Build.pools:', Build.pools);
    
    // Collect inherent powers (including Fitness)
    if (Build.inherents && Array.isArray(Build.inherents)) {
        console.log(`Processing ${Build.inherents.length} inherent powers`);
        Build.inherents.forEach(power => {
            // Skip Rest power - it's special and handled separately
            if (power.name === 'Rest') {
                console.log('Skipping Rest power');
                return;
            }
            console.log('Processing inherent power:', power.name, 'with effects:', power.effects);
            if (power.effects) {
                allPowers.push(power);
            }
        });
    }
    
    // Collect pool powers
    if (Build.pools && Array.isArray(Build.pools)) {
        console.log(`Processing ${Build.pools.length} pools`);
        Build.pools.forEach(poolData => {
            console.log('Processing pool:', poolData.id, 'with', poolData.powers?.length || 0, 'powers');
            if (!poolData.powers) return;
            
            poolData.powers.forEach(power => {
                console.log('Processing pool power:', power.name, 'with effects:', power.effects);
                if (power.effects) {
                    allPowers.push(power);
                }
            });
        });
    }
    
    // Process all collected powers
    console.log('Processing', allPowers.length, 'total powers:', allPowers.map(p => p.name));
    
    allPowers.forEach(power => {
        const effects = power.effects;
        console.log(`Processing power "${power.name}" with effects:`, effects);
        
        // Map effect names to stat names
        // Effects are decimal multipliers (0.25 = 25% increase)
        // We accumulate these as additive multipliers
        
        // Regeneration effect (in HP/sec)
        if (effects.regeneration !== undefined && effects.regeneration !== null) {
            const scaleValue = typeof effects.regeneration === 'number' 
                ? effects.regeneration 
                : (effects.regeneration.scale || 0);
            bonuses.regeneration = (bonuses.regeneration || 0) + scaleValue;
            console.log(`  Regeneration: ${scaleValue}, total now: ${bonuses.regeneration}`);
        }
        
        // Recovery effect (in Endurance/sec)
        if (effects.recovery !== undefined && effects.recovery !== null) {
            const scaleValue = typeof effects.recovery === 'number' 
                ? effects.recovery 
                : (effects.recovery.scale || 0);
            bonuses.recovery = (bonuses.recovery || 0) + scaleValue;
            console.log(`  Recovery: ${scaleValue}, total now: ${bonuses.recovery}`);
        }
        
        // Run speed effect
        if (effects.runSpeed !== undefined && effects.runSpeed !== null) {
            const scaleValue = typeof effects.runSpeed === 'number' 
                ? effects.runSpeed 
                : (effects.runSpeed.scale || 0);
            bonuses.runspeed = (bonuses.runspeed || 0) + scaleValue;
            console.log(`  RunSpeed: ${scaleValue}, total now: ${bonuses.runspeed}`);
        }
        
        // Fly speed effect
        if (effects.flySpeed !== undefined && effects.flySpeed !== null) {
            const scaleValue = typeof effects.flySpeed === 'number' 
                ? effects.flySpeed 
                : (effects.flySpeed.scale || 0);
            bonuses.flyspeed = (bonuses.flyspeed || 0) + scaleValue;
        }
        
        // Jump height effect
        if (effects.jumpHeight !== undefined && effects.jumpHeight !== null) {
            const scaleValue = typeof effects.jumpHeight === 'number' 
                ? effects.jumpHeight 
                : (effects.jumpHeight.scale || 0);
            bonuses.jumpheight = (bonuses.jumpheight || 0) + scaleValue;
            console.log(`  JumpHeight: ${scaleValue}, total now: ${bonuses.jumpheight}`);
        }
        
        // Jump speed effect
        if (effects.jumpSpeed !== undefined && effects.jumpSpeed !== null) {
            const scaleValue = typeof effects.jumpSpeed === 'number' 
                ? effects.jumpSpeed 
                : (effects.jumpSpeed.scale || 0);
            bonuses.jumpspeed = (bonuses.jumpspeed || 0) + scaleValue;
            console.log(`  JumpSpeed: ${scaleValue}, total now: ${bonuses.jumpspeed}`);
        }
        
        // Max endurance effect
        if (effects.maxEndurance !== undefined && effects.maxEndurance !== null) {
            const scaleValue = typeof effects.maxEndurance === 'number' 
                ? effects.maxEndurance 
                : (effects.maxEndurance.scale || 0);
            bonuses.maxend = (bonuses.maxend || 0) + scaleValue;
        }
        
        // Max HP effect
        if (effects.maxHealth !== undefined && effects.maxHealth !== null) {
            const scaleValue = typeof effects.maxHealth === 'number' 
                ? effects.maxHealth 
                : (effects.maxHealth.scale || 0);
            bonuses.maxhp = (bonuses.maxhp || 0) + scaleValue;
        }
    });
    
    console.log('Final bonuses (as multipliers):', bonuses);
    return bonuses;
}

/**
 * Recalculate all character stats from enhancements and set bonuses
 * Uses Rule of 5 system for accurate bonus tracking
 */
function recalculateStats() {
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
    
    // Add pool power bonuses as percentage points
    const poolBonuses = calculatePoolPowerBonuses();
    Object.entries(poolBonuses).forEach(([stat, multiplier]) => {
        if (multiplier > 0) {
            // Apply multiplier as percentage bonus (multiplier is a decimal like 0.2 = 20%)
            CharacterStats[stat] = (CharacterStats[stat] || 0) + (multiplier * 100);
        }
    });
    
    // Add accolade bonuses
    if (typeof getActiveAccoladeBuffs === 'function') {
        const accoladeBuffs = getActiveAccoladeBuffs();
        
        // Handle endurance bonuses (+5, +5, etc. are absolute values)
        if (accoladeBuffs.endurance > 0) {
            CharacterStats.maxend = (CharacterStats.maxend || 0) + accoladeBuffs.endurance;
        }
        
        // Handle max health bonuses (percentage bonuses)
        if (accoladeBuffs.maxHealth > 0) {
            // Convert percentage bonus to percentage points (0.10 = 10%)
            const maxHealthBonus = accoladeBuffs.maxHealth * 100;
            CharacterStats.maxhp = (CharacterStats.maxhp || 0) + maxHealthBonus;
        }
    }
    
    // TODO: Add enhancement bonuses from slotted enhancements
    
    // Update dashboard display
    updateStatsDashboard();
}

// Initialize dashboard on page load
window.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        updateStatsDashboard();
    }, 200);
});
