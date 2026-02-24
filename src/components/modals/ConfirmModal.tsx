/**
 * ConfirmModal - replaces window.confirm() for reliable mobile support.
 * iOS Safari can silently suppress window.confirm(), making buttons appear
 * unresponsive. This modal works on all platforms.
 */

import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button } from '@/components/ui';

interface ConfirmModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary';
}

export function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title} size="sm">
      <ModalBody>
        <p className="text-sm text-gray-300">{message}</p>
      </ModalBody>
      <ModalFooter>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button variant={variant} size="sm" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </ModalFooter>
    </Modal>
  );
}
