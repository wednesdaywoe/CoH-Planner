/**
 * PowerColumn component - displays a list of powers in a column
 */

import type { ReactNode } from 'react';

interface PowerColumnProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  emptyMessage?: string;
  headerAction?: ReactNode;
  className?: string;
}

export function PowerColumn({
  title,
  subtitle,
  children,
  headerAction,
  className = '',
}: PowerColumnProps) {
  return (
    <div className={`flex flex-col h-full bg-gray-900/50 rounded-lg border border-gray-800 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800">
        <div>
          <h3 className="text-sm font-medium text-gray-200">{title}</h3>
          {subtitle && <span className="text-xs text-gray-500">{subtitle}</span>}
        </div>
        {headerAction}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {children}
      </div>
    </div>
  );
}

/**
 * Empty state for power columns
 */
interface PowerColumnEmptyProps {
  message: string;
  action?: ReactNode;
}

export function PowerColumnEmpty({ message, action }: PowerColumnEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center h-32 text-center">
      <p className="text-sm text-gray-500">{message}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
