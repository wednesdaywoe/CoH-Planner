/**
 * Parser for Homecoming in-game build export text format
 *
 * Parses the text output from the /buildexport command into structured data.
 *
 * Format:
 *   CharName: Level N Origin Class_Archetype
 *   Character Profile:
 *   ------------------
 *   Level N: Category Powerset Power_Name
 *   \tEnhancement_UID (level) | EMPTY
 *   ...
 *   ------------------
 */

import type {
  GameExportData,
  GameExportHeader,
  GameExportPower,
  GameExportEnhancement,
} from './types';

/**
 * Parse the full game export text into structured data.
 */
export function parseGameExport(text: string): GameExportData | null {
  const lines = text.split('\n').map((l) => l.trimEnd());

  // Find the header line (first non-empty line)
  const header = parseHeader(lines);
  if (!header) return null;

  // Find the profile section between the two "---" separators
  const powers = parsePowers(lines);

  return { header, powers };
}

/**
 * Parse the header line: "CharName: Level N Origin Class_Archetype"
 */
function parseHeader(lines: string[]): GameExportHeader | null {
  for (const line of lines) {
    // Match: "Name: Level N Origin Class_X"
    const match = line.match(/^(.+?):\s*Level\s+(\d+)\s+(\w+)\s+(Class_\w+)\s*$/);
    if (match) {
      return {
        characterName: match[1].trim(),
        level: parseInt(match[2], 10),
        origin: match[3],
        archetype: match[4],
      };
    }
  }
  return null;
}

/**
 * Parse all power entries from the profile section.
 */
function parsePowers(lines: string[]): GameExportPower[] {
  const powers: GameExportPower[] = [];
  let currentPower: GameExportPower | null = null;
  let inProfile = false;
  let separatorCount = 0;

  for (const line of lines) {
    // Track the separator lines
    if (line.startsWith('---')) {
      separatorCount++;
      if (separatorCount === 1) {
        inProfile = true;
        continue;
      }
      if (separatorCount >= 2) {
        // End of profile
        if (currentPower) powers.push(currentPower);
        break;
      }
    }

    if (!inProfile) continue;

    // Power line: "Level N: Category Powerset Power_Name"
    const powerMatch = line.match(/^Level\s+(\d+):\s+(\S+)\s+(\S+)\s+(\S+)\s*$/);
    if (powerMatch) {
      if (currentPower) powers.push(currentPower);
      currentPower = {
        level: parseInt(powerMatch[1], 10),
        category: powerMatch[2],
        powerset: powerMatch[3],
        powerName: powerMatch[4],
        enhancements: [],
      };
      continue;
    }

    // Enhancement line (tab-indented): "\tUID (level)" or "\tEMPTY"
    if ((line.startsWith('\t') || line.startsWith('  ')) && currentPower) {
      const trimmed = line.trim();
      if (trimmed === 'EMPTY') {
        currentPower.enhancements.push(null);
      } else {
        const enh = parseEnhancement(trimmed);
        currentPower.enhancements.push(enh);
      }
    }
  }

  // Push last power if file didn't end with separator
  if (currentPower && !powers.includes(currentPower)) {
    powers.push(currentPower);
  }

  return powers;
}

/**
 * Parse an enhancement line like:
 *   "Attuned_Decimation_A (1)"
 *   "Crafted_Hecatomb_A (50)"
 *   "Crafted_Armageddon_A (50+5)"
 *   "Crafted_Accuracy (50)"
 *   "Crafted_Fly (50+5)"
 *   "Superior_Attuned_Avalanche_A (1)"
 */
function parseEnhancement(text: string): GameExportEnhancement | null {
  // Match: UID (level) or UID (level+boost)
  const match = text.match(/^(\S+)\s+\((\d+)(?:\+(\d+))?\)\s*$/);
  if (!match) return null;

  const uid = match[1];
  const rawLevel = parseInt(match[2], 10);
  const rawBoost = match[3] ? parseInt(match[3], 10) : undefined;

  // Determine if attuned: Attuned_ or Superior_Attuned_ prefix
  const attuned = uid.startsWith('Attuned_') || uid.startsWith('Superior_Attuned_');

  // For attuned enhancements, the (1) is just a count, not a level
  const level = attuned ? undefined : rawLevel;
  const boost = rawBoost;

  return { uid, level, boost, attuned };
}
