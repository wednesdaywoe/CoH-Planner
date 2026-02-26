/**
 * Modal component - generic modal wrapper with backdrop
 */

import { useEffect, useCallback, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-4xl',
};

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    },
    [closeOnEscape, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleEscape]);

  // Track where mousedown started to avoid closing when dragging from inside modal to backdrop
  const mouseDownTargetRef = useRef<EventTarget | null>(null);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent) => {
    mouseDownTargetRef.current = e.target;
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if both mousedown and mouseup happened on the backdrop itself
    if (closeOnBackdrop && e.target === e.currentTarget && mouseDownTargetRef.current === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onMouseDown={handleMouseDown}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        className={`
          w-full ${sizeClasses[size]}
          bg-gray-900 rounded-lg shadow-xl
          border border-gray-700
          max-h-[90vh] flex flex-col
          animate-in fade-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            {title && (
              <h2 id="modal-title" className="text-lg font-medium text-gray-100">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-white transition-colors rounded hover:bg-gray-700"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>,
    document.body
  );
}

/**
 * Modal header component for custom headers
 */
interface ModalHeaderProps {
  children: ReactNode;
  className?: string;
}

export function ModalHeader({ children, className = '' }: ModalHeaderProps) {
  return (
    <div className={`px-4 py-3 border-b border-gray-700 ${className}`}>{children}</div>
  );
}

/**
 * Modal body component
 */
interface ModalBodyProps {
  children: ReactNode;
  className?: string;
}

export function ModalBody({ children, className = '' }: ModalBodyProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

/**
 * Modal footer component
 */
interface ModalFooterProps {
  children: ReactNode;
  className?: string;
}

export function ModalFooter({ children, className = '' }: ModalFooterProps) {
  return (
    <div className={`px-4 py-3 border-t border-gray-700 flex justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}
