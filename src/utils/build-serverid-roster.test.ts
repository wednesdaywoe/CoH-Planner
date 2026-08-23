/**
 * A saved build must come back stamped with the server it was saved on.
 *
 * `build.serverId` is not a label. The engine keys its whole calculation on it
 * (`engineTotals.recalcJson(build.serverId, …)`) while the header badge reads the dataset
 * actually loaded, so the two disagreeing is a build that displays as one server and computes
 * as another — silently, with plausible numbers. That is what a hand-written roster in
 * `hydrateBuild` cost: it named three forks, Brainstorm was not one of them, and every
 * Brainstorm save re-stamped itself Homecoming on open.
 *
 * So the roster is graded as a ROSTER: derived from `DATASET_IDS`, never listed here. A fifth
 * dataset that any reader forgets fails this without the test being touched.
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { DATASET_IDS, isDatasetId, loadDataset } from '@/data/dataset';
import { isKnownServerId } from '@/utils/per-server-builds';
import { createEmptyBuild } from '@/types/build';
import { slimBuild, hydrateBuild } from './build-serialization';

describe('serverId survives a save/open round-trip', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it.each(DATASET_IDS)('a %s build opens as the same dataset', (id) => {
    expect(hydrateBuild(slimBuild(createEmptyBuild(id))).serverId).toBe(id);
  });

  it('a file naming no dataset opens as Homecoming', () => {
    const slim = slimBuild(createEmptyBuild('rebirth'));
    delete (slim as Record<string, unknown>).serverId; // a v2/v3 export, before the field existed
    expect(hydrateBuild(slim).serverId).toBe('homecoming');
  });

  it('a file naming a dataset this build does not ship opens as Homecoming', () => {
    const slim = slimBuild(createEmptyBuild());
    (slim as Record<string, unknown>).serverId = 'excelsior';
    // Homecoming and not the id as written, because `importBuild` compares this against the
    // dataset boot will load for that id — and boot answers Homecoming for one it can't load.
    // Keeping the unknown id here is the reload that never converges.
    expect(hydrateBuild(slim).serverId).toBe('homecoming');
  });
});

describe('the roster has one home', () => {
  it.each(DATASET_IDS)('%s is a known server id', (id) => {
    expect(isDatasetId(id)).toBe(true);
    expect(isKnownServerId(id)).toBe(true);
  });

  it.each([['excelsior'], [''], [undefined], [null], [42]])('%s is not', (value) => {
    expect(isDatasetId(value)).toBe(false);
    expect(isKnownServerId(value)).toBe(false);
  });
});
