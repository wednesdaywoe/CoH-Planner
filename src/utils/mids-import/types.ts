/**
 * Type definitions for Mids Reborn .mbd file format and import results
 */

import type { Build } from '@/types';

// ============================================
// .MBD FILE STRUCTURE
// ============================================

export interface MbdBuiltWith {
  App: string;
  Version: string;
  Database: string;
  DatabaseVersion: string;
}

export interface MbdEnhancement {
  Uid: string;
  Grade: string;
  IoLevel: number;
  RelativeLevel: string;
  Obtained: boolean;
}

export interface MbdSlotEntry {
  Level: number;
  IsInherent: boolean;
  Enhancement: MbdEnhancement | null;
  FlippedEnhancement: MbdEnhancement | null;
}

export interface MbdPowerEntry {
  PowerName: string;
  Level: number;
  StatInclude: boolean;
  ProcInclude: boolean;
  VariableValue: number;
  InherentSlotsUsed: number;
  SubPowerEntries: unknown[];
  SlotEntries: MbdSlotEntry[];
}

export interface MbdFile {
  BuiltWith: MbdBuiltWith;
  Level: string;
  Class: string;
  Origin: string;
  Alignment: string;
  Name: string;
  Comment: string;
  PowerSets: string[];
  LastPower: number;
  PowerEntries: MbdPowerEntry[];
}

// ============================================
// IMPORT RESULT
// ============================================

export type MidsWarningType = 'archetype' | 'powerset' | 'power' | 'pool' | 'epic' | 'enhancement' | 'general';

export interface MidsImportWarning {
  type: MidsWarningType;
  midsName: string;
  message: string;
}

export interface MidsImportSummary {
  powersImported: number;
  powersFailed: number;
  enhancementsImported: number;
  enhancementsFailed: number;
  slotsImported: number;
}

export interface MidsImportResult {
  success: boolean;
  build: Build | null;
  warnings: MidsImportWarning[];
  summary: MidsImportSummary;
}
