import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Regression guard for the 2026-06-11 systemic binary-parser misalignment.
 *
 * `_parse_power` read a u4_array mode/recharge field as a single `read_u4()`
 * ("redirect pre-field"). That was byte-identical only when the array was EMPTY;
 * on pet/summon entity powers where it carries a value (e.g. `['kPostDeath']`),
 * the extra elements shifted the effects read → a garbage `eff_count` → the
 * `try/except pass` silently produced `effects: []`. ~265 powers (Trip Mine, MM
 * henchman / Kheldian / Lore pet abilities) lost their ENTIRE effects array, and
 * a self-consistent pipeline hid it for months (only a CoD2 oracle diff surfaced
 * it). Fix: read the field as `read_u4_array()`. See GAME-DATA-PRINCIPLES §5.
 *
 * This guards the materialized symptom — pet abilities carry their damage —
 * so a future layout shift that re-empties them fails CI without needing the
 * Python parser / .pigg in the loop.
 */
function petEntities(dataset: string): string {
  const p = fileURLToPath(new URL(`./datasets/${dataset}/pet-entities.ts`, import.meta.url));
  return fs.readFileSync(p, 'utf8');
}

describe('parser effect-alignment (pet abilities carry their effects)', () => {
  it('Pets_Mine (Trip Mine) carries its Fire/Lethal explosion damage', () => {
    const t = petEntities('homecoming');
    // The mine's Trip_Mine ability — was empty before the fix.
    expect(t).toContain('"Pets_Mine"');
    // CoD2-verified payload: Fire 2.0 + Lethal 1.0 + Fire 1.0, table Melee_Damage.
    const mineBlock = t.slice(t.indexOf('"Pets_Mine"'), t.indexOf('"Pets_Mine"') + 1500);
    expect(mineBlock).toMatch(/"damageType":"Fire","scale":2/);
    expect(mineBlock).toMatch(/"damageType":"Lethal"/);
    expect(mineBlock).toMatch(/Melee_Damage/);
  });

  it('no commandable pet entity has a defined-but-empty ability set from the misalignment', () => {
    // A weak but cheap canary: the file should carry real damage payloads for
    // the pet families that were victims (Kheldian drones, MM henchmen). If the
    // misalignment regressed, these damage arrays would collapse to "[]".
    const t = petEntities('homecoming');
    const damageArrays = (t.match(/damage:\s*\[\{/g) || []).length;
    // Pre-fix this file had far fewer; lock in a healthy floor (~1041 post-fix).
    expect(damageArrays).toBeGreaterThan(700);
  });
});
