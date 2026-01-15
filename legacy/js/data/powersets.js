/**
 * City of Heroes: Homecoming - Powerset Registry
 * 
 * Central registry for all powersets. Individual powersets are defined
 * in separate files in the /powersets/ subdirectory.
 * 
 * Each powerset file adds itself to this POWERSETS object.
 */

// Initialize empty powersets object
const POWERSETS = {};

// Individual powerset files will populate this object like:
// POWERSETS['fire-blast'] = { ... } (from fire-blast.js)
// POWERSETS['ice-blast'] = { ... } (from ice-blast.js)
// etc.

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { POWERSETS };
}
