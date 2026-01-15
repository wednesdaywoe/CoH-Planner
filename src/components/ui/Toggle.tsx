/**
 * Toggle switch component
 */

import { forwardRef, type InputHTMLAttributes } from 'react';

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ label, description, className = '', checked, disabled, ...props }, ref) => {
    return (
      <label
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
              peer-checked:bg-blue-600
              peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-focus:ring-offset-gray-900
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
