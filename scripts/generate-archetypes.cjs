/**
 * Generate src/data/datasets/<id>/archetypes.ts from exported data.
 *
 * The per-AT *roster* (which primary/secondary powersets each archetype can
 * pick) is the part that genuinely differs between servers, so it is derived
 * from the converted powerset tree on disk (`datasets/<id>/powersets/<at>/...`).
 * Everything else about an archetype — display name, side, description, inherent
 * text, and the hand-curated stat scalars (damageModifier, buffDebuff, caps) —
 * is CoH-intrinsic and reused verbatim from Homecoming's hand-authored
 * archetypes.ts (single source of truth; avoids drift). The HP/cap/threat/
 * damageCap stats come from this dataset's own binary via the spread of
 * `ARCHETYPE_BINARY_STATS[at]`.
 *
 * Standard ATs get disk-derived primary/secondary lists. Kheldians (single
 * blast + single aura) and VEATs (1 base set + branches) keep HC's verbatim
 * arrays/branches — their rosters are fixed and identically named across
 * servers. Thunderspy's custom Primalist AT is emitted from a bespoke template.
 *
 * Usage: node scripts/generate-archetypes.cjs --dataset thunderspy
 *
 * Intended for bootstrapping a NEW dataset's archetypes.ts. Re-running
 * regenerates the file; hand-tweaks afterward are fine but will be overwritten
 * on the next run, so fold lasting changes back into this generator.
 */

const fs = require('fs');
const path = require('path');
const { parseDatasetArg, datasetPath, REPO_ROOT } = require('./_dataset-paths.cjs');

const datasetId = parseDatasetArg();
if (datasetId === 'homecoming') {
  throw new Error('Refusing to overwrite the hand-authored Homecoming archetypes.ts (it is the metadata source).');
}

const PS_DIR = datasetPath(datasetId, 'powersets');
const HC_SRC = fs.readFileSync(
  path.join(REPO_ROOT, 'src', 'data', 'datasets', 'homecoming', 'archetypes.ts'),
  'utf8',
);
const OUT = datasetPath(datasetId, 'archetypes.ts');

// ATs to emit, in display order. Only those with both a powerset dir AND a
// binary-stats entry are kept (so HC-only Sentinel / Rebirth-only Guardian
// are skipped automatically when absent).
const STANDARD = ['blaster', 'controller', 'defender', 'scrapper', 'tanker',
  'brute', 'corruptor', 'dominator', 'mastermind', 'stalker'];
const KHELDIAN = ['peacebringer', 'warshade'];
const VEAT = ['arachnos-soldier', 'arachnos-widow'];

// We can't `require` a .ts module from cjs — instead read the generated stats
// file text and pull the set of archetype keys it defines.
const STATS_SRC = fs.readFileSync(
  datasetPath(datasetId, 'generated', 'archetype-stats.generated.ts'), 'utf8');
const STATS_KEYS = new Set(
  [...STATS_SRC.matchAll(/^\s*'([a-z-]+)':\s*\{/gm)].map((m) => m[1]));

function hasStats(at) { return STATS_KEYS.has(at); }
function hasDir(at) { return fs.existsSync(path.join(PS_DIR, at)); }

/** Disk-derived set IDs (`<at>/<dir>`) for a slot dir, sorted. */
function diskSets(at, slot) {
  const dir = path.join(PS_DIR, at, slot);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => `${at}/${d.name}`)
    .sort();
}

/** Extract the inner body (between the outer braces) of an HC archetype block. */
function hcBody(id) {
  const keyText = id.includes('-') ? `'${id}'` : id;
  const marker = `\n  ${keyText}: {`;
  const start = HC_SRC.indexOf(marker);
  if (start === -1) throw new Error(`HC archetype block not found: ${id}`);
  let i = start + marker.length; // just after the opening '{'
  let depth = 1;
  for (; i < HC_SRC.length && depth > 0; i++) {
    if (HC_SRC[i] === '{') depth++;
    else if (HC_SRC[i] === '}') depth--;
  }
  // body excludes the opening '{' and the closing '}'
  return HC_SRC.slice(start + marker.length, i - 1);
}

function fmtArray(ids) {
  if (ids.length === 0) return '[]';
  return `[\n${ids.map((s) => `      '${s}',`).join('\n')}\n    ]`;
}

/** Replace a `<field>: [ ... ]` multi-line array inside an HC body. */
function replaceArray(body, field, ids) {
  const re = new RegExp(`(\\n    ${field}: )\\[[\\s\\S]*?\\n    \\]`);
  if (!re.test(body)) throw new Error(`array field ${field} not found in body`);
  return body.replace(re, `$1${fmtArray(ids)}`);
}

function emitBlock(id, body) {
  const keyText = id.includes('-') ? `'${id}'` : id;
  return `  ${keyText}: {${body}\n  },`;
}

const blocks = [];
const emitted = [];

// Standard ATs — disk-derived primary/secondary lists.
for (const at of STANDARD) {
  if (!hasStats(at) || !hasDir(at)) continue;
  let body = hcBody(at);
  body = replaceArray(body, 'primarySets', diskSets(at, 'primary'));
  body = replaceArray(body, 'secondarySets', diskSets(at, 'secondary'));
  blocks.push(emitBlock(at, body));
  emitted.push(at);
}

// Kheldians + VEATs — keep HC's verbatim rosters/branches, except inject any
// dataset-specific custom branches whose sets exist on disk but HC doesn't list.
const veatSetExists = (at, set) => fs.existsSync(path.join(PS_DIR, at, 'epic', set));
for (const at of [...KHELDIAN, ...VEAT]) {
  if (!hasStats(at) || !hasDir(at)) continue;
  let body = hcBody(at);
  // Thunderspy adds a third Widow branch, Tarantula (tarantula-training +
  // tarantula-teamwork), alongside Night Widow / Fortunata. HC has no such
  // branch, so inject it into the branches block when its sets are present.
  if (datasetId === 'thunderspy' && at === 'arachnos-widow'
      && veatSetExists(at, 'tarantula-training') && veatSetExists(at, 'tarantula-teamwork')) {
    const tarantula = `branches: {\n      tarantula: {\n` +
      `        name: 'Tarantula',\n` +
      `        primarySet: 'arachnos-widow/tarantula-training',\n` +
      `        secondarySet: 'arachnos-widow/tarantula-teamwork',\n      },`;
    body = body.replace(/branches: \{/, tarantula);
  }
  blocks.push(emitBlock(at, body));
  emitted.push(at);
}

// Thunderspy Primalist — bespoke (no HC template). Kheldian-style form-shifter:
// single primary (Feral Might) + single secondary (Primal Gifts). Forms and
// per-attack lifesteal redirects are modeled separately (see kheldian-* files).
if (datasetId === 'thunderspy' && hasStats('primalist') && hasDir('primalist')) {
  const prim = diskSets('primalist', 'primary');
  const sec = diskSets('primalist', 'secondary');
  const body = `
    name: 'Primalist',
    side: 'villain',
    description:
      'Savage shapeshifter that channels Primal Energy, switching between human (Primal), Hunter, and Prowler forms to reshape its attacks. A Thunderspy original archetype.',
    inherent: {
      name: 'Primal Energy',
      description:
        "Many of the Primalist's attacks grant Primal Energy, lost slowly over time. It is spent to execute devastating attacks, debuffs, and potent healing — some powers require 10 Primal Energy, others scale with the amount you have.",
    },
    stats: {
      ...ARCHETYPE_BINARY_STATS['primalist'],
      baseEndurance: 100,
      baseRecovery: 1.67,
      damageModifier: { melee: 0.95, ranged: 0.5, aoe: 0.8 },
      buffDebuffModifier: 1.0,
      defenseCap: 0.45,
    },
    primarySets: ${fmtArray(prim)},
    secondarySets: ${fmtArray(sec)},`;
  blocks.push(emitBlock('primalist', body));
  emitted.push('primalist');
}

const epicIds = [...KHELDIAN, ...VEAT].filter((at) => emitted.includes(at));
const standardIds = emitted.filter((at) => !epicIds.includes(at));

const header = `/**
 * ${datasetId[0].toUpperCase() + datasetId.slice(1)} archetype definitions — AUTO-GENERATED by
 * scripts/generate-archetypes.cjs. Do not edit by hand; fold changes into the
 * generator. Roster (primary/secondary set lists) is derived from the converted
 * powerset tree; display/inherent/scalar metadata is reused from Homecoming;
 * HP/cap/threat/damageCap come from this dataset's binary via ARCHETYPE_BINARY_STATS.
 */

import type { Archetype, ArchetypeId, ArchetypeRegistry } from '@/types';
import { ARCHETYPE_BINARY_STATS } from './generated/archetype-stats.generated';

export const ARCHETYPES: ArchetypeRegistry = {
${blocks.join('\n\n')}
};

export function getArchetype(id: ArchetypeId): Archetype | undefined {
  return ARCHETYPES[id];
}

export const EPIC_ARCHETYPE_IDS: ArchetypeId[] = [
${epicIds.map((id) => `  '${id}',`).join('\n')}
];

export const STANDARD_ARCHETYPE_IDS: ArchetypeId[] = [
${standardIds.map((id) => `  '${id}',`).join('\n')}
];
`;

fs.writeFileSync(OUT, header);
console.log(`Wrote ${OUT}`);
console.log(`  ${emitted.length} archetypes: ${emitted.join(', ')}`);
for (const at of STANDARD) {
  if (emitted.includes(at)) {
    console.log(`  ${at}: ${diskSets(at, 'primary').length} primary / ${diskSets(at, 'secondary').length} secondary`);
  }
}
