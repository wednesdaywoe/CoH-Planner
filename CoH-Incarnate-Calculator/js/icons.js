/**
 * City of Heroes Planner - Enhancement Icons
 * 
 * Helper functions to get correct icon paths for enhancements
 * Uses the layered icon system: Base icon + Overlay
 */

// ============================================
// ICON PATH MAPPING
// ============================================

/**
 * Map enhancement aspect to base icon filename
 */

// Return overlay path using canonical overlay filenames from ORIGIN_OVERLAYS
function getOriginOverlay(tier) {
    const origin = (Build && Build.settings && Build.settings.origin) ? Build.settings.origin.toLowerCase() : 'natural';
    const key = tier === 0 ? '0' : `${tier}-${origin}`;
    const file = ORIGIN_OVERLAYS[key] || 'NatSO.png';
    return `img/Overlay/${file}`;
}
const ASPECT_ICONS = {
    'damage': 'Damage.png',
    'accuracy': 'Acc.png',
    'recharge': 'Recharge.png',
    'endurance': 'EndRdx.png',
    'range': 'Range.png',
    'defense': 'Defbuff.png',
    'resistance': 'DamRes.png',
    'healing': 'Heal.png',
    'tohit': 'ToHitBuff.png',
    'hold': 'Hold.png',
    'stun': 'Stun.png',
    'immobilize': 'Immob.png',
    'sleep': 'Sleep.png',
    'confuse': 'Confuse.png',
    'fear': 'Fear.png',
    'knockback': 'Knock.png',
    'fly': 'Fly.png',
    'jump': 'Jump.png',
    'run': 'Run.png'
};

/**
 * Map origin + tier to overlay filename
 */
const ORIGIN_OVERLAYS = {
    // Training Origin
    '0': 'Training.png',
    
    // Dual Origins
    '1-magic': 'MagDO.png',
    '1-mutation': 'MutDO.png',
    '1-natural': 'NatDO.png',
    '1-science': 'SciDO.png',
    '1-technology': 'TechDO.png',
    
    // Single Origins
    '2-magic': 'MagSO.png',
    '2-mutation': 'MutSO.png',
    '2-natural': 'NatSO.png',
    '2-science': 'SciSO.png',
    '2-technology': 'TechSO.png'
};

/**
 * Map Hamidon types to pre-composed icons
 */
const HAMIDON_ICONS = {
    'nucleolus': 'HONucleolus.png',
    'centriole': 'HOCentriole.png',
    'enzyme': 'HOEnzyme.png',
    'lysosome': 'HOLysosome.png',
    'membrane': 'HOMembrane.png',
    'peroxisome': 'HOPeroxisome.png',
    'cytoskeleton': 'HOCytoskeleton.png',
    'endoplasm': 'HOEndoplasm.png',
    'golgi': 'HOGolgi.png',
    'microfilament': 'HOMicrofilament.png',
    'ribosome': 'HORibosome.png'
};

/**
 * Map IO set IDs to pre-composed icons
 */
const IO_SET_ICONS = {
    'positrons': 'sPositronsBlast.png',
    'bombardment': 'sDetonation.png',
    'thunderstrike': 'sThunderstrike.png',
    'apocalypse': 'sApocalypse.png',
    'ragnarok': 'sRagnarok.png',
    'avalanche': 'EO_Avalanche.png',
    'winters-bite': 'EO_WintersBite.png',
    'blasters-wrath': 'AO_Blaster1.png',
    'defiant-barrage': 'AO_Blaster2.png'
    ,
    // Fallback mapping for sets with missing icon files
    'cupids_crush': 'sCrushingimpact.png'
};

// ============================================
// ICON GENERATION
// ============================================

/**
 * Get icon layers for an enhancement
 * @param {Object} enhancement - Enhancement object
 * @returns {Object} Icon layer information
 */
function getEnhancementIcon(enhancement) {
    if (!enhancement) {
        return null;
    }
    
    // IO Set - Use pre-composed icon
    if (enhancement.type === 'io-set') {
        // Try hardcoded mapping first
        let iconFile = IO_SET_ICONS[enhancement.setId];
        
        // If not found, get from IO set data
        if (!iconFile && IO_SETS && IO_SETS[enhancement.setId]) {
            iconFile = IO_SETS[enhancement.setId].icon;
        }
        
        // Fallback to a default icon if still not found
        if (!iconFile) {
            console.warn('No icon found for set:', enhancement.setId);
            iconFile = 'IO_Generic.png'; // Generic IO icon
        }
        
        return {
            type: 'single',
            path: `img/Enhancements/${iconFile}`
        };
    }
    
    // Common IO - Base + IO Overlay
    if (enhancement.type === 'io-generic') {
        const baseIcon = ASPECT_ICONS[enhancement.aspect] || 'Damage.png';
        return {
            type: 'layered',
            base: `img/Enhancements/${baseIcon}`,
            overlay: 'img/Overlay/IO.png'
        };
    }
    
    // Hamidon - Use pre-composed icon
    if (enhancement.type === 'hamidon') {
        const iconFile = HAMIDON_ICONS[enhancement.hamiType];
        return {
            type: 'single',
            path: `img/Enhancements/${iconFile}`
        };
    }
    
    // Origin (TO/DO/SO) - Base + Origin Overlay
    if (enhancement.type === 'origin') {
        const baseIcon = ASPECT_ICONS[enhancement.aspect] || 'Damage.png';
        const origin = Build.settings.origin.toLowerCase();
        const overlayKey = enhancement.tier === 0 ? '0' : `${enhancement.tier}-${origin}`;
        const overlayIcon = ORIGIN_OVERLAYS[overlayKey] || 'NatSO.png';
        
        return {
            type: 'layered',
            base: `img/Enhancements/${baseIcon}`,
            overlay: `img/Overlay/${overlayIcon}`
        };
    }
    
    return null;
}

/**
 * Create an img element for an enhancement icon
 * @param {Object} enhancement - Enhancement object
 * @returns {HTMLElement} Image element or composite div
 */
function createEnhancementIconElement(enhancement) {
    const iconInfo = getEnhancementIcon(enhancement);
    
    if (!iconInfo) {
        return null;
    }
    
    // Single image (IO sets, Hamidon)
    if (iconInfo.type === 'single') {
        const img = document.createElement('img');
        img.src = iconInfo.path;
        img.className = 'enhancement-icon';
        img.alt = enhancement.name || 'Enhancement';
        img.onerror = function() { this.onerror = null; this.src = 'img/Enhancements/Damage.png'; };
        return img;
    }
    
    // Layered image (Common IO, Origins)
    if (iconInfo.type === 'layered') {
        const container = document.createElement('div');
        container.className = 'enhancement-icon-layered';
        
        const baseImg = document.createElement('img');
        baseImg.src = iconInfo.base;
        baseImg.className = 'enhancement-icon-base';
        
        const overlayImg = document.createElement('img');
        overlayImg.src = iconInfo.overlay;
        overlayImg.className = 'enhancement-icon-overlay';
        
        container.appendChild(baseImg);
        container.appendChild(overlayImg);
        
        return container;
    }
    
    return null;
}

/**
 * Get icon path for display in picker modal
 * @param {string} setId - IO set ID
 * @returns {string} Icon path
 */
function getSetIcon(setId) {
    // Use icon from IO_SETS data if available
    if (typeof IO_SETS !== 'undefined' && IO_SETS[setId] && IO_SETS[setId].icon) {
        return `img/Enhancements/${IO_SETS[setId].icon}`;
    }
    
    // Fallback to hardcoded mapping for backwards compatibility
    const iconFile = IO_SET_ICONS[setId];
    return iconFile ? `img/Enhancements/${iconFile}` : 'img/Enhancements/Damage.png';
}

/**
 * Get base icon path for common IO type selector
 * @param {string} aspect - Enhancement aspect
 * @returns {string} Icon path
 */
function getAspectIcon(aspect) {
    const iconFile = ASPECT_ICONS[aspect];
    return iconFile ? `img/Enhancements/${iconFile}` : null;
}

/**
 * Get overlay path for origin enhancement based on tier
 * @param {number} tier - 0=TO, 1=DO, 2=SO
 * @returns {string} Overlay path
 */
function getOriginOverlay(tier) {
    const origin = Build.settings.origin.toLowerCase();
    const originCap = origin.charAt(0).toUpperCase() + origin.slice(1);
    
    if (tier === 0) {
        return 'img/Overlay/Training.png';
    } else if (tier === 1) {
        return `img/Overlay/${originCap}DO.png`;
    } else if (tier === 2) {
        return `img/Overlay/${originCap}SO.png`;
    }
    
    // Fallback
    return 'img/Overlay/NatSO.png';
}
