/**
 * Attack Chain Builder announcement — a feature spotlight shown on load until
 * the user opts out. Closing it hides it for the session; checking "Don't show
 * this again" persists the dismissal (uiStore.attackChainAnnounceDismissed) so
 * it never returns. Self-managing, like WelcomeModal — render it once.
 */

import { useState } from 'react';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';
import { useUIStore } from '@/stores';
import { resolvePath } from '@/utils/paths';

export function AttackChainAnnounceModal() {
  const dismissed = useUIStore((s) => s.attackChainAnnounceDismissed);
  const dismiss = useUIStore((s) => s.dismissAttackChainAnnounce);
  const openChain = useUIStore((s) => s.openAttackChainModal);

  // `visible` lets a plain close hide it for THIS session; the persisted
  // `dismissed` flag is what keeps it from coming back on reload.
  const [visible, setVisible] = useState(true);
  const [dontShow, setDontShow] = useState(false);

  if (dismissed) return null;

  const close = () => {
    if (dontShow) dismiss();
    setVisible(false);
  };
  const tryIt = () => {
    if (dontShow) dismiss();
    setVisible(false);
    openChain();
  };

  return (
    <Modal isOpen={visible} onClose={close} size="lg" showCloseButton={false}>
      <ModalBody>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded border bg-purple-900/50 text-purple-300 border-purple-700/50">
              New
            </span>
            <h2 className="text-lg font-medium text-gray-100">Try the new Attack Chain Builder 😎</h2>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Add your attacks onto a timeline to see your rotation&apos;s DPS, dead time, and
            check your endurance burn against your recovery. Open it any time from the{' '}
            <span className="text-gray-100 font-medium">Attack Chain</span> button on the dashboard.
          </p>
          <img
            src={resolvePath('/chainbuilder.png')}
            alt="Attack Chain Builder preview"
            className="w-full rounded-lg border border-gray-700"
          />
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
          Don&apos;t show this again
        </label>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={close}>
            Maybe later
          </Button>
          <Button variant="primary" onClick={tryIt}>
            Try it now
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
