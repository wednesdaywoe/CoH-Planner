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

  return (
    <div
      className={`inline-flex rounded bg-slate-800 border border-slate-600 ${className}`}
      role="radiogroup"
      aria-label="Power view mode"
    >
      <button
        type="button"
        role="radio"
        aria-checked={powerViewMode === 'category'}
        onClick={() => setPowerViewMode('category')}
        className={`
          px-2 py-1 text-xs font-medium rounded-l transition-colors
          ${
            powerViewMode === 'category'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }
        `}
        title="Category view - powers grouped by type"
      >
        <svg
          className="w-4 h-4"
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
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={powerViewMode === 'chronological'}
        onClick={() => setPowerViewMode('chronological')}
        className={`
          px-2 py-1 text-xs font-medium rounded-r transition-colors
          ${
            powerViewMode === 'chronological'
              ? 'bg-blue-600 text-white'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }
        `}
        title="Chronological view - powers by level taken (Mids style)"
      >
        <svg
          className="w-4 h-4"
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
      </button>
    </div>
  );
}

export default ViewModeToggle;
