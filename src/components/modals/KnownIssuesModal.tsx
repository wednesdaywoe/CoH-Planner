/**
 * KnownIssuesModal - Shows known bugs, recent fixes, and planned features.
 * Users can check this before submitting a bug report.
 */

import { Modal, ModalBody } from './Modal';
import { KNOWN_BUGS, RECENT_CHANGES, PLANNED_FEATURES, type TrackerItem } from '@/data/tracker';

interface KnownIssuesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function StatusBadge({ status }: { status: TrackerItem['status'] }) {
  const config = {
    'known-bug': { label: 'Bug', className: 'bg-red-900/50 text-red-300 border-red-700/50' },
    'fixed': { label: 'Fixed', className: 'bg-green-900/50 text-green-300 border-green-700/50' },
    'planned': { label: 'Planned', className: 'bg-blue-900/50 text-blue-300 border-blue-700/50' },
    'in-progress': { label: 'In Progress', className: 'bg-amber-900/50 text-amber-300 border-amber-700/50' },
    'new': { label: 'New', className: 'bg-purple-900/50 text-purple-300 border-purple-700/50' },
  };
  const { label, className } = config[status];
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${className}`}>
      {label}
    </span>
  );
}

/** Replace [missing-icon] markers in tracker text with inline images */
function renderTrackerText(text: string): React.ReactNode {
  const marker = '[missing-icon]';
  const idx = text.indexOf(marker);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <img src="img/Unknown.png" alt="missing icon" className="inline-block h-5 w-5 align-text-bottom" />
      {text.slice(idx + marker.length)}
    </>
  );
}

function TrackerSection({
  title,
  icon,
  color,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  color: string;
  items: TrackerItem[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className={`text-lg font-semibold ${color} mb-2 flex items-center gap-2`}>
        {icon}
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2 text-sm text-gray-400">
            <StatusBadge status={item.status} />
            <span>{renderTrackerText(item.text)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function KnownIssuesModal({ isOpen, onClose }: KnownIssuesModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Known Issues & Roadmap" size="lg">
      <ModalBody>
        <div className="space-y-5">
          <p className="text-sm text-gray-400">
            Check here before submitting a bug report to see if your issue is already tracked.
          </p>

          {/* Known Bugs */}
          <TrackerSection
            title="Known Bugs"
            color="text-red-400"
            items={KNOWN_BUGS}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          />

          {/* Recent Fixes */}
          <TrackerSection
            title="Recent Changes"
            color="text-green-400"
            items={RECENT_CHANGES}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />

          {/* Planned Features */}
          <TrackerSection
            title="Planned Features"
            color="text-blue-400"
            items={PLANNED_FEATURES}
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            }
          />

          {/* Feedback note */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <p className="text-sm text-gray-300">
              Don't see your issue listed? Use the{' '}
              <span className="text-purple-400 font-medium">Feedback/Bugs</span> button
              to report it!
            </p>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
}
