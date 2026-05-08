/**
 * Type definitions for the in-game build export format
 */

import type { Build } from '@/types';

// ============================================
// PARSED STRUCTURES
// ============================================

export interface GameExportHeader {
  characterName: string;
  level: number;
  origin: string;
  archetype: string; // e.g., "Class_Corruptor"
}

export interface GameExportEnhancement {
  /** Raw UID e.g., "Attuned_Decimation_A", "Crafted_Hecatomb_A", "Crafted_Accuracy" */
  uid: string;
  /** Parsed level (for crafted), undefined for attuned */
  level: number | undefined;
  /** Boost amount (from +N suffix), undefined if none */
  boost: number | undefined;
  /** Whether this is an attuned enhancement */
  attuned: boolean;
}

export interface GameExportPower {
  /** Level from the export (0 = auto-granted at that tier) */
  level: number;
  /** Category: "Inherent", "Corruptor_Ranged", "Pool", "Epic", "Redirects", etc. */
  category: string;
  /** Powerset name: "Fitness", "Storm_Blast", "Flight", "Energy_Mastery", etc. */
  powerset: string;
  /** Power internal name: "Chain_Lightning", "Hasten", etc. */
  powerName: string;
  /** Parsed enhancement slots */
  enhancements: (GameExportEnhancement | null)[];
}

export interface GameExportData {
  header: GameExportHeader;
  powers: GameExportPower[];
}

// ============================================
// IMPORT RESULT (matches Mids format for UI reuse)
// ============================================

export type GameImportWarningType = 'archetype' | 'powerset' | 'power' | 'pool' | 'epic' | 'enhancement' | 'general';

export interface GameImportWarning {
  type: GameImportWarningType;
  name: string;
  message: string;
}

export interface GameImportSummary {
  powersImported: number;
  powersFailed: number;
  enhancementsImported: number;
  enhancementsFailed: number;
  slotsImported: number;
}

export interface GameImportResult {
  success: boolean;
  build: Build | null;
  warnings: GameImportWarning[];
  summary: GameImportSummary;
}
