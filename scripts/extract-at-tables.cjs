/**
 * Extract AT Modifier Tables from Raw Homecoming Data
 *
 * Extracts the named_tables from each archetype's JSON file
 * and creates a TypeScript file with the relevant tables for calculations.
 */

const fs = require('fs');
const path = require('path');

const RAW_DATA_PATH = path.join(__dirname, '../raw_data_homecoming-20251209_7415/tables');
const OUTPUT_PATH = path.join(__dirname, '../src/data/at-tables.ts');

// Archetypes we care about for player characters
const PLAYER_ARCHETYPES = [
  'blaster',
  'brute',
  'controller',
  'corruptor',
  'defender',
  'dominator',
  'mastermind',
  'scrapper',
  'sentinel',
  'stalker',
  'tanker',
  'peacebringer',
  'warshade',
  'arachnos_soldier',
  'arachnos_widow'
];

// Pet character classes that need damage tables
const PET_CLASSES = [
  'minion_pets',
  'minion_controllerpets',
  'henchman_minion',
  'henchman_minion_small',
  'henchman_boss',
  'henchman_lt',
  'boss_heavypet',
  'minion_turret',
  'minion_monument',
  'boss_praetoriangrunt_pet',
  'lt_praetoriangrunt_pet',
  'minion_praetoriansmall',
];

// Tables we need for power calculations
const RELEVANT_TABLES = [
  // Damage tables
  'melee_damage',
  'ranged_damage',
  'aoe_damage',
  'pet_damage',

  // Debuff tables
  'ranged_debuff_def',
  'ranged_debuff_tohit',
  'melee_debuff_def',
  'melee_debuff_tohit',

  // Buff tables
  'ranged_buff_def',
  'ranged_buff_tohit',
  'melee_buff_def',
  'melee_buff_tohit',

  // Heal tables
  'ranged_heal',
  'melee_heal',

  // Resistance tables (damage and mez)
  'ranged_res_dmg',
  'melee_res_dmg',
  'ranged_res_boolean',
  'melee_res_boolean',

  // Other
  'ranged_resistance',
  'melee_resistance',
  'ranged_endurance_discount',
  'ranged_recharge',
  'ranged_speed',
  'ranged_perception',
  'melee_ones',
  'ranged_ones',

  // PvP tables (if present)
  'ranged_pvpdamage',
  'melee_pvpdamage'
];

function extractTables() {
  const allTables = {};

  for (const at of PLAYER_ARCHETYPES) {
    const filePath = path.join(RAW_DATA_PATH, `${at}.json`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${at}.json not found`);
      continue;
    }

    console.log(`Processing ${at}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    const atKey = at.replace(/_/g, '-'); // arachnos_soldier -> arachnos-soldier
    allTables[atKey] = {
      primaryCategory: data.primary_category,
      secondaryCategory: data.secondary_category,
      tables: {}
    };

    if (data.named_tables) {
      for (const tableName of Object.keys(data.named_tables)) {
        // Check if it's a relevant table (case-insensitive)
        const normalizedName = tableName.toLowerCase();
        if (RELEVANT_TABLES.some(t => normalizedName === t.toLowerCase())) {
          // Store as lowercase for consistency
          allTables[atKey].tables[normalizedName] = data.named_tables[tableName];
        }
      }
    }
  }

  return allTables;
}

function extractPetTables() {
  const petTables = {};

  for (const petClass of PET_CLASSES) {
    const filePath = path.join(RAW_DATA_PATH, `${petClass}.json`);

    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: ${petClass}.json not found`);
      continue;
    }

    console.log(`Processing pet class ${petClass}...`);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    petTables[petClass] = { tables: {} };

    if (data.named_tables) {
      for (const tableName of Object.keys(data.named_tables)) {
        const normalizedName = tableName.toLowerCase();
        if (RELEVANT_TABLES.some(t => normalizedName === t.toLowerCase())) {
          petTables[petClass].tables[normalizedName] = data.named_tables[tableName];
        }
      }
    }

    const tableCount = Object.keys(petTables[petClass].tables).length;
    if (tableCount === 0) {
      delete petTables[petClass];
      console.warn(`  No relevant tables found, skipping`);
    }
  }

  return petTables;
}

function generateTypeScript(tables, petTables) {
  const lines = [];

  lines.push(`/**`);
  lines.push(` * Archetype Modifier Tables`);
  lines.push(` * Auto-generated from Homecoming raw data`);
  lines.push(` * `);
  lines.push(` * Each table is an array of 54 values for levels 1-54`);
  lines.push(` * Usage: tableValue = AT_TABLES[archetype].tables[tableName][level - 1]`);
  lines.push(` */`);
  lines.push(``);
  lines.push(`export interface ATTableData {`);
  lines.push(`  primaryCategory: string;`);
  lines.push(`  secondaryCategory: string;`);
  lines.push(`  tables: Record<string, number[]>;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export interface PetTableData {`);
  lines.push(`  tables: Record<string, number[]>;`);
  lines.push(`}`);
  lines.push(``);
  lines.push(`export const AT_TABLES: Record<string, ATTableData> = {`);

  for (const [atKey, atData] of Object.entries(tables)) {
    lines.push(`  '${atKey}': {`);
    lines.push(`    primaryCategory: '${atData.primaryCategory}',`);
    lines.push(`    secondaryCategory: '${atData.secondaryCategory}',`);
    lines.push(`    tables: {`);

    for (const [tableName, values] of Object.entries(atData.tables)) {
      // Format the array compactly but with reasonable line length
      const formattedValues = formatArray(values);
      lines.push(`      '${tableName}': ${formattedValues},`);
    }

    lines.push(`    },`);
    lines.push(`  },`);
  }

  lines.push(`};`);
  lines.push(``);

  // Add helper function
  lines.push(`/**`);
  lines.push(` * Get a table value for a specific archetype and level`);
  lines.push(` */`);
  lines.push(`export function getTableValue(`);
  lines.push(`  archetype: string,`);
  lines.push(`  tableName: string,`);
  lines.push(`  level: number`);
  lines.push(`): number | undefined {`);
  lines.push(`  const at = AT_TABLES[archetype];`);
  lines.push(`  if (!at) return undefined;`);
  lines.push(`  `);
  lines.push(`  const key = tableName.toLowerCase();`);
  lines.push(`  let table = at.tables[key];`);
  lines.push(`  `);
  lines.push(`  // Power data uses suffixed names (e.g., "Ranged_HealSelf") that map to`);
  lines.push(`  // base table names (e.g., "ranged_heal"). Strip common suffixes to match.`);
  lines.push(`  if (!table) {`);
  lines.push(`    const stripped = key.replace(/self$|other$|target$/, '');`);
  lines.push(`    table = at.tables[stripped];`);
  lines.push(`  }`);
  lines.push(`  `);
  lines.push(`  if (!table) return undefined;`);
  lines.push(`  `);
  lines.push(`  // Level 1 = index 0`);
  lines.push(`  const index = Math.max(0, Math.min(53, level - 1));`);
  lines.push(`  return table[index];`);
  lines.push(`}`);
  lines.push(``);

  // Add calculation helper
  lines.push(`/**`);
  lines.push(` * Calculate the final effect value from scale and table`);
  lines.push(` * Example: scale 2.5 with ranged_debuff_tohit at level 50 = 2.5 * -0.125 = -31.25%`);
  lines.push(` */`);
  lines.push(`export function calculateEffectValue(`);
  lines.push(`  archetype: string,`);
  lines.push(`  tableName: string,`);
  lines.push(`  scale: number,`);
  lines.push(`  level: number = 50`);
  lines.push(`): number | undefined {`);
  lines.push(`  const tableValue = getTableValue(archetype, tableName, level);`);
  lines.push(`  if (tableValue === undefined) return undefined;`);
  lines.push(`  return scale * tableValue;`);
  lines.push(`}`);
  lines.push(``);

  // Generate PET_TABLES
  if (petTables && Object.keys(petTables).length > 0) {
    lines.push(`// ============================================`);
    lines.push(`// PET CLASS TABLES`);
    lines.push(`// ============================================`);
    lines.push(``);
    lines.push(`export const PET_TABLES: Record<string, PetTableData> = {`);

    for (const [petClass, petData] of Object.entries(petTables)) {
      lines.push(`  '${petClass}': {`);
      lines.push(`    tables: {`);

      for (const [tableName, values] of Object.entries(petData.tables)) {
        const formattedValues = formatArray(values);
        lines.push(`      '${tableName}': ${formattedValues},`);
      }

      lines.push(`    },`);
      lines.push(`  },`);
    }

    lines.push(`};`);
    lines.push(``);

    // Add pet table helper
    lines.push(`/**`);
    lines.push(` * Get a table value for a specific pet class and level`);
    lines.push(` */`);
    lines.push(`export function getPetTableValue(`);
    lines.push(`  petClass: string,`);
    lines.push(`  tableName: string,`);
    lines.push(`  level: number`);
    lines.push(`): number | undefined {`);
    lines.push(`  const pet = PET_TABLES[petClass];`);
    lines.push(`  if (!pet) return undefined;`);
    lines.push(`  `);
    lines.push(`  const key = tableName.toLowerCase();`);
    lines.push(`  let table = pet.tables[key];`);
    lines.push(`  `);
    lines.push(`  // Strip common suffixes like getTableValue does`);
    lines.push(`  if (!table) {`);
    lines.push(`    const stripped = key.replace(/self$|other$|target$/, '');`);
    lines.push(`    table = pet.tables[stripped];`);
    lines.push(`  }`);
    lines.push(`  `);
    lines.push(`  if (!table) return undefined;`);
    lines.push(`  `);
    lines.push(`  const index = Math.max(0, Math.min(table.length - 1, level - 1));`);
    lines.push(`  return table[index];`);
    lines.push(`}`);
    lines.push(``);
  }

  return lines.join('\n');
}

function formatArray(arr) {
  // For large arrays, put multiple values per line
  const valuesPerLine = 10;
  const lines = ['['];

  for (let i = 0; i < arr.length; i += valuesPerLine) {
    const chunk = arr.slice(i, i + valuesPerLine);
    const formatted = chunk.map(v => typeof v === 'number' ? v.toString() : JSON.stringify(v)).join(', ');
    if (i + valuesPerLine < arr.length) {
      lines.push(`        ${formatted},`);
    } else {
      lines.push(`        ${formatted}`);
    }
  }

  lines.push(`      ]`);
  return lines.join('\n');
}

// Run extraction
console.log('Extracting AT modifier tables...\n');
const tables = extractTables();

console.log('\nExtracting pet class tables...\n');
const petTables = extractPetTables();

console.log('\nGenerating TypeScript file...');
const tsContent = generateTypeScript(tables, petTables);

fs.writeFileSync(OUTPUT_PATH, tsContent);
console.log(`\nWrote ${OUTPUT_PATH}`);

// Print summary
console.log('\nPlayer Archetypes:');
for (const [at, data] of Object.entries(tables)) {
  const tableCount = Object.keys(data.tables).length;
  console.log(`  ${at}: ${tableCount} tables`);
}

console.log('\nPet Classes:');
for (const [petClass, data] of Object.entries(petTables)) {
  const tableCount = Object.keys(data.tables).length;
  console.log(`  ${petClass}: ${tableCount} tables`);
}
