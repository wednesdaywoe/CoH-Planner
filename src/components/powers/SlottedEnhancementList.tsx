/**
 * SlottedEnhancementList - Expandable, legible list of a power's slots.
 *
 * On touch devices the enhancement slots are tiny and visually
 * indistinguishable, so it's hard to tell what's slotted — or to deliberately
 * change a specific slot — without poking each icon. This list mirrors the slot
 * strip as readable text: each row names its enhancement and is tappable to
 * open the picker for that slot (filled rows change, empty rows add). Because
 * the row is labeled, tapping it is a deliberate edit rather than the blind
 * guess that tapping an ambiguous icon would be.
 */

import type {
  Enhancement,
  IOSetEnhancement,
  OriginEnhancement,
  SpecialEnhancement,
} from '@/types';
import { resolveProcPieceName } from '@/data';
import { SlottedEnhancementIcon } from './SlottedEnhancementIcon';

interface SlottedEnhancementListProps {
  slots: (Enhancement | null)[];
  /** Open the picker for a slot (same handler the slot strip uses). */
  onSelectSlot: (index: number) => void;
  /** Slot indices holding an enhancement the game forbids here — excluded from
   *  totals; the row is marked so the user can move or clear it. */
  invalidSlots?: ReadonlySet<number>;
}

/** Primary/secondary label text for a slotted enhancement. */
function enhancementLabel(enh: Enhancement): { primary: string; secondary: string } {
  switch (enh.type) {
    case 'io-set': {
      const io = enh as IOSetEnhancement;
      return {
        primary: io.setName,
        secondary: resolveProcPieceName(io.name, io.setName, io.isProc),
      };
    }
    case 'io-generic':
      return { primary: enh.name, secondary: 'Generic IO' };
    case 'origin': {
      const o = enh as OriginEnhancement;
      return { primary: o.name, secondary: o.tier };
    }
    case 'special': {
      const s = enh as SpecialEnhancement;
      return { primary: s.name, secondary: s.category };
    }
  }
}

/** Right-aligned meta badge: attuned / crafting level, plus boost. */
function enhancementMeta(enh: Enhancement): string {
  const parts: string[] = [];
  if (enh.attuned) {
    parts.push('Attuned');
  } else if (enh.level) {
    parts.push(`L${enh.level}`);
  }
  // Signed: a negative is an under-level enhancement, which is a penalty the
  // player needs to SEE. Rendering only the positive half hid it entirely.
  if (enh.boost) {
    parts.push(enh.boost > 0 ? `+${enh.boost}` : `${enh.boost}`);
  }
  return parts.join(' ');
}

const ROW_CLASS =
  'w-full flex items-center gap-1.5 min-w-0 rounded-sm px-1 py-1 text-left ' +
  'active:bg-slate-700/70 hover:bg-slate-700/50 transition-colors';

export function SlottedEnhancementList({ slots, onSelectSlot, invalidSlots }: SlottedEnhancementListProps) {
  return (
    <div className="mt-1 rounded-sm bg-slate-900/60 border border-slate-700/70 p-0.5 space-y-px">
      {slots.length === 0 && (
        <div className="text-[11px] text-slate-500 italic px-1 py-1">No slots</div>
      )}
      {slots.map((enh, index) =>
        enh ? (
          (() => {
            const { primary, secondary } = enhancementLabel(enh);
            const meta = enhancementMeta(enh);
            const invalid = invalidSlots?.has(index) ?? false;
            return (
              <button
                key={index}
                type="button"
                onClick={() => onSelectSlot(index)}
                className={`${ROW_CLASS}${invalid ? ' ring-1 ring-red-500/70 bg-red-900/25' : ''}`}
                title={invalid ? `${primary} can't be slotted in this power in-game — it's excluded from all totals. Please move or clear it to fix your build.` : undefined}
                aria-label={`${invalid ? 'Invalid: ' : ''}Change enhancement in slot ${index + 1}: ${primary}${secondary ? ` ${secondary}` : ''}`}
              >
                <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                  <SlottedEnhancementIcon enhancement={enh} size={16} />
                </span>
                <span className="text-[11px] text-slate-200 truncate min-w-0 flex-1">
                  {primary}
                  {secondary && <span className="text-slate-400">: {secondary}</span>}
                  {invalid && <span className="text-red-400"> ⚠</span>}
                </span>
                {meta && (
                  <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">{meta}</span>
                )}
                <ChevronRight />
              </button>
            );
          })()
        ) : (
          <button
            key={index}
            type="button"
            onClick={() => onSelectSlot(index)}
            className={`${ROW_CLASS} text-slate-500`}
            aria-label={`Add enhancement to empty slot ${index + 1}`}
          >
            <span className="flex-shrink-0 w-4 h-4 flex items-center justify-center rounded-full border border-slate-600 bg-slate-700/50 text-[10px] leading-none">
              +
            </span>
            <span className="text-[11px] italic min-w-0 flex-1">Empty slot</span>
            <ChevronRight />
          </button>
        )
      )}
    </div>
  );
}

/** Trailing affordance signalling the row opens the enhancement picker. */
function ChevronRight() {
  return (
    <svg
      className="w-3 h-3 text-slate-500 flex-shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
