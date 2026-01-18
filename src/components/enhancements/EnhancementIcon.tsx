/**
 * EnhancementIcon component - displays enhancement icons with overlays
 *
 * Enhancement icons consist of two parts:
 * 1. Base icon - the core enhancement image
 * 2. Overlay - a frame that indicates the enhancement type/origin
 *
 * Overlay types:
 * - IO.png: Standard IO sets and Generic IOs
 * - attuned.png: Attuned IO sets
 * - Training.png: Training Origin enhancements (TO)
 * - {Origin}DO.png: Dual Origin enhancements (MagDO, MutDO, NatDO, SciDO, TechDO)
 * - {Origin}SO.png: Single Origin enhancements (MagSO, MutSO, NatSO, SciSO, TechSO)
 * - HO.png: Hamidon Origin enhancements
 */

import { useMemo } from 'react';
import type { Origin } from '@/types';

// Base path for enhancement images
const IMG_BASE = '/img/Enhancements';

export type EnhancementType = 'io-set' | 'io-generic' | 'origin' | 'special';
export type OriginTier = 'TO' | 'DO' | 'SO';

interface EnhancementIconProps {
  /** The type of enhancement */
  type: EnhancementType;
  /** Base icon filename (without path) */
  icon: string;
  /** Whether the enhancement is attuned (for IO sets) */
  attuned?: boolean;
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
 * Get the overlay image path based on enhancement type and properties
 */
function getOverlayPath(
  type: EnhancementType,
  attuned?: boolean,
  tier?: OriginTier,
  origin?: Origin
): string {
  const overlayBase = `${IMG_BASE}/Overlay`;

  switch (type) {
    case 'io-set':
    case 'io-generic':
      return attuned ? `${overlayBase}/attuned.png` : `${overlayBase}/IO.png`;

    case 'origin':
      if (tier === 'TO') {
        return `${overlayBase}/Training.png`;
      }
      if (tier === 'DO' || tier === 'SO') {
        const prefix = origin ? ORIGIN_TO_PREFIX[origin] || 'Nat' : 'Nat';
        return `${overlayBase}/${prefix}${tier}.png`;
      }
      return `${overlayBase}/IO.png`; // fallback

    case 'special':
      return `${overlayBase}/HO.png`;

    default:
      return `${overlayBase}/IO.png`;
  }
}

/**
 * Determine the folder for an IO set icon based on its filename prefix
 * - AO_ = Archetype Origin (in Archetype folder)
 * - SAO_ = Superior Archetype Origin (in Archetype folder)
 * - EO_ = Event Origin (in Event folder)
 * - SEO_ = Superior Event Origin (in Event folder)
 * - SEW_ = Superior Event Winter (in Event folder)
 * - All others = IO Sets folder
 */
function getIOSetFolder(icon: string): string {
  if (icon.startsWith('AO_') || icon.startsWith('SAO_')) {
    return 'Archetype';
  }
  if (icon.startsWith('EO_') || icon.startsWith('SEO_') || icon.startsWith('SEW_')) {
    return 'Event';
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
    () => getOverlayPath(type, attuned, tier, origin),
    [type, attuned, tier, origin]
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
        className="absolute inset-0 w-full h-full object-contain"
        onError={(e) => {
          // Fallback to a default image on error
          (e.target as HTMLImageElement).src = '/img/Unknown.png';
        }}
      />
      {/* Overlay frame */}
      <img
        src={overlayPath}
        alt=""
        aria-hidden="true"
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
  /** Size in pixels */
  size?: number;
  /** Additional classes */
  className?: string;
  /** Alt text */
  alt?: string;
}

export function IOSetIcon({ icon, attuned, size = 36, className, alt }: IOSetIconProps) {
  return (
    <EnhancementIcon
      type="io-set"
      icon={icon}
      attuned={attuned}
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

// Map stat names to generic icon filenames
const STAT_TO_GENERIC_ICON: Record<string, string> = {
  Accuracy: 'Acc.png',
  Damage: 'Damage.png',
  Recharge: 'Recharge.png',
  EnduranceReduction: 'EndRdx.png',
  Range: 'Range.png',
  Defense: 'Defbuff.png',
  Resistance: 'DamRes.png',
  Healing: 'Heal.png',
  ToHit: 'Acc.png', // ToHit uses Accuracy icon
  Hold: 'Hold.png',
  Stun: 'Hold.png', // Stun uses Hold icon
  Immobilize: 'Immob.png',
  Sleep: 'Hold.png', // Sleep uses Hold icon
  Confuse: 'Confuse.png',
  Fear: 'Fear.png',
  Knockback: 'Knockback.png',
  'Run Speed': 'Run.png',
  Jump: 'Jump.png',
  Fly: 'Fly.png',
  'ToHit Debuff': 'DefDebuff.png',
  'Defense Debuff': 'DefDebuff.png',
  EnduranceModification: 'EndMod.png',
  Interrupt: 'Interrupt.png',
  Slow: 'Slow.png',
  Intangible: 'Intan.png',
};

export function GenericIOIcon({ stat, size = 36, className, alt }: GenericIOIconProps) {
  const icon = STAT_TO_GENERIC_ICON[stat] || 'Damage.png';
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
  const icon = STAT_TO_GENERIC_ICON[stat] || 'Damage.png';
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
