/**
 * Unified Tooltip System
 * Handles all tooltips for the City of Heroes Planner
 * UPDATED: Now uses new power data fields (description, shortHelp, targetType, etc.)
 */


// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get color for a stat type
 * @param {string} stat - Stat type
 * @returns {string} CSS color value
 */
function getStatColor(stat) {
    const colors = {
        damage: '#ef4444',
        accuracy: '#3b82f6',
        recharge: '#8b5cf6',
        endurance: '#06b6d4',
        range: '#10b981',
        cast: '#f59e0b',
        buff: '#10b981',
        debuff: '#ef4444',
        healing: '#10b981',
        control: '#a78bfa',
        protection: '#3b82f6'
    };
    return colors[stat] || 'var(--text-secondary)';
}

/**
 * Get color for a value (positive/negative)
 * @param {number} value - Numeric value
 * @returns {string} CSS color value
 */
function getValueColor(value) {
    if (value > 0) return '#10b981'; // Green for positive
    if (value < 0) return '#ef4444'; // Red for negative
    return 'var(--text-secondary)'; // Gray for zero
}
// ============================================
// AVAILABLE POWER TOOLTIPS (Column 1)
// ============================================

/**
 * Generate tooltip HTML for an available power (Column 1)
 * Shows description and base values only
 * @param {Object} basePower - Original power definition
 * @returns {string} HTML for tooltip
 */
function generateAvailablePowerTooltipHTML(basePower) {
    if (!basePower) return '';
    
    let html = `<div class="tooltip-title">${basePower.name}</div>`;
    
    // Show power type and targeting (compact, one line)
    const typeInfo = [];
    if (basePower.powerType) typeInfo.push(basePower.powerType);
    if (basePower.targetType) typeInfo.push(basePower.targetType);
    if (basePower.effectArea && basePower.effectArea !== 'SingleTarget') {
        typeInfo.push(basePower.effectArea);
    }
    
    if (typeInfo.length > 0) {
        html += `<div class="tooltip-section" style="padding-bottom: 4px;">`;
        html += `<div style="font-size: 10px; opacity: 0.6;">${typeInfo.join(' • ')}</div>`;
        html += `</div>`;
    }
    
    // Show short help (this is the best summary line!)
    if (basePower.shortHelp) {
        html += `<div class="tooltip-section">`;
        html += `<div style="font-size: 11px; color: var(--accent); font-weight: 500;">${basePower.shortHelp}</div>`;
        html += `</div>`;
    }
    
    // Show full description
    if (basePower.description) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div style="font-size: 11px; font-style: italic; opacity: 0.9; line-height: 1.4;">${basePower.description}</div>`;
        html += `</div>`;
    }
    
    // Show targeting details (arc, max targets) if present
    const targetingDetails = [];
    if (basePower.maxTargets) {
        targetingDetails.push(`Max Targets: ${basePower.maxTargets}`);
    }
    if (basePower.arc) {
        const degrees = (basePower.arc * 180 / Math.PI).toFixed(0);
        targetingDetails.push(`Arc: ${degrees}°`);
    }
    
    if (targetingDetails.length > 0) {
        html += `<div class="tooltip-section">`;
        html += `<div style="font-size: 10px; opacity: 0.7;">${targetingDetails.join(' • ')}</div>`;
        html += `</div>`;
    }
    
    // Show all base values
    if (basePower.effects) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 6px;">Base Values</div>`;
        
        const effects = basePower.effects;
        
        // Show damage (handles single type, multiple types, and DoT)
        if (effects.damage) {
            const dmg = effects.damage;
            const damageColor = getStatColor('damage');
            html += `<div style="margin-bottom: 4px;">`;
            
            if (dmg.type) {
                // Single damage type
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px;">`;
                html += `<span style="opacity: 0.8; color: ${damageColor};">${dmg.type} Damage:</span>`;
                html += `<span style="font-weight: 600;">${dmg.scale.toFixed(2)}</span>`;
                html += `</div>`;
            } else if (dmg.types) {
                // Multiple damage types
                html += `<div style="font-size: 11px; opacity: 0.8; margin-bottom: 2px; color: ${damageColor};">Damage (${dmg.scale.toFixed(2)} total):</div>`;
                dmg.types.forEach(type => {
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding-left: 12px;">`;
                    html += `<span style="opacity: 0.7;">${type.type}:</span>`;
                    html += `<span style="font-weight: 600;">${type.scale.toFixed(2)}</span>`;
                    html += `</div>`;
                });
            }
            
            html += `</div>`;
        }
        
        // Show DoT damage
        if (effects.dotDamage) {
            const dot = effects.dotDamage;
            const dotDamageColor = getStatColor('damage');
            html += `<div style="margin-bottom: 4px;">`;
            
            if (dot.type) {
                // Single DoT type
                const totalDot = dot.scale * dot.ticks;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px;">`;
                html += `<span style="opacity: 0.8; color: ${dotDamageColor};">${dot.type} DoT:</span>`;
                html += `<span style="font-weight: 600;">${totalDot.toFixed(2)}</span>`;
                html += `</div>`;
                html += `<div style="font-size: 10px; opacity: 0.6; padding-left: 12px;">`;
                html += `${dot.scale.toFixed(3)} × ${dot.ticks} ticks`;
                html += `</div>`;
            } else if (dot.types) {
                // Multiple DoT types
                html += `<div style="font-size: 11px; opacity: 0.8; margin-bottom: 2px; color: ${dotDamageColor};">DoT:</div>`;
                dot.types.forEach(type => {
                    const totalDot = type.scale * type.ticks;
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding-left: 12px;">`;
                    html += `<span style="opacity: 0.7;">${type.type}:</span>`;
                    html += `<span style="font-weight: 600;">${totalDot.toFixed(2)}</span>`;
                    html += `</div>`;
                });
            }
            
            html += `</div>`;
        }
        
        // Other common stats
        const statDisplay = [
            { key: 'accuracy', label: 'Accuracy', format: v => `${(v * 100).toFixed(0)}%`, stat: 'accuracy' },
            { key: 'range', label: 'Range', format: v => `${v.toFixed(0)} ft`, stat: 'range' },
            { key: 'recharge', label: 'Recharge', format: v => `${v.toFixed(1)}s`, stat: 'recharge' },
            { key: 'endurance', label: 'Endurance', format: v => `${v.toFixed(2)}`, stat: 'endurance' },
            { key: 'cast', label: 'Cast Time', format: v => `${v.toFixed(2)}s`, stat: 'cast' }
        ];
        
        statDisplay.forEach(({ key, label, format, stat }) => {
            if (effects[key] !== undefined) {
                const statColor = getStatColor(stat);
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8; color: ${statColor};">${label}:</span>`;
                html += `<span style="font-weight: 600;">${format(effects[key])}</span>`;
                html += `</div>`;
            }
        });
        
        // === DEBUFFS SECTION ===
        const debuffDisplay = [
            { key: 'resistanceDebuff', label: 'Resistance Debuff', color: '#ff6b6b' },
            { key: 'defenseDebuff', label: 'Defense Debuff', color: '#ff6b6b' },
            { key: 'tohitDebuff', label: 'ToHit Debuff', color: '#ff6b6b' },
            { key: 'damageDebuff', label: 'Damage Debuff', color: '#ff6b6b' },
            { key: 'rechargeDebuff', label: 'Recharge Debuff', color: '#ff6b6b' },
            { key: 'movementDebuff', label: 'Movement Debuff', color: '#ff6b6b' },
            { key: 'regenerationDebuff', label: 'Regeneration Debuff', color: '#ff6b6b' },
            { key: 'recoveryDebuff', label: 'Recovery Debuff', color: '#ff6b6b' }
        ];
        
        const hasDebuffs = debuffDisplay.some(({ key }) => effects[key] !== undefined);
        if (hasDebuffs) {
            const debuffColor = getStatColor('debuff');
            html += `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px; color: ${debuffColor};">DEBUFFS</div>`;
            debuffDisplay.forEach(({ key, label, color }) => {
                if (effects[key] !== undefined) {
                    const valueColor = getValueColor(effects[key] * -1);
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                    html += `<span style="opacity: 0.8;">${label}:</span>`;
                    html += `<span style="font-weight: 600; color: ${valueColor};">-${(effects[key] * 100).toFixed(0)}%</span>`;
                    html += `</div>`;
                }
            });
            html += `</div>`;
        }
        
        // === BUFFS SECTION ===
        const buffDisplay = [
            { key: 'tohitBuff', label: 'ToHit Buff' },
            { key: 'damageBuff', label: 'Damage Buff' },
            { key: 'defenseBuff', label: 'Defense Buff' },
            { key: 'resistanceBuff', label: 'Resistance Buff' },
            { key: 'rechargeBuff', label: 'Recharge Buff' },
            { key: 'movementBuff', label: 'Movement Buff' },
            { key: 'regenerationBuff', label: 'Regeneration Buff' },
            { key: 'recoveryBuff', label: 'Recovery Buff' },
            { key: 'maxHPBuff', label: 'Max HP Buff' }
        ];
        
        const hasBuffs = buffDisplay.some(({ key }) => effects[key] !== undefined);
        if (hasBuffs) {
            const buffColor = getStatColor('buff');
            html += `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px; color: ${buffColor};">BUFFS</div>`;
            buffDisplay.forEach(({ key, label }) => {
                if (effects[key] !== undefined) {
                    const valueColor = getValueColor(effects[key]);
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                    html += `<span style="opacity: 0.8;">${label}:</span>`;
                    html += `<span style="font-weight: 600; color: ${valueColor};">+${(effects[key] * 100).toFixed(0)}%</span>`;
                    html += `</div>`;
                }
            });
            html += `</div>`;
        }
        
        // === HEALING/ABSORB SECTION ===
        if (effects.healing !== undefined || effects.absorb !== undefined) {
            const healingColor = getStatColor('healing');
            html += `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px; color: ${healingColor};">HEALING</div>`;
            
            if (effects.healing !== undefined) {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">Healing:</span>`;
                html += `<span style="font-weight: 600; color: #4ade80;">${(effects.healing * 100).toFixed(1)}% HP</span>`;
                html += `</div>`;
            }
            
            if (effects.absorb !== undefined) {
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.8;">Absorb Shield:</span>`;
                html += `<span style="font-weight: 600; color: #60a5fa;">${(effects.absorb * 100).toFixed(1)}% HP</span>`;
                html += `</div>`;
            }
            
            html += `</div>`;
        }
        
        // === CONTROL EFFECTS SECTION ===
        const controlEffects = [
            { key: 'hold', durKey: 'holdDuration', label: 'Hold', color: '#a78bfa' },
            { key: 'stun', durKey: 'stunDuration', label: 'Stun', color: '#fbbf24' },
            { key: 'immobilize', durKey: 'immobilizeDuration', label: 'Immobilize', color: '#fb923c' },
            { key: 'sleep', durKey: 'sleepDuration', label: 'Sleep', color: '#94a3b8' },
            { key: 'confuse', durKey: 'confuseDuration', label: 'Confuse', color: '#c084fc' },
            { key: 'fear', durKey: 'fearDuration', label: 'Fear', color: '#f87171' },
            { key: 'knockback', label: 'Knockback', color: '#38bdf8' }
        ];
        
        const hasControl = controlEffects.some(({ key }) => effects[key] !== undefined);
        if (hasControl) {
            const controlColor = getStatColor('control');
            html += `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px; color: ${controlColor};">CONTROL EFFECTS</div>`;
            
            controlEffects.forEach(({ key, durKey, label, color }) => {
                if (effects[key] !== undefined) {
                    html += `<div style="margin-bottom: 4px;">`;
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                    html += `<span style="opacity: 0.8;">${label} Magnitude:</span>`;
                    html += `<span style="font-weight: 600; color: ${color};">Mag ${effects[key].toFixed(1)}</span>`;
                    html += `</div>`;
                    
                    if (durKey && effects[durKey] !== undefined) {
                        html += `<div style="display: flex; justify-content: space-between; font-size: 10px; padding: 2px 0; padding-left: 12px;">`;
                        html += `<span style="opacity: 0.6;">Duration:</span>`;
                        html += `<span style="font-weight: 600;">${effects[durKey].toFixed(1)}s</span>`;
                        html += `</div>`;
                    }
                    html += `</div>`;
                }
            });
            
            html += `</div>`;
        }
        
        // === STATUS PROTECTION SECTION ===
        const protectionEffects = [
            { key: 'holdProtection', label: 'Hold Protection' },
            { key: 'stunProtection', label: 'Stun Protection' },
            { key: 'immobilizeProtection', label: 'Immobilize Protection' },
            { key: 'sleepProtection', label: 'Sleep Protection' },
            { key: 'confuseProtection', label: 'Confuse Protection' },
            { key: 'fearProtection', label: 'Fear Protection' },
            { key: 'knockbackProtection', label: 'Knockback Protection' }
        ];
        
        const hasProtection = protectionEffects.some(({ key }) => effects[key] !== undefined);
        if (hasProtection) {
            const protectionColor = getStatColor('protection');
            html += `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">`;
            html += `<div style="font-size: 10px; font-weight: 600; opacity: 0.7; margin-bottom: 4px; color: ${protectionColor};">STATUS PROTECTION</div>`;
            
            protectionEffects.forEach(({ key, label }) => {
                if (effects[key] !== undefined) {
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                    html += `<span style="opacity: 0.8;">${label}:</span>`;
                    html += `<span style="font-weight: 600; color: #10b981;">Mag ${effects[key].toFixed(1)}</span>`;
                    html += `</div>`;
                }
            });
            
            html += `</div>`;
        }
        
        // === DURATION (if not shown elsewhere) ===
        if (effects.duration !== undefined && !hasControl) {
            html += `<div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">`;
            html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
            html += `<span style="opacity: 0.8;">Duration:</span>`;
            html += `<span style="font-weight: 600;">${effects.duration.toFixed(1)}s</span>`;
            html += `</div>`;
            html += `</div>`;
        }
        
        html += `</div>`;
    }
    
    // Show available level
    html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 6px; margin-top: 8px;">`;
    html += `<div style="font-size: 10px; opacity: 0.7; text-align: center;">Available at Level ${basePower.available}</div>`;
    html += `</div>`;
    
    return html;
}

/**
 * Show available power tooltip (Column 1)
 * @param {Event} event - Mouse event
 * @param {Object} basePower - Original power definition
 */
function showAvailablePowerTooltip(event, basePower) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + generateAvailablePowerTooltipHTML(basePower);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// ENHANCEMENT SET TOOLTIPS
// ============================================

/**
 * Generate tooltip HTML for an enhancement set
 * Shows bonuses grouped by piece count
 * @param {Object} set - The IO set data
 * @param {number} currentPieces - How many pieces are currently slotted (optional)
 * @returns {string} HTML for tooltip
 */
function generateSetTooltipHTML(set, currentPieces = 0) {
    let html = `<div class="tooltip-title">${set.name}</div>`;
    
    // Set info
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-label">Level Range:</div>`;
    html += `<div class="tooltip-value">${set.minLevel}-${set.maxLevel}</div>`;
    html += `</div>`;
    
    // Group bonuses by piece count
    const bonusesByPieces = {};

    // Helper to normalize bonus entries (support objects and legacy strings)
    const normalizeBonus = (bonus) => {
        if (!bonus) return null;
        if (typeof bonus === 'string') {
            // Try to parse strings like "2 pieces: +3% Damage"
            const m = bonus.match(/(\d+)\s*pieces\s*:\s*\+?([\d.]+)%\s*(.+)/i);
            if (m) {
                return {
                    pieces: parseInt(m[1], 10),
                    value: parseFloat(m[2]),
                    desc: bonus,
                    label: m[3].trim()
                };
            }
            // Fallback: put the whole string as desc under undefined pieces
            return { pieces: undefined, desc: bonus };
        }

        // Assume structured object with pieces/stat/value/desc
        return {
            pieces: bonus.pieces,
            stat: bonus.stat,
            value: bonus.value,
            desc: bonus.desc || (typeof bonus === 'string' ? bonus : JSON.stringify(bonus))
        };
    };

    set.bonuses.forEach(bonus => {
        const b = normalizeBonus(bonus);
        const key = b && b.pieces !== undefined ? b.pieces : 'none';
        if (!bonusesByPieces[key]) bonusesByPieces[key] = [];
        bonusesByPieces[key].push(b);
    });
    
    // Display bonuses grouped by pieces
    html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
    html += `<div class="tooltip-label" style="margin-bottom: 6px;">Set Bonuses</div>`;
    
    const pieceCounts = Object.keys(bonusesByPieces).map(Number).sort((a, b) => a - b);
    
    pieceCounts.forEach(pieceCount => {
        const bonuses = bonusesByPieces[pieceCount];
        const isActive = currentPieces >= pieceCount;
        
        html += `<div class="set-bonus-tier" style="margin-bottom: 8px; ${isActive ? 'color: var(--accent);' : 'opacity: 0.5;'}">`;
        html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 4px;">${pieceCount} pieces:</div>`;
        
        bonuses.forEach(bonus => {
            html += `<div style="padding-left: 12px; font-size: 11px;">`;
            html += `${bonus.desc}`;
            html += `</div>`;
        });
        
        html += `</div>`;
    });
    
    html += `</div>`;
    
    // Show pieces
    if (set.pieces && set.pieces.length > 0) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 4px;">Enhancements (${set.pieces.length})</div>`;
        
        set.pieces.forEach(piece => {
            html += `<div style="font-size: 11px; padding: 2px 0;">`;
            html += `<span style="opacity: 0.7;">${piece.num}.</span> `;
            html += `${piece.name}`;
            if (piece.values) {
                html += ` <span style="opacity: 0.6; font-size: 10px;">(${piece.values})</span>`;
            }
            html += `</div>`;
        });
        
        html += `</div>`;
    }
    
    return html;
}

/**
 * Show enhancement set tooltip
 * @param {Event} event - Mouse event
 * @param {Object} set - IO set data
 * @param {number} currentPieces - Currently slotted pieces
 */
function showSetTooltip(event, set, currentPieces = 0) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + generateSetTooltipHTML(set, currentPieces);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// ACTIVE POWER TOOLTIPS (Column 2/3)
// ============================================

/**
 * Calculate enhanced power stats
 * @param {Object} power - Power data from build
 * @param {Object} basePower - Original power definition from powerset
 * @returns {Object} Enhanced stats
 */
function calculateEnhancedPowerStats(power, basePower) {
    // Get base stats
    const base = {
        damage: basePower.effects?.damage?.scale || 0,
        accuracy: basePower.effects?.accuracy || 1.0,
        recharge: basePower.effects?.recharge || 0,
        endurance: basePower.effects?.endurance || 0,
        range: basePower.effects?.range || 0
    };
    
    // If no power from build (just viewing in available powers), return base
    if (!power || !power.slots) {
        return base;
    }
    
    // Calculate enhancement bonuses (if enhancement-calculations.js is loaded)
    let bonuses = { damage: 0, accuracy: 0, recharge: 0, endurance: 0, range: 0 };
    if (typeof calculatePowerEnhancementBonuses === 'function') {
        bonuses = calculatePowerEnhancementBonuses(power);
    }
    
    // Apply bonuses to base stats
    const enhanced = {
        damage: base.damage * (1 + bonuses.damage),
        accuracy: base.accuracy * (1 + bonuses.accuracy),
        recharge: base.recharge / (1 + bonuses.recharge),  // Recharge is reduced
        endurance: base.endurance / (1 + bonuses.endurance),  // Endurance is reduced
        range: base.range * (1 + bonuses.range)
    };
    
    return enhanced;
}

/**
 * Calculate final power stats (with global bonuses + active buffs)
 * @param {Object} enhancedStats - Enhanced stats
 * @param {Object} power - Power from build (to check if it's active)
 * @returns {Object} Final stats
 */
function calculateFinalPowerStats(enhancedStats, power = null) {
    const stats = CharacterStats || {};
    
    // Get active power bonuses if function exists
    let activeBonuses = { damage: 0, tohit: 0, recharge: 0 };
    if (typeof getActivePowerBonuses === 'function') {
        activeBonuses = getActivePowerBonuses(power);
    }
    
    return {
        damage: enhancedStats.damage * (1 + (stats.damage || 0) / 100) * (1 + activeBonuses.damage),
        accuracy: enhancedStats.accuracy * (1 + (stats.accuracy || 0) / 100) * (1 + activeBonuses.tohit),
        recharge: enhancedStats.recharge / (1 + (stats.recharge || 0) / 100) / (1 + activeBonuses.recharge),
        endurance: enhancedStats.endurance / (1 + (stats.endrdx || 0) / 100),
        range: enhancedStats.range * (1 + (stats.range || 0) / 100)
    };
}

/**
 * Generate tooltip HTML for a power
 * Shows base, enhanced, and final stats
 * @param {Object} power - Power from build
 * @param {Object} basePower - Original power definition
 * @returns {string} HTML for tooltip
 */
function generatePowerTooltipHTML(power, basePower) {
    if (!basePower) return '';
    
    let html = `<div class="tooltip-title">${basePower.name}</div>`;
    
    // Show power type and targeting (compact)
    const typeInfo = [];
    if (basePower.powerType) typeInfo.push(basePower.powerType);
    if (basePower.targetType) typeInfo.push(basePower.targetType);
    if (basePower.effectArea && basePower.effectArea !== 'SingleTarget') {
        typeInfo.push(basePower.effectArea);
    }
    
    if (typeInfo.length > 0) {
        html += `<div class="tooltip-section" style="padding-bottom: 4px;">`;
        html += `<div style="font-size: 10px; opacity: 0.6;">${typeInfo.join(' • ')}</div>`;
        html += `</div>`;
    }
    
    // Show short help
    if (basePower.shortHelp) {
        html += `<div class="tooltip-section">`;
        html += `<div style="font-size: 11px; color: var(--accent); font-weight: 500;">${basePower.shortHelp}</div>`;
        html += `</div>`;
    }
    
    // Only show stats table if effects exist
    if (basePower.effects) {
        // Get stats
        const baseStats = {
            damage: basePower.effects?.damage?.scale || 0,
            accuracy: basePower.effects?.accuracy || 1.0,
            recharge: basePower.effects?.recharge || 0,
            endurance: basePower.effects?.endurance || 0,
            range: basePower.effects?.range || 0,
            recovery: basePower.effects?.recovery?.scale || 0,
            regeneration: basePower.effects?.regeneration?.scale || 0,
            runSpeed: basePower.effects?.runSpeed?.scale || 0,
            flySpeed: basePower.effects?.flySpeed?.scale || 0,
            jumpHeight: basePower.effects?.jumpHeight?.scale || 0,
            jumpSpeed: basePower.effects?.jumpSpeed?.scale || 0
        };
        
        const enhancedStats = calculateEnhancedPowerStats(power, basePower);
        const finalStats = calculateFinalPowerStats(enhancedStats, power);
        
        // Check for DoT damage
        const hasDotDamage = basePower.effects?.dotDamage !== undefined;
        
        // Only show stats that exist for this power
        const hasStats = baseStats.damage > 0 || hasDotDamage || baseStats.recharge > 0 || baseStats.endurance > 0 || 
                         baseStats.recovery > 0 || baseStats.regeneration > 0 || baseStats.runSpeed > 0 || 
                         baseStats.flySpeed > 0 || baseStats.jumpHeight > 0 || baseStats.jumpSpeed > 0;
        
        if (hasStats) {
            html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
            
            // Damage
            if (baseStats.damage > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Damage Scale</div>`;
                html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
                html += `<div></div>`;
                html += `<div style="opacity: 0.6;">Base</div>`;
                html += `<div style="opacity: 0.6;">Enhanced</div>`;
                html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
                html += `<div style="opacity: 0.7;">→</div>`;
                html += `<div>${baseStats.damage.toFixed(2)}</div>`;
                html += `<div>${enhancedStats.damage.toFixed(2)}</div>`;
                html += `<div style="color: var(--accent); font-weight: 600;">${finalStats.damage.toFixed(2)}</div>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // DoT Damage
            if (hasDotDamage) {
                const dot = basePower.effects.dotDamage;
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">DoT Damage</div>`;
                
                if (dot.type) {
                    // Single DoT type
                    const totalDot = dot.scale * dot.ticks;
                    html += `<div style="font-size: 11px; padding-left: 12px;">`;
                    html += `<div style="display: flex; justify-content: space-between;">`;
                    html += `<span style="opacity: 0.7;">${dot.type}:</span>`;
                    html += `<span style="font-weight: 600; color: var(--accent);">${totalDot.toFixed(2)}</span>`;
                    html += `</div>`;
                    html += `<div style="font-size: 10px; opacity: 0.6;">`;
                    html += `${dot.scale.toFixed(3)} × ${dot.ticks} ticks`;
                    html += `</div>`;
                    html += `</div>`;
                } else if (dot.types) {
                    // Multiple DoT types
                    html += `<div style="font-size: 11px; padding-left: 12px;">`;
                    dot.types.forEach(type => {
                        const totalDot = type.scale * type.ticks;
                        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 2px;">`;
                        html += `<span style="opacity: 0.7;">${type.type}:</span>`;
                        html += `<span style="font-weight: 600; color: var(--accent);">${totalDot.toFixed(2)}</span>`;
                        html += `</div>`;
                    });
                    html += `</div>`;
                }
                
                html += `</div>`;
            }
            
            // Accuracy
            html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
            html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Accuracy</div>`;
            html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
            html += `<div></div>`;
            html += `<div style="opacity: 0.6;">Base</div>`;
            html += `<div style="opacity: 0.6;">Enhanced</div>`;
            html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
            html += `<div style="opacity: 0.7;">→</div>`;
            html += `<div>${(baseStats.accuracy * 100).toFixed(0)}%</div>`;
            html += `<div>${(enhancedStats.accuracy * 100).toFixed(0)}%</div>`;
            html += `<div style="color: var(--accent); font-weight: 600;">${(finalStats.accuracy * 100).toFixed(0)}%</div>`;
            html += `</div>`;
            html += `</div>`;
            
            // Recharge
            if (baseStats.recharge > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Recharge Time</div>`;
                html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
                html += `<div></div>`;
                html += `<div style="opacity: 0.6;">Base</div>`;
                html += `<div style="opacity: 0.6;">Enhanced</div>`;
                html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
                html += `<div style="opacity: 0.7;">→</div>`;
                html += `<div>${baseStats.recharge.toFixed(1)}s</div>`;
                html += `<div>${enhancedStats.recharge.toFixed(1)}s</div>`;
                html += `<div style="color: var(--accent); font-weight: 600;">${finalStats.recharge.toFixed(1)}s</div>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Endurance
            if (baseStats.endurance > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Endurance Cost</div>`;
                html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
                html += `<div></div>`;
                html += `<div style="opacity: 0.6;">Base</div>`;
                html += `<div style="opacity: 0.6;">Enhanced</div>`;
                html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
                html += `<div style="opacity: 0.7;">→</div>`;
                html += `<div>${baseStats.endurance.toFixed(2)}</div>`;
                html += `<div>${enhancedStats.endurance.toFixed(2)}</div>`;
                html += `<div style="color: var(--accent); font-weight: 600;">${finalStats.endurance.toFixed(2)}</div>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Range
            if (baseStats.range > 0) {
                html += `<div class="power-stat-row">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Range</div>`;
                html += `<div style="display: grid; grid-template-columns: auto 1fr 1fr 1fr; gap: 8px; font-size: 11px;">`;
                html += `<div></div>`;
                html += `<div style="opacity: 0.6;">Base</div>`;
                html += `<div style="opacity: 0.6;">Enhanced</div>`;
                html += `<div style="opacity: 0.6; color: var(--accent);">Final</div>`;
                html += `<div style="opacity: 0.7;">→</div>`;
                html += `<div>${baseStats.range.toFixed(0)} ft</div>`;
                html += `<div>${enhancedStats.range.toFixed(0)} ft</div>`;
                html += `<div style="color: var(--accent); font-weight: 600;">${finalStats.range.toFixed(0)} ft</div>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Recovery (pool power bonus)
            if (baseStats.recovery > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Recovery Bonus</div>`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px;">`;
                html += `<span style="opacity: 0.7;">+${(baseStats.recovery * 100).toFixed(1)}%</span>`;
                html += `<span style="color: var(--accent); font-weight: 600;">${(baseStats.recovery * 100).toFixed(1)}%</span>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Regeneration (pool power bonus)
            if (baseStats.regeneration > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Regeneration Bonus</div>`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px;">`;
                html += `<span style="opacity: 0.7;">+${(baseStats.regeneration * 100).toFixed(1)}%</span>`;
                html += `<span style="color: var(--accent); font-weight: 600;">${(baseStats.regeneration * 100).toFixed(1)}%</span>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Run Speed (pool power bonus)
            if (baseStats.runSpeed > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Run Speed Bonus</div>`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px;">`;
                html += `<span style="opacity: 0.7;">+${(baseStats.runSpeed * 100).toFixed(1)}%</span>`;
                html += `<span style="color: var(--accent); font-weight: 600;">${(baseStats.runSpeed * 100).toFixed(1)}%</span>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Fly Speed (pool power bonus)
            if (baseStats.flySpeed > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Fly Speed Bonus</div>`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px;">`;
                html += `<span style="opacity: 0.7;">+${(baseStats.flySpeed * 100).toFixed(1)}%</span>`;
                html += `<span style="color: var(--accent); font-weight: 600;">${(baseStats.flySpeed * 100).toFixed(1)}%</span>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Jump Height (pool power bonus)
            if (baseStats.jumpHeight > 0) {
                html += `<div class="power-stat-row" style="margin-bottom: 6px;">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Jump Height Bonus</div>`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px;">`;
                html += `<span style="opacity: 0.7;">+${(baseStats.jumpHeight * 100).toFixed(1)}%</span>`;
                html += `<span style="color: var(--accent); font-weight: 600;">${(baseStats.jumpHeight * 100).toFixed(1)}%</span>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            // Jump Speed (pool power bonus)
            if (baseStats.jumpSpeed > 0) {
                html += `<div class="power-stat-row">`;
                html += `<div style="font-weight: 600; font-size: 11px; margin-bottom: 2px;">Jump Speed Bonus</div>`;
                html += `<div style="display: flex; justify-content: space-between; font-size: 11px;">`;
                html += `<span style="opacity: 0.7;">+${(baseStats.jumpSpeed * 100).toFixed(1)}%</span>`;
                html += `<span style="color: var(--accent); font-weight: 600;">${(baseStats.jumpSpeed * 100).toFixed(1)}%</span>`;
                html += `</div>`;
                html += `</div>`;
            }
            
            html += `</div>`;
        }
    }
    
    // Show slotted enhancements if this is a power from build
    const hasSlottedEnhancements = power && power.slots && power.slots.some(slot => slot !== null);
    if (hasSlottedEnhancements) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 4px;">Slotted Enhancements</div>`;
        
        power.slots.forEach((slot, index) => {
            if (slot) {
                const set = IO_SETS[slot.setId];
                html += `<div style="font-size: 11px; padding: 2px 0;">`;
                html += `<span style="opacity: 0.7;">${index + 1}.</span> `;
                html += `${set?.name || 'Unknown'}: ${slot.pieceName}`;
                html += `</div>`;
            }
        });
        
        html += `</div>`;
    }
    
    return html;
}

/**
 * Show power tooltip
 * @param {Event} event - Mouse event
 * @param {Object} power - Power from build
 * @param {Object} basePower - Original power definition
 */
function showPowerTooltip(event, power, basePower) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = (typeof getTooltipHintsHtml === 'function' ? getTooltipHintsHtml() : '') + generatePowerTooltipHTML(power, basePower);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// DASHBOARD STAT TOOLTIPS
// ============================================

/**
 * Get all contributors to a stat
 * Uses Rule of 5 system to show unique bonus values with counts
 * @param {string} stat - Stat name (e.g., 'damage', 'accuracy')
 * @returns {Array} Array of contributor objects
 */
function getStatContributors(stat) {
    const contributors = [];
    
    console.log('getStatContributors called for stat:', stat);
    
    // Add pool power contributors
    if (typeof calculatePoolPowerBonuses === 'function') {
        const poolBonuses = calculatePoolPowerBonuses();
        console.log('calculatePoolPowerBonuses result:', poolBonuses);
        if (poolBonuses[stat]) {
            const poolSources = getPoolPowerSources(stat);
            console.log(`Pool bonuses for ${stat}:`, poolBonuses[stat], 'Sources:', poolSources);
            if (poolSources.length > 0) {
                contributors.push({
                    value: poolBonuses[stat],
                    sources: poolSources,
                    type: 'pool',
                    total: poolBonuses[stat]
                });
            }
        }
    } else {
        console.log('calculatePoolPowerBonuses is NOT a function');
    }
    
    // Use Rule of 5 system if available
    if (typeof getStatBreakdown === 'function') {
        const breakdown = getStatBreakdown(stat);
        breakdown.forEach(item => {
            contributors.push({
                value: item.value,
                count: item.count,
                sources: item.sources,
                capped: item.capped,
                total: item.total,
                type: 'set'
            });
        });
        return contributors;
    }
    
    // Fallback to old system (should not happen if rule-of-five.js is loaded)
    if (typeof getActiveSetBonuses === 'function') {
        const activeBonuses = getActiveSetBonuses();
        activeBonuses.forEach(bonus => {
            if (bonus.stat === stat) {
                contributors.push({
                    source: bonus.source,
                    value: bonus.value,
                    type: 'set'
                });
            }
        });
    }
    
    console.log('Final contributors for', stat, ':', contributors);
    return contributors;
}

/**
 * Get pool power sources contributing to a stat
 * @param {string} stat - Stat key
 * @returns {Array} Array of source strings
 */
function getPoolPowerSources(stat) {
    const sources = [];
    
    // Check inherent powers (Fitness, Archetype, Universal)
    if (Build.inherents && Array.isArray(Build.inherents)) {
        Build.inherents.forEach(power => {
            // Skip Rest power - it's special and handled separately
            if (power.name === 'Rest') {
                return;
            }
            if (!power.effects) return;
            
            const effects = power.effects;
            let hasEffect = false;
            
            // Map effects to stats
            if (stat === 'regeneration' && effects.regeneration) {
                hasEffect = true;
            } else if (stat === 'recovery' && effects.recovery) {
                hasEffect = true;
            } else if (stat === 'runspeed' && effects.runSpeed) {
                hasEffect = true;
            } else if (stat === 'flyspeed' && effects.flySpeed) {
                hasEffect = true;
            } else if (stat === 'jumpheight' && effects.jumpHeight) {
                hasEffect = true;
            } else if (stat === 'jumpspeed' && effects.jumpSpeed) {
                hasEffect = true;
            } else if (stat === 'maxend' && effects.maxEndurance) {
                hasEffect = true;
            } else if (stat === 'maxhp' && effects.maxHealth) {
                hasEffect = true;
            }
            
            if (hasEffect) {
                sources.push(power.name);
            }
        });
    }
    
    // Check pool powers
    if (Build.pools && Array.isArray(Build.pools)) {
        Build.pools.forEach(poolData => {
            if (!poolData.powers) return;
            
            poolData.powers.forEach(power => {
                if (!power.effects) return;
                
                const effects = power.effects;
                let hasEffect = false;
                
                // Map effects to stats - handle both direct values and nested {scale: value} objects
                if (stat === 'regeneration') {
                    if (effects.regeneration) hasEffect = true;
                } else if (stat === 'recovery') {
                    if (effects.recovery) hasEffect = true;
                } else if (stat === 'runspeed' && effects.runSpeed) {
                    hasEffect = true;
                } else if (stat === 'flyspeed' && effects.flySpeed) {
                    hasEffect = true;
                } else if (stat === 'jumpheight' && effects.jumpHeight) {
                    hasEffect = true;
                } else if (stat === 'jumpspeed' && effects.jumpSpeed) {
                    hasEffect = true;
                } else if (stat === 'maxend' && effects.maxEndurance) {
                    hasEffect = true;
                } else if (stat === 'maxhp' && effects.maxHealth) {
                    hasEffect = true;
                }
                
                if (hasEffect) {
                    sources.push(`${power.name} (${poolData.name})`);
                }
            });
        });
    }
    
    return sources;
}

/**
 * Generate tooltip HTML for a dashboard stat
 * Shows total and breakdown with Rule of 5 tracking
 * @param {string} statName - Display name of stat
 * @param {string} statKey - Key for stat in CharacterStats
 * @param {number} totalValue - Total value of stat
 * @returns {string} HTML for tooltip
 */
function generateStatTooltipHTML(statName, statKey, totalValue) {
    let html = `<div class="tooltip-title">${statName}</div>`;
    
    html += `<div class="tooltip-section">`;
    html += `<div class="tooltip-label">Total:</div>`;
    const totalColor = getValueColor(totalValue);
    html += `<div class="tooltip-value" style="color: ${totalColor}; font-weight: 600; font-size: 14px;">+${totalValue.toFixed(2)}%</div>`;
    html += `</div>`;
    
    const contributors = getStatContributors(statKey);
    
    if (contributors.length > 0) {
        html += `<div class="tooltip-section" style="border-top: 1px solid var(--border); padding-top: 8px; margin-top: 8px;">`;
        html += `<div class="tooltip-label" style="margin-bottom: 4px;">Contributors</div>`;
        
        // Separate pool and set contributors
        const poolContributors = contributors.filter(c => c.type === 'pool');
        const setContributors = contributors.filter(c => c.type === 'set');
        
        // Display pool power contributors first
        if (poolContributors.length > 0) {
            html += `<div style="margin-bottom: 8px;">`;
            html += `<div style="font-weight: 600; font-size: 10px; opacity: 0.7; margin-bottom: 4px; color: var(--accent);">POWER POOLS</div>`;
            poolContributors.forEach(c => {
                const contribColor = getValueColor(c.value);
                html += `<div style="margin-bottom: 4px;">`;
                c.sources.forEach(source => {
                    html += `<div style="font-size: 10px; opacity: 0.8;">`;
                    html += `• ${source}`;
                    html += `</div>`;
                });
                html += `<div style="padding-left: 12px; font-size: 10px; font-weight: 600; color: ${contribColor}; margin-top: 2px;">`;
                html += `= +${c.value.toFixed(2)}%`;
                html += `</div>`;
                html += `</div>`;
            });
            html += `</div>`;
        }
        
        // Display enhancement set contributors
        if (setContributors.length > 0) {
            const usingRuleOfFive = setContributors[0] && setContributors[0].count !== undefined;
            
            if (usingRuleOfFive) {
                // Display using Rule of 5 breakdown
                html += `<div style="margin-bottom: 8px;">`;
                html += `<div style="font-weight: 600; font-size: 10px; opacity: 0.7; margin-bottom: 4px;">ENHANCEMENT SETS</div>`;
                
                setContributors.forEach(c => {
                    const cappedIndicator = c.capped ? ' ⚠️ CAPPED' : '';
                    const countDisplay = c.capped ? '5/5' : `${c.count}/5`;
                    const cappedStyle = c.capped ? 'color: var(--warning);' : '';
                    
                    // Header for this bonus value
                    html += `<div style="font-weight: 600; font-size: 11px; margin-top: 6px; margin-bottom: 2px; ${cappedStyle}">`;
                    html += `+${c.value.toFixed(2)}% × ${countDisplay}${cappedIndicator}`;
                    html += `</div>`;
                    
                    // List sources
                    c.sources.forEach(source => {
                        html += `<div style="padding-left: 12px; font-size: 10px; opacity: 0.8;">`;
                        html += `• ${source}`;
                        html += `</div>`;
                    });
                    
                    // Show total from this unique value
                    html += `<div style="padding-left: 12px; font-size: 10px; font-weight: 600; color: var(--accent); margin-top: 2px;">`;
                    html += `= +${c.total.toFixed(2)}%`;
                    html += `</div>`;
                });
                
                html += `</div>`;
                
                // Show Rule of 5 explanation if any are capped
                if (setContributors.some(c => c.capped)) {
                    html += `<div style="font-size: 10px; font-style: italic; opacity: 0.7; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--border);">`;
                    html += `⚠️ Rule of 5: Identical bonus values can only stack 5 times`;
                    html += `</div>`;
                }
            } else {
                // Old system - simple list
                html += `<div style="margin-bottom: 8px;">`;
                html += `<div style="font-weight: 600; font-size: 10px; opacity: 0.7; margin-bottom: 4px;">ENHANCEMENT SETS</div>`;
                setContributors.forEach(c => {
                    const contribColor = getValueColor(c.value);
                    html += `<div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">`;
                    html += `<span>${c.source}</span>`;
                    html += `<span style="color: ${contribColor};">+${c.value.toFixed(2)}%</span>`;
                    html += `</div>`;
                });
                html += `</div>`;
            }
        }
        
        html += `</div>`;
    } else {
        html += `<div class="tooltip-section" style="opacity: 0.6; font-style: italic; font-size: 11px;">`;
        html += `No bonuses active`;
        html += `</div>`;
    }
    
    return html;
}

/**
 * Show dashboard stat tooltip
 * @param {Event} event - Mouse event
 * @param {string} statName - Display name
 * @param {string} statKey - Stat key
 * @param {number} totalValue - Total value
 */
function showStatTooltip(event, statName, statKey, totalValue) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    tooltip.innerHTML = generateStatTooltipHTML(statName, statKey, totalValue);
    positionTooltip(tooltip, event);
    tooltip.classList.add('visible');
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Hide tooltip
 */
function hideTooltip() {
    const tooltip = document.getElementById('tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

/**
 * Position tooltip near mouse cursor
 * @param {HTMLElement} tooltip - Tooltip element
 * @param {Event} event - Mouse event
 */
function positionTooltip(tooltip, event) {
    const offset = 10;
    let x = event.clientX + offset;
    let y = event.clientY + offset;
    
    // Set initial position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    
    // Get tooltip dimensions for edge detection
    const rect = tooltip.getBoundingClientRect();
    
    // Adjust if tooltip goes off right edge
    if (rect.right > window.innerWidth) {
        x = event.clientX - rect.width - offset;
    }
    
    // Adjust if tooltip goes off bottom edge
    if (rect.bottom > window.innerHeight) {
        y = event.clientY - rect.height - offset;
    }
    
    // Apply final position
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
}

// ============================================
// INHERENT POWER TOOLTIPS
// ============================================

/**
 * Show tooltip for inherent powers
 * @param {Event} event - Mouse event
 * @param {Object} power - Inherent power object
 */
function showInherentPowerTooltip(event, power) {
    const tooltip = document.getElementById('tooltip');
    if (!tooltip) return;
    
    let html = '<div class="tooltip-power">';
    
    // Power name
    html += `<div class="tooltip-power-name">${power.name}</div>`;
    
    // Power type
    html += `<div class="tooltip-power-type">${power.powerType} - ${power.shortHelp}</div>`;
    
    // Description
    html += `<div class="tooltip-description">${power.description}</div>`;
    
    // Effects (if slottable)
    if (power.maxSlots > 0) {
        html += `<div class="tooltip-section">`;
        html += `<div class="tooltip-section-label">Enhancements</div>`;
        html += `<div>Max Slots: ${power.maxSlots}</div>`;
        if (power.allowedEnhancements.length > 0) {
            html += `<div>Accepts: ${power.allowedEnhancements.join(', ')}</div>`;
        }
        html += `</div>`;
    } else {
        html += `<div class="tooltip-note">This power cannot be slotted with enhancements.</div>`;
    }
    
    html += '</div>';
    
    tooltip.innerHTML = html;
    tooltip.style.display = 'block';
    
    // Position tooltip
    positionTooltip(tooltip, event);
}
