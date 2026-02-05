/**
 * SlotContextMenu - Touch-friendly context menu for enhancement slots
 *
 * Shows relevant actions based on slot state (filled/empty, removable/not)
 */

import { useEffect, useRef } from 'react';

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

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Small delay to prevent immediate close from the triggering touch
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Adjust position to keep menu on screen
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const menu = menuRef.current;
    const rect = menu.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust if menu goes off right edge
    if (rect.right > viewportWidth - 10) {
      menu.style.left = `${viewportWidth - rect.width - 10}px`;
    }

    // Adjust if menu goes off bottom edge
    if (rect.bottom > viewportHeight - 10) {
      menu.style.top = `${position.y - rect.height - 10}px`;
    }
  }, [isOpen, position]);

  if (!isOpen) return null;

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[9999] bg-slate-800 border border-slate-600 rounded-lg shadow-xl py-1 min-w-[180px]"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      {/* Always show option to add/change enhancement */}
      <button
        onClick={() => handleAction(onOpenPicker)}
        className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
      >
        <span className="text-blue-400">+</span>
        {hasFill ? 'Change Enhancement' : 'Add Enhancement'}
      </button>

      {/* Show remove enhancement if slot has one */}
      {hasFill && (
        <button
          onClick={() => handleAction(onClearEnhancement)}
          className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
        >
          <span className="text-red-400">-</span>
          Remove Enhancement
        </button>
      )}

      {/* Show remove slot if it's not the first slot */}
      {canRemoveSlot && (
        <button
          onClick={() => handleAction(onRemoveSlot)}
          className="w-full px-3 py-2 text-left text-sm text-slate-200 hover:bg-slate-700 flex items-center gap-2"
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
        className="w-full px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-700 hover:text-slate-200 flex items-center gap-2"
      >
        <span className="text-red-400/70">--</span>
        Clear All Enhancements
      </button>

      <button
        onClick={() => handleAction(onRemoveAllSlots)}
        className="w-full px-3 py-2 text-left text-sm text-slate-400 hover:bg-slate-700 hover:text-slate-200 flex items-center gap-2"
      >
        <span className="text-orange-400/70">xx</span>
        Remove All Extra Slots
      </button>

      {/* Cancel button for easy dismissal on mobile */}
      <div className="border-t border-slate-600 mt-1 pt-1">
        <button
          onClick={onClose}
          className="w-full px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-700 hover:text-slate-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default SlotContextMenu;
