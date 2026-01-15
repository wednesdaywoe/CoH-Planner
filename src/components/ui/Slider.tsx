/**
 * Slider/range input component
 */

import { forwardRef, type InputHTMLAttributes } from 'react';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  showValue?: boolean;
  valueFormatter?: (value: number) => string;
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(
  (
    { label, showValue = true, valueFormatter, className = '', value, min, max, ...props },
    ref
  ) => {
    const displayValue = valueFormatter
      ? valueFormatter(Number(value))
      : String(value);

    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {(label || showValue) && (
          <div className="flex items-center justify-between">
            {label && <span className="text-sm font-medium text-gray-200">{label}</span>}
            {showValue && (
              <span className="text-sm text-gray-400">{displayValue}</span>
            )}
          </div>
        )}
        <input
          ref={ref}
          type="range"
          value={value}
          min={min}
          max={max}
          className={`
            w-full h-2
            bg-gray-700 rounded-full
            appearance-none cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:bg-blue-500
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:hover:bg-blue-400
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:bg-blue-500
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:hover:bg-blue-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
          `}
          {...props}
        />
        {min !== undefined && max !== undefined && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>{min}</span>
            <span>{max}</span>
          </div>
        )}
      </div>
    );
  }
);

Slider.displayName = 'Slider';
