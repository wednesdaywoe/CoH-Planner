/**
 * IncarnatePanel component - horizontal panel showing all 6 incarnate slots
 * Displayed after the Stats Dashboard, only active for level 50 characters
 */

import { useBuildStore, useUIStore } from '@/stores';
import { getAllIncarnateSlots } from '@/data';
import { INCARNATE_SLOT_ORDER, INCARNATE_REQUIRED_LEVEL, createEmptyIncarnateBuildState } from '@/types';
import { IncarnateSlotButton } from './IncarnateSlotButton';
import { IncarnateModal } from './IncarnateModal';

export function IncarnatePanel() {
  const build = useBuildStore((s) => s.build);
  const incarnatesRaw = useBuildStore((s) => s.build.incarnates);
  const incarnateModalOpen = useUIStore((s) => s.incarnateModalOpen);
  const openIncarnateModal = useUIStore((s) => s.openIncarnateModal);
  const closeIncarnateModal = useUIStore((s) => s.closeIncarnateModal);

  // Handle migration case where incarnates might be undefined for old builds
  const incarnates = incarnatesRaw || createEmptyIncarnateBuildState();

  const isLevel50 = build.level >= INCARNATE_REQUIRED_LEVEL;
  const slots = getAllIncarnateSlots();

  // Count filled slots (safely handle undefined incarnates)
  const filledSlotCount = INCARNATE_SLOT_ORDER.filter((id) => incarnates?.[id] !== null).length;

  return (
    <>
      <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-2">
        <div className="flex items-center gap-4">
          {/* Title */}
          <div className="flex flex-col">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              Incarnate Powers
            </div>
            <div className="text-[10px] text-gray-500">
              {isLevel50 ? `${filledSlotCount}/6 slots filled` : 'Requires Level 50'}
            </div>
          </div>

          {/* Slot buttons */}
          <div className="flex-1 flex items-center justify-center gap-3">
            {slots.map((slot) => (
              <IncarnateSlotButton
                key={slot.id}
                slotId={slot.id}
                slotName={slot.displayName}
                selectedPower={incarnates?.[slot.id] || null}
                disabled={!isLevel50}
                onClick={() => openIncarnateModal(slot.id)}
              />
            ))}
          </div>

          {/* Clear all button */}
          {isLevel50 && filledSlotCount > 0 && (
            <button
              onClick={() => {
                const store = useBuildStore.getState();
                store.clearAllIncarnates();
              }}
              className="text-xs text-gray-500 hover:text-red-400 transition-colors px-2 py-1"
              title="Clear all incarnate powers"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      <IncarnateModal isOpen={incarnateModalOpen} onClose={closeIncarnateModal} />
    </>
  );
}
