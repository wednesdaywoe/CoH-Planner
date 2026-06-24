/**
 * Veracity pet entities — EMPTY PLACEHOLDER.
 *
 * export_entities.py doesn't yet have a Veracity VillainDef.bin layout, so there
 * is no pet/summon ability data yet (Thunderspy and Rebirth shipped the same
 * empty placeholder initially). Player power math is unaffected; only summoned-
 * pet detail panels (Mastermind henchmen, Lore pets, pseudo-pets) lack detail
 * until the entity parser gains a Veracity layout.
 */

import type { PetEntity } from '../../dataset';

export const PET_ENTITIES: Record<string, PetEntity> = {};
