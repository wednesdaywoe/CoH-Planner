/**
 * WelcomeModal - Shows recent changes on first visit or version update
 */

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { APP_VERSION } from '@/buildTime';
import { getRecentChanges } from '@/data/changelog';

type ChangeStatus = 'known-bug' | 'fixed' | 'planned' | 'in-progress' | 'new';

function StatusBadge({ status }: { status: ChangeStatus }) {
  const config = {
    'known-bug': { label: 'Bug', className: 'bg-red-900/50 text-red-300 border-red-700/50' },
    'fixed': { label: 'Fixed', className: 'bg-green-900/50 text-green-300 border-green-700/50' },
    'planned': { label: 'Planned', className: 'bg-blue-900/50 text-blue-300 border-blue-700/50' },
    'in-progress': { label: ' ⚙️ ', className: 'bg-amber-900/50 text-amber-300 border-amber-700/50' },
    'new': { label: 'New', className: 'bg-purple-900/50 text-purple-300 border-purple-700/50' },
  };
  const { label, className } = config[status];
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${className}`}>
      {label}
    </span>
  );
}

const STORAGE_KEY = 'coh-planner-welcome-dismissed';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const openChangelogModal = useUIStore((s) => s.openChangelogModal);
  const openControlsModal = useUIStore((s) => s.openControlsModal);
  const { date: changesDate, items: recentChanges } = getRecentChanges();
  const formattedDate = changesDate
    ? new Date(changesDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, APP_VERSION);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} showCloseButton={false} size="lg">
      <ModalHeader className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-100">What's New in Sidekick</h2>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 whitespace-nowrap">v{APP_VERSION}{formattedDate ? ` — ${formattedDate}` : ''}</span>
          <button
            onClick={handleClose}
            className="p-1 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <div className="bg-amber-900/30 border-2 border-amber-500/60 rounded-lg p-4 text-sm text-gray-200 leading-relaxed">
            <p className="text-center text-amber-400 font-bold mb-2">!!! PLEASE READ !!!</p>
            <p>
              If you have a question and would like a response, please contact{' '}
              <a
                href="https://discord.com/channels/@me/570068130320220172"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline hover:text-amber-100"
              >
                WW on Discord
              </a>
              , message{' '}
              <a
                href="https://www.reddit.com/message/compose/?to=wednesdaywoe13"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline hover:text-amber-100"
              >
                WW on Reddit
              </a>
              {' '}or join the{' '}
              <a
                href="https://discord.gg/cGrUAanm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 underline hover:text-amber-100"
              >
                Sidekick Discord channel
              </a>
              . I'm not able to respond to questions submitted through the reporting tool.
            </p>
          </div>

          <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4 text-xs text-purple-200 leading-relaxed space-y-2">
            <p>
              Thank you for helping test Sidekick Beta! Your feedback is invaluable in improving this planner. I push updates frequently, so if you encounter bugs, issues,
              or have suggestions for features, please reach out through the contact methods above.
            </p>
            <p>
              Thank you for your patience and support! Especially your patience. CoH is complicated 😅  -WW
            </p>
          </div>

          <p className="text-gray-300 text-sm">
            <span className="text-[#D62BCE] font-semibold">Sidekick</span>{' '}
            <span className="text-amber-400 font-semibold">is in active beta development, so please be patient with bugs and errors.</span>
            {' '}Here's what's been updated{formattedDate ? ` on ${formattedDate}` : ' recently'}:
          </p>

          {/* Recent Changes */}
          <ul className="space-y-2">
            {recentChanges.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
                <StatusBadge status={item.status} />
                <span>{item.text}</span>
              </li>
            ))}
          </ul>

          {/* Links */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => { handleClose(); openChangelogModal(); }}
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-cyan-600/50 transition-colors text-center"
            >
              <svg className="w-5 h-5 text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-xs font-medium text-cyan-400 leading-tight">Full Changelog</span>
            </button>
            <button
              type="button"
              onClick={() => { handleClose(); openControlsModal(); }}
              className="flex flex-col items-center justify-center gap-1.5 p-3 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 hover:border-cyan-600/50 transition-colors text-center"
            >
              <span className="text-xl font-bold text-cyan-400 leading-none">?</span>
              <span className="text-xs font-medium text-cyan-400 leading-tight">Controls & Help</span>
            </button>
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <label className="flex items-center gap-2 mr-auto text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-900"
          />
          Don't show this again
        </label>
        <Button onClick={handleClose}>
          Got it!
        </Button>
      </ModalFooter>
    </Modal>
  );
}

/**
 * Hook to manage welcome modal visibility
 * Returns [isOpen, close] - modal auto-opens on first visit
 */
export function useWelcomeModal(): [boolean, () => void] {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed !== APP_VERSION) {
      // Small delay to let the app render first
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => setIsOpen(false);

  return [isOpen, close];
}
