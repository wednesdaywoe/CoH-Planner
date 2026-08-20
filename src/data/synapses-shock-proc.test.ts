import { describe, it, expect } from 'vitest';
import { IO_SETS_RAW } from '@/data/datasets/homecoming/io-sets-raw';
import { findProcData, getProcEffects } from '@/data/proc-data';

/**
 * Regression: Synapse's Shock #6 is an always-on global proc — slotting it
 * enhances EndMod AND grants run speed. The bin extractor mis-tagged it
 * `proc: false` and stripped its name to bare "EndMod", so the run-speed global
 * was never applied (collectAlwaysOnProcs gates on isProc) and the piece never
 * appeared under the Procs filter. It must carry proc:true, a name that still
 * says run speed, and totalAspects:2 — the global dilutes the EndMod value to
 * the 2-aspect modifier.
 *
 * The game calls it "Endurance Modification/Increased Run Speed"; the extractor
 * reads that off the boost power, so the name is matched loosely here rather
 * than pinned to the shape the extractor used to assemble.
 */
describe("Synapse's Shock #6 is a run-speed global proc", () => {
  const piece = (IO_SETS_RAW as unknown as Record<string, { pieces: Array<Record<string, unknown>> }>)
    .synapses_shock.pieces.find((p) => p.num === 6)!;

  it('is flagged as a proc with a run-speed name and 2-aspect dilution', () => {
    expect(piece.proc).toBe(true);
    expect(piece.name).toMatch(/Run Speed/);
    expect(piece.totalAspects).toBe(2);
    expect(piece.aspects).toEqual(['EndMod']); // still a hybrid: EndMod portion enhances
  });

  it('resolves to a RunSpeed global effect via PROC_DATABASE', () => {
    const data = findProcData(piece.name as string, "Synapse's Shock");
    expect(data).toBeDefined();
    const runSpeed = getProcEffects(data!).find((e) => e.category === 'RunSpeed');
    expect(runSpeed).toBeDefined();
    expect(runSpeed!.value).toBeGreaterThan(0);
  });
});
