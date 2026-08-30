import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Summon `copyBoosts` extraction (binary-sourced).
 *
 * A summoned pet inherits the caster's enhancement / global damage bonuses only
 * when its EntCreate AttribMod carries the `CopyBoosts` flag. That flag lives in
 * the SECOND AttribMod flags word (bit 0x4) — a u4 the parser previously
 * swallowed into the opaque Params tail, so `template.flags` never contained
 * 'CopyBoosts' and `summon.copyBoosts` was always undefined (the converter wired
 * it up at convert-powerset.cjs but had nothing to read). The parser now decodes
 * that word (_FLAG2_BITS_BY_ATTRIB in tools/bin-crawler/bin_crawler/parser/_powers.py), so
 * the value is binary-sourced. This retired the hand `copyBoosts: true` overrides
 * on Electrical Affinity Discharge (controller + corruptor).
 *
 * Guards that known CopyBoosts summons carry `copyBoosts: true` in generated, so
 * a parser/converter regression (or a re-export that loses the flag) is caught.
 */
const HC = fileURLToPath(new URL('./datasets/homecoming/generated/powersets', import.meta.url));

function summonCopyBoosts(file: string): boolean {
  const text = fs.readFileSync(`${HC}/${file}`, 'utf8');
  const m = text.match(/"summon":\s*\{[^}]*?"copyBoosts":\s*(true|false)/s);
  return m ? m[1] === 'true' : false;
}

describe('summon copyBoosts is binary-sourced (homecoming)', () => {
  it.each([
    ['Discharge (Controller)', 'controller/secondary/electrical-affinity/discharge.ts'],
    ['Discharge (Corruptor)', 'corruptor/secondary/electrical-affinity/discharge.ts'],
    ['Omega Maneuver', 'arachnos-soldier/epic/crab-spider-soldier/omega-maneuver.ts'],
    ['Rain of Arrows', 'blaster/primary/archery/rain-of-arrows.ts'],
  ])('%s summon carries copyBoosts: true', (_name, file) => {
    expect(summonCopyBoosts(file)).toBe(true);
  });
});
