/**
 * Tabbed feature-announcement spotlight ("What's New"). Auto-opens whenever the
 * ANNOUNCEMENTS registry has at least one entry the user hasn't dismissed,
 * defaulting to the newest unseen featurette. Each entry is a tab (newest
 * first), so the user can browse every spotlight in one place.
 *
 * Dismissal (keyed by id, persisted in uiStore.dismissedAnnouncements):
 *   - "Maybe later" / backdrop: hide for the session only — returns next load.
 *   - Clicking a featurette's CTA: marks THAT featurette seen and acts on it.
 *   - "Don't show these again": marks every listed featurette seen.
 *
 * Self-managing, like WelcomeModal — render it once. Adding a new spotlight is
 * data-only: see data/core/announcements.
 */

import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { resolvePath } from '@/utils/paths';
import { ANNOUNCEMENTS, type AnnouncementAction } from '@/data/core/announcements';

export function AnnouncementModal() {
  const dismissed = useUIStore((s) => s.dismissedAnnouncements);
  const dismiss = useUIStore((s) => s.dismissAnnouncement);
  const openChain = useUIStore((s) => s.openAttackChainModal);
  const navigate = useNavigate();

  // `visible` lets "Maybe later" hide it for THIS session; the persisted
  // dismissals (by id) keep seen featurettes from re-opening it on reload.
  const [visible, setVisible] = useState(true);
  const [dontShow, setDontShow] = useState(false);
  // Default to the newest featurette the user hasn't seen yet.
  const firstUnseen = Math.max(0, ANNOUNCEMENTS.findIndex((a) => !dismissed.includes(a.id)));
  const [activeIdx, setActiveIdx] = useState(firstUnseen);

  // Only auto-open when there's something new; once all are seen, stay closed.
  const hasUnseen = ANNOUNCEMENTS.some((a) => !dismissed.includes(a.id));
  if (!hasUnseen) return null;

  const active = ANNOUNCEMENTS[activeIdx] ?? ANNOUNCEMENTS[0];

  const runAction = (action: AnnouncementAction) => {
    if (action.kind === 'openModal' && action.modal === 'attackChain') openChain();
    else if (action.kind === 'navigate') navigate({ to: action.to });
  };

  const close = () => {
    if (dontShow) ANNOUNCEMENTS.forEach((a) => dismiss(a.id));
    setVisible(false);
  };
  // Engaging a featurette's CTA marks just that one seen, then acts on it.
  const act = () => {
    dismiss(active.id);
    setVisible(false);
    if (active.cta) runAction(active.cta.action);
  };

  return (
    <Modal isOpen={visible} onClose={close} size="lg" showCloseButton={false}>
      {/* Tab strip — newest first; a dot marks featurettes not yet seen */}
      <div className="flex gap-1 px-6 pt-5 border-b border-gray-700">
        {ANNOUNCEMENTS.map((a, i) => {
          const isActive = i === activeIdx;
          const unseen = !dismissed.includes(a.id);
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => setActiveIdx(i)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm border-b-2 -mb-px transition-colors ${
                isActive
                  ? 'text-gray-100 border-[var(--color-selected)]'
                  : 'text-gray-400 border-transparent hover:text-gray-200'
              }`}
            >
              {unseen && (
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-sk-magenta)]" aria-label="new" />
              )}
              {a.tabLabel}
            </button>
          );
        })}
      </div>

      <ModalBody>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {active.badge && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-purple-900/50 text-purple-300 border-purple-700/50">
                {active.badge}
              </span>
            )}
            <h2 className="text-lg font-medium text-gray-100">{active.title}</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">{active.body}</p>
          {active.image && (
            <img
              src={resolvePath(active.image)}
              alt=""
              className="w-full rounded-lg border border-gray-700"
            />
          )}
        </div>
      </ModalBody>
      <ModalFooter className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={dontShow}
            onChange={(e) => setDontShow(e.target.checked)}
            className="w-4 h-4 rounded border-gray-600 bg-gray-800 accent-purple-500"
          />
          Don&apos;t show these again
        </label>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={close}>
            Maybe later
          </Button>
          {active.cta && (
            <Button variant="primary" onClick={act}>
              {active.cta.label}
            </Button>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}
