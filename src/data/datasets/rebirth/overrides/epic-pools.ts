/**
 * Epic/Patron Pool overrides — hand-written deltas keyed by a power's
 * `fullName`. The composed facade (src/data/epic-pools-raw.ts) merges
 * each entry into its matching generated power via `withOverrides`.
 *
 * Empty record means no overrides. Add entries here when the stale
 * CoD2 raw extraction disagrees with current HC game values. See
 * src/data/README.md for the layering convention.
 */
import type { Power } from '@/types';

export const EPIC_POOL_OVERRIDES: Record<string, Partial<Power>> = {
  // +Accuracy self-buff restoration (Focused Accuracy / Targeting Drone /
  // Personal Force Field). See the homecoming override for the full rationale —
  // the converter now emits `accuracyBuff`, but a full epic-pools regen surfaces
  // unrelated stale mez drift, so these merge the exact values surgically.
  // Rebirth's tables/AT set differ from Homecoming (Guardian AT; Brute uses
  // Melee_Ones here, no Sentinel Mace), so values are captured per-dataset.
  'Epic.Body_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Body_Mastery_Stalker.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Brute_Mace_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Controller_Mace_Mastery.Personal_Force_Field': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Corruptor_Mace_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Energy_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Energy_Mastery_Brute.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Guardian_Mace_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Guardian_Munitions_Mastery.Targeting_Drone': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Guardian_Primal_Forces_Mastery.Focused_Accuracy': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Weapon_Mastery.Targeting_Drone': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
  'Epic.Weapon_Mastery_Stalker.Targeting_Drone': { effects: { accuracyBuff: { scale: 0.2, table: 'Melee_Ones' } } },
};
