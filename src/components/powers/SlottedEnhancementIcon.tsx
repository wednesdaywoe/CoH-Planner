/**
 * SlottedEnhancementIcon component - renders the appropriate icon for a slotted enhancement
 */

import type { Enhancement, IOSetEnhancement, GenericIOEnhancement, OriginEnhancement, SpecialEnhancement } from '@/types';
import {
  IOSetIcon,
  GenericIOIcon,
  OriginEnhancementIcon,
  SpecialEnhancementIcon,
} from '@/components/enhancements/EnhancementIcon';
import { getEnhancementOutline } from '@/utils/enhancement-outline';

interface SlottedEnhancementIconProps {
  enhancement: Enhancement;
  size?: number;
}

/**
 * Boost level badge overlay - small circle with the boost number
 */
function BoostBadge({ boost, size }: { boost: number; size: number }) {
  if (!boost || boost <= 0) return null;
  const badgeSize = size <= 16 ? 8 : size <= 20 ? 10 : 12;
  const fontSize = size <= 16 ? 5 : size <= 20 ? 6 : 7;
  return (
    <div
      className="absolute -bottom-0.5 -left-0.5 rounded-full bg-green-600 border border-gray-900 flex items-center justify-center pointer-events-none z-10"
      style={{ width: badgeSize, height: badgeSize }}
    >
      <span className="text-white font-bold leading-none" style={{ fontSize }}>
        {boost}
      </span>
    </div>
  );
}

/**
 * Renders the appropriate enhancement icon based on type
 */
export function SlottedEnhancementIcon({ enhancement, size = 20 }: SlottedEnhancementIconProps) {
  const boost = enhancement.boost || 0;

  switch (enhancement.type) {
    case 'io-set': {
      const ioSet = enhancement as IOSetEnhancement;
      // Extract icon filename from the full path if needed
      const iconName = ioSet.icon?.includes('/')
        ? ioSet.icon.split('/').pop() || 'Unknown.png'
        : ioSet.icon || 'Unknown.png';

      const outline = getEnhancementOutline(
        { name: ioSet.name, proc: ioSet.isProc, unique: ioSet.isUnique },
        ioSet.setName,
      );
      const dotSize = size <= 20 ? 5 : 7;

      return (
        <div className="relative">
          <IOSetIcon
            icon={iconName}
            attuned={ioSet.attuned}
            size={size}
            alt={enhancement.name}
          />
          {outline.show && (
            <div
              className="absolute -top-0.5 right-0.5 rounded-full border border-gray-900 pointer-events-none"
              style={{
                width: dotSize,
                height: dotSize,
                background: outline.secondaryColor
                  ? `linear-gradient(135deg, ${outline.color} 50%, ${outline.secondaryColor} 50%)`
                  : outline.color,
              }}
            />
          )}
          <BoostBadge boost={boost} size={size} />
        </div>
      );
    }
    case 'io-generic': {
      const generic = enhancement as GenericIOEnhancement;
      return (
        <div className="relative">
          <GenericIOIcon
            stat={generic.stat}
            size={size}
            alt={enhancement.name}
          />
          <BoostBadge boost={boost} size={size} />
        </div>
      );
    }
    case 'origin': {
      const origin = enhancement as OriginEnhancement;
      return (
        <div className="relative">
          <OriginEnhancementIcon
            stat={origin.stat}
            tier={origin.tier}
            origin={origin.origin}
            size={size}
            alt={enhancement.name}
          />
          <BoostBadge boost={boost} size={size} />
        </div>
      );
    }
    case 'special': {
      const special = enhancement as SpecialEnhancement;
      // Extract icon filename from the full path if needed
      const iconName = special.icon?.includes('/')
        ? special.icon.split('/').pop() || 'Unknown.png'
        : special.icon || 'Unknown.png';
      return (
        <div className="relative">
          <SpecialEnhancementIcon
            icon={iconName}
            size={size}
            alt={enhancement.name}
          />
          <BoostBadge boost={boost} size={size} />
        </div>
      );
    }
    default:
      return (
        <img
          src="/img/Unknown.png"
          alt="Unknown enhancement"
          className="w-full h-full object-cover"
        />
      );
  }
}
