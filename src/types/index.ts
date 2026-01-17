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
  Archetype,
  ArchetypeId,
  ArchetypeRegistry,
} from './archetype';

// Power types
export type {
  DamageEffect,
  MultiDamageEffect,
  DotEffect,
  ProtectionEffects,
  DefenseByType,
  ResistanceByType,
  HealingEffect,
  DebuffResistance,
  MovementEffect,
  PowerEffects,
  Power,
  Powerset,
  PowerPool,
  SelectedPower,
} from './power';

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
