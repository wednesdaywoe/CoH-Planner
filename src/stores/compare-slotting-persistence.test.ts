// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/stores/uiStore';
import { reconcileLength, applySlotEditToStoredCopies } from '@/components/modals/CompareSlottingModal';
import type { Enhancement } from '@/types';

const enh = (name: string) => ({ name, type: 'io' }) as unknown as Enhancement;

beforeEach(() => {
  useUIStore.setState({ compareSlottingCopies: {} });
  localStorage.removeItem('coh-planner-ui');
});

describe('compareSlottingCopies store', () => {
  it('keeps a power\'s copies keyed independently of other powers', () => {
    const { setCompareSlottingCopies } = useUIStore.getState();
    setCompareSlottingCopies('Fire_Blast::Blaze', [{ id: 1, slots: [enh('a')] }]);
    setCompareSlottingCopies('Fire_Blast::Fire_Blast', [{ id: 1, slots: [enh('b')] }]);

    const map = useUIStore.getState().compareSlottingCopies;
    expect(Object.keys(map).sort()).toEqual(['Fire_Blast::Blaze', 'Fire_Blast::Fire_Blast']);
    expect(map['Fire_Blast::Blaze'][0].slots[0]?.name).toBe('a');
  });

  it('drops the entry entirely when the last copy is removed', () => {
    const { setCompareSlottingCopies } = useUIStore.getState();
    setCompareSlottingCopies('Fire_Blast::Blaze', [{ id: 1, slots: [null] }]);
    setCompareSlottingCopies('Fire_Blast::Blaze', []);
    expect('Fire_Blast::Blaze' in useUIStore.getState().compareSlottingCopies).toBe(false);
  });

  it('clearCompareSlottingCopies wipes every power', () => {
    const { setCompareSlottingCopies, clearCompareSlottingCopies } = useUIStore.getState();
    setCompareSlottingCopies('a::b', [{ id: 1, slots: [null] }]);
    setCompareSlottingCopies('c::d', [{ id: 1, slots: [null] }]);
    clearCompareSlottingCopies();
    expect(useUIStore.getState().compareSlottingCopies).toEqual({});
  });

  // The scope decision, locked in. Copies hold whole enhancements and describe
  // one build's powers, while this store is global and outlives any build —
  // persisting them would replay a stale build's slotting (or, after a server
  // switch, enhancements the active dataset cannot resolve).
  it('is NOT written to localStorage', () => {
    useUIStore.getState().setCompareSlottingCopies('Fire_Blast::Blaze', [
      { id: 1, slots: [enh('persist-me-not')] },
    ]);
    const raw = localStorage.getItem('coh-planner-ui') ?? '';
    expect(raw).not.toContain('persist-me-not');
    expect(raw).not.toContain('compareSlottingCopies');
  });
});

// Slotting a multi-piece selection writes one slot at a time, all within a
// single tick — nothing re-reads the store between pieces. A writer that built
// its next value from a render snapshot therefore kept only the last piece,
// which is what the compare modal did: drag-select or "Select multiple" put one
// enhancement in the row instead of the whole range.
describe('a multi-piece pick writes every piece', () => {
  const KEY = 'Fire_Blast::Blaze';
  const COPY_ID = 1;
  const SLOT_COUNT = 6;

  // Mirrors CompareSlottingModal's per-slot write, with no read in between.
  const slotOne = (slotIndex: number, e: Enhancement) =>
    useUIStore.getState().setCompareSlottingCopies(KEY, (prev) =>
      applySlotEditToStoredCopies(prev, COPY_ID, SLOT_COUNT, (slots) =>
        slots.map((s, i) => (i === slotIndex ? e : s))
      )
    );

  beforeEach(() => {
    useUIStore.setState({
      compareSlottingCopies: { [KEY]: [{ id: COPY_ID, slots: new Array(SLOT_COUNT).fill(null) }] },
    });
  });

  it('lands all three pieces of a dragged range, not just the last', () => {
    slotOne(0, enh('piece-a'));
    slotOne(1, enh('piece-b'));
    slotOne(2, enh('piece-c'));

    const slots = useUIStore.getState().compareSlottingCopies[KEY][0].slots;
    expect(slots.map((s) => s?.name ?? null)).toEqual([
      'piece-a', 'piece-b', 'piece-c', null, null, null,
    ]);
  });

  it('leaves other saved rows untouched', () => {
    useUIStore.setState({
      compareSlottingCopies: {
        [KEY]: [
          { id: COPY_ID, slots: new Array(SLOT_COUNT).fill(null) },
          { id: 2, slots: [enh('other'), ...new Array(SLOT_COUNT - 1).fill(null)] },
        ],
      },
    });
    slotOne(0, enh('piece-a'));
    slotOne(1, enh('piece-b'));

    const rows = useUIStore.getState().compareSlottingCopies[KEY];
    expect(rows[0].slots.map((s) => s?.name ?? null).slice(0, 2)).toEqual(['piece-a', 'piece-b']);
    expect(rows[1].slots[0]?.name).toBe('other');
  });

  // The repair that used to ride along with the snapshot write has to survive
  // the move onto the store: a row saved before the power gained or lost slots
  // is still brought to length the first time it is touched.
  it('reconciles a stale-length row on the same write', () => {
    useUIStore.setState({
      compareSlottingCopies: { [KEY]: [{ id: COPY_ID, slots: [null, null] }] },
    });
    slotOne(0, enh('piece-a'));
    expect(useUIStore.getState().compareSlottingCopies[KEY][0].slots).toHaveLength(SLOT_COUNT);
  });
});

// A copy is a fixed-length array captured when it was made. Slots added or
// removed on the real power afterwards must not leave it rendering the wrong
// number of circles, or let Apply write past the end of the power.
describe('reconcileLength', () => {
  it('pads with empty slots when the power gained slots', () => {
    expect(reconcileLength([enh('a')], 3)).toEqual([expect.objectContaining({ name: 'a' }), null, null]);
  });

  it('truncates when the power lost slots', () => {
    const slots = [enh('a'), enh('b'), enh('c')];
    expect(reconcileLength(slots, 1)).toEqual([expect.objectContaining({ name: 'a' })]);
  });

  it('returns the same array untouched when the length already matches', () => {
    const slots = [enh('a'), null];
    expect(reconcileLength(slots, 2)).toBe(slots);
  });

  it('handles a power with no slots', () => {
    expect(reconcileLength([enh('a')], 0)).toEqual([]);
  });
});
