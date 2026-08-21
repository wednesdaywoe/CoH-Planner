import { describe, it, expect } from 'vitest';
import { getEffectiveAspectCount, getSetRarityMultiplier } from '@/utils/calculations';
import { IO_SETS_RAW as HC } from '@/data/datasets/homecoming/io-sets-raw';
import { IO_SETS_RAW as RB } from '@/data/datasets/rebirth/io-sets-raw';
import { IO_SETS_RAW as TS } from '@/data/datasets/thunderspy/io-sets-raw';

/**
 * Corpus conformance for the two IO-set dilution inputs, over every set and piece
 * on all three forks.
 *
 * Both were heuristics once, and both heuristics still look right from a distance,
 * which is why they need a corpus and not an example. Rarity read `category ==
 * 'purple'` or a "Superior" name prefix instead of the binary tier; the aspect count
 * took the larger of the aspect list and the piece name's slash segments. The
 * name-segment half shipped wrong values on the public site until 2026-08-21: it
 * collapsed "Heal"+"Absorb" but the game writes "Healing/Absorb", so the collapse
 * never fired and Doctored Wounds' Healing/Absorb/Recharge diluted to 21.2% instead
 * of 26.5%.
 *
 * The census below is the evidence for retiring them, kept executable so it reds if
 * either heuristic comes back or the data moves under it. See
 * `getEffectiveAspectCount` in utils/calculations/enhancement-values.ts.
 */

type Piece = { name?: string; aspects?: string[]; proc?: boolean; totalAspects?: number };
type Registry = Record<string, { name: string; rarity: string; category: string; pieces?: Piece[] }>;
const FORKS: [string, Registry][] = [
  ['homecoming', HC as unknown as Registry],
  ['rebirth', RB as unknown as Registry],
  ['thunderspy', TS as unknown as Registry],
];

/** The retired heuristic: display category, then the piece-name prefix. */
const displayRarity = (set: { category: string; name: string }) =>
  set.category === 'purple' || set.name.startsWith('Superior') ? 1.25 : 1.0;

/** The retired heuristic: whichever of the aspect list and the name is longer. */
function nameSegmentCount(p: Piece): number {
  if (p.totalAspects != null) return p.totalAspects;
  const a = p.aspects ?? [];
  const explicit = a.length + (p.proc ? 1 : 0) - (a.includes('Heal') && a.includes('Absorb') ? 1 : 0);
  if (!p.name) return explicit;
  const seg = p.name.split('/');
  return Math.max(explicit, seg.length - (seg.includes('Heal') && seg.includes('Absorb') ? 1 : 0));
}

const live = (p: Piece) => getEffectiveAspectCount(p.aspects ?? [], !!p.proc, p.totalAspects);
const pieces = (r: Registry) => Object.values(r).flatMap((s) => s.pieces ?? []);

describe('IO-set rarity multiplier', () => {
  it.each(FORKS)('%s: the binary tier vocabulary covers every set', (_id, reg) => {
    const unknown = Object.values(reg).filter((s) => {
      try {
        getSetRarityMultiplier(s.rarity);
        return false;
      } catch {
        return true;
      }
    });
    expect(unknown.map((s) => `${s.name} (${s.rarity})`)).toEqual([]);
  });

  it('agrees with the retired display heuristic on all 673 sets', () => {
    // Two independent derivations, one from boostsets.bin and one from the display
    // strings. Zero disagreement is what let the heuristic pass for so long; a new
    // tier that splits them has to be adjudicated, not absorbed.
    const total = FORKS.reduce((n, [, r]) => n + Object.keys(r).length, 0);
    const split = FORKS.flatMap(([id, r]) =>
      Object.values(r)
        .filter((s) => getSetRarityMultiplier(s.rarity) !== displayRarity(s))
        .map((s) => `${id}/${s.name}: tier ${s.rarity}, category ${s.category}`),
    );
    expect(total).toBe(673);
    expect(split).toEqual([]);
  });
});

describe('IO-set effective aspect count', () => {
  it('the retired name-segment count moves 145 of the 3,653 pieces, all upward', () => {
    // Upward only, and that is the whole argument. The extractor derives every piece's
    // count from its own enhancement scale and emits `totalAspects` whenever that
    // exceeds the aspect list, so a piece with no override has a measured answer
    // already. A name count can only inflate it, and inflation lowers the value.
    const moved = FORKS.flatMap(([id, r]) =>
      pieces(r)
        .filter((p) => nameSegmentCount(p) !== live(p))
        .map((p) => ({ id, p, from: live(p), to: nameSegmentCount(p) })),
    );
    expect(FORKS.reduce((n, [, r]) => n + pieces(r).length, 0)).toBe(3653);
    expect(moved.length).toBe(145);
    expect(moved.filter((m) => m.to <= m.from)).toEqual([]);

    const healAbsorb = moved.filter((m) => (m.p.aspects ?? []).includes('Absorb'));
    expect(healAbsorb.length).toBe(114);
  });

  it('holds the pieces the two heuristics disagreed about', () => {
    const find = (reg: Registry, setName: string, pieceName: string) => {
      const p = Object.values(reg).find((s) => s.name === setName)?.pieces?.find((x) => x.name === pieceName);
      expect(p, `${setName} "${pieceName}"`).toBeTruthy();
      return p!;
    };
    // The game's name is "Healing/Absorb", so a segment count never sees the pair.
    expect(live(find(HC as unknown as Registry, 'Doctored Wounds', 'Healing/Absorb/Recharge'))).toBe(2);
    expect(live(find(HC as unknown as Registry, 'Doctored Wounds', 'Healing/Absorb'))).toBe(1);
    // Name segments the aspect list doesn't carry, and the scale says the list is right.
    expect(live(find(HC as unknown as Registry, 'Mocking Beratement', 'Taunt/Placate'))).toBe(1);
    expect(live(find(TS as unknown as Registry, 'Nightmare', 'Accuracy/Fear/Endurance/Recharge'))).toBe(2);
  });
});
