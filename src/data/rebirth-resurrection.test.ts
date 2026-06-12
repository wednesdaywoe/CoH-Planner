import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { IO_SETS_RAW as IO_SETS_RAW_REBIRTH } from './datasets/rebirth/io-sets-raw';
import { IO_SET_TYPE_TO_CATEGORY } from './io-sets';

/**
 * Rebirth "Resurrection" category (Return From The Grave / Superior).
 *
 * Rebirth's first-ever Rez IO Set. Its 60-power pool is exclusively
 * resurrection powers (Revive, Rise of the Phoenix, Soul Transfer, Resurgence,
 * Howling Twilight, Resurrect, Rebirth, Mutation, Stygian Return, …). No
 * common-rarity set shares that pool, so pool-matching failed and the
 * AT-prefix fallback mislabeled it "Brute Archetype Sets" off its first rez
 * power (Brute_Defense.Dark_Armor.Soul_Transfer). Recategorized to a bespoke
 * "Resurrection" category (a `_CHALLENGE_SET_OVERRIDES_BY_NAME` entry in
 * _boostsets.py), surgically re-applied to `exported_powers/rebirth`
 * allowed_set_categories, and plumbed through the planner. See BIN-PARSER-LOG.
 */
function gen(rel: string): string {
  const p = fileURLToPath(new URL(`./datasets/rebirth/generated/powersets/${rel}`, import.meta.url));
  return fs.readFileSync(p, 'utf8');
}
function setCats(text: string): string[] {
  const m = text.match(/"allowedSetCategories":\s*\[([^\]]*)\]/s);
  return m ? [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]) : [];
}

describe('Rebirth Resurrection (Return From The Grave) categorization', () => {
  it('the set itself is typed "Resurrection", not "Brute Archetype Sets"', () => {
    expect(IO_SETS_RAW_REBIRTH['return_from_the_grave']?.type).toBe('Resurrection');
    expect(IO_SETS_RAW_REBIRTH['superior_return_from_the_grave']?.type).toBe('Resurrection');
  });

  it('the "Resurrection" set type maps to the "Resurrection" picker category', () => {
    expect(IO_SET_TYPE_TO_CATEGORY['Resurrection']).toBe('Resurrection');
  });

  it('a non-Brute rez power (Scrapper Revive) gains Resurrection and DROPS the spurious Brute Archetype Sets', () => {
    const cats = setCats(gen('scrapper/secondary/regeneration/revive.ts'));
    expect(cats).toContain('Resurrection');
    expect(cats).not.toContain('Brute Archetype Sets');
  });

  it('an ally-rez buff power (Controller Resurrect) gains Resurrection, no spurious Brute Archetype Sets', () => {
    const cats = setCats(gen('controller/secondary/empathy/resurrect.ts'));
    expect(cats).toContain('Resurrection');
    expect(cats).not.toContain('Brute Archetype Sets');
  });

  it('a genuine Brute rez power (Brute Rise of the Phoenix) KEEPS Brute Archetype Sets (real Brute ATOs) AND gains Resurrection', () => {
    const cats = setCats(gen('brute/secondary/fiery-aura/rise-of-the-phoenix.ts'));
    expect(cats).toContain('Resurrection');
    expect(cats).toContain('Brute Archetype Sets'); // legit: Brute ATOs slot every Brute power
  });
});
