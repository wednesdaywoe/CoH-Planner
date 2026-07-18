import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { createEmptyBuild } from '@/types/build';
import { slimBuild, hydrateBuild, encodeBuildToHash } from './build-serialization';
import { decodeImportFragment } from '@/utils/import-url';

describe('mutedOverCapStats serialization', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('createEmptyBuild initializes an empty mute list', () => {
    expect(createEmptyBuild().mutedOverCapStats).toEqual([]);
  });

  it('survives a slim → hydrate round-trip', () => {
    const build = createEmptyBuild();
    build.mutedOverCapStats = ['Mez/Debuff Res|Mez Resistance', 'Defense|Energy/Negative'];
    const restored = hydrateBuild(slimBuild(build));
    expect(restored.mutedOverCapStats).toEqual([
      'Mez/Debuff Res|Mez Resistance',
      'Defense|Energy/Negative',
    ]);
  });

  it('a legacy slim payload with no field hydrates to []', () => {
    const slim = slimBuild(createEmptyBuild());
    delete (slim as Record<string, unknown>).mutedOverCapStats; // simulate a pre-feature export
    expect(hydrateBuild(slim).mutedOverCapStats).toEqual([]);
  });

  it('a share link preserves the field (encodeBuildToHash must not strip it)', () => {
    const build = createEmptyBuild();
    build.mutedOverCapStats = ['Mez/Debuff Res|Mez Resistance'];
    const decoded = JSON.parse(decodeImportFragment(encodeBuildToHash(build)));
    expect(decoded.build.mutedOverCapStats).toEqual(['Mez/Debuff Res|Mez Resistance']);
  });
});
