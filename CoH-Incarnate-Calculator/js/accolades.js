/**
 * City of Heroes Planner - Accolades System
 * 
 * Manages accolade selection and buffs
 */

// ============================================
// ACCOLADES DATA
// ============================================

const ACCOLADES = {
    atlas_medallion: {
        id: 'atlas_medallion',
        name: 'The Atlas Medallion',
        description: '+5 Endurance',
        buffs: {
            endurance: 5
        }
    },
    freedom_phalanx: {
        id: 'freedom_phalanx',
        name: 'Freedom Phalanx',
        description: '+10% Max Health',
        buffs: {
            maxHealth: 0.10
        }
    },
    task_force_commander: {
        id: 'task_force_commander',
        name: 'Task Force Commander',
        description: '+5% Max Health',
        buffs: {
            maxHealth: 0.05
        }
    },
    portal_jockey: {
        id: 'portal_jockey',
        name: 'Portal Jockey',
        description: '+5% Max Health and +5 Max Endurance',
        buffs: {
            maxHealth: 0.05,
            endurance: 5
        }
    }
};

// ============================================
// MODAL FUNCTIONS
// ============================================

/**
 * Open the accolades selection modal
 */
function openAccoladesModal() {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'simple-modal';
    modal.id = 'accoladesModal';
    
    // Create modal content
    const content = document.createElement('div');
    content.className = 'simple-modal-content';
    content.style.maxWidth = '600px';
    content.style.maxHeight = '80vh';
    
    // Header
    const header = document.createElement('h3');
    header.textContent = 'Accolades';
    content.appendChild(header);
    
    const subtitle = document.createElement('p');
    subtitle.style.fontSize = '12px';
    subtitle.style.color = 'var(--text-secondary)';
    subtitle.style.marginBottom = '16px';
    subtitle.textContent = 'Select accolades to apply stat buffs to your build';
    content.appendChild(subtitle);
    
    // Accolades list
    const accoladesContainer = document.createElement('div');
    accoladesContainer.style.flex = '1';
    accoladesContainer.style.overflowY = 'auto';
    accoladesContainer.style.marginBottom = '16px';
    
    Object.entries(ACCOLADES).forEach(([accoladeId, accolade]) => {
        const accoladeOption = document.createElement('label');
        accoladeOption.style.display = 'flex';
        accoladeOption.style.alignItems = 'center';
        accoladeOption.style.gap = '12px';
        accoladeOption.style.padding = '12px';
        accoladeOption.style.background = 'var(--bg-tertiary)';
        accoladeOption.style.border = '1px solid var(--border)';
        accoladeOption.style.borderRadius = '4px';
        accoladeOption.style.cursor = 'pointer';
        accoladeOption.style.marginBottom = '8px';
        accoladeOption.style.transition = 'all 0.15s';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = accoladeId;
        checkbox.checked = Build.accolades ? Build.accolades.includes(accoladeId) : false;
        checkbox.onchange = () => updateAccoladeSelection(accoladeId, checkbox.checked);
        checkbox.style.cursor = 'pointer';
        
        const labelContent = document.createElement('div');
        labelContent.style.flex = '1';
        
        const accoladeName = document.createElement('div');
        accoladeName.style.fontWeight = '600';
        accoladeName.style.fontSize = '13px';
        accoladeName.textContent = accolade.name;
        
        const accoladeDesc = document.createElement('div');
        accoladeDesc.style.fontSize = '11px';
        accoladeDesc.style.color = 'var(--text-secondary)';
        accoladeDesc.style.marginTop = '2px';
        accoladeDesc.textContent = accolade.description;
        
        labelContent.appendChild(accoladeName);
        labelContent.appendChild(accoladeDesc);
        
        accoladeOption.appendChild(checkbox);
        accoladeOption.appendChild(labelContent);
        
        accoladeOption.onmouseenter = () => {
            accoladeOption.style.borderColor = 'var(--accent)';
            accoladeOption.style.background = 'var(--bg-secondary)';
        };
        accoladeOption.onmouseleave = () => {
            accoladeOption.style.borderColor = 'var(--border)';
            accoladeOption.style.background = 'var(--bg-tertiary)';
        };
        
        accoladesContainer.appendChild(accoladeOption);
    });
    
    content.appendChild(accoladesContainer);
    
    // Buttons
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '8px';
    
    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear All';
    clearBtn.onclick = () => {
        Build.accolades = [];
        closeAccoladesModal();
        openAccoladesModal(); // Reopen to show updated checkboxes
        recalculateStats();
    };
    
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Done';
    closeBtn.style.marginLeft = 'auto';
    closeBtn.onclick = () => {
        closeAccoladesModal();
        recalculateStats();
    };
    
    buttonContainer.appendChild(clearBtn);
    buttonContainer.appendChild(closeBtn);
    content.appendChild(buttonContainer);
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'simple-modal-overlay';
    overlay.id = 'accoladesOverlay';
    overlay.appendChild(content);
    
    overlay.onclick = (e) => {
        if (e.target === overlay) {
            closeAccoladesModal();
        }
    };
    
    document.body.appendChild(overlay);
}

/**
 * Close the accolades modal
 */
function closeAccoladesModal() {
    const overlay = document.getElementById('accoladesOverlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * Update accolade selection
 * @param {string} accoladeId - The accolade ID
 * @param {boolean} enabled - Whether the accolade is enabled
 */
function updateAccoladeSelection(accoladeId, enabled) {
    if (!Build.accolades) {
        Build.accolades = [];
    }
    
    if (enabled) {
        if (!Build.accolades.includes(accoladeId)) {
            Build.accolades.push(accoladeId);
        }
    } else {
        Build.accolades = Build.accolades.filter(id => id !== accoladeId);
    }
}

// ============================================
// BUFF CALCULATION
// ============================================

/**
 * Get total accolade buffs for a specific stat
 * @param {string} statKey - The stat key (e.g., 'endurance', 'maxHealth')
 * @returns {number} Total buff value
 */
function getAccoladeBuff(statKey) {
    if (!Build.accolades || Build.accolades.length === 0) {
        return 0;
    }
    
    let totalBuff = 0;
    
    Build.accolades.forEach(accoladeId => {
        const accolade = ACCOLADES[accoladeId];
        if (accolade && accolade.buffs && accolade.buffs[statKey]) {
            totalBuff += accolade.buffs[statKey];
        }
    });
    
    return totalBuff;
}

/**
 * Get all active accolade buffs
 * @returns {Object} Object with all active buffs
 */
function getActiveAccoladeBuffs() {
    const buffs = {
        endurance: 0,
        maxHealth: 0
    };
    
    if (!Build.accolades || Build.accolades.length === 0) {
        return buffs;
    }
    
    Build.accolades.forEach(accoladeId => {
        const accolade = ACCOLADES[accoladeId];
        if (accolade && accolade.buffs) {
            Object.entries(accolade.buffs).forEach(([statKey, value]) => {
                if (buffs.hasOwnProperty(statKey)) {
                    buffs[statKey] += value;
                }
            });
        }
    });
    
    return buffs;
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.ACCOLADES = ACCOLADES;
    window.openAccoladesModal = openAccoladesModal;
    window.closeAccoladesModal = closeAccoladesModal;
    window.updateAccoladeSelection = updateAccoladeSelection;
    window.getAccoladeBuff = getAccoladeBuff;
    window.getActiveAccoladeBuffs = getActiveAccoladeBuffs;
}
