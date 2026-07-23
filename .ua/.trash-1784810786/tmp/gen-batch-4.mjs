import fs from 'fs';

const ROOT = '/home/jiiwii/Github/CoH-Sidekick';
const input = JSON.parse(fs.readFileSync(`${ROOT}/.ua/tmp/ua-file-analyzer-input-4.json`, 'utf8'));
const importData = input.batchImportData;

// fn tuple: [name, start, end, exported, summary, tags, complexity]
const F = (name, s, e, exported, summary, tags, complexity = 'simple') => ({ name, s, e, exported, summary, tags, complexity });

const files = [
  {
    path: 'src/utils/calculations/incandescence-heal-received.test.ts', complexity: 'moderate',
    summary: "Regression test guarding the Incandescence Destiny fix: its Heal_Dmg/aspect=Resistance effect must surface as a 'Healing Received' character total instead of being flattened into damage resistance.",
    tags: ['test', 'incarnate', 'healing', 'regression-guard'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/incarnate-effects-completeness.test.ts', complexity: 'complex',
    summary: 'Completeness guard for the incarnate effects pipeline: verifies Destiny/Hybrid/Clarion effect categories (mez protection, heal, endurance) all reach character totals instead of being silently dropped by converter allowlists.',
    tags: ['test', 'incarnate', 'completeness-guard', 'character-totals'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/incarnate-exemplar.test.ts', complexity: 'moderate',
    summary: 'Tests that incarnate power effects are suppressed from character totals when the effective (exemplar) level drops below the incarnate minimum level.',
    tags: ['test', 'incarnate', 'exemplar', 'level-scaling'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/inherents.ts', complexity: 'complex',
    summary: 'Implements archetype inherent mechanics for every AT: Defiance, Domination, Scourge, Fury, Supremacy/Bodyguard, Vigilance, Opportunity, Critical Hit, Assassination, Gauntlet, and Containment, each with info descriptors, damage/chance calculators, and power-eligibility predicates.',
    tags: ['game-mechanics', 'inherent', 'archetype', 'damage-calculation', 'utility'],
    languageNotes: 'Organized as one section per archetype, each exposing an info getter, numeric calculators, and an is*Power eligibility predicate.',
    fns: [
      F('calculateAreaModifier', 40, 61, false, 'Computes the AoE area factor modifier (radius/arc based) used to scale inherent damage contributions for area attacks.', ['aoe', 'modifier', 'utility']),
      F('calculateDefiance', 70, 102, false, "Calculates the Blaster Defiance damage bonus from recently used attacks, weighting each power's contribution by cast time and area modifier.", ['blaster', 'inherent', 'damage'], 'moderate'),
      F('isBlasterAttackPower', 108, 110, true, 'Predicate: whether a power qualifies as a Blaster attack for Defiance accumulation.', ['blaster', 'predicate', 'inherent']),
      F('getDominationInfo', 196, 202, true, 'Returns descriptor info for the Dominator Domination inherent (fury-style bar, mez magnitude doubling).', ['dominator', 'inherent', 'info']),
      F('getPowerDominationSummary', 217, 236, true, 'Summarizes how Domination modifies a specific power (doubled mez magnitude/duration when active).', ['dominator', 'mez', 'inherent']),
      F('getScourgeInfo', 272, 279, true, 'Returns descriptor info for the Corruptor Scourge inherent (chance for double damage scaling with target health loss).', ['corruptor', 'inherent', 'info']),
      F('calculateScourgeChance', 286, 293, true, "Calculates Scourge trigger chance from the target's remaining health percentage.", ['corruptor', 'inherent', 'probability']),
      F('calculateScourgeDamage', 301, 304, true, 'Calculates expected bonus damage from Scourge given base damage and trigger chance.', ['corruptor', 'inherent', 'damage']),
      F('isCorruptorAttackPower', 310, 312, true, 'Predicate: whether a power qualifies for Corruptor Scourge.', ['corruptor', 'predicate', 'inherent']),
      F('getFuryInfo', 343, 349, true, 'Returns descriptor info for the Brute Fury inherent (damage bonus building with combat activity).', ['brute', 'inherent', 'info']),
      F('calculateFuryDamageBonus', 356, 360, true, 'Converts a Fury bar level into its percentage damage bonus.', ['brute', 'inherent', 'damage']),
      F('calculateFuryDamage', 369, 372, true, 'Applies the Fury damage bonus to a base damage value.', ['brute', 'inherent', 'damage']),
      F('isBruteAttackPower', 378, 380, true, 'Predicate: whether a power qualifies as a Brute attack for Fury.', ['brute', 'predicate', 'inherent']),
      F('getSupremacyInfo', 421, 427, true, 'Returns descriptor info for the Mastermind Supremacy inherent (pet damage/to-hit buffs in supremacy range).', ['mastermind', 'inherent', 'info']),
      F('getBodyguardInfo', 432, 438, true, 'Returns descriptor info for Mastermind Bodyguard mode (damage sharing across pets).', ['mastermind', 'inherent', 'info']),
      F('calculateSupremacyDamage', 445, 448, true, 'Applies the Supremacy damage buff to pet base damage.', ['mastermind', 'pets', 'damage']),
      F('calculateSupremacyToHit', 455, 458, true, 'Applies the Supremacy to-hit buff for pets.', ['mastermind', 'pets', 'to-hit']),
      F('calculateBodyguardDamage', 466, 481, true, 'Calculates damage taken by the Mastermind in Bodyguard mode, splitting incoming damage across bodyguard-mode pets.', ['mastermind', 'inherent', 'mitigation'], 'simple'),
      F('isMastermindPower', 486, 488, true, 'Predicate: whether a power belongs to Mastermind inherent handling.', ['mastermind', 'predicate', 'inherent']),
      F('getVigilanceInfo', 549, 556, true, 'Returns descriptor info for the Defender Vigilance inherent (endurance discount from ally health, solo damage bonus).', ['defender', 'inherent', 'info']),
      F('calculateVigilanceDamageBonus', 564, 578, true, 'Calculates the Vigilance solo/small-team damage bonus based on team size.', ['defender', 'inherent', 'damage']),
      F('calculateVigilanceDamage', 588, 591, true, 'Applies the Vigilance damage bonus to base damage.', ['defender', 'inherent', 'damage']),
      F('isDefenderPower', 596, 598, true, 'Predicate: whether a power qualifies for Defender Vigilance handling.', ['defender', 'predicate', 'inherent']),
      F('getOpportunityInfo', 641, 651, true, 'Returns descriptor info for the Sentinel Opportunity inherent (vulnerability debuff and heal/endurance returns).', ['sentinel', 'inherent', 'info']),
      F('isSentinelPower', 656, 658, true, 'Predicate: whether a power belongs to Sentinel inherent handling.', ['sentinel', 'predicate', 'inherent']),
      F('getCriticalHitInfo', 698, 706, true, 'Returns descriptor info for the Scrapper Critical Hit inherent (crit chance vs minions/lieutenants and bosses).', ['scrapper', 'inherent', 'info']),
      F('calculateCriticalHitChance', 713, 716, true, 'Returns the Scrapper crit chance for a given target rank.', ['scrapper', 'inherent', 'probability']),
      F('calculateCriticalHitDamage', 725, 729, true, 'Calculates expected bonus damage from Scrapper critical hits.', ['scrapper', 'inherent', 'damage']),
      F('isScrapperAttackPower', 735, 737, true, 'Predicate: whether a power qualifies for Scrapper critical hits.', ['scrapper', 'predicate', 'inherent']),
      F('getOpportunityCritBonus', 760, 762, true, 'Returns the Sentinel Opportunity crit damage multiplier constant.', ['sentinel', 'inherent', 'damage']),
      F('calculateOpportunityCritDamage', 769, 771, true, 'Calculates bonus damage from Sentinel Opportunity crits.', ['sentinel', 'inherent', 'damage']),
      F('isSentinelAttackPower', 777, 779, true, 'Predicate: whether a power qualifies as a Sentinel attack.', ['sentinel', 'predicate', 'inherent']),
      F('getAssassinationInfo', 823, 834, true, 'Returns descriptor info for the Stalker Assassination inherent (hidden crits, Assassin Focus stacks).', ['stalker', 'inherent', 'info']),
      F('calculateAssassinationCritChance', 842, 852, true, 'Calculates Stalker crit chance from hidden status, team size, and Assassin Focus stacks.', ['stalker', 'inherent', 'probability']),
      F('calculateAssassinationDamageBonus', 865, 876, true, 'Calculates the expected damage bonus multiplier from Assassination crit mechanics.', ['stalker', 'inherent', 'damage']),
      F('calculateAssassinationDamage', 886, 894, true, 'Applies Assassination crit expectations to base damage.', ['stalker', 'inherent', 'damage']),
      F('isStalkerAttackPower', 900, 902, true, 'Predicate: whether a power qualifies for Stalker Assassination mechanics.', ['stalker', 'predicate', 'inherent']),
      F('getGauntletInfo', 937, 944, true, 'Returns descriptor info for the Tanker Gauntlet inherent (taunt on attack, widened AoEs).', ['tanker', 'inherent', 'info']),
      F('calculateGauntletRadius', 951, 954, true, 'Calculates the Gauntlet-boosted AoE radius for Tanker attacks.', ['tanker', 'inherent', 'aoe']),
      F('calculateGauntletArc', 961, 964, true, 'Calculates the Gauntlet-boosted cone arc for Tanker attacks.', ['tanker', 'inherent', 'aoe']),
      F('isTankerPower', 969, 971, true, 'Predicate: whether a power qualifies for Tanker Gauntlet handling.', ['tanker', 'predicate', 'inherent']),
      F('getContainmentInfo', 1008, 1014, true, 'Returns descriptor info for the Controller Containment inherent (double damage vs mezzed targets).', ['controller', 'inherent', 'info']),
      F('calculateContainmentDamageBonus', 1021, 1026, true, 'Returns the Containment damage bonus multiplier when the target is mezzed.', ['controller', 'inherent', 'damage']),
      F('calculateContainmentDamage', 1035, 1039, true, 'Applies the Containment bonus to base damage against contained targets.', ['controller', 'inherent', 'damage']),
      F('isControllerPower', 1044, 1046, true, 'Predicate: whether a power qualifies for Controller Containment.', ['controller', 'predicate', 'inherent']),
    ],
  },
  {
    path: 'src/utils/calculations/jump-height.test.ts', complexity: 'simple',
    summary: 'Tests jump-height character totals against movement-constant bases and caps, guarding the jump buff support added with the travel-speed fixes.',
    tags: ['test', 'movement', 'jump-height', 'character-totals'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/perma.ts', complexity: 'moderate',
    summary: 'Determines whether a click power can be made "perma" (buff duration >= enhanced recharge + cast time) and computes uptime/gap info, including detection of self-state buffs worth keeping up.',
    tags: ['perma', 'recharge', 'uptime', 'game-mechanics', 'utility'],
    fns: [
      F('isPermaEligible', 70, 87, true, 'Decides whether a power is a candidate for perma analysis (click power with a lasting self-state buff and meaningful recharge).', ['perma', 'eligibility', 'predicate']),
      F('hasSelfStateToKeepUp', 97, 144, false, 'Scans a power\'s effects for self-directed lasting buffs (defense, resistance, mez protection, etc.) that justify keeping the power permanently active.', ['perma', 'effects', 'detection'], 'moderate'),
      F('calculatePermaInfo', 153, 193, true, 'Computes perma status for a power: enhanced recharge vs buff duration, uptime percentage, and the recharge still needed to reach perma.', ['perma', 'recharge', 'uptime'], 'moderate'),
    ],
  },
  {
    path: 'src/utils/calculations/proc-global-damage.test.ts', complexity: 'moderate',
    summary: "Tests the Liberty's Belt fused +7.5% global Damage proc: slotting the piece must raise the character damage total via the always-on global proc path.",
    tags: ['test', 'proc', 'global-damage', 'io-set'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/proc-global-recharge.test.ts', complexity: 'moderate',
    summary: 'Tests Luck of the Gambler style global +recharge procs: slotting the piece must contribute its recharge bonus to character totals with Rule-of-5 handling.',
    tags: ['test', 'proc', 'global-recharge', 'io-set'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/proc-runtime-allowlist.test.ts', complexity: 'moderate',
    summary: 'Guards the runtime allowlist of proc effect categories: only recognized always-on global proc categories may flow into character totals, preventing unhandled categories from silently applying.',
    tags: ['test', 'proc', 'allowlist', 'character-totals'],
    fns: [
      F('buildWithSlots', 19, 36, false, 'Test fixture: constructs a build with a slotted power containing the supplied enhancement slots.', ['test-fixture', 'build', 'helper']),
    ],
  },
  {
    path: 'src/utils/calculations/proc-variable-calc.test.ts', complexity: 'moderate',
    summary: 'Tests variable/stacking proc contributions (e.g. Might of the Tanker absorb stacks, Interface-style scaling) so per-stack overrides and interpolated values reach character totals correctly.',
    tags: ['test', 'proc', 'stacking', 'variable-proc'],
    fns: [
      F('tankerBuild', 24, 47, false, 'Test fixture: constructs a Tanker build with proc-slotted powers used across the variable-proc test cases.', ['test-fixture', 'build', 'helper']),
    ],
  },
  {
    path: 'src/utils/calculations/self-penalty-towho.test.ts', complexity: 'moderate',
    summary: 'Verifies converter output for self-directed penalties: effects like Bio Armor Offensive Adaptation\'s -resistance must carry toWho:Self so they are charged to the caster rather than treated as foe debuffs.',
    tags: ['test', 'converter-guard', 'self-penalty', 'dataset'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/stacking-flaw-fix.verify.test.ts', complexity: 'moderate',
    summary: 'Verification test for the perma/stacking flaw fix: linear vs per-target stacking must produce distinct expected values in perma calculations.',
    tags: ['test', 'stacking', 'perma', 'regression-guard'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/stats.ts', complexity: 'moderate',
    summary: 'Provides the empty character-stats factory (all defense/resistance/movement/misc totals zeroed) and baseline health lookup per archetype and level.',
    tags: ['character-stats', 'factory', 'baseline', 'utility'],
    fns: [
      F('createEmptyStats', 67, 104, true, 'Creates a fully zeroed character stats object covering defense, resistance, movement, endurance, and misc total categories.', ['factory', 'character-stats', 'initialization'], 'simple'),
      F('getBaselineHealth', 115, 147, true, 'Returns the unbuffed base hit points for an archetype at a given level, interpolating from AT base HP tables.', ['health', 'archetype', 'baseline'], 'simple'),
    ],
  },
  {
    path: 'src/utils/calculations/stealth-procs.test.ts', complexity: 'moderate',
    summary: 'Tests stealth-granting IO procs (Celerity/Unbounded Leap +Stealth): slotting them must add stealth radius values to character totals with correct PvE/PvP handling.',
    tags: ['test', 'proc', 'stealth', 'io-set'],
    fns: [],
  },
  {
    path: 'src/utils/calculations/strength-buffs.test.ts', complexity: 'complex',
    summary: 'Tests strength-buff collection (Power Boost / Power Build Up style effects): secondary-effect strength buffs must amplify defense, to-hit, and other buff magnitudes in totals and per-power displays.',
    tags: ['test', 'strength-buffs', 'power-boost', 'character-totals'],
    fns: [
      F('buildWith', 161, 175, false, 'Test fixture: constructs a build containing the given powers for strength-buff scenarios.', ['test-fixture', 'build', 'helper']),
    ],
  },
  {
    path: 'src/utils/calculations/travel-speed-fixes.test.ts', complexity: 'complex',
    summary: 'Regression suite for the travel-speed fixes: TravelBuff stack-group exclusivity (strongest per group), movement cap bumps, combat suppression, and pool travel power speeds against movement constants.',
    tags: ['test', 'movement', 'travel-speed', 'regression-guard'],
    fns: [],
  },
  {
    path: 'src/utils/conditional-effects.ts', complexity: 'moderate',
    summary: 'Selects which conditional effect variants of a power are active given build state (stances, AT inherent conditionals like Domination), so displays and totals merge the correct conditional branch.',
    tags: ['conditional-effects', 'stances', 'game-mechanics', 'utility'],
    fns: [
      F('selectActiveConditionals', 73, 107, true, 'Filters a power\'s conditional effects down to the active set based on stance selections and AT inherent conditional toggles.', ['conditional-effects', 'selection', 'stances'], 'simple'),
    ],
  },
  {
    path: 'src/utils/enhancement-eligibility.ts', complexity: 'simple',
    summary: 'Decides whether a given enhancement (IO set piece, generic IO, or special) may legally be slotted into a power, based on the power\'s allowed categories and set types.',
    tags: ['enhancement', 'eligibility', 'validation', 'utility'],
    fns: [
      F('enhancementAllowedInPower', 25, 46, true, 'Checks an enhancement against a power\'s allowed enhancement categories and IO set types to determine slotting legality.', ['enhancement', 'validation', 'predicate']),
    ],
  },
  {
    path: 'src/utils/export-popmenu.ts', complexity: 'complex',
    summary: 'Generates a City of Heroes in-game popmenu (.mnu) file from a build, emitting /boostset and enhancement slotting commands so players can apply the planned build in-game.',
    tags: ['export', 'popmenu', 'serialization', 'game-integration'],
    fns: [
      F('toPascalUnderscore', 50, 60, false, 'Normalizes a display name to the PascalCase/underscore identifier form used by in-game slash commands.', ['formatting', 'normalization', 'helper']),
      F('enhancementToBoostCmd', 155, 213, false, 'Translates a slotted enhancement into the in-game /boostset or enhancement command string, handling IO sets, generics, and special enhancement naming.', ['export', 'command-generation', 'enhancement'], 'moderate'),
      F('collectEnhancements', 222, 242, false, 'Walks the build\'s powers and slots collecting the enhancement command entries to emit.', ['export', 'traversal', 'enhancement']),
      F('generatePopmenu', 251, 311, true, 'Builds the full popmenu file text: menu structure, power sections, and enhancement application commands for the whole build.', ['export', 'popmenu', 'serialization'], 'moderate'),
    ],
  },
  {
    path: 'src/utils/export-print.ts', complexity: 'complex',
    summary: 'Renders a build as a self-contained printable HTML document (powers, slotting, set bonuses, incarnates, and character stat totals) and opens it in a print view window.',
    tags: ['export', 'print', 'html-generation', 'report'],
    fns: [
      F('abbrProcText', 79, 102, false, 'Abbreviates proc effect descriptions to compact labels suitable for the print layout.', ['formatting', 'abbreviation', 'helper']),
      F('formatEnhancementName', 104, 129, false, 'Formats a slotted enhancement into its short display name (set abbreviation + piece, level, boosters).', ['formatting', 'enhancement', 'helper']),
      F('buildStatsHTML', 158, 236, false, 'Generates the character totals section HTML: defense, resistance, movement, and misc stat tables from calculated totals.', ['html-generation', 'character-stats', 'report'], 'moderate'),
      F('powerRow', 242, 268, false, 'Renders a single power row with level, name, and slotted enhancements.', ['html-generation', 'power', 'helper']),
      F('buildIncarnateHTML', 284, 309, false, 'Generates the incarnate abilities section of the printable build.', ['html-generation', 'incarnate', 'report']),
      F('generatePrintHTML', 315, 536, true, 'Assembles the complete printable build document: header, powerset sections, pool/epic powers, incarnates, set bonus summary, and stats, as inline-styled HTML.', ['export', 'html-generation', 'report'], 'complex'),
      F('openPrintView', 541, 548, true, 'Opens the generated print HTML in a new browser window and triggers the print dialog.', ['export', 'print', 'browser']),
    ],
  },
  {
    path: 'src/utils/external-import/converter.ts', complexity: 'complex',
    summary: 'Converts externally sourced build text (in-game export format) into the planner\'s build model: splits multi-build dumps, scores the best segment, converts powers/boosts, and augments incarnates and accolades.',
    tags: ['import', 'converter', 'external-build', 'game-integration'],
    fns: [
      F('resolveHybridPowerName', 129, 137, false, 'Resolves Hybrid incarnate power names that differ between game export and planner naming.', ['incarnate', 'name-resolution', 'helper']),
      F('splitBuilds', 152, 165, false, 'Splits a raw export dump containing multiple builds into separate build segments.', ['parsing', 'segmentation', 'helper']),
      F('scoreBuildSegment', 170, 189, false, 'Scores a build segment by resolvable powers so the most complete segment can be chosen for import.', ['scoring', 'heuristic', 'import']),
      F('getSegmentSetNames', 194, 214, false, 'Extracts the powerset names referenced by a build segment for archetype/powerset resolution.', ['parsing', 'powerset', 'helper']),
      F('convertBoost', 223, 233, false, 'Converts a single exported enhancement (boost) entry into the game-export data model.', ['converter', 'enhancement', 'helper']),
      F('convertPower', 238, 273, false, 'Converts one exported power entry with its slotted boosts into game-export power data.', ['converter', 'power', 'import'], 'simple'),
      F('convertToGameExportData', 278, 302, false, 'Wraps parsed external build content into the GameExportData structure consumed by the shared game importer.', ['converter', 'adapter', 'import']),
      F('augmentIncarnates', 308, 362, false, 'Maps incarnate powers from the external export onto the build\'s incarnate slots, resolving tiers and branches by name.', ['incarnate', 'import', 'mapping'], 'moderate'),
      F('augmentAccolades', 368, 383, false, 'Enables accolade bonuses on the imported build for accolade powers present in the export.', ['accolades', 'import', 'mapping']),
      F('importExternalBuild', 394, 509, true, 'Top-level external import: parses the pasted export, selects the best build segment, runs the shared game importer, then augments incarnates and accolades, returning result plus warnings.', ['import', 'orchestration', 'external-build'], 'complex'),
    ],
  },
  {
    path: 'src/utils/external-import/index.ts', complexity: 'simple',
    summary: 'Barrel module re-exporting the external build importer entry point and its result types.',
    tags: ['barrel', 'entry-point', 'import'],
    fns: [],
  },
  {
    path: 'src/utils/game-importer/index.ts', complexity: 'simple',
    summary: 'Barrel module exposing the shared in-game export importer (importGameExport/importFromParsedData) and its data/result types to other import pipelines.',
    tags: ['barrel', 'entry-point', 'import'],
    fns: [],
  },
  {
    path: 'src/utils/import-url.ts', complexity: 'moderate',
    summary: 'Encodes and decodes the URL hash fragment used to hand off pasted build imports between pages, compressing the payload for shareable import links.',
    tags: ['url', 'encoding', 'import', 'utility'],
    fns: [
      F('decodeImportFragment', 14, 56, true, 'Decodes and decompresses a build-import payload from a URL hash fragment, validating structure and tolerating malformed input.', ['decoding', 'url', 'import'], 'simple'),
      F('encodeImportFragment', 62, 70, true, 'Compresses and encodes a build-import payload into a URL-safe hash fragment.', ['encoding', 'url', 'import']),
    ],
  },
  {
    path: 'src/utils/kheldian-import.test.ts', complexity: 'moderate',
    summary: 'Tests importing Kheldian (Peacebringer/Warshade) builds through both the external and Mids import pipelines, covering form powers and Kheldian-specific powerset resolution.',
    tags: ['test', 'import', 'kheldian', 'integration'],
    fns: [],
  },
  {
    path: 'src/utils/mids-export.ts', complexity: 'complex',
    summary: 'Exports a planner build to the Mids Reborn .mbd JSON format: maps archetype/powerset paths to Mids UIDs, converts slotted enhancements (IO sets, generics, origins, specials), and emits the full build document.',
    tags: ['export', 'mids-reborn', 'serialization', 'interoperability'],
    fns: [
      F('buildPowersetPath', 118, 134, false, 'Builds the Mids powerset UID path (category-prefixed) for a powerset selection.', ['mids', 'uid-mapping', 'powerset']),
      F('buildPowerName', 141, 170, false, 'Maps a planner power to its Mids power UID, handling renames and internal-name divergences.', ['mids', 'uid-mapping', 'power']),
      F('buildRelativeLevel', 177, 187, false, 'Converts an enhancement level/booster state into Mids relative-level encoding.', ['mids', 'enhancement', 'encoding']),
      F('buildEnhancement', 190, 203, false, 'Dispatches a slotted enhancement to the correct Mids enhancement builder by type.', ['mids', 'enhancement', 'dispatch']),
      F('buildIOSetEnhancement', 218, 252, false, 'Builds the Mids representation of an IO set piece, resolving set UID stems and piece indices.', ['mids', 'io-set', 'enhancement'], 'simple'),
      F('buildGenericIOEnhancement', 254, 263, false, 'Builds the Mids representation of a generic (common) IO enhancement.', ['mids', 'generic-io', 'enhancement']),
      F('buildOriginEnhancement', 265, 274, false, 'Builds the Mids representation of an origin (SO/DO/TO) enhancement.', ['mids', 'origin', 'enhancement']),
      F('buildSpecialEnhancement', 323, 346, false, 'Builds the Mids representation of special enhancements (Hamidon, D-Sync, Titan, Hydra).', ['mids', 'special-enhancement', 'enhancement']),
      F('exportToMids', 369, 503, true, 'Top-level Mids export: assembles the .mbd document with build metadata, power entries, slot entries, and incarnate selections.', ['export', 'mids-reborn', 'orchestration'], 'complex'),
    ],
  },
  {
    path: 'src/utils/mids-import/importer.test.ts', complexity: 'moderate',
    summary: 'Tests the Mids Reborn .mbd import path: parsed Mids files must resolve to the correct archetype, powersets, powers, and slotted enhancements.',
    tags: ['test', 'import', 'mids-reborn', 'integration'],
    fns: [],
  },
  {
    path: 'src/utils/mids-import/index.ts', complexity: 'simple',
    summary: 'Barrel module re-exporting the Mids Reborn build importer and its file/result types.',
    tags: ['barrel', 'entry-point', 'import'],
    fns: [],
  },
  {
    path: 'src/utils/mxd-import/importer.ts', complexity: 'complex',
    summary: 'Imports legacy Mids .mxd plain-text build exports: resolves archetypes, powersets, pools, epics, and incarnates by display name, and matches slotted enhancements via set-abbreviation lookup.',
    tags: ['import', 'mxd', 'name-resolution', 'interoperability'],
    fns: [
      F('importMxdBuild', 28, 223, true, 'Top-level MxD import: parses the text, resolves the archetype and each power against the dataset, places powers/slots into a new build, and collects warnings.', ['import', 'orchestration', 'mxd'], 'complex'),
      F('findPowersetByDisplayName', 229, 256, false, 'Resolves a powerset by display name for the imported archetype, tolerating renames and near matches.', ['name-resolution', 'powerset', 'helper']),
      F('findPoolByDisplayName', 258, 267, false, 'Resolves a power pool by its display name.', ['name-resolution', 'pool', 'helper']),
      F('findPowerInBuild', 276, 322, false, 'Locates the matching power definition for an imported power name across primary/secondary/pool/epic sources.', ['name-resolution', 'power', 'lookup'], 'simple'),
      F('resolveIncarnateByDisplayName', 328, 358, false, 'Resolves an incarnate power selection from its MxD display name, inferring slot, tier, and branch.', ['incarnate', 'name-resolution', 'helper']),
      F('resolveEnhancement', 360, 400, false, 'Resolves an imported enhancement string into an IO set piece, generic IO, or special enhancement.', ['enhancement', 'name-resolution', 'lookup'], 'simple'),
      F('matchPieceByAbbrev', 402, 446, false, 'Matches a set-piece abbreviation (e.g. "LotG-Def/EndRdx") to the concrete IO set piece using abbreviation tables.', ['enhancement', 'abbreviation', 'matching'], 'simple'),
    ],
  },
  {
    path: 'src/utils/mxd-import/index.ts', complexity: 'simple',
    summary: 'Barrel module re-exporting the MxD text parser, importer, parsed-build types, and abbreviation tables.',
    tags: ['barrel', 'entry-point', 'import'],
    fns: [],
  },
  {
    path: 'src/utils/mxd-import/parser.ts', complexity: 'complex',
    summary: 'Parses legacy Mids .mxd plain-text exports into a structured parsed-build model: header (archetype/origin), power lines with levels, and enhancement strings with set abbreviations and boosters.',
    tags: ['parser', 'mxd', 'text-parsing', 'import'],
    fns: [
      F('parseMxdText', 56, 176, true, 'Parses the full MxD export text into archetype, powerset, power, and slot structures, tolerating format variations across Mids versions.', ['parser', 'mxd', 'text-parsing'], 'complex'),
      F('parseEnhancementString', 183, 252, false, 'Parses one enhancement token into set abbreviation, piece descriptor, level, and booster count.', ['parser', 'enhancement', 'tokenization'], 'moderate'),
    ],
  },
  {
    path: 'src/utils/url-build-sync.ts', complexity: 'moderate',
    summary: 'React hook that keeps the current build synchronized with the URL hash: serializes the build into a shareable link, restores builds from incoming URLs, and handles import fragments.',
    tags: ['hook', 'url', 'serialization', 'sharing'],
    fns: [
      F('buildShareUrl', 28, 36, true, 'Constructs a shareable URL embedding the serialized build hash.', ['url', 'sharing', 'serialization']),
      F('writeUrl', 39, 48, false, 'Writes the encoded build hash into the browser URL without triggering navigation.', ['url', 'history', 'helper']),
      F('useUrlBuildSync', 59, 138, true, 'React hook wiring build-store state to the URL: decodes builds or import fragments on load and re-encodes the hash when the build changes.', ['hook', 'url', 'synchronization'], 'moderate'),
    ],
  },
];

// --- build nodes/edges ---
const nodes = [];
const edges = [];
const basename = p => p.split('/').pop();

for (const f of files) {
  const fileId = `file:${f.path}`;
  const node = {
    id: fileId, type: 'file', name: basename(f.path), filePath: f.path,
    summary: f.summary, tags: f.tags, complexity: f.complexity,
  };
  if (f.languageNotes) node.languageNotes = f.languageNotes;
  nodes.push(node);

  for (const fn of f.fns) {
    const fnId = `function:${f.path}:${fn.name}`;
    nodes.push({
      id: fnId, type: 'function', name: fn.name, filePath: f.path,
      lineRange: [fn.s, fn.e], summary: fn.summary, tags: fn.tags, complexity: fn.complexity,
    });
    edges.push({ source: fileId, target: fnId, type: 'contains', direction: 'forward', weight: 1.0 });
    if (fn.exported) {
      edges.push({ source: fileId, target: fnId, type: 'exports', direction: 'forward', weight: 0.8 });
    }
  }
}

// imports: 1:1 from batchImportData
let importCount = 0;
for (const f of files) {
  const targets = importData[f.path] || [];
  for (const t of targets) {
    edges.push({ source: `file:${f.path}`, target: `file:${t}`, type: 'imports', direction: 'forward', weight: 0.7 });
    importCount++;
  }
}

// tested_by: production -> test
const testedBy = [
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/incandescence-heal-received.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/incarnate-effects-completeness.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/incarnate-exemplar.test.ts'],
  ['src/utils/calculations/effective-level.ts', 'src/utils/calculations/incarnate-exemplar.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/jump-height.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/proc-global-damage.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/proc-global-recharge.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/proc-runtime-allowlist.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/proc-variable-calc.test.ts'],
  ['src/data/powersets.ts', 'src/utils/calculations/self-penalty-towho.test.ts'],
  ['src/utils/calculations/perma.ts', 'src/utils/calculations/stacking-flaw-fix.verify.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/stealth-procs.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/strength-buffs.test.ts'],
  ['src/utils/calculations/character-totals.ts', 'src/utils/calculations/travel-speed-fixes.test.ts'],
  ['src/utils/external-import/index.ts', 'src/utils/kheldian-import.test.ts'],
  ['src/utils/mids-import/index.ts', 'src/utils/kheldian-import.test.ts'],
  ['src/utils/mids-import/index.ts', 'src/utils/mids-import/importer.test.ts'],
];
for (const [src, tgt] of testedBy) {
  edges.push({ source: `file:${src}`, target: `file:${tgt}`, type: 'tested_by', direction: 'forward', weight: 0.5, _testFile: tgt });
}

// calls (both endpoints are nodes in this batch)
edges.push({ source: 'function:src/utils/url-build-sync.ts:useUrlBuildSync', target: 'function:src/utils/import-url.ts:decodeImportFragment', type: 'calls', direction: 'forward', weight: 0.8 });
edges.push({ source: 'function:src/utils/mxd-import/importer.ts:importMxdBuild', target: 'function:src/utils/mxd-import/parser.ts:parseMxdText', type: 'calls', direction: 'forward', weight: 0.8 });

// --- partition into 3 parts, files sorted alphabetically, chunks of 11 ---
const sortedPaths = files.map(f => f.path).sort();
const parts = 3;
const chunkSize = Math.ceil(sortedPaths.length / parts); // 11
const pathToPart = {};
sortedPaths.forEach((p, i) => { pathToPart[p] = Math.floor(i / chunkSize) + 1; });

const partOfNode = id => {
  const m = id.match(/^(?:file|function):([^:]+)/);
  return m && pathToPart[m[1]] !== undefined ? pathToPart[m[1]] : null;
};

const partNodes = { 1: [], 2: [], 3: [] };
const partEdges = { 1: [], 2: [], 3: [] };
for (const n of nodes) partNodes[partOfNode(n.id)].push(n);
for (const e of edges) {
  let p = partOfNode(e.source);
  if (p === null) p = partOfNode(e.target); // out-of-batch source (tested_by): place with test file
  const { _testFile, ...clean } = e;
  partEdges[p].push(clean);
}

// --- validation ---
const allNodeIds = new Set(nodes.map(n => n.id));
const knownFilePaths = new Set([
  ...Object.keys(importData),
  ...Object.values(importData).flat(),
  ...testedBy.map(t => t[0]),
]);
let errors = [];
const seen = new Set();
for (const n of nodes) {
  if (seen.has(n.id)) errors.push('dup node ' + n.id);
  seen.add(n.id);
  if (!n.summary || !n.tags.length) errors.push('empty summary/tags ' + n.id);
}
for (const p of [1, 2, 3]) {
  for (const e of partEdges[p]) {
    if (e.source === e.target) errors.push('self-edge ' + e.source);
    for (const end of [e.source, e.target]) {
      if (allNodeIds.has(end)) continue;
      const m = end.match(/^file:(.+)$/);
      if (m && knownFilePaths.has(m[1])) continue;
      errors.push(`part ${p}: unresolvable endpoint ${end} (${e.type})`);
    }
  }
}
const totalImports = edges.filter(e => e.type === 'imports').length;
const expectedImports = Object.values(importData).reduce((a, v) => a + v.length, 0);
if (totalImports !== expectedImports) errors.push(`import count ${totalImports} != expected ${expectedImports}`);

if (errors.length) { console.error('VALIDATION ERRORS:\n' + errors.join('\n')); process.exit(1); }

for (const p of [1, 2, 3]) {
  const out = { nodes: partNodes[p], edges: partEdges[p] };
  const path = `${ROOT}/.ua/intermediate/batch-4-part-${p}.json`;
  fs.writeFileSync(path, JSON.stringify(out, null, 1));
  JSON.parse(fs.readFileSync(path, 'utf8')); // round-trip check
  console.log(`part ${p}: ${out.nodes.length} nodes, ${out.edges.length} edges -> ${path}`);
}
console.log(`TOTAL: ${nodes.length} nodes, ${edges.length} edges, imports=${totalImports}/${expectedImports}`);
const byType = {};
for (const e of edges) byType[e.type] = (byType[e.type] || 0) + 1;
console.log('edge types:', JSON.stringify(byType));
