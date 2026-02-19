/**
 * Type definitions barrel export
 *
 * Import types from here:
 * import type { Build, Power, Enhancement } from '@/types';
 */

// Common types and enums
export type {
  DamageType,
  DefenseType,
  EnhancementStatType,
  PowerType,
  TargetType,
  EffectArea,
  Origin,
  Faction,
  IOSetCategory,
  IOSetRarity,
  EnhancementTier,
  OriginTierInfo,
  ProgressionMode,
} from './common';

// Archetype types
export type {
  DamageModifiers,
  ArchetypeStats,
  InherentPower,
  ArchetypeBranch,
  ArchetypeBranchId,
  Archetype,
  ArchetypeId,
  ArchetypeRegistry,
} from './archetype';

// Power types
export type {
  ScaledEffect,
  NumberOrScaled,
  MezEffect,
  NumberOrMez,
  DamageEffect,
  MultiDamageEffect,
  DotEffect,
  ProtectionEffects,
  DefenseByType,
  ResistanceByType,
  ElusivityByType,
  MovementByType,
  StealthEffects,
  SummonEffect,
  HealingEffect,
  DebuffResistance,
  MovementEffect,
  PowerStats,
  ScaledDamageEntry,
  PowerEffects,
  Power,
  Powerset,
  PowerPool,
  SelectedPower,
} from './power';

export { getScaleValue, isScaledEffect, isMezEffect } from './power';

// Enhancement types
export type {
  EnhancementType,
  BaseEnhancement,
  IOSetEnhancement,
  GenericIOEnhancement,
  SpecialEnhancement,
  OriginEnhancement,
  Enhancement,
  SetBonusEffect,
  SetBonus,
  IOSetPiece,
  IOSet,
  IOSetRegistry,
  HamidonEnhancementDef,
  HamidonRegistry,
} from './enhancement';

// Build types
export type {
  PowersetSelection,
  PoolSelection,
  Accolade,
  AccoladeBonus,
  BuildSettings,
  SetTracking,
  ArchetypeSelection,
  Build,
  BuildExport,
} from './build';
export { createEmptyBuild } from './build';

// UI types
export type {
  ModalView,
  EnhancementPickerState,
  GenericPickerState,
  OriginPickerState,
  StatDisplayConfig,
  TooltipState,
  TooltipContent,
  InfoPanelState,
  InfoPanelContent,
  UIState,
} from './ui';
export { createDefaultUIState } from './ui';

// Incarnate types
export type {
  IncarnateSlotId,
  IncarnateTier,
  IncarnateBranch,
  IncarnateSlotDefinition,
  IncarnateTree,
  IncarnatePower,
  SelectedIncarnatePower,
  IncarnateBuildState,
  IncarnateActiveState,
  ToggleableIncarnateSlot,
  // Crafting types
  SalvageId,
  SalvageRarity,
  SalvageRequirement,
  CraftingVariantKey,
  CraftingVariant,
  TierRecipe,
  CraftingConversions,
  CraftingChecklistKey,
  CraftingChecklistState,
} from './incarnate';
export {
  INCARNATE_SLOT_ORDER,
  INCARNATE_TIER_ORDER,
  INCARNATE_REQUIRED_LEVEL,
  createEmptyIncarnateBuildState,
  createDefaultIncarnateActiveState,
  inferTierFromPowerName,
  inferBranchFromPowerName,
  // Crafting utilities
  createEmptyCraftingChecklistState,
  craftingKey,
} from './incarnate';
