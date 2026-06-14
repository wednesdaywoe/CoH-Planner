/**
 * Toggle switch component
 */

import { forwardRef, type InputHTMLAttributes } from 'react';

// `primary` (the default) adopts the active theme accent; `warning` stays amber
// across themes for true caution toggles (e.g. Bonus Cap Alert) — see the
// three-color-family split in THEME-INTEGRATION-PLAN.md.
type ToggleVariant = 'primary' | 'warning';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  variant?: ToggleVariant;
}

// Tailwind needs full class names present in source for JIT to pick them up,
// so per-variant classes are spelled out rather than templated.
const TRACK_CHECKED: Record<ToggleVariant, string> = {
  primary: 'peer-checked:bg-[var(--color-primary)]',
  warning: 'peer-checked:bg-warning',
};
const FOCUS_RING: Record<ToggleVariant, string> = {
  primary: 'peer-focus:ring-[var(--color-ring)]',
  warning: 'peer-focus:ring-warning',
};

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className = '', checked, disabled, title, variant = 'primary', ...props }, ref) => {
    return (
      <label
        title={title}
        className={`
          inline-flex items-center gap-3 cursor-pointer
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
      >
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            checked={checked}
            disabled={disabled}
            {...props}
          />
          <div
            className={`
              w-10 h-5 rounded-full
              bg-gray-600
              ${TRACK_CHECKED[variant]}
              peer-focus:ring-2 ${FOCUS_RING[variant]} peer-focus:ring-offset-2 peer-focus:ring-offset-gray-900
              transition-colors duration-200
            `}
          />
          <div
            className={`
              absolute left-0.5 top-0.5
              w-4 h-4 rounded-full
              bg-white
              transition-transform duration-200
              peer-checked:translate-x-5
            `}
          />
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && <span className="text-sm font-medium text-gray-200">{label}</span>}
            {description && <span className="text-xs text-gray-400">{description}</span>}
          </div>
        )}
      </label>
    );
  }
);

Toggle.displayName = 'Toggle';
