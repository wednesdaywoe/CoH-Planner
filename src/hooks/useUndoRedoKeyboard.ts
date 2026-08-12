/**
 * useUndoRedoKeyboard - Global keyboard shortcut for undo/redo
 *
 * Ctrl+Z → undo, Ctrl+Shift+Z / Ctrl+Y → redo
 * Skips when focus is in text inputs (lets browser handle native text undo).
 */

import { useEffect } from 'react';
import { undoBuild, redoBuild } from '@/utils/undo-redo';

export function useUndoRedoKeyboard() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      if (!isCtrlOrMeta) return;

      const isUndo = e.key === 'z' && !e.shiftKey;
      const isRedo = (e.key === 'z' && e.shiftKey) || (e.key === 'y' && !e.shiftKey);

      if (!isUndo && !isRedo) return;

      e.preventDefault();

      if (isUndo) undoBuild();
      else redoBuild();
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
