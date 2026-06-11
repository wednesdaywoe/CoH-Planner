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
  /**
   * On narrow (mobile) screens, render edge-to-edge over the whole viewport —
   * including the bottom nav — instead of a centered card that reserves space
   * for the nav. Use for content-heavy pickers that should scroll vertically
   * only. Desktop behavior is unchanged.
   */
  mobileFullscreen?: boolean;
  /**
   * When false, the content area does NOT scroll itself — the child is expected
   * to manage its own single scroll region. Prevents a redundant outer
   * scrollbar (and the horizontal scrollbar `overflow-y-auto` implies) for
   * children that already have an internal `overflow-y-auto` pane. Default true.
   */
  scrollBody?: boolean;
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
  mobileFullscreen = false,
  scrollBody = true,
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

  // Backdrop: a centered card normally reserves space above the mobile bottom
  // nav (z-50). Fullscreen mode instead sits above the nav (z-[60]) and covers
  // it edge-to-edge so the picker reads as a single surface, not a layer that
  // leaves tappable nav showing through.
  const backdropClass = mobileFullscreen
    ? 'fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm max-lg:p-0 lg:p-4'
    : 'fixed inset-0 max-lg:bottom-[calc(56px+env(safe-area-inset-bottom))] z-40 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm';
  const cardClass = mobileFullscreen
    ? `w-full ${sizeClasses[size]} bg-gray-900 shadow-xl flex flex-col animate-in fade-in zoom-in-95 duration-200`
      + ' max-lg:max-w-none max-lg:h-full max-lg:max-h-none max-lg:rounded-none max-lg:border-0'
      + ' lg:rounded-lg lg:border lg:border-gray-700 lg:max-h-[90vh]'
    : `w-full ${sizeClasses[size]} bg-gray-900 rounded-lg shadow-xl border border-gray-700 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200`;

  return createPortal(
    <div
      className={backdropClass}
      onMouseDown={handleMouseDown}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={cardClass}>
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
        <div className={`flex-1 min-h-0 ${scrollBody ? 'overflow-y-auto' : 'overflow-hidden'}`}>{children}</div>
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
