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

/**
 * Get base icon filename from set type
 * @param {Object} enhancement - Enhancement object
 * @returns {string|null} Base icon filename
 */
function getBaseIconForSetType(enhancement) {
    if (!enhancement || !IO_SETS || !IO_SETS[enhancement.setId]) {
        return null;
    }
    
    const setType = IO_SETS[enhancement.setId].type;
    if (!setType) return null;
    
    // Map set types to appropriate base icons
    const typeMapping = {
        'Ranged Damage': 'Damage.png',
        'Melee Damage': 'Damage.png',
        'Ranged AoE Damage': 'Damage.png',
        'Melee AoE Damage': 'Damage.png',
        'PBAoE Damage': 'Damage.png',
        'Sniper Attacks': 'Damage.png',
        'Targeted AoE Damage': 'Damage.png',
        'Accurate To-Hit Debuff': 'ToHitDebuff.png',
        'To Hit Debuff': 'ToHitDebuff.png',
        'Defense Debuff': 'DefDebuff.png',
        'Accurate Defense Debuff': 'DefDebuff.png',
        'Defense': 'Defbuff.png',
        'Resist Damage': 'DamRes.png',
        'Healing': 'Heal.png',
        'Holds': 'Hold.png',
        'Stuns': 'Stun.png',
        'Immobilize': 'Immob.png',
        'Sleep': 'Sleep.png',
        'Confuse': 'Confuse.png',
        'Fear': 'Fear.png',
        'Knockback': 'Knock.png',
        'Fly': 'Fly.png',
        'Jump': 'Jump.png',
        'Run': 'Run.png',
        'Endurance Modification': 'EndMod.png',
        'Recharge': 'Recharge.png',
        'Accuracy': 'Acc.png'
    };
    
    return typeMapping[setType] || null;
}

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

/**
 * Common icon name case corrections
 * Maps lowercase icon names to correct casing as they appear in filesystem
 */
const ICON_CASE_CORRECTIONS = {
    'sabsoluteamazement.png': 'sAbsoluteAmazement.png',
    'sachillesheel.png': 'sAchillesHeel.png',
    'sbefuddlingaura.png': 'sBefuddlingAUra.png',
    'sbloodmandate.png': 'sBloodMandate.png',
    'sbonesnap.png': 'sBoneSnap.png',
    'sbrilliantleadership.png': 'sBrilliantLeadership.png',
    'sbruisingblow.png': 'sBruisingBlow.png',
    'scallofthesandman.png': 'sCallOfTheSandman.png',
    'scleavingblow.png': 'sCleavingBlow.png',
    'scommandingpresence.png': 'sCommandingPresence.png',
    'scrushingimpact.png': 'sCrushingImpact.png',
    'scurtailspeed.png': 'sCurtailSpeed.png',
    'sdampenedspirits.png': 'sDampenedSpirits.png',
    'sdebilitativeaction.png': 'sDebilitativeAction.png',
    'sdeflatedego.png': 'sDeflatedEgo.png',
    'sdiscouragingwords.png': 'sDiscouragingWords.png',
    'sdoctoredwounds.png': 'sDoctoredWounds.png',
    'sedictofthemaster.png': 'sEdictOfTheMaster.png',
    'sefficiencyadaptor.png': 'sEfficiencyAdaptor.png',
    'sencouragedacc.png': 'sEncouragedAcc.png',
    'senergymanip.png': 'sEnergyManip.png',
    'senfeebledoperation.png': 'sEnfeebledOperation.png',
    'sentropicchaos.png': 'sEntropicChaos.png',
    'sessenceofcurare.png': 'sEssenceOfCurare.png',
    'sexecutionerscontract.png': 'sExecutionersContract.png',
    'sexploitvuln.png': 'sExploitVuln.png',
    'sexploitweakness.png': 'sExploitWeakness.png',
    'sexplossivestrike.png': 'sExplosiveStrike.png',
    'sairburst.png': 'sAirBurst.png',
    'scupidscrush.png': 'sCupidsCrush.png',
    // Add more as needed
};

/**
 * Normalize icon filename to correct casing
 * @param {string} iconName - Icon filename from data
 * @returns {string} Corrected icon filename
 */
function normalizeIconName(iconName) {
    if (!iconName) return iconName;
    
    const lowerName = iconName.toLowerCase();
    return ICON_CASE_CORRECTIONS[lowerName] || iconName;
}

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
    
    // IO Set - Always use layered approach to show IO or catalyzed overlay
    if (enhancement.type === 'io-set') {
        // Get the set-specific icon file for base image
        let iconFile = IO_SET_ICONS[enhancement.setId];

        // If not found, get from IO set data
        if (!iconFile && IO_SETS && IO_SETS[enhancement.setId]) {
            iconFile = IO_SETS[enhancement.setId].icon;
        }

        // Normalize icon name for case-sensitivity issues
        if (iconFile) {
            iconFile = normalizeIconName(iconFile);
        }

        // Determine which overlay to use
        const overlayPath = enhancement.attuned
            ? 'img/Overlay/catalyzed_overlay_placeholder.png'
            : 'img/Overlay/IO.png';

        // Use layered approach with set-specific icon (or fallback) and appropriate overlay
        if (iconFile) {
            return {
                type: 'layered',
                base: `img/Enhancements/${iconFile}`,
                overlay: overlayPath
            };
        }

        // No icon specified - use base icon for set type
        console.warn('No icon specified for set:', enhancement.setId, '- using base icon');
        const baseIcon = getBaseIconForSet(enhancement);
        return {
            type: 'layered',
            base: `img/Enhancements/${baseIcon}`,
            overlay: overlayPath
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
    
    // Hamidon - Use pre-composed icon or layered with HO overlay
    if (enhancement.type === 'hamidon') {
        const iconFile = HAMIDON_ICONS[enhancement.hamiType];
        
        if (iconFile) {
            return {
                type: 'single',
                path: `img/Enhancements/${iconFile}`,
                fallbackToLayered: true,
                enhancement: enhancement
            };
        }
        
        // Fallback to layered approach with HO overlay
        console.warn('No icon found for Hamidon type:', enhancement.hamiType);
        const baseIcon = getBaseIconForHamidon(enhancement);
        return {
            type: 'layered',
            base: `img/Enhancements/${baseIcon}`,
            overlay: 'img/Overlay/HO.png'
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
        
        // If icon fails to load and fallbackToLayered is set, create a layered icon instead
        img.onerror = function() {
            this.onerror = null;
            
            if (iconInfo.fallbackToLayered && iconInfo.enhancement) {
                console.warn('Icon failed to load:', iconInfo.path, '- using layered fallback');
                
                // Replace this img with a layered icon
                const parent = this.parentElement;
                if (parent) {
                    const layeredIcon = createLayeredIconFallback(iconInfo.enhancement);
                    parent.replaceChild(layeredIcon, this);
                }
            } else {
                // Final fallback - just show base damage icon
                this.src = 'img/Enhancements/Damage.png';
            }
        };
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
 * Create a layered icon as fallback when pre-composed icon fails
 * @param {Object} enhancement - Enhancement object
 * @returns {HTMLElement} Layered icon container
 */
function createLayeredIconFallback(enhancement) {
    const container = document.createElement('div');
    container.className = 'enhancement-icon-layered';

    let baseIcon, overlayPath;

    if (enhancement.type === 'io-set') {
        baseIcon = getBaseIconForSet(enhancement);
        overlayPath = enhancement.attuned ? 'img/Overlay/catalyzed_overlay_placeholder.png' : 'img/Overlay/IO.png';
    } else if (enhancement.type === 'hamidon') {
        baseIcon = getBaseIconForHamidon(enhancement);
        overlayPath = 'img/Overlay/HO.png';
    } else {
        // Generic fallback
        baseIcon = 'Damage.png';
        overlayPath = 'img/Overlay/IO.png';
    }
    
    const baseImg = document.createElement('img');
    baseImg.src = `img/Enhancements/${baseIcon}`;
    baseImg.className = 'enhancement-icon-base';
    baseImg.onerror = function() { this.onerror = null; this.src = 'img/Enhancements/Damage.png'; };
    
    const overlayImg = document.createElement('img');
    overlayImg.src = overlayPath;
    overlayImg.className = 'enhancement-icon-overlay';
    
    container.appendChild(baseImg);
    container.appendChild(overlayImg);
    
    return container;
}

/**
 * Get base icon for an IO set enhancement
 * @param {Object} enhancement - Enhancement object
 * @returns {string} Base icon filename
 */
function getBaseIconForSet(enhancement) {
    // First try to get icon from set type
    const iconFromType = getBaseIconForSetType(enhancement);
    if (iconFromType) {
        return iconFromType;
    }
    
    // Try to determine the most appropriate base icon from the set's aspects
    if (IO_SETS && IO_SETS[enhancement.setId] && IO_SETS[enhancement.setId].pieces) {
        const pieces = IO_SETS[enhancement.setId].pieces;
        // Use the first piece's first aspect to determine base icon
        if (pieces.length > 0 && pieces[0].aspects && pieces[0].aspects.length > 0) {
            const aspect = pieces[0].aspects[0].toLowerCase();
            return ASPECT_ICONS[aspect] || 'Damage.png';
        }
    }
    
    // Default fallback
    return 'Damage.png';
}

/**
 * Get base icon for a Hamidon enhancement
 * @param {Object} enhancement - Enhancement object
 * @returns {string} Base icon filename
 */
function getBaseIconForHamidon(enhancement) {
    // Hamidon enhancements typically affect multiple aspects
    // Use Damage as a reasonable default
    return 'Damage.png';
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
