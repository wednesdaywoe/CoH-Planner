/**
 * Tests for the shared enhancement-UID + archetype parsing (MSOT-5).
 *
 * parseIOSetUid and the archetype Class_X map were previously duplicated — and
 * had drifted — across the Mids (.mbd) and game (/buildexport) importers. They
 * are now single-sourced in @/utils/enhancement-uid, so parity across import
 * paths is guaranteed by construction. This suite locks the unified (superset)
 * behavior and verifies the de-triplication carries through to the downstream
 * maps both importers expose (mids `mapArchetype`, mxd `CLASS_TO_ARCHETYPE`).
 *
 * The cases marked `(was DIVERGENCE)` are the bug the extraction fixed: the game
 * path previously dropped descriptive-suffix proc UIDs and Class_Guardian and
 * kept apostrophes. They now resolve like the Mids path.
 */
import { describe, it, expect } from 'vitest';
import {
  parseIOSetUid,
  mapArchetypeClass,
} from './enhancement-uid';
import { mapArchetype } from './mids-import/mappers';
import { CLASS_TO_ARCHETYPE } from './mxd-import/abbreviations';

describe('parseIOSetUid (shared)', () => {
  it('resolves a standard letter-suffix UID', () => {
    expect(parseIOSetUid('Hecatomb_A')).toEqual({ setId: 'hecatomb', pieceNum: 1, attuned: false, superior: false });
  });

  it('Superior_Attuned_ prefix sets attuned + superior', () => {
    expect(parseIOSetUid('Superior_Attuned_Blistering_Cold_A')).toEqual({ setId: 'blistering_cold', pieceNum: 1, attuned: true, superior: true });
  });

  it('Attuned_ prefix sets attuned', () => {
    expect(parseIOSetUid('Attuned_Basilisks_Gaze_A')).toEqual({ setId: 'basilisks_gaze', pieceNum: 1, attuned: true, superior: false });
  });

  it('piece letter maps to 1-based piece number', () => {
    expect(parseIOSetUid('Hecatomb_F')!.pieceNum).toBe(6);
  });

  it('(was DIVERGENCE) descriptive-suffix proc UID resolves to a synthetic last piece (pieceNum 6)', () => {
    expect(parseIOSetUid('Panacea_Hea_End_Rech')).toEqual({ setId: 'panacea_hea_end_rech', pieceNum: 6, attuned: false, superior: false });
  });

  it("(was DIVERGENCE) apostrophes are stripped from the set id", () => {
    expect(parseIOSetUid("Vampire's_Bite_A")!.setId).toBe('vampires_bite');
  });
});

describe('archetype maps (shared + downstream)', () => {
  it('resolves shared archetypes', () => {
    expect(mapArchetypeClass('Class_Blaster')).toBe('blaster');
    expect(mapArchetypeClass('Class_Arachnos_Widow')).toBe('arachnos-widow');
  });

  it('returns null for an unknown class', () => {
    expect(mapArchetypeClass('Class_Nope')).toBeNull();
  });

  it('(was DIVERGENCE) Rebirth Class_Guardian resolves on every path', () => {
    expect(mapArchetypeClass('Class_Guardian')).toBe('guardian');
    // mids importer delegates to the shared map
    expect(mapArchetype('Class_Guardian')).toBe('guardian');
    // mxd importer's display-name map is derived from the shared map
    expect(CLASS_TO_ARCHETYPE['Guardian']).toBe('guardian');
  });

  it('mxd display-name map is derived correctly (underscores → spaces)', () => {
    expect(CLASS_TO_ARCHETYPE['Arachnos Soldier']).toBe('arachnos-soldier');
    expect(CLASS_TO_ARCHETYPE['Blaster']).toBe('blaster');
  });
});
