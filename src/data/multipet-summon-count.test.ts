import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Multi-pet summon count correction (convert-powerset `normalizeSummonEntities`).
 *
 * Two summon shapes were mis-counted by per-template counting:
 *  - **Phantom Army (internal "Decoy")** carries its 3 staggered decoys in TWO
 *    effect groups with complementary `@CustomFX Mirror` requires (a visual
 *    branch, only one fires) — counted as 6. Now FX-deduped to 3, with the
 *    P-hash first-decoy merged into the named Pets_Decoy.
 *  - **Gang War** is 13 `Pets_Thug_Pose_NN` cosmetic poses of one Thug firing at
 *    decreasing chances; on HC the templates also sit in activation_effects with
 *    IgnoreStrength so the whole summon was dropped. Now rebuilt, poses collapsed
 *    to one entity, count = chance-weighted expected value.
 *
 * Strictly scoped: only complementary-FX and `_Pose_NN` summons are touched, so
 * level/tier-gated MM henchmen (Battle Drones, Soul Extraction) are left exactly
 * as the existing handler produced them.
 */
function gen(dataset: string, rel: string): string {
  const p = fileURLToPath(new URL(`./datasets/${dataset}/generated/powersets/${rel}`, import.meta.url));
  return fs.readFileSync(p, 'utf8');
}
function summonField(text: string, field: string): string | null {
  const m = text.match(new RegExp(`"summon":\\s*\\{[^}]*?"${field}":\\s*"?([^",}\\s]+)"?`, 's'));
  return m ? m[1] : null;
}

describe('multi-pet summon counts (homecoming)', () => {
  it('Phantom Army (Controller) = 3 Pets_Decoy (FX-variant dedup, was 6)', () => {
    const t = gen('homecoming', 'controller/primary/illusion-control/decoy.ts');
    expect(summonField(t, 'entity')).toBe('Pets_Decoy');
    expect(summonField(t, 'entityCount')).toBe('3');
    expect(t).not.toContain('P998401764'); // P-hash merged away
  });

  it('Phantom Army (Dominator) = 3 Pets_Decoy_Dominator', () => {
    const t = gen('homecoming', 'dominator/primary/illusion-control/decoy.ts');
    expect(summonField(t, 'entity')).toBe('Pets_Decoy_Dominator');
    expect(summonField(t, 'entityCount')).toBe('3');
  });

  it('Gang War = chance-weighted thugs (rebuilt from dropped, poses collapsed)', () => {
    const t = gen('homecoming', 'mastermind/primary/thugs/gang-war.ts');
    expect(summonField(t, 'entity')).toBe('Pets_Thug_Pose_01');
    expect(summonField(t, 'entityCount')).toBe('9');
    expect(t).not.toContain('Pets_Thug_Pose_05'); // poses collapsed to one entity
  });

  it('Fire Imps = 3 Pets_FireImp_Controller (P-hash first imp merged via priority_list)', () => {
    const t = gen('homecoming', 'controller/primary/fire-control/fire-imps.ts');
    expect(summonField(t, 'entity')).toBe('Pets_FireImp_Controller');
    expect(summonField(t, 'entityCount')).toBe('3');
    expect(t).not.toMatch(/"P\d{6,}"/); // no raw P-hash entity left
  });

  it('Gremlins = 2 of the AT gremlin pet (P-hash first gremlin merged)', () => {
    const ctrl = gen('homecoming', 'controller/primary/electric-control/gremlins.ts');
    expect(summonField(ctrl, 'entity')).toBe('Pets_Gremlin_Controller');
    expect(summonField(ctrl, 'entityCount')).toBe('2');
    expect(ctrl).not.toMatch(/"P\d{6,}"/);
    const dom = gen('homecoming', 'dominator/primary/electric-control/gremlins.ts');
    expect(summonField(dom, 'entity')).toBe('Pets_Gremlin');
    expect(summonField(dom, 'entityCount')).toBe('2');
  });

  it('Rain of Arrows keeps its distinct P-hash (priority_list ≠ sibling → NOT merged)', () => {
    // Rain-safety guard for the priority_list discriminator: Rain of Arrows'
    // P-hash resolves to Pets_RainofArrows_Visual, which is NOT its sibling
    // Pets_RainofArrows (visual vs static object), so the merge must leave it
    // alone — collapsing it would wrongly fuse two distinct entities.
    const t = gen('homecoming', 'blaster/primary/archery/rain-of-arrows.ts');
    expect(t).toMatch(/"P\d{6,}"/);          // P-hash still present
    expect(t).toContain('Pets_RainofArrows'); // static-object sibling still present
  });

  it('Soul Extraction surfaces 3 tier ghosts as MUTUALLY EXCLUSIVE (summons 1, not 3)', () => {
    // Previously dropped entirely (VillainName gate). Now rebuilt as the three
    // tier variants flagged mutuallyExclusive — exactly one materializes, so the
    // display shows "1 of" and never sums their damage. Each variant count = 1.
    const t = gen('homecoming', 'mastermind/primary/necromancy/soul-extraction.ts');
    expect(t).toContain('"mutuallyExclusive": true');
    for (const tier of ['Boss', 'Lt', 'Minion']) {
      expect(t).toContain(`MastermindPets_Ghost_${tier}`);
    }
    // No inflated entityCount — the variants stay count 1 (one summoned).
    expect(t).not.toMatch(/"entityCount":\s*3/);
  });
});
