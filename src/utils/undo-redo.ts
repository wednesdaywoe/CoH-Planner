/**
 * Undo/redo, as one step.
 *
 * History snapshots the Build, so stepping is always the same three moves: flag the restore
 * (so the checkpoint helper doesn't record the step itself), swap the build, unflag. Every
 * caller that open-codes it is a chance for one of the three to go missing, and there are
 * three callers — the keyboard shortcut, the header buttons, and the toasts that offer to
 * take an action back.
 */

import { useBuildStore } from '@/stores/buildStore';
import { useHistoryStore } from '@/stores/historyStore';

function step(direction: 'undo' | 'redo'): void {
  const history = useHistoryStore.getState();
  const currentBuild = useBuildStore.getState().build;

  history.setRestoring(true);
  const restored = direction === 'undo' ? history.undo(currentBuild) : history.redo(currentBuild);
  if (restored) useBuildStore.getState()._restoreBuild(restored);
  history.setRestoring(false);
}

export const undoBuild = () => step('undo');
export const redoBuild = () => step('redo');
