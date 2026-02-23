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
 * Renders the appropriate enhancement icon based on type
 */
export function SlottedEnhancementIcon({ enhancement, size = 20 }: SlottedEnhancementIconProps) {
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
        </div>
      );
    }
    case 'io-generic': {
      const generic = enhancement as GenericIOEnhancement;
      return (
        <GenericIOIcon
          stat={generic.stat}
          size={size}
          alt={enhancement.name}
        />
      );
    }
    case 'origin': {
      const origin = enhancement as OriginEnhancement;
      return (
        <OriginEnhancementIcon
          stat={origin.stat}
          tier={origin.tier}
          origin={origin.origin}
          size={size}
          alt={enhancement.name}
        />
      );
    }
    case 'special': {
      const special = enhancement as SpecialEnhancement;
      // Extract icon filename from the full path if needed
      const iconName = special.icon?.includes('/')
        ? special.icon.split('/').pop() || 'Unknown.png'
        : special.icon || 'Unknown.png';
      return (
        <SpecialEnhancementIcon
          icon={iconName}
          size={size}
          alt={enhancement.name}
        />
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
