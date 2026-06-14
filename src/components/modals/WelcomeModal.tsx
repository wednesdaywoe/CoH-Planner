/**
 * WelcomeModal - Shows recent changes; opened from the update banner's "learn more" link.
 */

import { Modal, ModalHeader, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { APP_VERSION } from '@/buildTime';
import { getRecentChanges } from '@/data/changelog';

type ChangeStatus = 'known-bug' | 'fixed' | 'planned' | 'in-progress' | 'new';

function StatusBadge({ status }: { status: ChangeStatus }) {
  const config = {
    'known-bug': { label: 'Bug', className: 'bg-[var(--color-danger)]/30 text-[var(--color-danger-fg)] border-[var(--color-danger)]/50' },
    'fixed': { label: 'Fixed', className: 'bg-[var(--color-success)]/30 text-[var(--color-success-fg)] border-[var(--color-success)]/50' },
    'planned': { label: 'Planned', className: 'bg-[var(--color-info)]/30 text-[var(--color-info-fg)] border-[var(--color-info)]/50' },
    'in-progress': { label: ' ⚙️ ', className: 'bg-[var(--color-warning)]/30 text-[var(--color-warning-fg)] border-[var(--color-warning)]/50' },
    'new': { label: 'New', className: 'bg-purple-900/50 text-purple-300 border-purple-700/50' },
  };
  const { label, className } = config[status];
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${className}`}>
      {label}
    </span>
  );
}

export function WelcomeModal() {
  const isOpen = useUIStore((s) => s.welcomeModalOpen);
  const handleClose = useUIStore((s) => s.closeWelcomeModal);
  const openChangelogModal = useUIStore((s) => s.openChangelogModal);
  const openControlsModal = useUIStore((s) => s.openControlsModal);
  const { date: changesDate, items: recentChanges } = getRecentChanges();
  const formattedDate = changesDate
    ? new Date(changesDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    : '';

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
                href="https://discord.gg/Tf2nkeqcFy"
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
        <Button onClick={handleClose}>
          Got it!
        </Button>
      </ModalFooter>
    </Modal>
  );
}
