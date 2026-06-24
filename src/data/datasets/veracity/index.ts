/**
 * Veracity dataset — assembles per-server data into a single `Dataset`
 * object that satisfies the contract in `src/data/dataset.ts`.
 *
 * Mirrors `datasets/homecoming/index.ts`. Veracity is a heavily-modified
 * private server (SCoRE-Neptune lineage) with its own `classes.bin`/`powers.bin`
 * (Parse7 framing, 50-level tables, a Dictionary field + HC-style effect groups
 * with HitsToBreak/HitBreakMinScale). Standard 14 archetypes (no custom AT).
 * AT caps are Veracity-specific (Scrapper/Stalker res 0.80). Vs-faction
 * conditional damage and the deprecated combo system are intentionally dropped
 * by the converter (per-enemy / dead mechanics). First-pass approximations
 * (re-export HC): purple-patch, granted-powers, io-sets. `petEntities` is an
 * empty placeholder pending a Veracity VillainDef.bin parser.
 */

import type { Dataset } from '../../dataset';
import {
  ARCHETYPES,
  EPIC_ARCHETYPE_IDS,
  STANDARD_ARCHETYPE_IDS,
  getArchetype,
} from './archetypes';
import {
  AT_TABLES,
  PET_TABLES,
  getTableValue,
  calculateEffectValue,
  calculateIncarnateDamage,
  getPetTableValue,
} from './at-tables';
import { getBaseToHit, getCombatModifier, getDefenseSoftcap } from './purple-patch';
import { GRANTED_POWER_GROUPS } from './granted-powers';
import { PET_ENTITIES } from './pet-entities';

const dataset: Dataset = {
  id: 'veracity',
  displayName: 'Veracity',

  archetypes: {
    registry: ARCHETYPES,
    epicIds: EPIC_ARCHETYPE_IDS,
    standardIds: STANDARD_ARCHETYPE_IDS,
  },

  atTables: {
    archetypes: AT_TABLES,
    pets: PET_TABLES,
  },

  purplePatch: {
    getBaseToHit,
    getCombatModifier,
    getDefenseSoftcap,
  },

  grantedPowerGroups: GRANTED_POWER_GROUPS,

  // Standard CoH baseline: Fitness available early, no auto-granted enhancement
  // slots (matches HC, not Rebirth's shifted-to-L2 + auto-slot model).
  inherentRules: {
    availabilityOverrides: {},
    autoGrantedSlotLevels: {},
  },

  petEntities: PET_ENTITIES,

  getTableValue,
  calculateEffectValue,
  calculateIncarnateDamage,
  getPetTableValue,
  getArchetype,
};

export default dataset;
