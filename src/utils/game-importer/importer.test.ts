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

describe('importer generic IO stat vocabulary', () => {
  beforeAll(async () => {
    await loadDataset('homecoming');
  });

  /** The one slotted enhancement in a single-enhancement export. */
  function slotted(uid: string) {
    const result = importFromParsedData(exportWithEnhancement(so(uid)));
    expect(result.warnings.filter((w) => w.type === 'enhancement')).toEqual([]);
    const allPowers = [
      ...result.build!.primary.powers,
      ...result.build!.secondary.powers,
      ...result.build!.inherents,
    ];
    return allPowers.flatMap((p) => p.slots ?? []).find(Boolean) as { stat?: string } | undefined;
  }

  /**
   * Every stat the game's boost table defines a crafted IO for, as the UID suffix
   * the export writes. Regenerate with:
   *   ls -d exported_powers/boosts/crafted_*_[0-9]* | sed -E 's/_[0-9]+$//' | sort -u
   * (`decreased_regeneration` is excluded — it is an NPC-only boost with no
   * level-50 tier and no player recipe.)
   */
  const CRAFTED_STATS = [
    'Accuracy', 'Confuse', 'Damage', 'Defense_Buff', 'Defense_Debuff',
    'Endurance_Discount', 'Fear', 'Fly', 'Heal', 'Hold', 'Immobilize',
    'Intangible', 'Interrupt', 'Jump', 'Knockback', 'Range', 'Recharge',
    'Recovery', 'Res_Damage', 'Run', 'Sleep', 'Snare', 'Stun', 'Taunt',
    'ToHit_Buff', 'ToHit_Debuff',
  ];

  it.each(CRAFTED_STATS)('resolves the Crafted_%s generic IO', (statSuffix) => {
    // Bug report (direct-game export): "Unknown generic IO stat: Defense_Debuff".
    // Defense_Debuff, ToHit_Debuff, Intangible and Snare were all absent from
    // GENERIC_STAT_MAP, so each dropped its slot on import.
    expect(slotted(`Crafted_${statSuffix}`)).toBeDefined();
  });

  it.each(CRAFTED_STATS)('resolves the SO form of %s', (statSuffix) => {
    expect(slotted(`Magic_${statSuffix}`)).toBeDefined();
  });

  it('keeps a ToHit Debuff IO out of the ToHit Buff aspect', () => {
    // Tohit_Debuff used to map onto 'ToHit', which imported a debuff IO as a
    // buff one — same schedule, so the number looked right and the stat wasn't.
    expect(slotted('Crafted_ToHit_Debuff')?.stat).toBe('ToHit Debuff');
    expect(slotted('Crafted_ToHit_Buff')?.stat).toBe('ToHit');
  });

  it('maps the boost table\'s debuff and utility spellings to app stats', () => {
    expect(slotted('Crafted_Defense_Debuff')?.stat).toBe('Defense Debuff');
    expect(slotted('Crafted_Defense_Buff')?.stat).toBe('Defense');
    expect(slotted('Crafted_Snare')?.stat).toBe('Slow');
    expect(slotted('Crafted_Intangible')?.stat).toBe('Intangible');
  });

  it('resolves the two origin-only stats that have no crafted counterpart', () => {
    // "Science Range" and "Magic Endurance" SOs are keyed Cone / Drain_Endurance.
    expect(slotted('Science_Cone')?.stat).toBe('Range');
    expect(slotted('Magic_Drain_Endurance')?.stat).toBe('EnduranceModification');
  });
});
