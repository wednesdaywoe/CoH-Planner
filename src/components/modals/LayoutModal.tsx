/**
 * LayoutModal — rearrange the planner's columns for the current view mode.
 *
 * Lives next to "Configure" in the dashboard toolbar so the feature is
 * discoverable (dragging column headers in the grid also reorders, but that's a
 * power-user affordance — this modal is the signposted home for it). Edits the
 * persisted `plannerLayout` slice live: reorder via up/down, show/hide via
 * checkbox, and Reset restores the view's default arrangement.
 */

import { useUIStore, usePowerViewMode } from '@/stores';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import type { PlannerSectionId } from '@/types';

const SECTION_LABELS: Record<PlannerSectionId, string> = {
  available: 'Available Powers',
  primary: 'Primary Powers',
  secondary: 'Secondary Powers',
  pool: 'Pool Powers',
  info: 'Power Info',
  bylevel: 'Powers by Level',
};

interface LayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LayoutModal({ isOpen, onClose }: LayoutModalProps) {
  const powerViewMode = usePowerViewMode();
  const view = powerViewMode === 'chronological' ? 'chronological' : 'category';
  const sections = useUIStore((s) => s.plannerLayout[view]);
  const reorder = useUIStore((s) => s.reorderPlannerSections);
  const setVisible = useUIStore((s) => s.setPlannerSectionVisible);
  const resetLayout = useUIStore((s) => s.resetPlannerLayout);
  const undocked = useUIStore((s) => s.infoPanel.undocked);

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    [next[index], next[target]] = [next[target], next[index]];
    reorder(view, next);
  };

  const visibleCount = sections.filter((s) => s.visible).length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Planner Layout" size="sm">
      <ModalBody className="p-0">
        <div className="px-4 py-2 bg-blue-900/30 border-b border-gray-700">
          <p className="text-sm text-blue-300">
            Arrange the planner columns for the{' '}
            <span className="font-semibold">{view === 'chronological' ? 'By Level' : 'By Powerset'}</span> view.
            <span className="text-gray-400 ml-1">({visibleCount}/{sections.length} shown)</span>
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            Desktop only. You can also drag a column&apos;s header to reorder.
          </p>
        </div>

        <ul className="p-3 space-y-1">
          {sections.map((s, i) => {
            const isInfoFloating = s.id === 'info' && undocked;
            return (
              <li
                key={s.id}
                className="flex items-center gap-2 rounded border border-gray-700 bg-gray-800/60 px-2 py-1.5"
              >
                {/* Reorder controls */}
                <div className="flex flex-col -my-1">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="text-gray-500 hover:text-gray-200 disabled:opacity-25 disabled:hover:text-gray-500 leading-none"
                    title="Move left"
                    aria-label={`Move ${SECTION_LABELS[s.id]} left`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === sections.length - 1}
                    className="text-gray-500 hover:text-gray-200 disabled:opacity-25 disabled:hover:text-gray-500 leading-none"
                    title="Move right"
                    aria-label={`Move ${SECTION_LABELS[s.id]} right`}
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                <span className="text-xs text-gray-500 tabular-nums w-4 text-center">{i + 1}</span>
                <span className="text-sm text-gray-200 flex-1">{SECTION_LABELS[s.id]}</span>

                {isInfoFloating && (
                  <span className="text-[10px] text-slate-500 uppercase tracking-wide">floating</span>
                )}

                <label
                  className={`flex items-center gap-1.5 text-xs cursor-pointer ${isInfoFloating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title={isInfoFloating ? 'Info panel is popped out — re-dock it to place it in the grid' : 'Show this column'}
                >
                  <input
                    type="checkbox"
                    checked={s.visible}
                    disabled={isInfoFloating}
                    onChange={(e) => setVisible(view, s.id, e.target.checked)}
                    className="accent-[var(--color-primary)]"
                  />
                  <span className="text-gray-400">Shown</span>
                </label>
              </li>
            );
          })}
        </ul>
      </ModalBody>

      <ModalFooter>
        <Button variant="ghost" onClick={() => resetLayout(view)}>
          Reset to Default
        </Button>
        <Button variant="primary" onClick={onClose}>
          Done
        </Button>
      </ModalFooter>
    </Modal>
  );
}
