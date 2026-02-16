/**
 * WelcomeModal - Shows known issues and to-do list on first visit
 */

import { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';

const STORAGE_KEY = 'coh-planner-welcome-dismissed';
const CURRENT_VERSION = '0.3.1-alpha'; // Increment to show modal again after major updates

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const KNOWN_ISSUES = [
  'Titan/Hydra/D-Sync Origin Enhancements are not implemented',
  'Set level caps (Touch of Death, Miracle) not enforced',
];

const RECENT_CHANGES = [
  "Update to incorporate power updates in Issue 28, Page 3, Panel 2",
  'Fix: Toggle/Auto powers with recharge buffs (Chronoshift, etc.) now properly apply to global recharge stats',
  'Fix: Luck of the Gambler and Gift of the Ancients global procs now correctly apply their bonuses',
  'Fix: Flight pool powers (Group Fly, Evasive Maneuvers) now unlock after selecting two of the first three powers',
  'Fix: Enhancement picker can now be reopened via left-click after using the context menu on a slot',
  'Fix: Enhancement slot limits are now level-aware instead of always using the level 50 cap',
];

const TODO_ITEMS = [
  'Add build sharing functionality',
  'Add data sets for Rebirth and Thunderspy',
  'Continue improving mobile experience',
];

export function WelcomeModal({ isOpen, onClose }: WelcomeModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
    }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Welcome to CoH Planner" size="lg">
      <ModalBody>
        <div className="space-y-5">
          {/* Welcome Message */}
          <p className="text-gray-300">
            Thank you for helping test <span className="text-[#D62BCE] font-semibold">Sidekick</span>! This build planner is in <span className="text-amber-400 font-semibold">active development</span>.
            Please expect bugs and incomplete features.
          </p>

          {/* How to Use */}
          <div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              How to Use
            </h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div>
                <span className="text-cyan-300 font-medium">Desktop (Mouse):</span>
                <ul className="mt-1 space-y-1 ml-4">
                  <li><span className="text-gray-300">Hover</span> over powers to see details in the info panel</li>
                  <li><span className="text-gray-300">Click</span> to select powers or open the enhancement picker</li>
                  <li><span className="text-gray-300">Right-click</span> on a power to lock its info in the panel</li>
                  <li><span className="text-gray-300">Right-click</span> on a slot to remove its enhancement (or remove the slot if empty)</li>
                  <li><span className="text-gray-300">Shift + Right-click</span> on a slot for bulk actions menu</li>
                  <li><span className="text-gray-300">Drag</span> the + button to add multiple slots at once</li>
                </ul>
              </div>
              <div>
                <span className="text-cyan-300 font-medium">Mobile (Touch):</span>
                <ul className="mt-1 space-y-1 ml-4">
                  <li><span className="text-gray-300">Tap</span> to select powers or open the enhancement picker</li>
                  <li><span className="text-gray-300">Long-press</span> on a power to view its info in the panel</li>
                  <li><span className="text-gray-300">Touch and hold</span> on a slot for action menu (add, remove, clear all)</li>
                  <li><span className="text-gray-300">Touch and drag</span> the + button to add multiple slots</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Known Issues */}
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Known Issues
            </h3>
            <ul className="space-y-1 text-sm text-gray-400">
              {KNOWN_ISSUES.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Updates */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recent Updates
            </h3>
            <ul className="space-y-1 text-sm text-gray-400">
              {RECENT_CHANGES.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Planned Features / Todo */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Todo
            </h3>
            <ul className="space-y-1 text-sm text-gray-400">
              {TODO_ITEMS.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Feedback note */}
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <p className="text-sm text-gray-300">
              Found a bug or have a suggestion? Use the{' '}
              <span className="text-purple-400 font-medium">Feedback/Bugs</span> button
              in the bottom-right corner to let me know!
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
    if (dismissed !== CURRENT_VERSION) {
      // Small delay to let the app render first
      const timer = setTimeout(() => setIsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => setIsOpen(false);

  return [isOpen, close];
}
