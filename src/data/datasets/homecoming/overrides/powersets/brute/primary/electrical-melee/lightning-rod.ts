/**
 * Lightning Rod — OVERRIDES LAYER
 *
 * Two corrections to the binary-extracted shape:
 *
 * 1. `targetType`: the binary reports "Dead Teammate" because the underlying
 *    mechanic is a teleport-then-summon (the teleport target is "any
 *    location"). For UI purposes the power is a Foe-targeted AoE attack.
 *
 * 2. `summon.entity`: the binary spawns `PL_StaticObject` (a positional
 *    anchor) and then casts `Pets.Lightning_Rod_Universal.Lightning_Rod`
 *    on it — the static object itself has no damage table. The actual
 *    damage source is the AT-specific pet entity. Without this remap the
 *    damage panel shows nothing because `PL_StaticObject` isn't in
 *    `pet-entities.ts`.
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {};
