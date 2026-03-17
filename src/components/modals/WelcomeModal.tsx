/**
 * WelcomeModal - Shows recent changes on first visit or version update
 */

import { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { APP_VERSION } from '@/buildTime';
import { getRecentChanges } from '@/data/changelog';
import { StatusBadge, renderTrackerText } from './KnownIssuesModal';

const STORAGE_KEY = 'coh-planner-welcome-dismissed';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const openKnownIssuesModal = useUIStore((s) => s.openKnownIssuesModal);
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
              One frequent request is better Mids importing, especially for very old files. The challenge is that Mids 
              spans decades of development, with inconsistent naming for archetypes, powers, and enhancements. There’s 
              no standard format, which makes importing unreliable.
            </p>
            <p>
              I’m improving the importer case by case, but with hundreds of named elements and variations
              across versions, it’s an enormous task. For players with large archives of old builds, keeping Mids
              installed will likely remain necessary.
            </p>
            <p>
              Sidekick isn’t meant to replace Mids—it’s meant to provide, IMHO, an essential CoH tool for those who can’t use it
              or run into technical issues.
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
                <span>{renderTrackerText(item.text)}</span>
              </li>
            ))}
          </ul>

          {/* Links */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 space-y-2">
            <p className="text-sm text-gray-300">
              <button
                type="button"
                onClick={() => { handleClose(); openChangelogModal(); }}
                className="text-cyan-400 underline hover:text-cyan-300 font-medium"
              >
                View Full Changelog
              </button>
              {' '} — complete history of all changes
            </p>
            <p className="text-sm text-gray-300">
              <button
                type="button"
                onClick={() => { handleClose(); openKnownIssuesModal(); }}
                className="text-cyan-400 underline hover:text-cyan-300 font-medium"
              >
                Known Issues & Roadmap
              </button>
              {' '} — tracked bugs and planned features
            </p>
            <p className="text-sm text-gray-300">
              <button
                type="button"
                onClick={() => { handleClose(); openControlsModal(); }}
                className="text-cyan-400 underline hover:text-cyan-300 font-medium"
              >
                Controls
              </button>
              {' '} — keyboard shortcuts and interactions
            </p>
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
