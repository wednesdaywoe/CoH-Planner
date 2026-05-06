/**
 * Toast — transient notification rendered bottom-right (above the floating
 * action buttons on desktop). Driven by uiStore.toasts.
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUIStore, type Toast } from '@/stores/uiStore';

const TONE_STYLES: Record<NonNullable<Toast['tone']>, string> = {
  info: 'bg-slate-800 border-blue-500/60 text-slate-100',
  success: 'bg-slate-800 border-emerald-500/60 text-slate-100',
  warning: 'bg-slate-800 border-amber-500/60 text-slate-100',
};

const TONE_ICON: Record<NonNullable<Toast['tone']>, string> = {
  info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  success: 'M5 13l4 4L19 7',
  warning: 'M12 9v2m0 4h.01M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 00-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3z',
};

const TONE_ICON_COLOR: Record<NonNullable<Toast['tone']>, string> = {
  info: 'text-blue-400',
  success: 'text-emerald-400',
  warning: 'text-amber-400',
};

function ToastItem({ toast }: { toast: Toast }) {
  const dismiss = useUIStore((s) => s.dismissToast);
  const tone = toast.tone ?? 'info';
  const duration = toast.durationMs ?? 8000;

  useEffect(() => {
    if (duration <= 0) return;
    const t = window.setTimeout(() => dismiss(toast.id), duration);
    return () => window.clearTimeout(t);
  }, [duration, dismiss, toast.id]);

  const handleAction = () => {
    if (!toast.action) return;
    const result = toast.action.onClick();
    if (result !== false) dismiss(toast.id);
  };

  return (
    <div
      role="status"
      className={`pointer-events-auto flex items-start gap-3 max-w-sm pl-3 pr-2 py-2.5 rounded-lg border shadow-xl backdrop-blur-sm ${TONE_STYLES[tone]}`}
      style={{ animation: 'toastIn 200ms ease-out' }}
    >
      <svg
        className={`w-5 h-5 shrink-0 mt-0.5 ${TONE_ICON_COLOR[tone]}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={TONE_ICON[tone]} />
      </svg>
      <div className="flex-1 text-sm leading-snug pt-0.5">{toast.message}</div>
      {toast.action && (
        <button
          onClick={handleAction}
          className="shrink-0 px-2.5 py-1 text-xs font-medium rounded bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          {toast.action.label}
        </button>
      )}
      <button
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss"
        className="shrink-0 p-1 -mr-1 text-slate-400 hover:text-slate-100 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useUIStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed z-[60] pointer-events-none flex flex-col-reverse gap-2"
      // Anchored bottom-right, sitting above the floating help / feedback /
      // coffee buttons (~h-9 buttons + ~16px padding). Bumped up enough to
      // clear the mobile bottom nav too.
      style={{ bottom: 72, right: 16, maxWidth: 'calc(100vw - 32px)' }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>,
    document.body
  );
}
