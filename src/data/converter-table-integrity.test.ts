import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AT_TABLES,
  PET_TABLES,
  getTableValue,
  getPetTableValue,
} from './datasets/homecoming/at-tables';
import { TABLE_BASE_VALUES } from '@/components/info/powerDisplayUtils';
import { EFFECT_REGISTRY, type EffectDisplayConfig } from '@/data/core/effect-registry';

/**
 * DSH2 (SC-1) — AT-table referential integrity on the COMMITTED generated data.
 *
 * When an emitted AT-table name does not resolve, the display layer does NOT error
 * — it substitutes a believable-but-wrong number. That is how the `_dam`/`_dmg`
 * typo shipped: `Ranged_Debuff_Dam` missed its `ranged_debuff_dmg` table and every
 * damage debuff rendered at half. This guard converts that silent failure into a
 * CI break.
 *
 * SLOT-AWARE, on purpose. A table only becomes a wrong number on effects the app
 * resolves as `scale × tableValue`. From the display code:
 *   • FATAL slots — resolved via `scale × table`:
 *       - `calculation: 'buff'|'debuff'` scalars (getEffectBaseValue → getTableValue;
 *         a miss falls back to the "generic half-rate" calculateBuffDebuffFraction),
 *       - `format: 'percent'` slots, and the by-type protection maps
 *         (calculateResistancePercent → getTableBaseValue; a miss → 0.10 default).
 *       - EXCEPT effects flagged `flatPercentPerScale` (e.g. maxHPBuff), which
 *         intentionally ignore the table.
 *   • GRACEFUL slots — `format: 'mag' | 'damage' | 'value' | 'duration' | 'scale' |
 *     'degrees' | 'custom'` — fall back to the raw magnitude/scale when the table
 *     misses, so an unresolvable table there is harmless (repel `Ones`, taunt
 *     `Melee_Taunt`, Kheldian `Melee_InherentDamage` all live here). We do NOT flag
 *     them — flagging benign names would be noise and erode the guard's authority.
 *
 * The fatal/graceful split is read straight from `EFFECT_REGISTRY`, so adding a new
 * buff/debuff/percent slot automatically brings its tables under this guard.
 *
 * Resolution mirrors the app exactly by calling the REAL `getTableValue` /
 * `getPetTableValue` (inheriting the live self/other/target + `_tempdamage` +
 * `_dam`→`_dmg` alias cascade) plus the `getTableBaseValue` tiers (`_ones`→1.0 and
 * the curated `TABLE_BASE_VALUES` map). Only a name no path can resolve is flagged.
 *
 * Scope: Homecoming only (Rebirth/Thunderspy ship their own AT-table registries).
 *
 * If this fails, DON'T hand-edit the generated file or bolt on a table alias — find
 * why the converter emitted an unresolvable name, or why the extractor never
 * produced the table (see DEDUCTIVE_SCHEMA_HARNESS.md / [[converter-bag-vs-array-rootcause]]).
 */

const GENERATED_DIR = fileURLToPath(
  new URL('./datasets/homecoming/generated', import.meta.url),
);
const rel = (f: string) =>
  path.relative(fileURLToPath(new URL('.', import.meta.url)), f).replace(/\\/g, '/');

function walkTs(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTs(p, out);
    else if (entry.name.endsWith('.ts')) out.push(p);
  }
  return out;
}

const generatedFiles = walkTs(GENERATED_DIR).filter((f) => !f.endsWith('index.ts'));

// ---- table resolution (mirrors getTableBaseValue's tiers + the pet resolver) ----
// A name is "resolved" iff it hits one of: the `_ones → 1.0` shortcut, an AT table
// via getTableValue (any archetype — all share the same names, but we don't assume
// it), a curated TABLE_BASE_VALUES key, or a pet table. Anything else lands on the
// silent default. Level 50 is arbitrary: resolution is level-independent.
const AT_KEYS = Object.keys(AT_TABLES);
const PET_KEYS = Object.keys(PET_TABLES);
const RESOLVE_LEVEL = 50;
const resolveCache = new Map<string, boolean>();
function tableResolves(name: string): boolean {
  const cached = resolveCache.get(name);
  if (cached !== undefined) return cached;
  const key = (name || '').toLowerCase();
  const ok =
    key.endsWith('_ones') ||
    AT_KEYS.some((at) => getTableValue(at, key, RESOLVE_LEVEL) !== undefined) ||
    PET_KEYS.some((pc) => getPetTableValue(pc, key, RESOLVE_LEVEL) !== undefined) ||
    (key !== 'default' && Object.prototype.hasOwnProperty.call(TABLE_BASE_VALUES, key));
  resolveCache.set(name, ok);
  return ok;
}

// ---- fatal-slot classification (read from the registry) ----
// FATAL: the value is displayed as scale × table (a miss = a wrong number), unless
// the slot intentionally ignores the table (flatPercentPerScale).
function isFatalSlot(config: EffectDisplayConfig | undefined): boolean {
  if (!config || config.flatPercentPerScale !== undefined) return false;
  return (
    config.format === 'percent' ||
    config.calculation === 'buff' ||
    config.calculation === 'debuff'
  );
}

// Collect every AT-table name reachable from a fatal slot's value: a direct
// { scale, table } record, or one nested level down (by-type maps like
// defense/resistance, and keyed containers like specialBuff).
function collectTables(value: unknown, out: string[]): void {
  if (!value || typeof value !== 'object') return;
  const v = value as Record<string, unknown>;
  if (typeof v.table === 'string') {
    out.push(v.table);
    return;
  }
  for (const sub of Object.values(v)) {
    if (sub && typeof sub === 'object' && typeof (sub as { table?: unknown }).table === 'string') {
      out.push((sub as { table: string }).table);
    }
  }
}

// Each generated file is `export const X: Power = <strict JSON>;` — slice and parse.
function parsePower(text: string): { effects?: Record<string, unknown> } | null {
  const i = text.indexOf('= {');
  const j = text.lastIndexOf('};');
  if (i < 0 || j < 0) return null;
  try {
    return JSON.parse(text.slice(i + 2, j + 1));
  } catch {
    return null;
  }
}

describe('DSH2 — AT-table referential integrity (committed generated data)', () => {
  it('discovers the generated files (guards a silent empty walk)', () => {
    expect(generatedFiles.length).toBeGreaterThan(1000);
  });

  it('has non-empty AT/pet registries and a populated effect registry', () => {
    expect(AT_KEYS.length).toBeGreaterThan(0);
    expect(PET_KEYS.length).toBeGreaterThan(0);
    expect(Object.keys(EFFECT_REGISTRY).length).toBeGreaterThan(0);
    // Anchor the classifier: the exact slot the `_dam`/`_dmg` bug lived on MUST be
    // fatal, or this guard would silently stop watching its own reason to exist.
    expect(isFatalSlot(EFFECT_REGISTRY.damageDebuff)).toBe(true);
    // ...and a magnitude slot must NOT be (else repel/taunt become false positives).
    expect(isFatalSlot(EFFECT_REGISTRY.repel)).toBe(false);
  });

  it('the resolver has teeth (known-good resolves, unaliased typo does not)', () => {
    expect(typeof getTableValue(AT_KEYS[0], 'Ranged_Damage', RESOLVE_LEVEL)).toBe('number');
    // `Ranged_Debuff_Dam` now RESOLVES via the `_dam`→`_dmg` alias; the guard is for
    // the NEXT typo that has no alias:
    expect(tableResolves('Ranged_Debuff_Totally_Fake')).toBe(false);
  });

  it('every fatal-slot table resolves (no silent generic/half or 0.10 value)', () => {
    const offenders: string[] = [];
    for (const f of generatedFiles) {
      const power = parsePower(fs.readFileSync(f, 'utf8'));
      const effects = power?.effects;
      if (!effects) continue;
      for (const [slot, value] of Object.entries(effects)) {
        if (!isFatalSlot(EFFECT_REGISTRY[slot])) continue;
        const tables: string[] = [];
        collectTables(value, tables);
        for (const t of tables) {
          if (!tableResolves(t)) offenders.push(`${rel(f)} [${slot}]: "${t}"`);
        }
      }
    }
    const distinct = [...new Set(offenders.map((o) => o.split(': ')[1]))];
    expect(
      offenders,
      offenders.length
        ? `${offenders.length} unresolved fatal-slot table(s) across ${distinct.length} distinct name(s): ${distinct.join(', ')}`
        : '',
    ).toEqual([]);
  });
});
