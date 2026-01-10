/**
 * Incarnate Icon Helper
 * Generates the correct icon path for any incarnate power
 */

const IncarnateIcons = {
    /**
     * Get the icon path for a specific incarnate power
     * @param {string} slot - 'alpha', 'judgement', 'interface', 'lore', 'destiny', 'hybrid'
     * @param {string} tree - e.g., 'Cardiac', 'Ion', 'Reactive', etc.
     * @param {number} tier - 1 (Common), 2 (Uncommon), 3 (Rare), 4 (VeryRare)
     * @returns {string} Path to icon
     */
    getIcon(slot, tree, tier) {
        if (!slot || !tree || !tier) {
            return this.getBlankIcon(slot);
        }
        
        const slotName = this.capitalizeFirst(slot);
        const treeName = this.capitalizeFirst(tree);
        const tierName = this.getTierName(tier);
        
        return `img/Incarnate/Incarnate_${slotName}_${treeName}_${tierName}.png`;
    },
    
    /**
     * Get blank/empty icon for a slot
     * @param {string} slot - Slot name
     * @returns {string} Path to blank icon
     */
    getBlankIcon(slot) {
        // Only Alpha has a specific blank icon
        if (slot === 'alpha') {
            return 'img/Incarnate/Incarnate_Alpha_Blank.png';
        }
        // For other slots, return a placeholder or the first common icon
        return `img/Incarnate/Incarnate_${this.capitalizeFirst(slot)}_Placeholder.png`;
    },
    
    /**
     * Convert tier number to tier name
     * @param {number} tier - 1-4
     * @returns {string} 'Common', 'Uncommon', 'Rare', or 'VeryRare'
     */
    getTierName(tier) {
        const tiers = {
            1: 'Common',
            2: 'Uncommon',
            3: 'Rare',
            4: 'VeryRare'
        };
        return tiers[tier] || 'Common';
    },
    
    /**
     * Capitalize first letter of a string
     * @param {string} str
     * @returns {string}
     */
    capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },
    
    /**
     * Get all available trees for a slot
     * @param {string} slot - Slot name
     * @returns {Array<string>} Array of tree names
     */
    getTrees(slot) {
        const trees = {
            alpha: ['Agility', 'Cardiac', 'Intuition', 'Musculature', 'Nerve', 'Resilient', 'Spiritual', 'Vigor'],
            judgement: ['Cryonic', 'Ion', 'Pyronic', 'Void', 'Vorpal'],
            interface: ['Cognitive', 'Degenerative', 'Diamagnetic', 'Gravitic', 'Paralytic', 'Preemptive', 'Reactive', 'Spectral'],
            lore: ['Arachnos', 'Banished', 'Carnival', 'Cimeroran', 'Clockwork', 'Drones', 'Elementals', 
                   'IDF', 'Knives', 'Lights', 'Longbow', 'Nemesis', 'Phantoms', 'Rikti', 'Rularuu', 
                   'Seers', 'Talons', 'Tsoo', 'Vanguard', 'WarWorks'],
            destiny: ['Ageless', 'Barrier', 'Clarion', 'Incandescence', 'Rebirth'],
            hybrid: ['Assault', 'Control', 'Melee', 'Support']
        };
        return trees[slot.toLowerCase()] || [];
    }
};

// Usage examples:
// IncarnateIcons.getIcon('alpha', 'cardiac', 3) 
//   → 'img/Incarnate/Incarnate_Alpha_Cardiac_Rare.png'
//
// IncarnateIcons.getIcon('judgement', 'ion', 4)
//   → 'img/Incarnate/Incarnate_Judgement_Ion_VeryRare.png'
//
// IncarnateIcons.getTrees('lore')
//   → ['Arachnos', 'Banished', ... 'WarWorks']

if (typeof module !== 'undefined' && module.exports) {
    module.exports = IncarnateIcons;
}
