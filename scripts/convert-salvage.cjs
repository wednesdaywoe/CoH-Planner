/**
 * Convert binary-sourced salvage → invention-salvage.generated.ts
 *
 * Reads `exported_powers/salvage.json` (written by
 * tools/bin-crawler/bin_crawler/export_salvage.py from salvage.bin) and emits
 * the INVENTION salvage registry — the 108 current IO-crafting salvage items
 * (binary category "Invention"), each with id / displayName / rarity. This is
 * net-new data (the planner had no invention salvage registry) and is the
 * foundation for the planned auction-house build-cost feature.
 *
 * Incarnate salvage (binary category "Incarnate") is binary-sourced through the
 * `incarnate-crafting` contract section instead (emit-contract.cjs
 * buildIncarnateCrafting): identity/display/rarity from salvage.bin here, the
 * thread/empyrean prices from baserecipes.bin's own Conversion-store recipes.
 * The hand-curated incarnate-salvage.ts survives only as the oracle that
 * decode is gated against (src/data/incarnate-crafting-oracle.test.ts).
 *
 * salvage.bin is HC-only (Rebirth has none), so this is not dataset-namespaced.
 *
 * Usage: node scripts/convert-salvage.cjs
 */

const fs = require('fs');
const path = require('path');

const SALVAGE_JSON = path.join(__dirname, '..', 'exported_powers', 'salvage.json');
const OUTPUT_PATH = path.join(__dirname, '..', 'src', 'data', 'generated', 'invention-salvage.generated.ts');

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, 'very-rare': 3 };

function idFromName(name) {
  return name.startsWith('S_') ? name.slice(2) : name;
}

function main() {
  if (!fs.existsSync(SALVAGE_JSON)) {
    console.error(`Missing ${SALVAGE_JSON} — run export_salvage.py first.`);
    process.exit(1);
  }
  const all = JSON.parse(fs.readFileSync(SALVAGE_JSON, 'utf-8')).salvage;
  const invention = all
    .filter((s) => s.category === 'invention')
    .map((s) => ({ id: idFromName(s.name), displayName: s.display_name, rarity: s.rarity }))
    .sort((a, b) => (RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity]) || a.id.localeCompare(b.id));

  if (invention.length === 0) {
    console.error('No invention-category salvage found — aborting.');
    process.exit(1);
  }

  const L = [];
  L.push('/**');
  L.push(' * Invention (IO-crafting) salvage registry — AUTO-GENERATED, DO NOT EDIT.');
  L.push(' *');
  L.push(' * Source: exported_powers/salvage.json (binary category "Invention", from');
  L.push(' * salvage.bin via export_salvage.py). Regenerate with:');
  L.push(' *   node scripts/convert-salvage.cjs');
  L.push(' */');
  L.push('');
  L.push("export type InventionSalvageRarity = 'common' | 'uncommon' | 'rare';");
  L.push('');
  L.push('export interface InventionSalvageDefinition {');
  L.push('  id: string;');
  L.push('  displayName: string;');
  L.push('  rarity: InventionSalvageRarity;');
  L.push('}');
  L.push('');
  L.push('export const INVENTION_SALVAGE_REGISTRY: Record<string, InventionSalvageDefinition> = {');
  for (const s of invention) {
    const dn = s.displayName.replace(/'/g, "\\'");
    L.push(`  ${s.id}: { id: '${s.id}', displayName: '${dn}', rarity: '${s.rarity}' },`);
  }
  L.push('};');
  L.push('');

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, L.join('\n'));
  const byR = invention.reduce((m, s) => ((m[s.rarity] = (m[s.rarity] || 0) + 1), m), {});
  console.log(`Wrote ${OUTPUT_PATH}: ${invention.length} invention salvage`, byR);
}

main();
