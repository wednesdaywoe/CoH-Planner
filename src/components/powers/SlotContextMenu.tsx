/**
 * SlotContextMenu - Touch-friendly context menu for enhancement slots
 *
 * Shows relevant actions based on slot state (filled/empty, removable/not)
 */

import { useEffect, useRef, useState } from 'react';

export interface SlotContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
  // Slot state
  hasFill: boolean;
  canRemoveSlot: boolean;
  // Actions
  onOpenPicker: () => void;
  onClearEnhancement: () => void;
  onRemoveSlot: () => void;
  onClearAllEnhancements: () => void;
  onRemoveAllSlots: () => void;
}

export function SlotContextMenu({
  isOpen,
  onClose,
  position,
  hasFill,
  canRemoveSlot,
  onOpenPicker,
  onClearEnhancement,
  onRemoveSlot,
  onClearAllEnhancements,
  onRemoveAllSlots,
}: SlotContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [backdropActive, setBackdropActive] = useState(false);

  // Delay backdrop activation to prevent immediate close from touchend
  useEffect(() => {
    if (!isOpen) {
      setBackdropActive(false);
      return;
    }

    // Wait for user to lift finger before activating backdrop
    const timer = setTimeout(() => {
      setBackdropActive(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [isOpen]);

  // Adjust position to keep menu on screen
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let newLeft = position.x;
    let newTop = position.y;

    // Adjust if menu goes off right edge
    if (rect.right > viewportWidth - 10) {
      newLeft = viewportWidth - rect.width - 10;
    }
    // Adjust if menu goes off left edge
    if (newLeft < 10) {
      newLeft = 10;
    }

    // Adjust if menu goes off bottom edge
    if (rect.bottom > viewportHeight - 10) {
      newTop = position.y - rect.height - 10;
    }
    // Adjust if menu goes off top edge
    if (newTop < 10) {
      newTop = 10;
    }

    menu.style.left = `${newLeft}px`;
    menu.style.top = `${newTop}px`;
  }, [isOpen, position]);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  // Prevent touch events on the menu from bubbling
  const stopPropagation = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <>
      {/* Backdrop to catch outside clicks/touches */}
      <div
        className="fixed inset-0 z-[9998]"
        onClick={backdropActive ? onClose : undefined}
        onTouchEnd={
          backdropActive
            ? (e) => {
                e.preventDefault();
                onClose();
              }
            : undefined
        }
      />

      {/* Menu */}
      <div
        ref={menuRef}
        className="fixed z-[9999] bg-slate-800 border border-slate-600 rounded-lg shadow-xl py-1 min-w-[180px]"
        style={{
          left: position.x,
          top: position.y,
        }}
        onClick={stopPropagation}
        onTouchEnd={stopPropagation}
      >
        {/* Always show option to add/change enhancement */}
        <button
          onClick={() => handleAction(onOpenPicker)}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAction(onOpenPicker);
          }}
          className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 active:bg-slate-600 flex items-center gap-2"
        >
          <span className="text-blue-400">+</span>
          {hasFill ? 'Change Enhancement' : 'Add Enhancement'}
        </button>

        {/* Show remove enhancement if slot has one */}
        {hasFill && (
          <button
            onClick={() => handleAction(onClearEnhancement)}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAction(onClearEnhancement);
            }}
            className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 active:bg-slate-600 flex items-center gap-2"
          >
            <span className="text-red-400">-</span>
            Remove Enhancement
          </button>
        )}

        {/* Show remove slot if it's not the first slot */}
        {canRemoveSlot && (
          <button
            onClick={() => handleAction(onRemoveSlot)}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleAction(onRemoveSlot);
            }}
            className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 active:bg-slate-600 flex items-center gap-2"
          >
            <span className="text-orange-400">x</span>
            Remove Slot
          </button>
        )}

        {/* Divider for bulk actions */}
        <div className="border-t border-slate-600 my-1" />

        {/* Bulk actions */}
        <button
          onClick={() => handleAction(onClearAllEnhancements)}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAction(onClearAllEnhancements);
          }}
          className="w-full px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-700 active:bg-slate-600 hover:text-slate-200 flex items-center gap-2"
        >
          <span className="text-red-400/70">--</span>
          Clear All Enhancements
        </button>

        <button
          onClick={() => handleAction(onRemoveAllSlots)}
          onTouchEnd={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAction(onRemoveAllSlots);
          }}
          className="w-full px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-700 active:bg-slate-600 hover:text-slate-200 flex items-center gap-2"
        >
          <span className="text-orange-400/70">xx</span>
          Remove All Extra Slots
        </button>

        {/* Cancel button for easy dismissal on mobile */}
        <div className="border-t border-slate-600 mt-1 pt-1">
          <button
            onClick={onClose}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="w-full px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-700 active:bg-slate-600 hover:text-slate-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}

export default SlotContextMenu;
