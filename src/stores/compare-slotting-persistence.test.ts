// MUST be first: installs an in-memory localStorage before the store module is
// evaluated (the store caches its persist storage at eval time).
import '@/test/localstorage-polyfill';
import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from '@/stores/uiStore';
import { reconcileLength } from '@/components/modals/CompareSlottingModal';
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
