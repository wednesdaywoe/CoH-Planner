import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { MindOverBody } from './datasets/thunderspy/generated/powersets/brute/secondary/willpower/mind-over-body';
import { HighPainTolerance } from './datasets/thunderspy/generated/powersets/brute/secondary/willpower/high-pain-tolerance';
import { Aim } from './datasets/thunderspy/generated/powersets/arachnos-soldier/epic/crab-spider-soldier/aim';
import { GlacialShield } from './datasets/thunderspy/generated/powersets/defender/primary/cold-domination/glacial-shield';
import { EnervatingField } from './datasets/thunderspy/generated/powersets/defender/primary/radiation-emission/enervating-field';
import { NWMindLink } from './datasets/thunderspy/generated/powersets/arachnos-widow/epic/widow-teamwork/nw-mind-link';
import { CloakofDarkness } from './datasets/thunderspy/generated/powersets/brute/secondary/dark-armor/cloak-of-darkness';

/**
 * Thunderspy resistance-armor / ToHit-buff vocabulary — the parser-surfacing fix
 * (branch `tspy-resist-tohit-vocab`, 2026-07-09).
 *
 * Thunderspy's Parse6-derived schema stores resistance armor and ToHit buffs with
 * only an enhancement-CATEGORY token as the front string-attrib (`Res_DMG`,
 * `Buff_ToHit`), naming the real affected attribs (`Smashing_Dmg`, …, `ToHit`) only
 * in the post-`requires` INDEX array — exactly the shape already handled for
 * `Buff_Def` positional defense. The parser historically surfaced only the front,
 * so every resistance-armor toggle/passive (Mind Over Body, High Pain Tolerance,
 * Absorption, …) and the ToHit half of buffs (Aim, Build Up, Link Minds) dropped to
 * ZERO effects — ~1,000 tspy powers rendered empty (TSPY11).
 *
 * `_parse_effect_template_thunderspy` now prefers the index array for these fronts
 * and synthesizes aspect='Resistance' for the `*_Dmg`-on-`*_Res_DMG` rows (so they
 * route to the converter's resistance branch, not the damage branch — the
 * `_Dmg`-table-suffix trap). ToHit needs no aspect: a bare positive `ToHit` is the
 * plain `tohitBuff`.
 *
 * These re-read the committed dataset so a future regen can't silently undo it
 * (GAME-DATA-PRINCIPLES §9). See [[tspy-player-vocab-gap]].
 */
describe('Thunderspy resistance / ToHit vocabulary surfacing (TSPY11)', () => {
  beforeAll(async () => {
    await loadDataset('thunderspy');
  });

  it('Mind Over Body surfaces its resistance (was empty {})', () => {
    // tspy MoB's bin carries a single Smashing resistance template (Lethal/Psi absent
    // from the tspy data, unlike HC's 3 templates — faithful to the bin).
    const res = MindOverBody.effects?.resistance;
    expect(res).toBeDefined();
    expect(res?.smashing?.scale).toBeCloseTo(2.25, 5);
    expect(res?.smashing?.table).toMatch(/res_dmg/i);
  });

  it('High Pain Tolerance surfaces ALL its per-type resistances (multi-attrib index)', () => {
    // Proves the index array decodes multi-type, not just the first entry.
    const res = HighPainTolerance.effects?.resistance ?? {};
    for (const t of ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic']) {
      expect(res[t as keyof typeof res], `missing resistance.${t}`).toBeDefined();
    }
  });

  it('Aim surfaces its ToHit buff (Buff_ToHit-front → ToHit) with no bogus aspect', () => {
    // scale 5 × Melee_Buff_ToHit resolves to the HC-sane ~+37.5% — the table-vs-literal
    // ambiguity resolves in favor of the table.
    expect(Aim.effects?.tohitBuff?.scale).toBeCloseTo(5, 5);
    expect(Aim.effects?.tohitBuff?.table).toMatch(/buff_tohit/i);
    // A ToHit buff must NOT be mislabeled as a resistance debuff or a damage buff.
    expect(Aim.effects?.tohitDebuff).toBeUndefined();
    expect(Aim.effects?.damageBuff).toBeUndefined();
  });
});

/**
 * Case B — the real-damage-type-front `*_Res_Dmg`-table mislabel (2026-07-09).
 *
 * Some tspy resistance buffs/debuffs lead with the ALREADY-real damage-type token
 * (`Cold_Dmg`, `Fire_Dmg`, …) — not the `Res_DMG` category token — while still
 * riding a `*_Res_Dmg` resistance table with the aspect dropped. The parser used to
 * synthesize aspect only for the `Res_DMG`-front surfaced case, so these rendered as
 * DAMAGE (Glacial Shield "Cold damage 4.5", Enervating Field "damage -3"). The parser
 * now also synthesizes aspect='Resistance' when EVERY attrib is a `*_Dmg` type on a
 * `*_Res_Dmg` table (damage never uses a resistance table). See [[tspy-player-vocab-gap]].
 */
describe('Thunderspy Case B — damage-type-front resistance mislabel', () => {
  it('Glacial Shield is Res(Cold), not Cold damage', () => {
    expect(GlacialShield.effects?.resistance?.cold).toBeDefined();
    expect(GlacialShield.effects?.resistance?.cold?.table).toMatch(/res_dmg/i);
    // Must NOT leak back as damage.
    expect((GlacialShield as { damage?: unknown }).damage).toBeUndefined();
    expect(GlacialShield.effects?.damage).toBeUndefined();
  });

  it('Enervating Field is -Res(all), not damage', () => {
    const rd = EnervatingField.effects?.resistanceDebuff ?? {};
    for (const t of ['smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic', 'toxic']) {
      expect(rd[t as keyof typeof rd], `missing resistanceDebuff.${t}`).toBeDefined();
    }
    expect(EnervatingField.effects?.damage).toBeUndefined();
  });
});

/**
 * Displaced defense index-array recovery (2026-07-09).
 *
 * Thunderspy stores a Buff_Def template's affected attribs as a count-prefixed index
 * array. Simple toggles keep it at the fixed post-`requires` offset the parser reads,
 * but powers with a requires/redirect block (Mind Link / Link Minds, Fade, Farsight,
 * armor passives) carry only a 1-type SHIM there and push the real multi-type array
 * downstream — so ~165 tspy defense powers rendered as SINGLE-type defense (Mind Link
 * → Def(Melee) instead of Def(All)). The parser now unions the shim with the widest
 * count-prefixed defense array in the element when the fixed read yields <=1 type.
 * Zero-regression: multi-type reads are used unchanged. See [[tspy-player-vocab-gap]].
 */
describe('Thunderspy displaced-defense index-array recovery', () => {
  it('Mind Link grants multi-type defense, not Melee-only', () => {
    const def = NWMindLink.effects?.defenseBuff ?? {};
    // Was ['melee'] only. Should now carry positional + typed defense (Def-All-ish).
    for (const t of ['melee', 'ranged', 'aoe', 'smashing', 'lethal', 'fire', 'cold', 'energy', 'negative', 'psionic']) {
      expect(def[t as keyof typeof def], `missing defenseBuff.${t}`).toBeDefined();
    }
  });

  it('a currently-correct armor toggle keeps its full defense (no regression)', () => {
    // Cloak of Darkness read correctly before the fix (its array sits at the fixed
    // offset); confirm the recovery path left it whole.
    const def = CloakofDarkness.effects?.defenseBuff ?? {};
    for (const t of ['melee', 'ranged', 'aoe', 'smashing', 'lethal', 'psionic']) {
      expect(def[t as keyof typeof def], `missing defenseBuff.${t}`).toBeDefined();
    }
  });
});
