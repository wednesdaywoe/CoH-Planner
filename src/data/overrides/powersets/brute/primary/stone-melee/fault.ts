/**
 * Fault — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of
 * src/data/generated/powersets/brute/primary/stone-melee/fault.ts
 * via `withOverrides()` in the composed file. Survives regeneration of
 * the generated layer.
 *
 * Currently empty — Brute Fault's auto-generated power matches the
 * desired output exactly (damage and effects come through the
 * Redirects.Stone_Melee.Fault_Brute / Fault_Cone_Brute redirect chain
 * via the convert script's redirect-following logic).
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {};
