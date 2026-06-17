/**
 * ViewModeToggle - Segmented control for switching between power view modes
 */

import { useUIStore, usePowerViewMode } from '@/stores/uiStore';

interface ViewModeToggleProps {
  className?: string;
}

export function ViewModeToggle({ className = '' }: ViewModeToggleProps) {
  const powerViewMode = usePowerViewMode();
  const setPowerViewMode = useUIStore((state) => state.setPowerViewMode);

  const btnBase =
    'flex flex-1 sm:flex-none items-center justify-center gap-1 px-2 py-1 text-xs font-medium transition-colors whitespace-nowrap';
  const activeCls = 'bg-[var(--color-selected)] text-[var(--color-selected-fg)]';
  const inactiveCls = 'text-slate-300 hover:text-white hover:bg-slate-700';

  return (
    <div
      className={`inline-flex items-center overflow-hidden rounded bg-slate-800 border border-slate-600 ${className}`}
      role="radiogroup"
      aria-label="Power layout"
    >
      <button
        type="button"
        role="radio"
        aria-checked={powerViewMode === 'category'}
        onClick={() => setPowerViewMode('category')}
        className={`${btnBase} rounded-l ${powerViewMode === 'category' ? activeCls : inactiveCls}`}
        title="Group powers by powerset (Primary / Secondary / Pools / Epic)"
      >
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {/* Grid icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
        <span>By Powerset</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={powerViewMode === 'chronological'}
        onClick={() => setPowerViewMode('chronological')}
        className={`${btnBase} rounded-r ${powerViewMode === 'chronological' ? activeCls : inactiveCls}`}
        title="List powers by the level you take them (Mids-style)"
      >
        <svg
          className="w-3.5 h-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          {/* List icon */}
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span>By Level</span>
      </button>
    </div>
  );
}

export default ViewModeToggle;
