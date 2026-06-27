/**
 * Color theme registry.
 *
 * Each theme re-skins the app by overriding CSS custom properties under a
 * `[data-theme="<id>"]` selector in index.css. The actual color values live in
 * the stylesheet (so Tailwind utilities like `bg-gray-900` pick them up with no
 * component changes); this module is the source of truth for the *set* of
 * themes, their labels/descriptions, and the swatch colors used by the picker.
 *
 * See index.css for the matching `[data-theme]` blocks. Keep the ids here in
 * sync with the selectors there.
 */

export type ColorThemeId =
  | 'sidekick'
  | 'paragon'
  | 'menace'
  | 'imperial'
  | 'renegade'
  | 'hamidon'
  | 'resistance'
  | 'carnival'
  | 'espresso';

export interface ColorTheme {
  id: ColorThemeId;
  /** Short display name shown in the picker. */
  label: string;
  /** Lore subtitle / one-liner. */
  tagline: string;
  /** Longer description for tooltips / the picker card. */
  description: string;
  /**
   * Representative colors for the picker swatch. These mirror the values in
   * index.css but are only used for the preview chips — the live theme reads
   * from the stylesheet.
   */
  swatch: {
    base: string;
    surface: string;
    panel: string;
    primary: string;
    accent: string;
    highlight: string;
  };
}

export const COLOR_THEMES: Record<ColorThemeId, ColorTheme> = {
  sidekick: {
    id: 'sidekick',
    label: 'Sidekick',
    tagline: 'The original',
    description:
      'Original formula!',
    swatch: {
      base: '#111827',
      surface: '#1f2937',
      panel: '#374151',
      primary: '#2563eb',
      accent: '#D62BCE',
      highlight: '#f3f4f6',
    },
  },
  paragon: {
    id: 'paragon',
    label: 'Paragon',
    tagline: 'City of Heroes',
    description:
      'What\'s CoV?',
    swatch: {
      base: '#0A0F1A',
      surface: '#0F1E3A',
      panel: '#1B3A72',
      primary: '#F0C040',
      accent: '#5A8AE8',
      highlight: '#E8EEF8',
    },
  },
  menace: {
    id: 'menace',
    label: 'Menace',
    tagline: 'City of Villains',
    description:
      'Blue skies, clean streets, and breathable air is for the weak.',
    swatch: {
      base: '#0F0909',
      surface: '#281619',
      panel: '#3B1D21',
      primary: '#C47A10',
      accent: '#E0707A',
      highlight: '#F4E8E7',
    },
  },
  imperial: {
    id: 'imperial',
    label: 'Imperial',
    tagline: 'Praetoria',
    description:
      'I\'m not saying he\'s right, but he makes a good point.',
    swatch: {
      base: '#0E0F12',
      surface: '#18191F',
      panel: '#25272E',
      primary: '#C8A840',
      accent: '#5A8AB8',
      highlight: '#D8D4C8',
    },
  },
  renegade: {
    id: 'renegade',
    label: 'Renegade',
    tagline: 'Rogue / Vigilante',
    description:
      'I frequently talk to birds.',
    swatch: {
      base: '#0C0A14',
      surface: '#1E1838',
      panel: '#6248A8',
      primary: '#2D72D8',
      accent: '#C82030',
      highlight: '#C8C0E0',
    },
  },
  hamidon: {
    id: 'hamidon',
    label: 'Hamidon',
    tagline: 'The Devouring Girth',
    description:
      'I\'m not saying he\'s right, but he makes a good jello.',
    swatch: {
      base: '#050E0C',
      surface: '#081A14',
      panel: '#0D2E22',
      primary: '#D4A820',
      accent: '#4FD1A8',
      highlight: '#D6F0E4',
    },
  },
  resistance: {
    id: 'resistance',
    label: 'Resistance',
    tagline: 'Underground Praetoria',
    description:
      'Didn\'t drink the water.',
    swatch: {
      base: '#0E0C0A',
      surface: '#1C1814',
      panel: '#2C2620',
      primary: '#1E88D8',
      accent: '#B86820',
      highlight: '#E5DFD7',
    },
  },
  carnival: {
    id: 'carnival',
    label: 'Carnival',
    tagline: 'Carnival of Shadows',
    description:
      'The mask stays on.',
    swatch: {
      base: '#15111F',
      surface: '#221A33',
      panel: '#34264C',
      primary: '#E0207A',
      accent: '#C58AE0',
      highlight: '#C8C0D8',
    },
  },
  espresso: {
    id: 'espresso',
    label: 'Espresso',
    tagline: 'Gimme!',
    description:
      'Slotted for recharge.',
    swatch: {
      base: '#120C08',
      surface: '#2A1F16',
      panel: '#3D2E20',
      primary: '#CA8E42',
      accent: '#E2B57A',
      highlight: '#EBE0CF',
    },
  },
};

/** Ordered list for rendering the picker. Sidekick (default) first. */
export const COLOR_THEME_ORDER: ColorThemeId[] = [
  'sidekick',
  'paragon',
  'menace',
  'imperial',
  'renegade',
  'hamidon',
  'resistance',
  'carnival',
  'espresso',
];

export const DEFAULT_COLOR_THEME: ColorThemeId = 'sidekick';

export function isColorThemeId(value: unknown): value is ColorThemeId {
  return typeof value === 'string' && value in COLOR_THEMES;
}

/**
 * Light/dark mode — an axis ORTHOGONAL to the color theme. Every theme has a
 * dark ramp (the default) and a generated light ramp (the exact reverse) under
 * `[data-theme='x'][data-mode='light']` in index.css. Dark is the default look,
 * so it clears the attribute rather than setting `data-mode='dark'`.
 */
export type ColorMode = 'light' | 'dark';

export const DEFAULT_COLOR_MODE: ColorMode = 'dark';

export function isColorMode(value: unknown): value is ColorMode {
  return value === 'light' || value === 'dark';
}

/**
 * Apply a color mode by setting `data-mode` on <html>. Set on documentElement
 * (like the theme) so portaled modals/tooltips inherit it. Dark is the default
 * baked into the stylesheet, so it removes the attribute rather than relying on
 * a `[data-mode='dark']` block.
 */
export function applyColorMode(mode: ColorMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === DEFAULT_COLOR_MODE) {
    root.removeAttribute('data-mode');
  } else {
    root.setAttribute('data-mode', mode);
  }
}

/**
 * Apply a theme by setting the `data-theme` attribute on <html>. Setting it on
 * documentElement (rather than a React-owned node) means modals and tooltips
 * rendered into portals at the document root inherit the theme too.
 *
 * Sidekick is the default look defined at `:root`, so it clears the attribute
 * rather than relying on a (possibly empty) `[data-theme="sidekick"]` block.
 */
export function applyColorTheme(themeId: ColorThemeId): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (themeId === DEFAULT_COLOR_THEME) {
    root.removeAttribute('data-theme');
  } else {
    root.setAttribute('data-theme', themeId);
  }
}
