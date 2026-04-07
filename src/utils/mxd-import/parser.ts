/**
 * MXD File Parser
 *
 * Parses Mids Reborn legacy .mxd text format.
 * The MXD file has a human-readable text header with build data,
 * followed by a compressed hex blob (ignored in Phase 1).
 */

// ============================================
// TYPES
// ============================================

export interface MxdParsedBuild {
  buildName: string;
  className: string;     // e.g., "Arachnos Soldier"
  level: number;
  origin: string;
  alignment: 'Hero' | 'Villain';
  primarySet: string;    // Display name from the file
  secondarySet: string;
  pools: string[];
  epicPool: string | null;
  powers: MxdParsedPower[];
  incarnates: MxdParsedIncarnatePower[];
  accolades: string[];
}

export interface MxdParsedPower {
  level: number;         // 0 = level 1 inherent
  name: string;          // Display name
  enhancements: MxdParsedEnhancement[];
  isInherent: boolean;   // Powers after the main build (Brawl, Sprint, etc.)
}

export interface MxdParsedEnhancement {
  setAbbrev: string;     // e.g., "Rgn", "LucoftheG"
  pieceAbbrev: string;   // e.g., "Acc/Dmg/Rchg", "Def/Rchg+"
  slotLevel: number | null;  // null = free slot (A)
  isEmpty: boolean;
  isGeneric: boolean;    // Single-stat IOs like "Acc-I", "EndRdx-I"
  isHamidon: boolean;    // "HO:Micro" etc.
}

export interface MxdParsedIncarnatePower {
  name: string;          // e.g., "Cardiac Core Paragon"
  level: number;
}

// ============================================
// PARSER
// ============================================

/**
 * Parse an MXD file text content into structured data.
 */
export function parseMxdText(text: string): MxdParsedBuild | null {
  const lines = text.split(/\r?\n/);

  // --- Header parsing ---

  // Line 1: "This Hero/Villain build was built using Mids Reborn X.X.X"
  const alignmentMatch = lines[0]?.match(/This (Hero|Villain) build/i);
  const alignment: 'Hero' | 'Villain' = alignmentMatch?.[1]?.toLowerCase() === 'villain' ? 'Villain' : 'Hero';

  // Find the character line: "Name: Level NN Origin Archetype"
  let buildName = '';
  let level = 50;
  let origin = 'Natural';
  let className = '';

  for (const line of lines) {
    const charMatch = line.match(/^(.+?):\s*Level\s+(\d+)\s+(\w+)\s+(.+)$/);
    if (charMatch) {
      buildName = charMatch[1].trim();
      level = parseInt(charMatch[2]);
      origin = charMatch[3].trim();
      className = charMatch[4].trim();
      break;
    }
  }

  // Find powerset lines
  let primarySet = '';
  let secondarySet = '';
  const pools: string[] = [];
  let epicPool: string | null = null;

  for (const line of lines) {
    const priMatch = line.match(/^Primary Power Set:\s*(.+)$/);
    if (priMatch) { primarySet = priMatch[1].trim(); continue; }

    const secMatch = line.match(/^Secondary Power Set:\s*(.+)$/);
    if (secMatch) { secondarySet = secMatch[1].trim(); continue; }

    const poolMatch = line.match(/^Power Pool:\s*(.+)$/);
    if (poolMatch) { pools.push(poolMatch[1].trim()); continue; }

    const epicMatch = line.match(/^Ancillary Pool:\s*(.+)$/);
    if (epicMatch) { epicPool = epicMatch[1].trim(); continue; }
  }

  // --- Power lines ---
  const powers: MxdParsedPower[] = [];
  const incarnates: MxdParsedIncarnatePower[] = [];
  const accolades: string[] = [];

  // Find the separator line
  const sepIdx = lines.findIndex(l => l.startsWith('------'));
  if (sepIdx === -1) return null;

  // Track whether we've passed the main build powers into inherents
  let pastMainBuild = false;

  for (let i = sepIdx + 1; i < lines.length; i++) {
    const line = lines[i];

    // Stop at the hex blob delimiter
    if (line.includes('Do not modify anything below')) break;
    if (line.startsWith('|---')) break;

    const powerMatch = line.match(/^Level\s+(\d+):\s*\t(.+?)(?:\t\t*(.*))?$/);
    if (!powerMatch) continue;

    const pickLevel = parseInt(powerMatch[1]);
    const powerName = powerMatch[2].trim();
    const enhStr = (powerMatch[3] || '').trim();

    // Level 50 incarnates
    if (pickLevel === 50 && !enhStr && (
      powerName.includes('Interface') || powerName.includes('Judgement') ||
      powerName.includes('Paragon') || powerName.includes('Epiphany') ||
      powerName.includes('Embodiment') || powerName.includes('Graft') ||
      powerName.includes('Genome') || powerName.includes('Ally') ||
      powerName.includes('Core') || powerName.includes('Radial') ||
      powerName.includes('Alpha') || powerName.includes('Total')
    )) {
      incarnates.push({ name: powerName, level: 50 });
      continue;
    }

    // Level 0 accolades
    if (pickLevel === 0) {
      accolades.push(powerName);
      continue;
    }

    // Inherent powers (after main build — Brawl, Sprint, Health, Stamina, etc.)
    if (pickLevel <= 2 && powers.length > 10 && !pastMainBuild) {
      pastMainBuild = true;
    }

    const enhancements = parseEnhancementString(enhStr);

    powers.push({
      level: pickLevel,
      name: powerName,
      enhancements,
      isInherent: pastMainBuild,
    });
  }

  return {
    buildName,
    className,
    level,
    origin,
    alignment,
    primarySet,
    secondarySet,
    pools,
    epicPool,
    powers,
    incarnates,
    accolades,
  };
}

/**
 * Parse the enhancement string from a power line.
 * Format: "SetAbbrev-PieceAbbrev(Level), SetAbbrev-PieceAbbrev(Level), ..."
 * Level is either a number or "A" for the free slot.
 */
function parseEnhancementString(enhStr: string): MxdParsedEnhancement[] {
  if (!enhStr) return [];

  const enhancements: MxdParsedEnhancement[] = [];
  // Split by comma, handling spaces in piece names
  const parts = enhStr.split(/,\s*/);

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    // Empty slot
    if (trimmed.startsWith('Empty(')) {
      enhancements.push({
        setAbbrev: '',
        pieceAbbrev: '',
        slotLevel: null,
        isEmpty: true,
        isGeneric: false,
        isHamidon: false,
      });
      continue;
    }

    // Hamidon Origin: "HO:Name(Level)"
    const hoMatch = trimmed.match(/^HO:(\w+)\((\d+|A)\)$/);
    if (hoMatch) {
      enhancements.push({
        setAbbrev: 'HO',
        pieceAbbrev: hoMatch[1],
        slotLevel: hoMatch[2] === 'A' ? null : parseInt(hoMatch[2]),
        isEmpty: false,
        isGeneric: false,
        isHamidon: true,
      });
      continue;
    }

    // Standard: "SetAbbrev-PieceAbbrev(Level)"
    const stdMatch = trimmed.match(/^([\w]+)-([\w/%+' \-]+)\((\d+|A)\)$/);
    if (stdMatch) {
      const setAbbrev = stdMatch[1];
      const pieceAbbrev = stdMatch[2].trim();
      const levelStr = stdMatch[3];
      const isGeneric = pieceAbbrev === 'I'; // Generic IO: "Acc-I", "EndRdx-I"

      enhancements.push({
        setAbbrev,
        pieceAbbrev,
        slotLevel: levelStr === 'A' ? null : parseInt(levelStr),
        isEmpty: false,
        isGeneric,
        isHamidon: false,
      });
      continue;
    }

    // Fallback: unrecognized format, add as empty
    enhancements.push({
      setAbbrev: trimmed,
      pieceAbbrev: '',
      slotLevel: null,
      isEmpty: true,
      isGeneric: false,
      isHamidon: false,
    });
  }

  return enhancements;
}
