/**
 * Characterization tests for enhancement-UID + archetype parsing across the
 * Mids (.mbd) and game (/buildexport) importers.
 *
 * MSOT-5: these two importers maintain independent copies of the same .mxd-format
 * knowledge that have ALREADY DRIFTED. This suite pins the CURRENT behavior of
 * both paths — including the divergences — so the upcoming extraction to a shared
 * enhancement-uid module is provably safe for the cases that should NOT change,
 * and the intended behavior changes are explicit.
 *
 * Cases tagged `[DIVERGENCE]` document a bug the extraction will FIX (the game
 * path will adopt the Mids superset). Those assertions change in the extraction
 * commit; the un-tagged "parity" cases must stay identical.
 */
import { describe, it, expect } from 'vitest';
import { parseIOSetUid as parseMids, mapArchetype } from './mids-import/mappers';
import { parseIOSetUid as parseGame, ARCHETYPE_MAP } from './game-importer/importer';

describe('parseIOSetUid — parity (must not change in extraction)', () => {
  it('standard letter-suffix UID resolves identically on both paths', () => {
    const expected = { setId: 'hecatomb', pieceNum: 1, attuned: false, superior: false };
    expect(parseMids('Hecatomb_A')).toEqual(expected);
    expect(parseGame('Hecatomb_A')).toEqual(expected);
  });

  it('Superior_Attuned_ prefix sets attuned+superior on both paths', () => {
    const expected = { setId: 'blistering_cold', pieceNum: 1, attuned: true, superior: true };
    expect(parseMids('Superior_Attuned_Blistering_Cold_A')).toEqual(expected);
    expect(parseGame('Superior_Attuned_Blistering_Cold_A')).toEqual(expected);
  });

  it('Attuned_ prefix sets attuned on both paths', () => {
    const expected = { setId: 'basilisks_gaze', pieceNum: 1, attuned: true, superior: false };
    expect(parseMids('Attuned_Basilisks_Gaze_A')).toEqual(expected);
    expect(parseGame('Attuned_Basilisks_Gaze_A')).toEqual(expected);
  });

  it('piece letter maps to 1-based piece number on both paths', () => {
    expect(parseMids('Hecatomb_F')!.pieceNum).toBe(6);
    expect(parseGame('Hecatomb_F')!.pieceNum).toBe(6);
  });
});

describe('parseIOSetUid — CURRENT divergences (extraction will reconcile)', () => {
  it('[DIVERGENCE] descriptive-suffix proc UID: Mids resolves (pieceNum 6), game drops to null', () => {
    const uid = 'Panacea_Hea_End_Rech'; // no _[A-F] suffix
    expect(parseMids(uid)).toEqual({ setId: 'panacea_hea_end_rech', pieceNum: 6, attuned: false, superior: false });
    expect(parseGame(uid)).toBeNull();
  });

  it("[DIVERGENCE] apostrophe handling: Mids strips, game keeps", () => {
    const uid = "Vampire's_Bite_A";
    expect(parseMids(uid)!.setId).toBe('vampires_bite');
    expect(parseGame(uid)!.setId).toBe("vampire's_bite");
  });
});

describe('archetype Class_X map — CURRENT state', () => {
  it('both paths resolve the shared archetypes identically', () => {
    expect(mapArchetype('Class_Blaster')).toBe('blaster');
    expect(ARCHETYPE_MAP['Class_Blaster']).toBe('blaster');
    expect(mapArchetype('Class_Arachnos_Widow')).toBe('arachnos-widow');
    expect(ARCHETYPE_MAP['Class_Arachnos_Widow']).toBe('arachnos-widow');
  });

  it('[DIVERGENCE] Rebirth Class_Guardian: Mids resolves, game map omits it', () => {
    expect(mapArchetype('Class_Guardian')).toBe('guardian');
    expect(ARCHETYPE_MAP['Class_Guardian']).toBeUndefined();
  });
});
