/**
 * FeedbackModal - allows users to submit bug reports, suggestions, and general feedback.
 * Sends data to a Cloudflare Worker which forwards it as a formatted email via Resend.
 */

import { useState } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from './Modal';
import { Button } from '../ui/Button';
import { useBuildStore } from '@/stores/buildStore';

// Worker endpoint URL - update this after deploying the Cloudflare Worker
const FEEDBACK_API_URL = 'https://coh-planner-feedback.wedswoe.workers.dev';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type FeedbackType = 'bug' | 'suggestion' | 'other';
type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

const TYPE_CONFIG = {
  bug: {
    label: 'Bug Report',
    placeholder: 'Describe the bug. What happened? What did you expect to happen?',
    color: 'red',
  },
  suggestion: {
    label: 'Suggestion',
    placeholder: 'What feature or improvement would you like to see?',
    color: 'blue',
  },
  other: {
    label: 'Other',
    placeholder: 'Share your thoughts...',
    color: 'purple',
  },
} as const;

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('bug');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const build = useBuildStore((s) => s.build);

  const getBuildContext = () => {
    // Count total powers and slots across all sets
    let powerCount = 0;
    let slotCount = 0;

    const countPowers = (powers: Array<{ name: string; slots: unknown[] }>) => {
      for (const p of powers) {
        if (p.name) {
          powerCount++;
          slotCount += p.slots.filter(Boolean).length;
        }
      }
    };

    countPowers(build.primary.powers);
    countPowers(build.secondary.powers);
    for (const pool of build.pools) {
      countPowers(pool.powers);
    }
    if (build.epicPool) {
      countPowers(build.epicPool.powers);
    }

    return {
      archetype: build.archetype.name || 'None',
      level: build.level,
      primary: build.primary.name || 'None',
      secondary: build.secondary.name || 'None',
      pools: build.pools.map((p) => p.name).filter(Boolean),
      epicPool: build.epicPool?.name || null,
      powerCount,
      slotCount,
    };
  };

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setStatus('sending');
    setErrorMessage('');

    const payload = {
      type: feedbackType,
      description: description.trim(),
      email: email.trim() || undefined,
      buildContext: getBuildContext(),
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(FEEDBACK_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMessage(data.error || 'Failed to send feedback. Please try again.');
        setStatus('error');
      }
    } catch {
      setErrorMessage('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  const handleClose = () => {
    setFeedbackType('bug');
    setDescription('');
    setEmail('');
    setStatus('idle');
    setErrorMessage('');
    onClose();
  };

  const config = TYPE_CONFIG[feedbackType];
  const canSubmit = description.trim().length >= 10 && status !== 'sending' && status !== 'success';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" showCloseButton={true}>
      <ModalHeader>Feedback</ModalHeader>

      <ModalBody>
        {status === 'success' ? (
          <div className="bg-green-900/20 border border-green-700/50 rounded p-4 text-center">
            <p className="text-green-300 font-semibold text-lg mb-1">Thank you!</p>
            <p className="text-green-400/80 text-sm">Your feedback has been sent.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Type selector */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Feedback Type
              </label>
              <div className="flex gap-2">
                {(Object.entries(TYPE_CONFIG) as [FeedbackType, typeof TYPE_CONFIG[FeedbackType]][]).map(
                  ([type, cfg]) => {
                    const isActive = feedbackType === type;
                    const colorMap = {
                      red: isActive
                        ? 'bg-red-600/20 border-red-500 text-red-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300',
                      blue: isActive
                        ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300',
                      purple: isActive
                        ? 'bg-purple-600/20 border-purple-500 text-purple-300'
                        : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300',
                    };
                    return (
                      <button
                        key={type}
                        onClick={() => setFeedbackType(type)}
                        className={`flex-1 px-3 py-2 rounded border text-sm font-medium transition-colors ${colorMap[cfg.color]}`}
                      >
                        {cfg.label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={config.placeholder}
                className="w-full h-40 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                maxLength={5000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {description.length < 10
                  ? `Minimum 10 characters (${10 - description.length} more needed)`
                  : `${description.length}/5000`}
              </p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email <span className="text-gray-500 font-normal">(optional, for follow-up)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            {/* Build context (collapsed info) */}
            <div className="bg-gray-800 border border-gray-600 rounded p-3">
              <p className="text-xs text-gray-500 mb-1">
                The following build info will be included with your report:
              </p>
              <div className="text-xs text-gray-400 space-y-0.5">
                <p>
                  <span className="text-gray-500">Archetype:</span>{' '}
                  {build.archetype.name || 'None'} (Lv {build.level})
                </p>
                <p>
                  <span className="text-gray-500">Primary:</span>{' '}
                  {build.primary.name || 'None'}
                </p>
                <p>
                  <span className="text-gray-500">Secondary:</span>{' '}
                  {build.secondary.name || 'None'}
                </p>
                {build.pools.length > 0 && (
                  <p>
                    <span className="text-gray-500">Pools:</span>{' '}
                    {build.pools.map((p) => p.name).filter(Boolean).join(', ') || 'None'}
                  </p>
                )}
              </div>
            </div>

            {/* Error message */}
            {status === 'error' && errorMessage && (
              <div className="bg-red-900/20 border border-red-700/50 rounded p-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}
          </div>
        )}
      </ModalBody>

      {status !== 'success' && (
        <ModalFooter>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={!canSubmit}
              isLoading={status === 'sending'}
            >
              Send Feedback
            </Button>
          </div>
        </ModalFooter>
      )}
    </Modal>
  );
}
