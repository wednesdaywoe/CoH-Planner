/**
 * Knockout Blow — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * `withOverrides()` in the composed file. Survives regeneration.
 * Empty `{}` means no overrides — the generated extraction is accepted
 * as-is. Add fields here when convert-powerset produces the wrong value
 * or is missing a planner-only field (maxStacks, stacksLinear, etc.).
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {};
