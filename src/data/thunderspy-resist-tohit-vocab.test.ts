import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { MindOverBody } from './datasets/thunderspy/generated/powersets/brute/secondary/willpower/mind-over-body';
import { HighPainTolerance } from './datasets/thunderspy/generated/powersets/brute/secondary/willpower/high-pain-tolerance';
import { Aim } from './datasets/thunderspy/generated/powersets/arachnos-soldier/epic/crab-spider-soldier/aim';

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
