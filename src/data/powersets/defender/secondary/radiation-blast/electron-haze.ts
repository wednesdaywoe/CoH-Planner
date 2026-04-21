/**
 * Electron Haze — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via `withOverrides`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs defender_ranged radiation_blast
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ElectronHaze as base } from '@/data/generated/powersets/defender/secondary/radiation-blast/electron-haze';
import { overrides } from '@/data/overrides/powersets/defender/secondary/radiation-blast/electron-haze';

export const ElectronHaze: Power = withOverrides(base, overrides);
