/**
 * ChangelogModal - Shows full git commit history grouped by date.
 */

import { useMemo } from 'react';
import { Modal, ModalBody } from './Modal';
import { getChangelogByDate, CHANGELOG_ENTRIES, type ChangelogEntry } from '@/data/changelog';

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function TypeBadge({ type }: { type: ChangelogEntry['type'] }) {
  const config = {
    feat: { label: 'New', className: 'bg-purple-900/50 text-purple-300 border-purple-700/50' },
    fix: { label: 'Fix', className: 'bg-green-900/50 text-green-300 border-green-700/50' },
    update: { label: 'Update', className: 'bg-blue-900/50 text-blue-300 border-blue-700/50' },
    'known-issue': { label: 'Known Issue', className: 'bg-amber-900/50 text-amber-300 border-amber-700/50' },
  };
  const { label, className } = config[type] || config.update;
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border whitespace-nowrap ${className}`}>
      {label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

export function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
  const grouped = useMemo(() => getChangelogByDate(), []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Changelog (${CHANGELOG_ENTRIES.length} changes)`} size="lg">
      <ModalBody>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {[...grouped.entries()].map(([date, entries]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-700 pb-1 mb-2 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
                {formatDate(date)}
              </h3>
              <ul className="space-y-1.5 ml-1">
                {entries.map((entry) => (
                  <li key={entry.hash || entry.message} className="flex items-start gap-2 text-sm text-gray-400">
                    <TypeBadge type={entry.type} />
                    <span className="flex-1">{entry.message}</span>
                    {entry.hash && <code className="text-[10px] text-gray-600 font-mono mt-0.5">{entry.hash}</code>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {CHANGELOG_ENTRIES.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">No changelog entries available.</p>
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}
