/**
 * useUndoRedoKeyboard - Global keyboard shortcut for undo/redo
 *
 * Ctrl+Z → undo, Ctrl+Shift+Z / Ctrl+Y → redo
 * Skips when focus is in text inputs (lets browser handle native text undo).
 */

import { useEffect } from 'react';
import { useBuildStore } from '@/stores/buildStore';
import { useHistoryStore } from '@/stores/historyStore';

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

      const history = useHistoryStore.getState();
      const currentBuild = useBuildStore.getState().build;

      history.setRestoring(true);
      const restored = isUndo
        ? history.undo(currentBuild)
        : history.redo(currentBuild);
      if (restored) {
        useBuildStore.getState()._restoreBuild(restored);
      }
      history.setRestoring(false);
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);
}
