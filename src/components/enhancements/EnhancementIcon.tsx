/**
 * EnhancementIcon component - displays enhancement icons with overlays
 *
 * Enhancement icons consist of two parts:
 * 1. Base icon - the core enhancement image
 * 2. Overlay - a frame that indicates the enhancement type/rarity
 *
 * Overlay frames use e_frame_ prefix naming with rarity-based variants:
 * - e_frame_IO.png: Generic IOs (common)
 * - e_frame_uncommon.png / e_frame_attuned_uncommon.png: Uncommon IO sets
 * - e_frame_rare.png / e_frame_attuned_rare.png: Rare IO sets
 * - e_frame_superior.png / e_frame_attuned_superior.png: Purple/very rare sets
 * - e_frame_pvp.png / e_frame_attuned_pvp.png: PvP sets
 * - e_frame_class.png: Archetype (ATO) and Event sets
 * - e_frame_TO.png: Training Origin enhancements
 * - e_frame_{Org}DO.png / e_frame_{Org}SO.png: Dual/Single Origin enhancements
 * - e_frame_HO.png: Hamidon Origin enhancements
 */

import { useMemo } from 'react';
import type { Origin, IOSetRarity } from '@/types';
import { STAT_ICON_MAP } from '@/data';
import { resolvePath } from '@/utils/paths';

// Base path for enhancement images
const IMG_BASE = resolvePath('/img/Enhancements');

export type EnhancementType = 'io-set' | 'io-generic' | 'origin' | 'special';
export type OriginTier = 'TO' | 'DO' | 'SO';

interface EnhancementIconProps {
  /** The type of enhancement */
  type: EnhancementType;
  /** Base icon filename (without path) */
  icon: string;
  /** Whether the enhancement is attuned (for IO sets) */
  attuned?: boolean;
  /** IO set rarity category (for frame selection) */
  category?: IOSetRarity;
  /** Origin tier for origin enhancements */
  tier?: OriginTier;
  /** Character origin for DO/SO enhancements */
  origin?: Origin;
  /** Size of the icon in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Alt text for accessibility */
  alt?: string;
}

/**
 * Maps origin names to their overlay prefix
 */
const ORIGIN_TO_PREFIX: Record<string, string> = {
  magic: 'Mag',
  mutation: 'Mut',
  natural: 'Nat',
  science: 'Sci',
  technology: 'Tech',
};

/**
 * Get the overlay image path based on enhancement type, rarity, and properties
 */
function getOverlayPath(
  type: EnhancementType,
  attuned?: boolean,
  tier?: OriginTier,
  origin?: Origin,
  icon?: string,
  category?: IOSetRarity
): string {
  const overlayBase = `${IMG_BASE}/Overlay`;

  switch (type) {
    case 'io-set': {
      // Superior archetype/event sets get superior frame
      if (icon?.startsWith('SAO_') || icon?.startsWith('SEO_')) {
        return `${overlayBase}/e_frame_superior.png`;
      }
      // Regular archetype/event sets get class frame
      if (icon?.startsWith('AO_') || icon?.startsWith('EO_')) {
        return `${overlayBase}/e_frame_class.png`;
      }
      // Rarity-based frames
      switch (category) {
        case 'uncommon':
          return attuned
            ? `${overlayBase}/e_frame_attuned_uncommon.png`
            : `${overlayBase}/e_frame_uncommon.png`;
        case 'rare':
          return attuned
            ? `${overlayBase}/e_frame_attuned_rare.png`
            : `${overlayBase}/e_frame_rare.png`;
        case 'purple':
          return attuned
            ? `${overlayBase}/e_frame_attuned_superior.png`
            : `${overlayBase}/e_frame_superior.png`;
        case 'pvp':
          return attuned
            ? `${overlayBase}/e_frame_attuned_pvp.png`
            : `${overlayBase}/e_frame_pvp.png`;
        case 'ato':
          return `${overlayBase}/e_frame_class.png`;
        case 'event':
          return `${overlayBase}/e_frame_class.png`;
        default:
          return `${overlayBase}/e_frame_IO.png`;
      }
    }

    case 'io-generic':
      return `${overlayBase}/e_frame_IO.png`;

    case 'origin':
      if (tier === 'TO') {
        return `${overlayBase}/e_frame_TO.png`;
      }
      if (tier === 'DO' || tier === 'SO') {
        const prefix = origin ? ORIGIN_TO_PREFIX[origin] || 'Nat' : 'Nat';
        return `${overlayBase}/e_frame_${prefix}${tier}.png`;
      }
      return `${overlayBase}/e_frame_IO.png`; // fallback

    case 'special':
      return `${overlayBase}/e_frame_HO.png`;

    default:
      return `${overlayBase}/e_frame_IO.png`;
  }
}

/**
 * Determine the folder for an IO set icon based on its filename prefix
 * - AO_ = Archetype Origin (in Archetype folder)
 * - SAO_ = Superior Archetype Origin (in Archetype folder)
 * - EO_ = Event Origin (in Event folder)
 * - SEO_ = Superior Event Origin (in Event folder)
 * - UD_ = Universal Damage (in Universal folder)
 * - All others = IO Sets folder
 */
function getIOSetFolder(icon: string): string {
  if (icon.startsWith('AO_') || icon.startsWith('SAO_')) {
    return 'Archetype';
  }
  if (icon.startsWith('EO_') || icon.startsWith('SEO_')) {
    return 'Event';
  }
  if (icon.startsWith('UD_')) {
    return 'Universal';
  }
  return 'IO Sets';
}

/**
 * Get the base icon path based on enhancement type and icon name
 */
function getBaseIconPath(type: EnhancementType, icon: string): string {
  // If icon already has a full path, use it
  if (icon.startsWith('/') || icon.startsWith('http')) {
    return icon;
  }

  switch (type) {
    case 'io-set': {
      // IO set icons are organized into subfolders by type
      const folder = getIOSetFolder(icon);
      return `${IMG_BASE}/${folder}/${icon}`;
    }

    case 'io-generic':
      // Generic IO icons are in the "Generic" folder
      return `${IMG_BASE}/Generic/${icon}`;

    case 'origin':
      // Origin enhancements use Generic icons
      return `${IMG_BASE}/Generic/${icon}`;

    case 'special':
      // Hamidon/Hydra/Titan icons are in "Special" folder
      return `${IMG_BASE}/Special/${icon}`;

    default:
      return `${IMG_BASE}/${icon}`;
  }
}

export function EnhancementIcon({
  type,
  icon,
  attuned = false,
  category,
  tier,
  origin,
  size = 36,
  className = '',
  alt = 'Enhancement',
}: EnhancementIconProps) {
  const baseIconPath = useMemo(
    () => getBaseIconPath(type, icon),
    [type, icon]
  );

  const overlayPath = useMemo(
    () => getOverlayPath(type, attuned, tier, origin, icon, category),
    [type, attuned, tier, origin, icon, category]
  );

  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Base enhancement icon */}
      <img
        src={baseIconPath}
        alt={alt}
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain"
        onError={(e) => {
          // Fallback to a default image on error
          (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
        }}
      />
      {/* Overlay frame */}
      <img
        src={overlayPath}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
        onError={(e) => {
          // Hide overlay if it fails to load
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    </div>
  );
}

/**
 * Convenience component for IO Set enhancement icons
 */
interface IOSetIconProps {
  /** Icon filename from the set data */
  icon: string;
  /** Whether attuned */
  attuned?: boolean;
  /** IO set rarity category */
  category?: IOSetRarity;
  /** Size in pixels */
  size?: number;
  /** Additional classes */
  className?: string;
  /** Alt text */
  alt?: string;
}

export function IOSetIcon({ icon, attuned, category, size = 36, className, alt }: IOSetIconProps) {
  return (
    <EnhancementIcon
      type="io-set"
      icon={icon}
      attuned={attuned}
      category={category}
      size={size}
      className={className}
      alt={alt}
    />
  );
}

/**
 * Convenience component for Generic IO icons
 */
interface GenericIOIconProps {
  /** Stat type determines the icon */
  stat: string;
  /** Size in pixels */
  size?: number;
  /** Additional classes */
  className?: string;
  /** Alt text */
  alt?: string;
}

export function GenericIOIcon({ stat, size = 36, className, alt }: GenericIOIconProps) {
  const icon = STAT_ICON_MAP[stat] || 'Damage.png';
  return (
    <EnhancementIcon
      type="io-generic"
      icon={icon}
      size={size}
      className={className}
      alt={alt || `${stat} IO`}
    />
  );
}

/**
 * Convenience component for Origin enhancement icons (TO/DO/SO)
 */
interface OriginEnhancementIconProps {
  /** Stat type determines the icon */
  stat: string;
  /** Origin tier */
  tier: OriginTier;
  /** Character origin (for DO/SO) */
  origin?: Origin;
  /** Size in pixels */
  size?: number;
  /** Additional classes */
  className?: string;
  /** Alt text */
  alt?: string;
}

export function OriginEnhancementIcon({
  stat,
  tier,
  origin,
  size = 36,
  className,
  alt,
}: OriginEnhancementIconProps) {
  const icon = STAT_ICON_MAP[stat] || 'Damage.png';
  return (
    <EnhancementIcon
      type="origin"
      icon={icon}
      tier={tier}
      origin={origin}
      size={size}
      className={className}
      alt={alt || `${stat} ${tier}`}
    />
  );
}

/**
 * Convenience component for Special (Hamidon/Hydra/Titan) enhancement icons
 */
interface SpecialEnhancementIconProps {
  /** Icon filename */
  icon: string;
  /** Size in pixels */
  size?: number;
  /** Additional classes */
  className?: string;
  /** Alt text */
  alt?: string;
}

export function SpecialEnhancementIcon({ icon, size = 36, className, alt }: SpecialEnhancementIconProps) {
  return (
    <EnhancementIcon
      type="special"
      icon={icon}
      size={size}
      className={className}
      alt={alt}
    />
  );
}
