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

describe('importer special-enhancement level → boost', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  function slottedSpecial(enh: GameExportEnhancement) {
    const result = importFromParsedData(exportWithEnhancement(enh));
    expect(result.warnings.filter((w) => w.type === 'enhancement')).toEqual([]);
    // The test export slots the special into the Inherent "Health" power.
    const allPowers = [
      ...result.build!.primary.powers,
      ...result.build!.secondary.powers,
      ...result.build!.inherents,
    ];
    const slotted = allPowers.flatMap((p) => p.slots ?? []).find(Boolean);
    expect(slotted?.type).toBe('special');
    return slotted as { type: 'special'; boost?: number };
  }

  it('maps an external-JSON level-53 special (boost folded into level) to +3 boost', () => {
    // External .json encodes a boosted special as "level": 53 / "numCombines": null.
    const enh = slottedSpecial({ uid: 'Hydra_Damage_Accuracy', level: 53, boost: undefined, attuned: false });
    expect(enh.boost).toBe(3);
  });

  it('keeps an unboosted level-50 special at no boost', () => {
    const enh = slottedSpecial({ uid: 'Hydra_Damage_Accuracy', level: 50, boost: undefined, attuned: false });
    expect(enh.boost).toBeUndefined();
  });

  it('prefers an explicit boost (game text "50+3" form) over the level', () => {
    const enh = slottedSpecial({ uid: 'Hydra_Damage_Accuracy', level: 50, boost: 3, attuned: false });
    expect(enh.boost).toBe(3);
  });
});
