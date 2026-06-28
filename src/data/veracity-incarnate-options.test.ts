import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import {
  getIncarnateTrees,
  getInterfaceEffects,
  getHybridEffects,
} from '@/data';

/**
 * Veracity expands two existing incarnate slots beyond the global (HC-derived)
 * option set: Interface gains the Hypnotic + Imbalancing trees (72 → 90 powers)
 * and Hybrid gains Eductive (36 → 45). The slot indices are now dataset-aware
 * (SLOT_INDEX_OVERRIDES in incarnates.ts) and the effects are picked per-dataset
 * (_pick4 in incarnate-effects.ts). These tests pin both halves — the picker
 * surfaces the new trees AND their powers resolve real effects — and confirm
 * the overrides don't leak into Homecoming.
 */

describe('Veracity incarnate options — Interface / Hybrid', () => {
  beforeAll(async () => {
    await loadDataset('veracity');
  });
  afterAll(async () => {
    await loadDataset('homecoming');
  });

  it('surfaces the new Interface trees (Hypnotic, Imbalancing)', () => {
    const trees = getIncarnateTrees('interface').map((t) => t.id);
    expect(trees).toContain('hypnotic');
    expect(trees).toContain('imbalancing');
  });

  it('surfaces the new Hybrid tree (Eductive)', () => {
    const trees = getIncarnateTrees('hybrid').map((t) => t.id);
    expect(trees).toContain('eductive');
  });

  it('resolves effects for a new Interface power (Hypnotic)', () => {
    const eff = getInterfaceEffects('hypnotic_core_flawless_interface');
    expect(eff).toBeTruthy();
  });

  it('resolves effects for a new Hybrid power (Eductive)', () => {
    const eff = getHybridEffects('eductive_core_embodiment');
    expect(eff).toBeTruthy();
  });
});

describe('Veracity incarnate overrides do not leak into Homecoming', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('Homecoming Interface has no Hypnotic/Imbalancing trees', () => {
    const trees = getIncarnateTrees('interface').map((t) => t.id);
    expect(trees).not.toContain('hypnotic');
    expect(trees).not.toContain('imbalancing');
  });

  it('Homecoming Hybrid has no Eductive tree', () => {
    const trees = getIncarnateTrees('hybrid').map((t) => t.id);
    expect(trees).not.toContain('eductive');
  });
});
