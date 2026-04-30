/**
 * Rebirth pet entities — empty placeholder.
 *
 * Pet damage data lives in `PC_Def_Entities.bin` / `PC_Def_NonSelectable_
 * Entities.bin` (both Parse6 in Rebirth). bin-crawler doesn't yet ship a
 * parser for these, so we ship an empty registry rather than serve HC's
 * entity data, which would be misleading (pet names and tier definitions
 * don't necessarily line up between servers).
 *
 * Effect: Mastermind henchmen / Lore incarnate pet damage shows up
 * without ability damage tables. Other planner functionality is
 * unaffected. Tracked as a Stage-A follow-up in MULTI_DATASET_PLAN.md.
 */

import type { PetEntity } from '../../dataset';

export const PET_ENTITIES: Record<string, PetEntity> = {};
