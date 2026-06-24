import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadDataset } from '@/data/dataset';
import { calculateDamageWithATTable } from '@/utils/calculations';

/**
 * Regression guard for `Grant_Power → Temporary_Powers` DoT resolution
 * (convert-powerset `resolveGrantedDamageProcs`, fed by the exporter's
 * referenced-grant-target inclusion).
 *
 * A few passives/toggles deliver damage via a hidden `Temporary_Powers` proc
 * power they GRANT rather than carrying it inline — invisible until the grant
 * hop is resolved at convert time. Molten Embrace (Sentinel) and Hidden Flame
 * (Stalker Hide) grant the *enhanceable* Fire DoT the I28P3 note describes;
 * Toxins / Envenomed Blades grant non-enhanceable (`IgnoreStrength`) damage.
 * Powers that grant MORE THAN ONE distinct proc (Bio Armor adaptations, a
 * mode system) are deliberately NOT resolved here. See BIN-PARSER-LOG.
 */
function gen(dataset: string, rel: string): string {
  const p = fileURLToPath(new URL(`./datasets/${dataset}/generated/powersets/${rel}`, import.meta.url));
  return fs.readFileSync(p, 'utf8');
}

describe('Granted DoT procs (Grant_Power → Temporary_Powers)', () => {
  it('Molten Embrace surfaces its enhanceable Fire DoT', () => {
    const t = gen('homecoming', 'sentinel/secondary/fiery-aura/molten-embrace.ts');
    expect(t).toContain('"grantedDamageProcs"');
    expect(t).toMatch(/"damageType":\s*"Fire",\s*"scale":\s*0\.0493/);
    expect(t).toMatch(/"enhanceable":\s*true/);
    // The "chance to inflict fire DoT" + tick structure are carried for display.
    expect(t).toMatch(/"tickChance":\s*0\.8/);
    expect(t).toMatch(/"duration":\s*2\.1/);
  });

  it('Stalker Hidden Flame (Hide) grants the same enhanceable Molten Embrace proc', () => {
    const t = gen('homecoming', 'stalker/secondary/fiery-aura/hide.ts');
    expect(t).toContain('"grantedDamageProcs"');
    expect(t).toMatch(/"name":\s*"Molten_Embrace_Proc"/);
    expect(t).toMatch(/"enhanceable":\s*true/);
  });

  it('Toxins / Envenomed Blades grant a non-enhanceable (IgnoreStrength) Toxic DoT', () => {
    for (const rel of [
      'blaster/secondary/plant-manipulation/toxins.ts',
      'dominator/secondary/martial-assault/envenomed-blades.ts',
    ]) {
      const t = gen('homecoming', rel);
      expect(t).toContain('"grantedDamageProcs"');
      expect(t).toMatch(/"damageType":\s*"Toxic"/);
      expect(t).toMatch(/"enhanceable":\s*false/);
    }
  });

  it('the proc damage table resolves to a real per-tick value (no §13 silent fallback)', async () => {
    // Molten Embrace's proc damage lives on `Melee_PvPDamage` at scale 0.0493.
    // Guard that the table resolves for the Sentinel AT — a fallback-to-0 (or a
    // wildly off value) would mean the display shows nothing/garbage.
    await loadDataset('homecoming');
    const perTick = calculateDamageWithATTable(0.0493, 'Melee_PvPDamage', 'sentinel', 50, 0, 0);
    expect(perTick).not.toBeNull();
    expect(perTick!).toBeGreaterThan(0);
    expect(perTick!).toBeLessThan(50); // sanity: a small per-tick DoT, not absurd
  });

  it('Bio Armor adaptations (multi-grant mode system) are NOT resolved as a flat proc', () => {
    // Each adaptation grants BOTH the Offensive (Toxic) and Defensive (Heal)
    // procs with no group-level requires to tell stances apart — attaching a
    // flat proc would show the offensive DoT on the defensive stance.
    for (const rel of [
      'brute/secondary/bio-armor/offensive-adaptation.ts',
      'brute/secondary/bio-armor/defensive-adaptation.ts',
    ]) {
      expect(gen('homecoming', rel)).not.toContain('"grantedDamageProcs"');
    }
  });
});
