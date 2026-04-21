#!/usr/bin/env node
/**
 * Migrate pre-layering single-file composed powers to the
 * generated/overrides/composed triple.
 *
 * Usage:
 *   node scripts/migrate-to-layered.cjs <category> <powerset> [--apply]
 *
 * Without --apply the tool is a dry-run: it walks each power in the given
 * powerset and prints, per-power, what deltas the migration would capture.
 * With --apply it writes the override file (if deltas exist, or an empty
 * stub if they don't) and replaces the composed file with the layered
 * boilerplate.
 *
 * Prerequisites:
 *   - The generated/ layer must already be populated for the powerset.
 *     Run `node scripts/convert-powerset.cjs <category> <powerset>` first;
 *     convert writes generated/* even when composed files already exist.
 *
 * Field-level semantics (must match src/data/_layer.ts):
 *   - 'effects' and 'stats' are deep-merged by withOverrides(), so we
 *     capture only the sub-fields that differ.
 *   - All other fields are shallow-replaced, so we capture the full
 *     composed value when it differs from generated.
 *
 * Skip list (fields that MAY legitimately diff with the generated but
 * aren't overrides — they're code artifacts, not data):
 *   - header comment
 *   - import statement
 *   - the export identifier name
 */
const fs = require('fs');
const path = require('path');

const REPO = path.resolve(__dirname, '..');
const GENERATED_ROOT = path.join(REPO, 'src', 'data', 'generated', 'powersets');
const OVERRIDES_ROOT = path.join(REPO, 'src', 'data', 'overrides', 'powersets');
const COMPOSED_ROOT = path.join(REPO, 'src', 'data', 'powersets');

const NESTED_OBJECT_FIELDS = new Set(['effects', 'stats']);

function usage() {
  console.error('Usage: node scripts/migrate-to-layered.cjs <category> <powerset> [--apply]');
  process.exit(1);
}

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const positional = args.filter(a => !a.startsWith('--'));
if (positional.length < 2) usage();
const [category, powerset] = positional;

const { CATEGORY_MAP, toKebabCase } = require('./convert-powerset.cjs');

const categoryInfo = CATEGORY_MAP[category];
if (!categoryInfo) {
  console.error(`Unknown category: ${category}`);
  console.error(`Known: ${Object.keys(CATEGORY_MAP).sort().join(', ')}`);
  process.exit(1);
}

// Resolve powerset's display name via its index.json
const rawPsPath = path.join(REPO, 'raw_data_homecoming-20251209_7415', 'powers', category, powerset);
if (!fs.existsSync(rawPsPath)) {
  console.error(`Powerset not found at ${rawPsPath}`);
  process.exit(1);
}
const indexJsonPath = path.join(rawPsPath, 'index.json');
if (!fs.existsSync(indexJsonPath)) {
  console.error(`No index.json in ${rawPsPath}`);
  process.exit(1);
}
const indexJson = JSON.parse(fs.readFileSync(indexJsonPath, 'utf-8'));
const setKebab = toKebabCase(indexJson.display_name);

const genDir = path.join(GENERATED_ROOT, categoryInfo.archetype, categoryInfo.type, setKebab);
const ovrDir = path.join(OVERRIDES_ROOT, categoryInfo.archetype, categoryInfo.type, setKebab);
const composedDir = path.join(COMPOSED_ROOT, categoryInfo.archetype, categoryInfo.type, setKebab);

if (!fs.existsSync(genDir)) {
  console.error(`Generated dir missing: ${genDir}`);
  console.error(`Run: node scripts/convert-powerset.cjs ${category} ${powerset}`);
  process.exit(1);
}

// Both generated and pre-layering composed files follow the same shape —
// a `JSON.stringify`-style object literal. We grab the literal text and
// parse it directly rather than paying a tsx boot per file. If a hand-
// edited composed file has JS-only syntax (unquoted keys, trailing commas,
// etc.), JSON.parse will fail and we fall back to a JS eval in a vm
// sandbox as a safety net.
function loadPowerObject(tsPath, exportName) {
  const src = fs.readFileSync(tsPath, 'utf-8');
  // Find the start of the object literal for the named export. We only
  // match the header; the body is extracted by a brace-counting scan
  // below to handle nested objects correctly.
  const headerRe = new RegExp(`export\\s+const\\s+${exportName}\\s*:\\s*Power\\s*=\\s*\\{`);
  const m = headerRe.exec(src);
  if (!m) {
    throw new Error(`could not find \`export const ${exportName}: Power = { ... };\` in ${tsPath}`);
  }
  let i = m.index + m[0].length - 1; // position of the opening `{`
  let depth = 0;
  let inStr = null;
  let start = i;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (c === '\\') { i++; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) { i++; break; }
    }
  }
  const literal = src.slice(start, i);
  try {
    return JSON.parse(literal);
  } catch (_jsonErr) {
    const vm = require('vm');
    return vm.runInNewContext(`(${literal})`, Object.create(null), { timeout: 500 });
  }
}

function extractExportName(composedSource) {
  // Match `export const Foo: Power = ...` or `export const Foo: Power = withOverrides(...)`.
  const m = composedSource.match(/export\s+const\s+([A-Za-z_$][\w$]*)\s*:\s*Power\b/);
  return m ? m[1] : null;
}

function isComposedAlreadyLayered(composedSource) {
  return /withOverrides\s*\(/.test(composedSource);
}

function deepDiff(composed, generated, fieldName) {
  // Returns what the override should contain for this field.
  //   - deep-merged fields (effects, stats): sub-key delta
  //   - everything else: full composed value if differs, else undefined
  if (NESTED_OBJECT_FIELDS.has(fieldName) &&
      composed && generated &&
      typeof composed === 'object' && typeof generated === 'object' &&
      !Array.isArray(composed) && !Array.isArray(generated)) {
    const delta = {};
    const allKeys = new Set([...Object.keys(composed), ...Object.keys(generated)]);
    for (const k of allKeys) {
      if (!deepEqual(composed[k], generated[k])) {
        delta[k] = composed[k];
      }
    }
    return Object.keys(delta).length ? delta : undefined;
  }
  return deepEqual(composed, generated) ? undefined : composed;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null || b === null) return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  if (Array.isArray(a)) {
    if (a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) return false;
  if (!aKeys.every((k, i) => k === bKeys[i])) return false;
  return aKeys.every(k => deepEqual(a[k], b[k]));
}

function computeOverrides(composed, generated) {
  const deltas = {};
  const allKeys = new Set([...Object.keys(composed || {}), ...Object.keys(generated || {})]);
  for (const k of allKeys) {
    const d = deepDiff(composed[k], generated[k], k);
    if (d !== undefined) deltas[k] = d;
  }
  return deltas;
}

function writeOverrideFile(ovrPath, powerName, deltas) {
  const isEmpty = Object.keys(deltas).length === 0;
  const body = isEmpty
    ? `/**\n * ${powerName} — OVERRIDES LAYER\n *\n * Empty: the generated extraction matches the previously-committed composed\n * form; no hand-written deltas to preserve.\n */\nimport type { Power } from '@/types';\n\nexport const overrides: Partial<Power> = {};\n`
    : `/**\n * ${powerName} — OVERRIDES LAYER\n *\n * Hand-written deltas applied on top of the generated power object via\n * \`withOverrides()\`. Each field below is a value the previously-committed\n * composed file carried that the current CoD2-raw extraction does not.\n * Keep them — the CoD2 archive we convert from is a snapshot, and these\n * overrides are where current HC values live when they've drifted from\n * that snapshot. See src/data/README.md.\n */\nimport type { Power } from '@/types';\n\nexport const overrides: Partial<Power> = ${JSON.stringify(deltas, null, 2)};\n`;
  fs.writeFileSync(ovrPath, body);
}

function writeComposedFile(composedPath, exportName, genRel, ovrRel, powerName, genSource) {
  // Derive `category powerset` from the generated file's header if we can.
  // Match up to the first non-identifier character so we don't capture the
  // trailing backtick from the generated file's header.
  const hint = genSource.match(/convert-powerset\.cjs\s+([\w]+)\s+([\w]+)/);
  const cmdHint = hint ? `node scripts/convert-powerset.cjs ${hint[1]} ${hint[2]}` : 'node scripts/convert-powerset.cjs <category> <powerset>';
  const body = `/**
 * ${powerName} — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via \`withOverrides\`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   ${cmdHint}
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ${exportName} as base } from '${genRel}';
import { overrides } from '${ovrRel}';

export const ${exportName}: Power = withOverrides(base, overrides);
`;
  fs.writeFileSync(composedPath, body);
}

// --- Main ---

const genFiles = fs.readdirSync(genDir).filter(f => f.endsWith('.ts') && f !== 'index.ts');
if (genFiles.length === 0) {
  console.error(`No generated power files in ${genDir}`);
  process.exit(1);
}

let migrated = 0;
let skipped = 0;
let errors = 0;

console.log(`Migrating ${genFiles.length} powers in ${categoryInfo.archetype}/${categoryInfo.type}/${setKebab}`);
console.log(`  apply=${apply}\n`);

for (const genFile of genFiles) {
  const powerStub = genFile.replace(/\.ts$/, '');
  const composedPath = path.join(composedDir, genFile);
  const ovrPath = path.join(ovrDir, genFile);
  const genPath = path.join(genDir, genFile);

  if (!fs.existsSync(composedPath)) {
    console.log(`  ? ${powerStub}: composed file missing (convert should have scaffolded)`);
    skipped++;
    continue;
  }

  const composedSource = fs.readFileSync(composedPath, 'utf-8');
  if (isComposedAlreadyLayered(composedSource)) {
    console.log(`  ✓ ${powerStub}: already layered, skipping`);
    skipped++;
    continue;
  }

  const exportName = extractExportName(composedSource);
  if (!exportName) {
    console.log(`  ! ${powerStub}: could not parse export name, skipping`);
    errors++;
    continue;
  }

  let composedObj, generatedObj;
  try {
    composedObj = loadPowerObject(composedPath, exportName);
    generatedObj = loadPowerObject(genPath, exportName);
  } catch (e) {
    console.log(`  ! ${powerStub}: load error — ${e.message.split('\n')[0]}`);
    errors++;
    continue;
  }

  const deltas = computeOverrides(composedObj, generatedObj);
  const deltaKeys = Object.keys(deltas);

  if (!apply) {
    console.log(`  ${deltaKeys.length ? '→' : '='} ${powerStub}: ${deltaKeys.length ? `deltas on [${deltaKeys.join(', ')}]` : 'no deltas (auto-accept)'}`);
    if (deltaKeys.length && deltaKeys.length <= 4) {
      for (const k of deltaKeys) {
        const d = deltas[k];
        const preview = typeof d === 'object' ? `{ ${Object.keys(d).join(', ')} }` : JSON.stringify(d);
        console.log(`      ${k}: ${preview}`);
      }
    }
    migrated++;
    continue;
  }

  const genRel = `@/data/generated/powersets/${categoryInfo.archetype}/${categoryInfo.type}/${setKebab}/${powerStub}`;
  const ovrRel = `@/data/overrides/powersets/${categoryInfo.archetype}/${categoryInfo.type}/${setKebab}/${powerStub}`;

  writeOverrideFile(ovrPath, composedObj.name || powerStub, deltas);
  writeComposedFile(composedPath, exportName, genRel, ovrRel, composedObj.name || powerStub,
    fs.readFileSync(genPath, 'utf-8'));

  console.log(`  ✓ ${powerStub}: migrated${deltaKeys.length ? ` (${deltaKeys.length} overrides: ${deltaKeys.join(', ')})` : ' (empty overrides)'}`);
  migrated++;
}

console.log(`\n${migrated} migrated, ${skipped} skipped, ${errors} errors`);
if (!apply) console.log(`(dry-run — re-run with --apply to write files)`);
