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

  it('Soul Extraction is NOT inflated to 3 ghosts (tier-gated, left untouched)', () => {
    // Guard the scoping: a dropped non-pose summon must not be rebuilt as a
    // bogus 3-entity list. It either has no summon block or its original shape.
    const t = gen('homecoming', 'mastermind/primary/necromancy/soul-extraction.ts');
    const ghostEntities = (t.match(/MastermindPets_Ghost_(Boss|Lt|Minion)/g) || []).length;
    expect(ghostEntities).toBeLessThan(3);
  });
});
