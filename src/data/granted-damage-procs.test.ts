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
 * Bio Armor adaptations grant a stance proc PLUS the other stances' procs
 * mode-nested. Since the 2026-07-07 export refresh (mode-system parsing), each
 * adaptation exposes only its OWN stance's proc on the converter's ungated walk,
 * so the offensive stance correctly surfaces its Toxic DoT while the defensive/
 * efficient stances (whose own procs are heals) surface no damage proc. See
 * HOMECOMING_PARSER.
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

  it('Bio Armor Offensive Adaptation surfaces its Toxic DoT, scoped to its own stance', () => {
    // Post the 2026-07-07 mode-system export refresh, each adaptation's ungated
    // grant is its OWN stance's proc: the offensive stance exposes its Toxic DoT,
    // while defensive/efficient (whose own procs are heals) surface no damage
    // proc — so the offensive DoT never leaks onto the wrong stance.
    const off = gen('homecoming', 'brute/secondary/bio-armor/offensive-adaptation.ts');
    expect(off).toContain('"grantedDamageProcs"');
    expect(off).toMatch(/"name":\s*"Offensive_Adaptation_Proc"/);
    expect(off).toMatch(/"damageType":\s*"Toxic"/);
    for (const rel of [
      'brute/secondary/bio-armor/defensive-adaptation.ts',
      'brute/secondary/bio-armor/efficient-adaptation.ts',
    ]) {
      expect(gen('homecoming', rel)).not.toContain('"grantedDamageProcs"');
    }
  });
});
