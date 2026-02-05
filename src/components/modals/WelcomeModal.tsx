/**
 * WelcomeModal - Shows known issues and to-do list on first visit
 */

import { useState, useEffect } from 'react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';

const STORAGE_KEY = 'coh-planner-welcome-dismissed';
const CURRENT_VERSION = '0.1.3-alpha'; // Increment to show modal again after major updates

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}


const KNOWN_ISSUES = [
    'Titan/Hydra/D-Sync Origin Enhancements are not implemented',
    'Set level caps (Touch of Death, Miracle) not enforced',
];

const RECENT_CHANGES = [
  'Fixed Street Justice naming issue',
  'First pass at adding Epic ATs, expect bugs',
  'First pass with Archetype inherent powers, expect bugs',
  'Battle Agility: Added missing defense: { ranged, aoe } values',
  'Deflection: Added missing melee defense (only had psionic), fixed allowedEnhancements',
  'True Grit: Removed incorrect dotDamage, added maxHealth bonus, fixed allowedEnhancements',
  'Generic IO Values: Level 50 shows correct 42.4%',
  'Display Bug: Fixed 3560.0% tooltip display',
  'Sprint Categories: Corrected to only accept Running & Sprints and Universal Travel',
  'Added some UI support for mobile devices',
  'Added touch support for slot and enhancement drag operations',
];

const TODO_ITEMS = [
  'Add build sharing functionality',
  'Add data sets for Rebirth and Thunderspy',
  "Improve mobile experience and layout",
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
        <div className="space-y-6">
          {/* Introduction */}
          <p className="text-gray-300">
            This build planner is currently in <span className="text-amber-400 font-semibold">active development</span>.
            Some features may be incomplete or contain bugs. I'm Currently working a massive overhaul for data extraction to capture more properties and values accurately.'
          </p>

          {/* Recent Changes */}
          <div>
            <h3 className="text-lg font-semibold text-green-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Recent Changes
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-400">
              {RECENT_CHANGES.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">•</span>
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Known Issues */}
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Known Issues
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-400">
              {KNOWN_ISSUES.map((issue, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">•</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* To-Do List */}
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              Planned Features
            </h3>
            <ul className="space-y-1.5 text-sm text-gray-400">
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
              in the bottom-right corner to let me know! You can submit feedback anonymously.
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
