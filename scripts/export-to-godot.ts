/**
 * Export all CoH-Planner game data to JSON for the Godot Sidekick project.
 *
 * Run with: node --import tsx/esm scripts/export-to-godot.ts
 * Or:       npx tsx scripts/export-to-godot.ts
 *
 * Outputs to: C:/Projects/Sidekick/sidekick/data/
 */

import * as fs from 'fs';
import * as path from 'path';

const OUTPUT_DIR = 'C:/Projects/Sidekick/sidekick/data';

// --- Helpers ---

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath: string, data: unknown) {
  const fullPath = path.join(OUTPUT_DIR, filePath);
  ensureDir(path.dirname(fullPath));
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  const size = (fs.statSync(fullPath).size / 1024).toFixed(1);
  console.log(`  + ${filePath} (${size} KB)`);
}

function safeExport(name: string, fn: () => void) {
  try {
    fn();
  } catch (err) {
    console.error(`  X Failed to export ${name}:`, (err as Error).message);
  }
}

// Helper to dynamically import with error handling
async function tryImport(modulePath: string): Promise<any> {
  try {
    return await import(modulePath);
  } catch (err) {
    console.error(`  X Failed to import ${modulePath}:`, (err as Error).message);
    return null;
  }
}

// --- Main ---

async function main() {
  console.log('CoH-Planner -> Godot JSON Export');
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log('='.repeat(50));

  ensureDir(OUTPUT_DIR);

  // ============ ARCHETYPES ============
  console.log('\n[1/10] Archetypes...');
  const arcMod = await tryImport('@/data/archetypes');
  if (arcMod) {
    const ids = arcMod.getArchetypeIds();
    const result: Record<string, unknown> = {};
    for (const id of ids) {
      const at = arcMod.ARCHETYPES[id];
      if (!at) continue;
      result[id] = {
        id,
        name: at.name,
        side: at.side,
        description: at.description,
        inherent: at.inherent,
        stats: at.stats,
        primarySets: at.primarySets,
        secondarySets: at.secondarySets,
        branches: at.branches ?? null,
      };
    }
    writeJson('archetypes/archetypes.json', result);
    console.log(`  Total: ${ids.length} archetypes`);
  }

  // ============ IO SETS ============
  console.log('\n[2/10] IO Sets...');
  const ioMod = await tryImport('@/data/io-sets-raw');
  if (ioMod) {
    const raw = ioMod.IO_SETS_RAW;
    const result: Record<string, unknown> = {};
    let count = 0;
    for (const [id, ioSet] of Object.entries(raw) as [string, any][]) {
      result[id] = {
        id,
        name: ioSet.name,
        category: ioSet.category,
        type: ioSet.type,
        minLevel: ioSet.minLevel,
        maxLevel: ioSet.maxLevel,
        icon: ioSet.icon || '',
        pieces: ioSet.pieces,
        bonuses: ioSet.bonuses,
      };
      count++;
    }
    writeJson('io_sets/io_sets.json', result);
    console.log(`  Total: ${count} IO sets`);
  }

  // ============ POWER POOLS ============
  console.log('\n[3/10] Power Pools...');
  const ppMod = await tryImport('@/data/power-pools-raw');
  if (ppMod) {
    const raw = ppMod.POWER_POOLS_RAW;
    const result: Record<string, unknown> = {};
    for (const [id, pool] of Object.entries(raw) as [string, any][]) {
      result[id] = {
        id: pool.id || id,
        name: pool.name,
        displayName: pool.displayName || pool.name,
        description: pool.description || '',
        icon: pool.icon || '',
        requires: pool.requires || '',
        powers: (pool.powers || []).map((p: any) => ({
          name: p.name,
          internalName: p.internalName || p.name,
          fullName: p.fullName || p.name,
          available: p.available,
          rank: p.rank,
          description: p.description,
          shortHelp: p.shortHelp || '',
          icon: p.icon || '',
          powerType: p.powerType,
          targetType: p.targetType || null,
          effectArea: p.effectArea || 'SingleTarget',
          requires: p.requires || null,
          stats: p.stats || {},
          allowedEnhancements: p.allowedEnhancements || [],
          allowedSetCategories: p.allowedSetCategories || [],
          maxSlots: p.maxSlots || 6,
          damage: p.damage || null,
          effects: p.effects || null,
        })),
      };
    }
    writeJson('pools/power_pools.json', result);
    console.log(`  Total: ${Object.keys(result).length} power pools`);
  }

  // ============ EPIC POOLS ============
  console.log('\n[4/10] Epic Pools...');
  const epMod = await tryImport('@/data/epic-pools-raw');
  if (epMod) {
    const raw = epMod.EPIC_POOLS_RAW;
    const result: Record<string, unknown> = {};
    for (const [id, pool] of Object.entries(raw) as [string, any][]) {
      result[id] = {
        id: pool.id || id,
        name: pool.name,
        displayName: pool.displayName || pool.name,
        description: pool.description || '',
        icon: pool.icon || '',
        archetype: pool.archetype || '',
        requires: pool.requires || '',
        powers: (pool.powers || []).map((p: any) => ({
          name: p.name,
          internalName: p.internalName || p.name,
          fullName: p.fullName || p.name,
          available: p.available,
          rank: p.rank,
          description: p.description,
          shortHelp: p.shortHelp || '',
          icon: p.icon || '',
          powerType: p.powerType,
          targetType: p.targetType || null,
          effectArea: p.effectArea || 'SingleTarget',
          requires: p.requires || null,
          stats: p.stats || {},
          allowedEnhancements: p.allowedEnhancements || [],
          allowedSetCategories: p.allowedSetCategories || [],
          maxSlots: p.maxSlots || 6,
          damage: p.damage || null,
          effects: p.effects || null,
        })),
      };
    }
    writeJson('pools/epic_pools.json', result);
    console.log(`  Total: ${Object.keys(result).length} epic pools`);
  }

  // ============ AT TABLES ============
  console.log('\n[5/10] AT Tables...');
  const atMod = await tryImport('@/data/at-tables');
  if (atMod) {
    writeJson('at_tables.json', atMod.AT_TABLES);
    console.log(`  Total: ${Object.keys(atMod.AT_TABLES).length} archetype table sets`);
  }

  // ============ ACCOLADES ============
  console.log('\n[6/10] Accolades...');
  const accMod = await tryImport('@/data/accolades');
  if (accMod) {
    writeJson('accolades/accolades.json', accMod.ACCOLADES);
    console.log(`  Total: ${accMod.ACCOLADES.length} accolades`);
  }

  // ============ LEVELS & CONSTANTS ============
  console.log('\n[7/10] Level Constants...');
  const lvlMod = await tryImport('@/data/levels');
  if (lvlMod) {
    writeJson('levels.json', {
      MAX_LEVEL: lvlMod.MAX_LEVEL,
      EPIC_POOL_LEVEL: lvlMod.EPIC_POOL_LEVEL,
      POOL_UNLOCK_LEVEL: lvlMod.POOL_UNLOCK_LEVEL,
      MAX_POWER_POOLS: lvlMod.MAX_POWER_POOLS,
      MAX_SLOTS_PER_POWER: lvlMod.MAX_SLOTS_PER_POWER,
      TOTAL_SLOTS_AT_50: lvlMod.TOTAL_SLOTS_AT_50,
      POWER_PICK_LEVELS: lvlMod.POWER_PICK_LEVELS,
      SLOT_GRANTS: lvlMod.SLOT_GRANTS,
      ENHANCEMENT_AVAILABILITY: lvlMod.ENHANCEMENT_AVAILABILITY,
      POOL_TIER_REQUIREMENTS: lvlMod.POOL_TIER_REQUIREMENTS,
      EARLY_TRAVEL_POWERS: lvlMod.EARLY_TRAVEL_POWERS,
      EPIC_TIER_REQUIREMENTS: lvlMod.EPIC_TIER_REQUIREMENTS,
      INCARNATE_LEVEL: lvlMod.INCARNATE_LEVEL,
      INCARNATE_SLOTS: lvlMod.INCARNATE_SLOTS,
      EPIC_POOLS: lvlMod.EPIC_POOLS,
    });

    // Inherent powers
    writeJson('inherent_powers.json', {
      fitness: lvlMod.INHERENT_FITNESS_POWERS,
      basic: lvlMod.BASIC_INHERENT_POWERS,
      prestige: lvlMod.PRESTIGE_SPRINT_POWERS,
    });
  }

  // ============ INCARNATES ============
  console.log('\n[8/10] Incarnates...');
  // incarnates.ts imports paths.ts which uses import.meta.env
  // So we read the incarnate raw JSON data directly instead
  try {
    const incRawPath = path.resolve('incarnate_raw_data/index.json');
    if (fs.existsSync(incRawPath)) {
      const incIndex = JSON.parse(fs.readFileSync(incRawPath, 'utf-8'));
      writeJson('incarnates/incarnates_index.json', incIndex);
      console.log('  Exported incarnate raw index');
      // Also copy raw data directories
      const incDir = path.resolve('incarnate_raw_data');
      const slots = ['alpha', 'judgement', 'interface', 'destiny', 'lore', 'hybrid'];
      for (const slotId of slots) {
        const slotDir = path.join(incDir, slotId);
        if (fs.existsSync(slotDir)) {
          const indexPath = path.join(slotDir, 'index.json');
          if (fs.existsSync(indexPath)) {
            const data = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
            writeJson(`incarnates/${slotId}.json`, data);
          }
        }
      }
    }
  } catch (err) {
    console.error('  X Incarnates failed:', (err as Error).message);
  }

  // ============ PROC DATA ============
  console.log('\n[9/10] Proc Data...');
  const procMod = await tryImport('@/data/proc-data');
  if (procMod) {
    writeJson('proc_data.json', procMod.PROC_DATABASE);
    console.log(`  Total: ${Object.keys(procMod.PROC_DATABASE).length} proc entries`);
  }

  // ============ GRANTED POWERS ============
  console.log('\n[10/10] Granted Powers...');
  const gpMod = await tryImport('@/data/granted-powers');
  if (gpMod) {
    writeJson('granted_powers.json', gpMod.GRANTED_POWER_GROUPS);
    console.log(`  Total: ${Object.keys(gpMod.GRANTED_POWER_GROUPS).length} granted power groups`);
  }

  // ============ POWERSETS (separate step - large import) ============
  console.log('\n[BONUS] Powersets (large barrel import)...');
  // Use explicit index.ts path to avoid resolving to powersets.ts (which imports paths.ts)
  const psMod = await tryImport('@/data/powersets/index');
  if (psMod && psMod.MODULAR_POWERSETS) {
    const registry = psMod.MODULAR_POWERSETS;
    const byArchetype: Record<string, Record<string, unknown[]>> = {};
    let count = 0;

    for (const [id, ps] of Object.entries(registry) as [string, any][]) {
      const at = ps.archetype || 'shared';
      const cat = ps.category || 'primary';
      if (!byArchetype[at]) byArchetype[at] = {};
      if (!byArchetype[at][cat]) byArchetype[at][cat] = [];

      byArchetype[at][cat].push({
        id: ps.id || id,
        name: ps.name,
        displayName: ps.displayName || ps.name,
        description: ps.description,
        icon: ps.icon,
        archetype: ps.archetype,
        category: ps.category,
        powers: ps.powers.map((p: any) => ({
          name: p.name,
          internalName: p.internalName || p.name,
          fullName: p.fullName || p.name,
          available: p.available,
          tier: p.tier,
          rank: p.rank,
          description: p.description,
          shortHelp: p.shortHelp || '',
          icon: p.icon || '',
          powerType: p.powerType,
          targetType: p.targetType || null,
          effectArea: p.effectArea || 'SingleTarget',
          maxTargets: p.maxTargets || 1,
          requires: p.requires || null,
          stats: p.stats || {},
          allowedEnhancements: p.allowedEnhancements || [],
          allowedSetCategories: p.allowedSetCategories || [],
          maxSlots: p.maxSlots || 6,
          damage: p.damage || null,
          effects: p.effects || null,
        })),
      });
      count++;
    }

    for (const [at, categories] of Object.entries(byArchetype)) {
      writeJson(`powersets/${at}/powersets.json`, categories);
    }
    console.log(`  Total: ${count} powersets across ${Object.keys(byArchetype).length} archetypes`);
  }

  console.log('\nExport complete!');
}

main().catch(console.error);
