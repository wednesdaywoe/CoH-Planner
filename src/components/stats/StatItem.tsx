/**
 * StatItem component - displays a single stat with optional breakdown
 */

import { Tooltip } from '@/components/ui';

export type StatCategory =
  | 'damage'
  | 'accuracy'
  | 'recharge'
  | 'endurance'
  | 'defense'
  | 'resistance'
  | 'health'
  | 'movement'
  | 'mez';

interface StatItemProps {
  label: string;
  value: number;
  unit?: string;
  category?: StatCategory;
  breakdown?: { source: string; value: number }[];
  cap?: number;
  className?: string;
}

export function StatItem({
  label,
  value,
  unit = '%',
  category,
  breakdown,
  cap,
  className = '',
}: StatItemProps) {
  const colorClass = category ? getCategoryColor(category) : 'text-gray-300';
  const isCapped = cap && value >= cap;

  const content = (
    <div className={`flex items-center justify-between ${className}`}>
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-sm font-medium ${isCapped ? 'text-yellow-400' : colorClass}`}>
        {formatValue(value, unit)}
        {isCapped && ' (capped)'}
      </span>
    </div>
  );

  if (breakdown && breakdown.length > 0) {
    return (
      <Tooltip
        content={
          <StatBreakdown
            label={label}
            total={value}
            unit={unit}
            breakdown={breakdown}
            cap={cap}
          />
        }
        position="left"
      >
        {content}
      </Tooltip>
    );
  }

  return content;
}

interface StatBreakdownProps {
  label: string;
  total: number;
  unit: string;
  breakdown: { source: string; value: number }[];
  cap?: number;
}

function StatBreakdown({ label, total, unit, breakdown, cap }: StatBreakdownProps) {
  return (
    <div className="min-w-[180px]">
      <div className="font-medium text-white mb-2">{label} Breakdown</div>
      <div className="space-y-1">
        {breakdown.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-gray-400">{item.source}</span>
            <span className="text-gray-300">{formatValue(item.value, unit)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 mt-2 pt-2 flex justify-between text-sm font-medium">
        <span className="text-gray-300">Total</span>
        <span className="text-white">{formatValue(total, unit)}</span>
      </div>
      {cap && (
        <div className="text-xs text-gray-500 mt-1">
          Cap: {formatValue(cap, unit)}
        </div>
      )}
    </div>
  );
}

function formatValue(value: number, unit: string): string {
  if (unit === '%') {
    return `${value.toFixed(2)}%`;
  }
  if (unit === 's') {
    return `${value.toFixed(2)}s`;
  }
  return `${value}${unit}`;
}

function getCategoryColor(category: StatCategory): string {
  switch (category) {
    case 'damage':
      return 'text-red-400';
    case 'accuracy':
      return 'text-yellow-400';
    case 'recharge':
      return 'text-blue-400';
    case 'endurance':
      return 'text-cyan-400';
    case 'defense':
      return 'text-green-400';
    case 'resistance':
      return 'text-purple-400';
    case 'health':
      return 'text-green-300';
    case 'movement':
      return 'text-orange-400';
    case 'mez':
      return 'text-pink-400';
    default:
      return 'text-gray-300';
  }
}

/**
 * Stat bar with visual progress indicator
 */
interface StatBarProps {
  label: string;
  value: number;
  max: number;
  category?: StatCategory;
  className?: string;
}

export function StatBar({ label, value, max, category, className = '' }: StatBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const colorClass = category ? getBarColor(category) : 'bg-gray-500';

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="text-xs text-gray-300">
          {value.toFixed(2)}% / {max}%
        </span>
      </div>
      <div className="h-2 bg-gray-700 rounded overflow-hidden">
        <div
          className={`h-full ${colorClass} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function getBarColor(category: StatCategory): string {
  switch (category) {
    case 'damage':
      return 'bg-red-500';
    case 'accuracy':
      return 'bg-yellow-500';
    case 'recharge':
      return 'bg-blue-500';
    case 'endurance':
      return 'bg-cyan-500';
    case 'defense':
      return 'bg-green-500';
    case 'resistance':
      return 'bg-purple-500';
    case 'health':
      return 'bg-green-400';
    case 'movement':
      return 'bg-orange-500';
    case 'mez':
      return 'bg-pink-500';
    default:
      return 'bg-gray-500';
  }
}
