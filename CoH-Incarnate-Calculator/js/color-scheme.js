/**
 * City of Heroes Planner - Unified Color Scheme
 * 
 * Centralized color definitions for stats, damage types, and effects.
 * Used across tooltips, dashboard, and all UI elements.
 */

const COLOR_SCHEME = {
    // ============================================
    // STAT CATEGORIES
    // ============================================
    
    stats: {
        // Accuracy & ToHit (Yellow)
        accuracy: '#FFC72C',
        toHit: '#FFC72C',
        tohit: '#FFC72C',
        tohitBuff: '#FFC72C',
        tohitDebuff: '#FFC72C',
        
        // Defense (Blue/Purple) - All types
        defense: '#832AFF',
        defensebuff: '#832AFF',
        defensedebuff: '#832AFF',
        defenseresistance: '#832AFF',
        defmelee: '#832AFF',
        defranged: '#832AFF',
        defaoe: '#832AFF',
        defsmashing: '#832AFF',
        deflethal: '#832AFF',
        deffire: '#832AFF',
        defcold: '#832AFF',
        defenergy: '#832AFF',
        defnegative: '#832AFF',
        defpsionic: '#832AFF',
        deftoxic: '#832AFF',
        
        // Damage (Red)
        damage: '#FF4757',
        damageBuff: '#FF4757',
        damageDebuff: '#FF4757',
        damageResistance: '#FF4757',
        
        // Healing (Green)
        heal: '#4CD964',
        healing: '#4CD964',
        health: '#4CD964',
        regeneration: '#4CD964',
        
        // Resistance (Orange) - All types
        resistance: '#FF7327',
        resistancebuff: '#FF7327',
        resistancedebuff: '#FF7327',
        ressmashing: '#FF7327',
        reslethal: '#FF7327',
        resfire: '#FF7327',
        rescold: '#FF7327',
        resenergy: '#FF7327',
        resnegative: '#FF7327',
        respsionic: '#FF7327',
        restoxic: '#FF7327',
        
        // Endurance & Recovery (Light Blue) - All types
        endurance: '#5AC8FA',
        recovery: '#5AC8FA',
        endurancecost: '#5AC8FA',
        endrdx: '#5AC8FA',
        maxend: '#5AC8FA',
        maxhp: '#4CD964',
        
        // Mez Protection (Magenta/Pink)
        protection: '#FF27B7',
        mez: '#FF27B7',
        control: '#FF27B7',
        hold: '#FF27B7',
        stun: '#FF27B7',
        sleep: '#FF27B7',
        immobilize: '#FF27B7',
        confuse: '#FF27B7',
        fear: '#FF27B7',
        
        // Recharge & Range (Teal/Cyan)
        recharge: '#80ABB0',
        range: '#80ABB0',
        
        // Movement (Dark Green) - All types
        speed: '#009D78',
        movement: '#009D78',
        fly: '#009D78',
        flying: '#009D78',
        flyspeed: '#009D78',
        running: '#009D78',
        runspeed: '#009D78',
        jump: '#009D78',
        jumpspeed: '#009D78',
        jumpheight: '#009D78',
        
        // Debuffs (Brown/Tan)
        debuff: '#A67C52',
        debuffResistance: '#A67C52'
    },
    
    // ============================================
    // DAMAGE TYPES
    // ============================================
    
    damageTypes: {
        smashing: '#8E8E93',
        lethal: '#636366',
        fire: '#FF9500',
        cold: '#5AC8FA',
        energy: '#007AFF',
        negative: '#AF52DE',
        psionic: '#FF2D55',
        toxic: '#4CD964'
    },
    
    // ============================================
    // UI COLORS
    // ============================================
    
    ui: {
        positive: '#4CD964',  // Buffs, increases
        negative: '#FF4757',  // Debuffs, decreases
        neutral: '#8E8E93',   // Base values
        enhanced: '#FFD700',  // Enhanced values
        softcap: '#FF9500',   // Softcap indicators
        hardcap: '#FF2D55'    // Hardcap indicators
    }
};

// ============================================
// COLOR UTILITY FUNCTIONS
// ============================================

/**
 * Get color for a stat type
 * @param {string} statType - The stat type (e.g., 'damage', 'defense', 'recharge')
 * @returns {string} Hex color code
 */
function getStatColor(statType) {
    const normalizedType = statType.toLowerCase().replace(/[_\s-]/g, '');
    return COLOR_SCHEME.stats[normalizedType] || COLOR_SCHEME.ui.neutral;
}

/**
 * Get color for a damage type
 * @param {string} damageType - The damage type (e.g., 'Fire', 'Cold', 'Energy')
 * @returns {string} Hex color code
 */
function getDamageTypeColor(damageType) {
    const normalizedType = damageType.toLowerCase();
    return COLOR_SCHEME.damageTypes[normalizedType] || COLOR_SCHEME.ui.neutral;
}

/**
 * Get color for a value (positive/negative/neutral)
 * @param {number} value - The numeric value
 * @param {boolean} inverseLogic - If true, negative is good (e.g., endurance cost reduction)
 * @returns {string} Hex color code
 */
function getValueColor(value, inverseLogic = false) {
    if (value === 0) return COLOR_SCHEME.ui.neutral;
    
    if (inverseLogic) {
        return value < 0 ? COLOR_SCHEME.ui.positive : COLOR_SCHEME.ui.negative;
    } else {
        return value > 0 ? COLOR_SCHEME.ui.positive : COLOR_SCHEME.ui.negative;
    }
}

/**
 * Apply color to an element
 * @param {HTMLElement} element - The element to color
 * @param {string} color - The hex color code
 * @param {string} property - CSS property to apply color to (default: 'color')
 */
function applyColor(element, color, property = 'color') {
    if (element) {
        element.style[property] = color;
    }
}

/**
 * Create a colored span element
 * @param {string} text - Text content
 * @param {string} color - Hex color code
 * @param {string} className - Optional CSS class
 * @returns {HTMLElement} Span element
 */
function createColoredSpan(text, color, className = '') {
    const span = document.createElement('span');
    span.textContent = text;
    span.style.color = color;
    if (className) {
        span.className = className;
    }
    return span;
}

// ============================================
// CSS CUSTOM PROPERTIES GENERATION
// ============================================

/**
 * Generate CSS custom properties for the color scheme
 * Call this on page load to make colors available in CSS
 */
function initializeColorScheme() {
    const root = document.documentElement;
    
    // Add stat colors as CSS variables
    Object.entries(COLOR_SCHEME.stats).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
    });
    
    // Add damage type colors
    Object.entries(COLOR_SCHEME.damageTypes).forEach(([key, value]) => {
        root.style.setProperty(`--color-damage-${key}`, value);
    });
    
    // Add UI colors
    Object.entries(COLOR_SCHEME.ui).forEach(([key, value]) => {
        root.style.setProperty(`--color-ui-${key}`, value);
    });
    
    console.log('Color scheme initialized');
}

// ============================================
// STAT LABEL HELPERS
// ============================================

/**
 * Format and color a stat label
 * @param {string} statName - The stat name
 * @returns {string} HTML string with colored label
 */
function formatStatLabel(statName) {
    const color = getStatColor(statName);
    return `<span style="color: ${color}; font-weight: 600;">${statName}</span>`;
}

/**
 * Format and color a damage type label
 * @param {string} damageType - The damage type
 * @returns {string} HTML string with colored label
 */
function formatDamageTypeLabel(damageType) {
    const color = getDamageTypeColor(damageType);
    return `<span style="color: ${color}; font-weight: 600;">${damageType}</span>`;
}

// ============================================
// TOOLTIP COLOR HELPERS
// ============================================

/**
 * Get appropriate color for a tooltip section
 * @param {string} sectionType - The section type (e.g., 'damage', 'defense', 'effects')
 * @returns {string} Hex color code
 */
function getTooltipSectionColor(sectionType) {
    const typeMap = {
        'damage': COLOR_SCHEME.stats.damage,
        'dotDamage': COLOR_SCHEME.stats.damage,
        'defense': COLOR_SCHEME.stats.defense,
        'resistance': COLOR_SCHEME.stats.resistance,
        'healing': COLOR_SCHEME.stats.healing,
        'protection': COLOR_SCHEME.stats.protection,
        'debuffResistance': COLOR_SCHEME.stats.debuffResistance,
        'endurance': COLOR_SCHEME.stats.endurance,
        'recharge': COLOR_SCHEME.stats.recharge,
        'accuracy': COLOR_SCHEME.stats.accuracy
    };
    
    return typeMap[sectionType] || COLOR_SCHEME.ui.neutral;
}

/**
 * Create a colored divider for tooltip sections
 * @param {string} sectionType - The section type
 * @returns {HTMLElement} Divider element
 */
function createColoredDivider(sectionType) {
    const divider = document.createElement('div');
    divider.className = 'tooltip-divider';
    divider.style.borderTopColor = getTooltipSectionColor(sectionType);
    divider.style.borderTopWidth = '2px';
    divider.style.borderTopStyle = 'solid';
    divider.style.margin = '8px 0';
    divider.style.opacity = '0.3';
    return divider;
}

// ============================================
// DASHBOARD HELPERS
// ============================================

/**
 * Get dashboard stat styling
 * @param {string} statType - The stat type
 * @returns {object} Style object with color and background
 */
function getDashboardStatStyle(statType) {
    const color = getStatColor(statType);
    return {
        color: color,
        borderColor: color,
        backgroundColor: `${color}15` // 15 = ~8% opacity in hex
    };
}

/**
 * Apply dashboard stat styling to an element
 * @param {HTMLElement} element - The element to style
 * @param {string} statType - The stat type
 */
function applyDashboardStatStyle(element, statType) {
    const style = getDashboardStatStyle(statType);
    element.style.color = style.color;
    element.style.borderColor = style.borderColor;
    element.style.backgroundColor = style.backgroundColor;
}

// Initialize color scheme on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initializeColorScheme);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.COLOR_SCHEME = COLOR_SCHEME;
    window.getStatColor = getStatColor;
    window.getDamageTypeColor = getDamageTypeColor;
    window.getValueColor = getValueColor;
    window.applyColor = applyColor;
    window.createColoredSpan = createColoredSpan;
    window.formatStatLabel = formatStatLabel;
    window.formatDamageTypeLabel = formatDamageTypeLabel;
    window.getTooltipSectionColor = getTooltipSectionColor;
    window.createColoredDivider = createColoredDivider;
    window.getDashboardStatStyle = getDashboardStatStyle;
    window.applyDashboardStatStyle = applyDashboardStatStyle;
}
