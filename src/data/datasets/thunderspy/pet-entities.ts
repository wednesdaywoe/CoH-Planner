/**
 * Thunderspy pet entities — EMPTY PLACEHOLDER.
 *
 * The entity exporter (export_entities.py) currently fails on Thunderspy's
 * older VillainDef.bin record schema (see parser_logs/THUNDERSPY-PARSER-LOG.md),
 * so there is no pet/summon ability data yet. Rebirth shipped the same empty
 * placeholder initially. Player power math is unaffected; only summoned-pet
 * detail panels (Mastermind henchmen, Lore pets, pseudo-pets) are missing
 * detail until the entity parser gains a Thunderspy layout.
 */

import type { PetEntity } from '../../dataset';

export const PET_ENTITIES: Record<string, PetEntity> = {};
