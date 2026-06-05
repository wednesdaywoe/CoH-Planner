import { describe, it, expect, beforeAll } from 'vitest';
import { loadDataset } from '@/data/dataset';
import { importFromParsedData } from './importer';
import type { GameExportData, GameExportEnhancement } from './types';

/** Build a minimal valid export with a single Inherent power holding `enh`. */
function exportWithEnhancement(enh: GameExportEnhancement): GameExportData {
  return {
    header: {
      characterName: 'Test',
      level: 50,
      origin: 'Technology',
      archetype: 'Class_Corruptor',
    },
    powers: [
      {
        level: 1,
        category: 'Inherent',
        powerset: 'Inherent',
        powerName: 'Health',
        enhancements: [enh],
      },
    ],
  };
}

function so(uid: string): GameExportEnhancement {
  return { uid, level: 50, boost: undefined, attuned: false };
}

describe('importer SO/DO stat resolution', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  it('resolves a ToHit Buff SO whose stat is title-cased differently by the exporter', () => {
    // Regression: exporter emits "Tohit_Buff" (lowercase h) but GENERIC_STAT_MAP
    // keys it as "ToHit_Buff". The SO/DO path used to do an exact-only lookup and
    // dropped it with "Unknown SO/DO stat: Tohit_Buff".
    const result = importFromParsedData(exportWithEnhancement(so('Technology_Tohit_Buff')));

    expect(result.warnings.filter((w) => w.type === 'enhancement')).toEqual([]);
    expect(result.summary.enhancementsImported).toBe(1);
    expect(result.summary.enhancementsFailed).toBe(0);
  });

  it('still resolves canonically-cased SO stats', () => {
    const result = importFromParsedData(exportWithEnhancement(so('Magic_Accuracy')));
    expect(result.warnings.filter((w) => w.type === 'enhancement')).toEqual([]);
    expect(result.summary.enhancementsImported).toBe(1);
  });

  it('still warns on a genuinely unknown SO stat', () => {
    const result = importFromParsedData(exportWithEnhancement(so('Technology_Nonsense')));
    expect(result.warnings.some((w) => w.message.includes('Unknown SO/DO stat'))).toBe(true);
  });
});
