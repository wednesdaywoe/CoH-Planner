import { describe, it, expect } from 'vitest';
import { PROC_DATABASE } from '@/data/proc-data';
import { PROC_PPM } from '@/data/generated/proc-ppm.generated';

/**
 * Guard (P6): binary-sourced per-proc PPM (now overlaid onto PROC_DATABASE.ppm)
 * matches the proc-group PPM from the bins. Documents the 12 confirmed
 * corrections where the hand value had drift (Superior ATOs carrying the base
 * PPM; Sentinel's Ward; a few base procs). A NEW diff means the generator
 * regressed or a real correction to record.
 */
describe('binary PPM overlay', () => {
  it('every PROC_PPM key resolves to an entry and is applied', () => {
    const missing = Object.keys(PROC_PPM).filter((k) => !PROC_DATABASE[k]);
    expect(missing, `PROC_PPM keys with no PROC_DATABASE entry:\n${missing.join('\n')}`).toEqual([]);
    // The overlay ran at import time — the live ppm equals the generated value.
    const mismatched = Object.entries(PROC_PPM).filter(([k, v]) => PROC_DATABASE[k]?.ppm !== v);
    expect(mismatched.map(([k]) => k), 'overlay did not apply').toEqual([]);
  });

  it('is non-trivially populated and includes the verified corrections', () => {
    expect(Object.keys(PROC_PPM).length).toBeGreaterThan(100);
    // Spot-check confirmed-in-game corrections (binary is authoritative).
    expect(PROC_PPM["Superior Might of the Tanker: Recharge/Chance for +Res(All)"]).toBe(6);
    expect(PROC_PPM["Sentinel's Ward: Recharge/Chance for +Absorb"]).toBe(2);
    expect(PROC_PPM['Blistering Cold: Chance for Hold']).toBe(2.5);
  });
});
