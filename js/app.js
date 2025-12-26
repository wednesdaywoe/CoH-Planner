/**
 * City of Heroes Planner - Main Application
 * 
 * Global state management and initialization
 */

// ============================================
// GLOBAL STATE
// ============================================

const AppState = {
    // Enhancement picker state
    currentView: 'category',
    currentCategory: null,
    currentPowerName: '',
    currentPowerSet: '',
    currentSlotIndex: 0,
    
    // IO level settings
    globalIOLevel: 50,
    
    // Enhancement type selections
    selectedGenericType: 'damage',
    selectedSOType: 'damage',
    selectedSOTier: 2, // 0=TO, 1=DO, 2=SO
    
    // Character stats
    characterLevel: 50,
    
    // Build data
    build: {
        name: 'Fire/Fire Blaster Build',
        archetype: 'Blaster',
        primary: 'Fire Blast',
        secondary: 'Fire Manipulation'
    }
};

// ============================================
// STAT COLOR MAPPING
// ============================================

const STAT_COLORS = {
    'damage': 'stat-damage',
    'dmg': 'stat-damage',
    'accuracy': 'stat-accuracy',
    'acc': 'stat-accuracy',
    'tohit': 'stat-tohit',
    'to hit': 'stat-tohit',
    'defense': 'stat-defense',
    'def': 'stat-defense',
    'resistance': 'stat-resistance',
    'res': 'stat-resistance',
    'healing': 'stat-healing',
    'heal': 'stat-healing',
    'regeneration': 'stat-regeneration',
    'regen': 'stat-regeneration',
    'recovery': 'stat-recovery',
    'rec': 'stat-recovery',
    'endurance': 'stat-endurance',
    'end': 'stat-endurance',
    'endurance reduction': 'stat-endurance',
    'recharge': 'stat-recharge',
    'rech': 'stat-recharge',
    'range': 'stat-range',
    'rng': 'stat-range',
    'speed': 'stat-speed',
    'run speed': 'stat-speed',
    'jump': 'stat-jump',
    'jumping': 'stat-jump',
    'fly': 'stat-fly',
    'flight': 'stat-fly',
    'knockback': 'stat-knockback',
    'kb': 'stat-knockback',
    'hold': 'stat-hold',
    'stun': 'stat-stun',
    'disorient': 'stat-stun',
    'immobilize': 'stat-immobilize',
    'immob': 'stat-immobilize',
    'sleep': 'stat-sleep',
    'confuse': 'stat-confuse',
    'fear': 'stat-fear'
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get stat color class for a stat name
 * @param {string} statName - Name of the stat
 * @returns {string} CSS class name or empty string
 */
function getStatColorClass(statName) {
    const normalized = statName.toLowerCase().trim();
    return STAT_COLORS[normalized] || '';
}

/**
 * Update global IO level
 */
function updateGlobalIOLevel() {
    AppState.globalIOLevel = parseInt(document.getElementById('globalIOLevel').value);
    document.getElementById('globalIOLevelDisplay').textContent = `Level ${AppState.globalIOLevel}`;
    
    // Update display if Generic IO view is active
    if (document.getElementById('selectionViewGeneric').classList.contains('active')) {
        updateGenericDisplay();
    }
}

/**
 * Update character level
 */
function updateCharLevel() {
    const level = document.getElementById('levelSlider').value;
    AppState.characterLevel = level;
    document.getElementById('charLevel').textContent = level;
}

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application when DOM is ready
 */
window.addEventListener('DOMContentLoaded', function() {
    console.log('City of Heroes Planner - Initializing...');
    
    // Set initial stat colors for default selections
    const genericTypeElement = document.getElementById('genericTypeName');
    if (genericTypeElement) {
        genericTypeElement.classList.add('stat-damage');
    }
    
    const soTypeElement = document.getElementById('soTypeName');
    if (soTypeElement) {
        soTypeElement.classList.add('stat-damage');
    }
    
    console.log('City of Heroes Planner - Ready!');
});
