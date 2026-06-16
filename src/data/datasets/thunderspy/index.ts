/**
 * Thunderspy dataset — assembles per-server data into a single `Dataset`
 * object that satisfies the contract in `src/data/dataset.ts`.
 *
 * Mirrors `datasets/homecoming/index.ts`. Thunderspy is an i23-era snapshot
 * with its own `classes.bin`/`powers.bin` (Parse7 framing, 50-level tables).
 * Notable content: the custom **Primalist** archetype and Defender melee/
 * assault secondaries. First-pass approximations (re-export HC): purple-patch,
 * granted-powers, io-sets. `petEntities` is an empty placeholder pending a
 * Thunderspy VillainDef.bin parser. See THUNDERSPY SUPPORT PROGRESS.md.
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
  id: 'thunderspy',
  displayName: 'Thunderspy',

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

  // i23-era baseline: Fitness available early, no auto-granted enhancement
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
