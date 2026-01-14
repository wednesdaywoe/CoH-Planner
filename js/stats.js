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
        categoryHeader.style.display = 'flex';
        categoryHeader.style.justifyContent = 'space-between';
        categoryHeader.style.alignItems = 'center';

        const categoryName = document.createElement('span');
        categoryName.textContent = category.name;
        categoryHeader.appendChild(categoryName);

        const toggleGroupBtn = document.createElement('button');
        toggleGroupBtn.textContent = 'Toggle Group';
        toggleGroupBtn.style.fontSize = '10px';
        toggleGroupBtn.style.padding = '4px 8px';
        toggleGroupBtn.style.background = 'var(--button-bg)';
        toggleGroupBtn.style.color = 'var(--text)';
        toggleGroupBtn.style.border = '1px solid var(--border)';
        toggleGroupBtn.style.borderRadius = '3px';
        toggleGroupBtn.style.cursor = 'pointer';
        toggleGroupBtn.onclick = (e) => {
            e.stopPropagation();
            // Get all checkboxes in this category
            const categoryStats = Object.keys(category.stats);
            const allChecked = categoryStats.every(statId => Build.settings.enabledStats.includes(statId));

            // Toggle all in this category
            categoryStats.forEach(statId => {
                updateStatSelection(statId, !allChecked);
                const checkbox = section.querySelector(`.stat-toggle-${statId} input`);
                if (checkbox) checkbox.checked = !allChecked;
            });
        };
        categoryHeader.appendChild(toggleGroupBtn);

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

    const toggleAllBtn = document.createElement('button');
    toggleAllBtn.textContent = 'Toggle All';
    toggleAllBtn.onclick = () => {
        // Get all stat IDs
        const allStatIds = [];
        Object.values(STAT_CATEGORIES).forEach(category => {
            allStatIds.push(...Object.keys(category.stats));
        });

        // Check if all are enabled
        const allEnabled = allStatIds.every(statId => Build.settings.enabledStats.includes(statId));

        // Toggle all
        allStatIds.forEach(statId => {
            updateStatSelection(statId, !allEnabled);
            const checkbox = content.querySelector(`.stat-toggle-${statId} input`);
            if (checkbox) checkbox.checked = !allEnabled;
        });
    };

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
    
    buttonContainer.appendChild(toggleAllBtn);
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
    if (!Build.archetype || !Build.archetype.id || !ARCHETYPES[Build.archetype.id]) {
        return 0;
    }
    
    const archetype = ARCHETYPES[Build.archetype.id];
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
    if (!Build.archetype || !Build.archetype.id || !ARCHETYPES[Build.archetype.id]) {
        return 0;
    }
    
    const archetype = ARCHETYPES[Build.archetype.id];
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
    if (!Build.archetype || !Build.archetype.id || !ARCHETYPES[Build.archetype.id]) {
        return {
            baseHealth: 0,
            maxHealth: 0
        };
    }
    
    const archetype = ARCHETYPES[Build.archetype.id];
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
    
    // Hide container while updating to prevent flashing
    container.classList.remove('ready');
    
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
                // Max HP uses archetype-based baseline
                const health = getBaselineHealth();
                const baselineMaxHP = health.maxHealth;
                absValue = baselineMaxHP * (1 + value / 100);
            } else if (statId === 'maxend') {
                // Max Endurance uses archetype-based baseline
                const baselineMaxEnd = getBaselineEndurance();
                absValue = baselineMaxEnd * (1 + value / 100);
            } else if (statId === 'regeneration') {
                // Regeneration is based on 5% of max health every 12 seconds
                const health = getBaselineHealth();
                const baselineMaxHP = health.maxHealth;
                const maxHealth = baselineMaxHP * (1 + (CharacterStats.maxhp || 0) / 100);
                const baseRegenRate = 0.05; // 5% per 12 seconds
                const baseRegenPerSecond = (maxHealth * baseRegenRate) / 12;
                
                // Apply percentage bonuses
                const bonusMultiplier = (1 + value / 100);
                absValue = baseRegenPerSecond * bonusMultiplier;
            } else if (statId === 'recovery') {
                // Recovery uses archetype-based baseline
                const baselineRecovery = getBaselineRecovery();
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
        
        // Apply color scheme - use both inline styles and CSS class as backup
        if (typeof applyDashboardStatStyle === 'function') {
            applyDashboardStatStyle(label, statId);
            // Also add the color class name for CSS-based styling as backup
            label.className += ` ${statDef.color}`;
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
    
    // Show container after all stats have been added and styled
    requestAnimationFrame(() => {
        container.classList.add('ready');
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
        Build.pools.forEach(poolData => {
            if (!poolData.powers) return;
            
            poolData.powers.forEach(power => {
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
function calculateActivePowerBufsBonuses() {
    const bonuses = {};

    // Helper function to process power effects
    const processPowerEffects = (power) => {
        if (!power.isActive || !power.effects) return;

        const effects = power.effects;

        // Add tohitBuff as percentage bonus
        if (effects.tohitBuff !== undefined && effects.tohitBuff !== null) {
            bonuses.tohit = (bonuses.tohit || 0) + (effects.tohitBuff * 100);
        }

        // Add damageBuff as percentage bonus
        if (effects.damageBuff !== undefined && effects.damageBuff !== null) {
            bonuses.damage = (bonuses.damage || 0) + (effects.damageBuff * 100);
        }

        // Note: defenseBuff in power files is incorrect - it should be a detailed object like resistance
        // The raw game data has separate scale values for each damage type (S/L, Energy, etc.)
        // but the extraction process incorrectly stores a single value
        // For now, we skip it to avoid displaying incorrect percentages
        // TODO: Re-extract powersets with correct defense breakdown
        if (effects.defenseBuff !== undefined && effects.defenseBuff !== null) {
            // Skip defenseBuff - values in power files are not properly extracted from raw data
            console.warn(`Power ${power.name} has defenseBuff: ${effects.defenseBuff}, but this value needs re-extraction from raw data to show correct defense values`);
        }

        // Add defense from detailed object - map to specific damage types
        if (effects.defense && typeof effects.defense === 'object') {
            const def = effects.defense;

            // Map to combined defense stats (S/L, F/C, E/N, Psi, Tox)
            // Smashing/Lethal
            if (def.smashing !== undefined || def.lethal !== undefined) {
                const sVal = (def.smashing || 0) * 100;
                const lVal = (def.lethal || 0) * 100;
                const avgSL = (sVal + lVal) / 2;
                bonuses.defSL = (bonuses.defSL || 0) + avgSL;
            }

            // Fire/Cold
            if (def.fire !== undefined || def.cold !== undefined) {
                const fVal = (def.fire || 0) * 100;
                const cVal = (def.cold || 0) * 100;
                const avgFC = (fVal + cVal) / 2;
                bonuses.defFC = (bonuses.defFC || 0) + avgFC;
            }

            // Energy/Negative
            if (def.energy !== undefined || def.negative !== undefined) {
                const eVal = (def.energy || 0) * 100;
                const nVal = (def.negative || 0) * 100;
                const avgEN = (eVal + nVal) / 2;
                bonuses.defEN = (bonuses.defEN || 0) + avgEN;
            }

            // Psionic
            if (def.psionic !== undefined) {
                bonuses.defPsionic = (bonuses.defPsionic || 0) + (def.psionic * 100);
            }

            // Toxic
            if (def.toxic !== undefined) {
                bonuses.defToxic = (bonuses.defToxic || 0) + (def.toxic * 100);
            }
        }

        // Add resistanceBuff as percentage bonus (single value) - NOT USED, use detailed object instead
        if (effects.resistanceBuff !== undefined && effects.resistanceBuff !== null) {
            console.warn(`Power ${power.name} has resistanceBuff: ${effects.resistanceBuff}, consider using detailed resistance object instead`);
        }

        // Add resistance from detailed object - map to specific damage types
        if (effects.resistance && typeof effects.resistance === 'object') {
            const res = effects.resistance;

            // Map to combined resistance stats (S/L, F/C, E/N, Psi, Tox)
            // Smashing/Lethal
            if (res.smashing !== undefined || res.lethal !== undefined) {
                const sVal = (res.smashing || 0) * 100;
                const lVal = (res.lethal || 0) * 100;
                const avgSL = (sVal + lVal) / 2;
                bonuses.resSL = (bonuses.resSL || 0) + avgSL;
            }

            // Fire/Cold
            if (res.fire !== undefined || res.cold !== undefined) {
                const fVal = (res.fire || 0) * 100;
                const cVal = (res.cold || 0) * 100;
                const avgFC = (fVal + cVal) / 2;
                bonuses.resFC = (bonuses.resFC || 0) + avgFC;
            }

            // Energy/Negative
            if (res.energy !== undefined || res.negative !== undefined) {
                const eVal = (res.energy || 0) * 100;
                const nVal = (res.negative || 0) * 100;
                const avgEN = (eVal + nVal) / 2;
                bonuses.resEN = (bonuses.resEN || 0) + avgEN;
            }

            // Psionic
            if (res.psionic !== undefined) {
                bonuses.resPsionic = (bonuses.resPsionic || 0) + (res.psionic * 100);
            }

            // Toxic
            if (res.toxic !== undefined) {
                bonuses.resToxic = (bonuses.resToxic || 0) + (res.toxic * 100);
            }
        }

        // Track toggle endurance cost
        if (power.powerType === 'Toggle' && effects.endurance) {
            bonuses.toggleEndCost = (bonuses.toggleEndCost || 0) + effects.endurance;
        }
    };

    // Check primary powers
    if (Build.primary && Build.primary.powers) {
        Build.primary.powers.forEach(processPowerEffects);
    }
    
    // Check secondary powers
    if (Build.secondary && Build.secondary.powers) {
        Build.secondary.powers.forEach(processPowerEffects);
    }

    // Check pool powers
    if (Build.pools) {
        Build.pools.forEach(pool => {
            if (pool.powers) {
                pool.powers.forEach(processPowerEffects);
            }
        });
    }

    // Check epic pool powers
    if (Build.epicPool && Build.epicPool.powers) {
        Build.epicPool.powers.forEach(processPowerEffects);
    }

    console.log('Active power buff bonuses:', bonuses);
    return bonuses;
}

function recalculateStats() {
    // Reset all stats to 0
    Object.keys(CharacterStats).forEach(key => {
        CharacterStats[key] = 0;
    });
    
    // Mapping from individual defense/resistance stats to combined dashboard stats
    const statToCombined = {
        // Defense typed -> combined
        'defSmashing': 'defSL',
        'defLethal': 'defSL',
        'defFire': 'defFC',
        'defCold': 'defFC',
        'defEnergy': 'defEN',
        'defNegative': 'defEN',
        // Resistance typed -> combined
        'resSmashing': 'resSL',
        'resLethal': 'resSL',
        'resFire': 'resFC',
        'resCold': 'resFC',
        'resEnergy': 'resEN',
        'resNegative': 'resEN'
    };

    // Helper to apply a stat value to CharacterStats
    const applyStat = (stat, value) => {
        // Check if it needs to be mapped to a combined stat
        if (statToCombined[stat]) {
            const combinedStat = statToCombined[stat];
            CharacterStats[combinedStat] = (CharacterStats[combinedStat] || 0) + value;
        } else if (CharacterStats.hasOwnProperty(stat)) {
            CharacterStats[stat] += value;
        }
        // Note: Stats like resPsionic, resToxic, defPsionic, defToxic are already in CharacterStats
    };

    // Use Rule of 5 system if available (aggregates bonuses properly)
    if (typeof getAggregatedSetBonuses === 'function') {
        const setBonuses = getAggregatedSetBonuses();
        Object.entries(setBonuses).forEach(([stat, value]) => {
            applyStat(stat, value);
        });
        console.log('Stats recalculated with Rule of 5:', CharacterStats);
        console.log('Bonus tracking:', BonusTracking);
    } else {
        // Fallback to old system
        const setBonuses = calculateSetBonuses();
        Object.entries(setBonuses).forEach(([stat, value]) => {
            applyStat(stat, value);
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
    
    // Add active power buff bonuses
    const activePowerBuffs = calculateActivePowerBufsBonuses();
    Object.entries(activePowerBuffs).forEach(([stat, value]) => {
        if (stat === 'toggleEndCost') {
            // Subtract toggle endurance costs from recovery
            // toggleEndCost is in endurance/sec, recovery is a percentage
            // We need to convert to percentage reduction
            const baseRecovery = getBaselineRecovery();
            const endCostAsPercentage = (value / baseRecovery) * 100;
            CharacterStats.recovery = (CharacterStats.recovery || 0) - endCostAsPercentage;
        } else if (value > 0) {
            CharacterStats[stat] = (CharacterStats[stat] || 0) + value;
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
