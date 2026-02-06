/**
 * PowerInfoModal - Mobile modal for displaying power information
 * Shows the InfoPanel content in a modal when info panel is locked on mobile
 */

import { useUIStore } from '@/stores';
import { InfoPanel } from '@/components/info/InfoPanel';
import { Modal } from './Modal';

export function PowerInfoModal() {
  const powerInfoModalOpen = useUIStore((s) => s.powerInfoModalOpen);
  const closePowerInfoModal = useUIStore((s) => s.closePowerInfoModal);
  const unlockInfoPanel = useUIStore((s) => s.unlockInfoPanel);

  const handleClose = () => {
    closePowerInfoModal();
    // Also unlock the info panel when closing the modal
    unlockInfoPanel();
  };

  return (
    <Modal
      isOpen={powerInfoModalOpen}
      onClose={handleClose}
      title="Power Info"
      size="lg"
      closeOnBackdrop={true}
      closeOnEscape={true}
    >
      <div className="overflow-y-auto p-4">
        <InfoPanel />
      </div>
    </Modal>
  );
}
