/**
 * Homecoming dataset — assembles per-server data into a single `Dataset`
 * object that satisfies the contract in `src/data/dataset.ts`.
 *
 * The pieces here close over Homecoming's own data records, so when this
 * dataset is active, calls like `getActiveDataset().getTableValue(...)`
 * resolve against HC's tables. Other datasets (Rebirth, …) live in
 * sibling folders and ship their own version of this file.
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
import { getBaseToHit, getCombatModifier } from './purple-patch';
import { GRANTED_POWER_GROUPS } from './granted-powers';
import { PET_ENTITIES } from './pet-entities';

const dataset: Dataset = {
  id: 'homecoming',
  displayName: 'Homecoming',

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
  },

  grantedPowerGroups: GRANTED_POWER_GROUPS,

  petEntities: PET_ENTITIES,

  getTableValue,
  calculateEffectValue,
  calculateIncarnateDamage,
  getPetTableValue,
  getArchetype,
};

export default dataset;
