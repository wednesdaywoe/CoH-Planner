/**
 * Badge component for labels, tags, and status indicators
 */

import type { ReactNode } from 'react';

export type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'purple'
  | 'cyan';

export type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-700 text-gray-300',
  primary: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
  success: 'bg-green-600/20 text-green-400 border-green-600/30',
  warning: 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  danger: 'bg-red-600/20 text-red-400 border-red-600/30',
  purple: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  cyan: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
};

export function Badge({
  variant = 'default',
  size = 'sm',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        font-medium rounded border
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/**
 * Rarity badge for IO sets
 */
export type IOSetRarityType = 'io-set' | 'purple' | 'ato' | 'pvp' | 'event';

const rarityClasses: Record<IOSetRarityType, string> = {
  'io-set': 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30',
  purple: 'bg-purple-600/20 text-purple-400 border-purple-600/30',
  ato: 'bg-orange-600/20 text-orange-400 border-orange-600/30',
  pvp: 'bg-red-600/20 text-red-400 border-red-600/30',
  event: 'bg-cyan-600/20 text-cyan-400 border-cyan-600/30',
};

const rarityLabels: Record<IOSetRarityType, string> = {
  'io-set': 'IO Set',
  purple: 'Purple',
  ato: 'ATO',
  pvp: 'PvP',
  event: 'Event',
};

interface RarityBadgeProps {
  rarity: IOSetRarityType;
  size?: BadgeSize;
  className?: string;
}

export function RarityBadge({ rarity, size = 'sm', className = '' }: RarityBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        font-medium rounded border
        ${rarityClasses[rarity]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {rarityLabels[rarity]}
    </span>
  );
}
