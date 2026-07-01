/**
 * Options model for the "Export as Image" build poster — presets, the seed
 * function that turns a preset into a full option set, and the section labels.
 * Shared by BuildImageModal (controls) and BuildImageCard (render).
 */

export type ExportPreset = 'compact' | 'standard' | 'full';

/** All eight detailed-totals section names, in display order (must match DETAILED_SECTIONS). */
export const ALL_STAT_SECTIONS = [
  'Offense',
  'Survival & Mobility',
  'Stealth & Perception',
  'Defense',
  'Damage Resistance',
  'Status Protection',
  'Status Effect Resistance',
  'Debuff Resistance',
] as const;

/** Compact's condensed stat set — the essentials without the mez/debuff/stealth detail. */
export const COMPACT_STAT_SECTIONS: string[] = [
  'Offense',
  'Survival & Mobility',
  'Defense',
  'Damage Resistance',
];

/** Standard/Full show every section. */
export const STANDARD_STAT_SECTIONS: string[] = [...ALL_STAT_SECTIONS];

export interface ExportImageOptions {
  preset: ExportPreset;
  // ── Header identity ──
  /** Free-text author / character credit (empty = hidden). */
  authorName: string;
  showLevel: boolean;
  showOrigin: boolean;
  /** Export date + "Made with coh-sidekick.com" footer. */
  showCredit: boolean;
  // ── Powers ──
  /** Show enhancement icons in slots; false = plain filled/empty slot dots. */
  showEnhancements: boolean;
  /** Include the inherent-powers row. */
  showInherents: boolean;
  /** Only show powers that have at least one enhancement slotted. */
  onlySlotted: boolean;
  // ── Totals ──
  /** Which detailed-totals sections to render. Empty = no totals panel. */
  statSections: string[];
  showSetBonuses: boolean;
  // ── Appearance ──
  /** Transparent background instead of the themed canvas fill. */
  transparent: boolean;
  /** Output resolution multiplier (1 or 2). */
  scale: number;
}

/** Fields a preset dictates. The rest (authorName, transparent, scale) persist across preset changes. */
type PresetSeed = Pick<
  ExportImageOptions,
  'showLevel' | 'showOrigin' | 'showCredit' | 'showEnhancements' | 'showInherents' | 'onlySlotted' | 'statSections' | 'showSetBonuses'
>;

const PRESET_SEEDS: Record<ExportPreset, PresetSeed> = {
  // Compact: only slotted powers + the essential stat sections.
  compact: {
    showLevel: true,
    showOrigin: false,
    showCredit: true,
    showEnhancements: true,
    showInherents: true,
    onlySlotted: true,
    statSections: COMPACT_STAT_SECTIONS,
    showSetBonuses: false,
  },
  // Standard: only slotted powers, but all stat sections + set bonuses.
  standard: {
    showLevel: true,
    showOrigin: false,
    showCredit: true,
    showEnhancements: true,
    showInherents: true,
    onlySlotted: true,
    statSections: [...ALL_STAT_SECTIONS],
    showSetBonuses: true,
  },
  // Full: everything — every power (slotted or not), all totals + set bonuses.
  full: {
    showLevel: true,
    showOrigin: false,
    showCredit: true,
    showEnhancements: true,
    showInherents: true,
    onlySlotted: false,
    statSections: [...ALL_STAT_SECTIONS],
    showSetBonuses: true,
  },
};

/** Apply a preset's section/toggle defaults while preserving identity + appearance choices. */
export function applyPreset(preset: ExportPreset, current: ExportImageOptions): ExportImageOptions {
  return { ...current, preset, ...PRESET_SEEDS[preset] };
}

/** The initial option set — Standard preset, with a suggested author name. */
export function createDefaultOptions(authorName = ''): ExportImageOptions {
  return applyPreset('standard', {
    preset: 'standard',
    authorName,
    showLevel: true,
    showOrigin: false,
    showCredit: true,
    showEnhancements: true,
    showInherents: false,
    onlySlotted: false,
    statSections: STANDARD_STAT_SECTIONS,
    showSetBonuses: false,
    transparent: false,
    scale: 2,
  });
}
