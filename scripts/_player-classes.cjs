/**
 * The class-table files the planner consumes, shared by the converters that
 * read `exported_powers/<id>/tables/`. The export carries every server class
 * (NPC bosses, pets, monuments…); this module names the player-facing subset.
 *
 * `derivePlayerArchetypes` reads that subset straight from the export's own
 * membership signal instead of a hand-maintained allowlist — so a new
 * archetype flows in, and a fixed NPC-misclassification flows out, with no
 * edit here (resolved DATA-GAP-REGISTER CLASSES-2, 2026-07-21: the WS8
 * sequential parse restored the header fields this reads).
 *
 * `PET_CLASSES` is not derivable from the class files themselves — every pet
 * class carries the same NPC-rank / empty-restriction signal as a random enemy
 * boss. But it IS derivable from the other side: `discoverPetClasses` reads the
 * class each exported summon actually declares. The hand list below survives
 * only as a floor.
 */

const fs = require('node:fs');
const path = require('node:path');

const PET_CLASSES = [
  'minion_pets',
  'minion_controllerpets',
  'henchman_minion',
  'henchman_minion_small',
  'henchman_boss',
  'henchman_lt',
  'boss_heavypet',
  'minion_turret',
  'minion_monument',
  'boss_praetoriangrunt_pet',
  'lt_praetoriangrunt_pet',
  'minion_praetoriansmall',
];

// A class file is player-facing when the export's own membership signal says
// so. That signal differs by dataset SCHEMA, not by name (CLASSES-1/WS8):
// Homecoming deleted i24's origin-restriction fields and added VillainRank
// (0 for players, 1-11 for NPC ranks), so HC keys on `villain_rank === 0`; the
// forks kept i24's restriction gating, where every playable class carries
// Hero/Villain/Kheldian/Arachnos vocab and NPC classes carry none, so they key
// on a non-empty `special_restrictions`. Each field is present on exactly the
// dataset that owns it, so the presence check picks the right one per record.
function isPlayerClass(record) {
  if ('villain_rank' in record) return record.villain_rank === 0;
  return Array.isArray(record.special_restrictions) && record.special_restrictions.length > 0;
}

// Derive the player-archetype file stems from a dataset's exported `tables/`
// dir. Sorted for deterministic output (the generated maps are keyed by
// archetype, so entry order is cosmetic). Reproduces the former hand list
// exactly on all three datasets.
function derivePlayerArchetypes(tablesDir) {
  const stems = fs
    .readdirSync(tablesDir)
    .filter((file) => file.endsWith('.json') && !file.startsWith('_'))
    .map((file) => file.slice(0, -'.json'.length))
    .filter((stem) =>
      isPlayerClass(JSON.parse(fs.readFileSync(path.join(tablesDir, `${stem}.json`), 'utf-8'))),
    )
    .sort();

  // Fail loud on a desynced discriminator: a parser regression that dropped
  // both membership fields would silently empty this list, which then silently
  // drops every archetype's modifier tables downstream (the FLAGS-2 failure
  // mode — a self-consistent-but-wrong export). Every real dataset carries ~15
  // player archetypes; the precise per-dataset count is pinned by the coverage
  // and staleness tests.
  if (stems.length < 10) {
    throw new Error(
      `derivePlayerArchetypes: only ${stems.length} player class(es) found in ${tablesDir} — `
        + 'expected ~15. The villain_rank / special_restrictions membership signal likely '
        + 'desynced (schema drift).',
    );
  }
  return stems;
}

/**
 * Every character class named by a villain def in `entitiesDir`, unioned with
 * the PET_CLASSES floor. Sorted for deterministic output.
 *
 * The hand list named only Homecoming's spellings. HC renamed the Mastermind
 * henchman classes (`minion_henchman` → `henchman_minion`) and forked the Lore
 * classes (`lt_praetoriangrunt` → `lt_praetoriangrunt_pet`); Rebirth and
 * Thunderspy still ship the originals. So on two of the three datasets every
 * henchman and every Lore pet resolved against no class row — which is not an
 * error anywhere, it is a pet that deals no damage and has no hit points.
 * Skipping a class is never neutral; see the AT-table allowlist gap in
 * GAME-DATA-PRINCIPLES.
 */
function discoverPetClasses(entitiesDir) {
  const found = new Set(PET_CLASSES);
  if (!fs.existsSync(entitiesDir)) return [...found].sort();

  for (const file of fs.readdirSync(entitiesDir)) {
    if (!file.endsWith('.json') || file.startsWith('_')) continue;
    let record;
    try {
      record = JSON.parse(fs.readFileSync(path.join(entitiesDir, file), 'utf-8'));
    } catch {
      continue;
    }
    const cls = record && record.defaults && record.defaults.character_class_name;
    if (typeof cls === 'string' && cls.length > 0) found.add(cls);
  }
  return [...found].sort();
}

// The same player subset in the `Class_*` spelling an effect gate uses, read off
// each record's own `name` rather than transformed from its file stem — the
// parser resolves an archetype fork against exactly this roster
// (`export_powers._player_class_names`), so a spelling this side invented could
// silently fail to match a `requires_archetypes` entry and read as "not in the
// roster", which is the answer that decides whether a bag slot is stated at all.
function derivePlayerClassTokens(tablesDir) {
  return derivePlayerArchetypes(tablesDir)
    .map((stem) => JSON.parse(fs.readFileSync(path.join(tablesDir, `${stem}.json`), 'utf-8')).name)
    .sort();
}

module.exports = {
  derivePlayerArchetypes,
  derivePlayerClassTokens,
  PET_CLASSES,
  discoverPetClasses,
};
