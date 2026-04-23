/**
 * Powerset Conversion Script
 *
 * Converts raw Homecoming power data to the new modular structure.
 * Usage: node scripts/convert-powerset.js <category> <powerset>
 * Example: node scripts/convert-powerset.js defender_buff radiation_emission
 */

const fs = require('fs');
const path = require('path');

// Source: bin-crawler JSON export (tools/bin-crawler/bin_crawler/export_powers.py)
// reading live HC .pigg archives. This is current HC data on every re-run;
// the old CoD2 snapshot at raw_data_homecoming-20251209_7415/ has been
// retired now that the encoded-string resolver lands the missing
// display_help / display_short_help strings.
const RAW_DATA_PATH = path.join(__dirname, '../exported_powers');
// The convert writes into three parallel trees (see src/data/README.md):
//   generated/  — full auto-extraction, overwritten on every run
//   overrides/  — hand-written deltas, scaffolded as empty stubs, never overwritten
//   powersets/  — composed exports + index.ts, composed stub scaffolded, never
//                 overwritten for individual powers (index.ts IS overwritten
//                 since it just lists the powers and doesn't carry manual data)
const OUTPUT_GENERATED_PATH = './src/data/generated/powersets';
const OUTPUT_OVERRIDES_PATH = './src/data/overrides/powersets';
const OUTPUT_PATH = './src/data/powersets';

// Map raw category names to our folder structure
const CATEGORY_MAP = {
  // Heroes
  'defender_buff': { archetype: 'defender', type: 'primary' },
  'defender_ranged': { archetype: 'defender', type: 'secondary' },
  'controller_control': { archetype: 'controller', type: 'primary' },
  'controller_buff': { archetype: 'controller', type: 'secondary' },
  'blaster_ranged': { archetype: 'blaster', type: 'primary' },
  'blaster_support': { archetype: 'blaster', type: 'secondary' },
  'tanker_defense': { archetype: 'tanker', type: 'primary' },
  'tanker_melee': { archetype: 'tanker', type: 'secondary' },
  'scrapper_melee': { archetype: 'scrapper', type: 'primary' },
  'scrapper_defense': { archetype: 'scrapper', type: 'secondary' },
  // Villains
  'corruptor_ranged': { archetype: 'corruptor', type: 'primary' },
  'corruptor_buff': { archetype: 'corruptor', type: 'secondary' },
  'brute_melee': { archetype: 'brute', type: 'primary' },
  'brute_defense': { archetype: 'brute', type: 'secondary' },
  'dominator_control': { archetype: 'dominator', type: 'primary' },
  'dominator_assault': { archetype: 'dominator', type: 'secondary' },
  'mastermind_summon': { archetype: 'mastermind', type: 'primary' },
  'mastermind_buff': { archetype: 'mastermind', type: 'secondary' },
  'stalker_melee': { archetype: 'stalker', type: 'primary' },
  'stalker_defense': { archetype: 'stalker', type: 'secondary' },
  // Praetorian
  'sentinel_ranged': { archetype: 'sentinel', type: 'primary' },
  'sentinel_defense': { archetype: 'sentinel', type: 'secondary' },
  // Kheldians — both the defensive and offensive categories live under
  // the same `epic` path in the composed tree (Luminous/Umbral Aura &
  // Blast), matching the existing Powerset.category = 'epic'.
  'peacebringer_defensive': { archetype: 'peacebringer', type: 'epic' },
  'peacebringer_offensive': { archetype: 'peacebringer', type: 'epic' },
  'warshade_defensive': { archetype: 'warshade', type: 'epic' },
  'warshade_offensive': { archetype: 'warshade', type: 'epic' },
  // Arachnos Soldiers / Widows — under HC's bin layout the SoA powers
  // span four source categories: arachnos_soldiers (core soldier sets),
  // training_gadgets (soldier training auxiliaries), widow_training
  // (widow training sets), and teamwork (shared widow leadership/buff).
  // All land under arachnos-soldier/epic or arachnos-widow/epic.
  'arachnos_soldiers': { archetype: 'arachnos-soldier', type: 'epic' },
  'training_gadgets': { archetype: 'arachnos-soldier', type: 'epic' },
  'widow_training': { archetype: 'arachnos-widow', type: 'epic' },
  'teamwork': { archetype: 'arachnos-widow', type: 'epic' },
};

// Enhancement type mapping
const BOOST_TYPE_MAP = {
  'Reduce Endurance Cost': 'EnduranceReduction',
  'Enhance Recharge Speed': 'Recharge',
  'Enhance Accuracy': 'Accuracy',
  'Enhance Range': 'Range',
  'Enhance Damage': 'Damage',
  'Enhance ToHit DeBuffs': 'ToHit Debuff',
  'Enhance Defense DeBuff': 'Defense Debuff',
  'Enhance Heal': 'Healing',
  'Enhance Defense Buff': 'Defense',
  'Enhance Resist Damage': 'Resistance',
  'Enhance Hold': 'Hold',
  'Enhance Hold Duration': 'Hold',
  'Enhance Stun': 'Stun',
  'Enhance Stun Duration': 'Stun',
  'Enhance Disorient': 'Stun',
  'Enhance Disorient Duration': 'Stun',
  'Enhance Immobilize': 'Immobilize',
  'Enhance Immobilize Duration': 'Immobilize',
  'Enhance Sleep': 'Sleep',
  'Enhance Sleep Duration': 'Sleep',
  'Enhance Confuse': 'Confuse',
  'Enhance Confuse Duration': 'Confuse',
  'Enhance Fear': 'Fear',
  'Enhance Fear Duration': 'Fear',
  'Enhance Knockback': 'Knockback',
  'Enhance ToHit Buff': 'ToHit',
  'Enhance Slow': 'Slow',
  'Enhance Slow Movement': 'Slow',
  'Enhance Fly Speed': 'Fly',
  'Enhance Run Speed': 'Run Speed',
  'Enhance Jump': 'Jump',
  'Enhance Intangible Duration': 'Intangible',
  'Enhance Taunt': 'Taunt',
  // Additional mappings found via audit (variant raw names)
  'Enhance Threat Duration': 'Taunt',
  'Enhance KnockBack': 'Knockback',
  'Enhance Endurance Modification': 'EnduranceModification',
  'Enhance Damage Resistance': 'Resistance',
  'Enhance Defense': 'Defense',
  'Enhance ToHit Buffs': 'ToHit',
  'Enhance Immobilization': 'Immobilize',
  'Reduce Interrupt Time': 'Interrupt',
  'Enhance Running Speed': 'Run Speed',
  'Enhance Flying Speed': 'Fly',
};

// Mapping for bin-crawler's boost-type enum names to the planner's
// EnhancementStatType. (Bin-crawler already uses short names close to the
// planner's format; a few still need translation.)
const BIN_BOOST_MAP = {
  'Accuracy': 'Accuracy',
  'Buff_Defense': 'Defense',
  'Buff_ToHit': 'ToHit',
  'Confuse': 'Confuse',
  'Damage': 'Damage',
  'Debuff_Defense': 'Defense Debuff',
  'Debuff_ToHit': 'ToHit Debuff',
  'Fear': 'Fear',
  'SpeedFlying': 'Fly',
  'Heal': 'Healing',
  'Immobilize': 'Immobilize',
  'Jump': 'Jump',
  'Knockback': 'Knockback',
  'Recharge': 'Recharge',
  'SpeedRunning': 'Run Speed',
  'Sleep': 'Sleep',
  'Stun': 'Stun',
  'Range': 'Range',
  'EnduranceDiscount': 'EnduranceReduction',
  'Taunt': 'Taunt',
  'Slow': 'Slow',
  'Hold': 'Hold',
  'Intangible': 'Intangible',
  'Interrupt': 'Interrupt',
  'Recovery': 'EnduranceModification',
  'Endurance_Drain': 'EnduranceModification',
  'Res_Damage': 'Resistance',
  // Origin tags (Science/Mutation/Magic/Technology/Natural) intentionally
  // unmapped — they aren't enhancement categories.
};

// Map bin-crawler's full effect-area enum to the planner's narrower
// EffectArea type. CoD2 used "AoE" for what bin-crawler labels "Sphere",
// and the planner only recognizes the canonical five values.
const EFFECT_AREA_MAP = {
  'SingleTarget': 'SingleTarget',
  'Cone': 'Cone',
  'Sphere': 'AoE',
  'Location': 'Location',
  'Chain': 'Chain',
  // Volume/NamedVolume/Map/Room/Touch/Box — not normally seen on player
  // powers; map to undefined so callers fall back to default behavior.
};

// IO Set category mapping
const SET_CATEGORY_MAP = {
  'Accurate Defense Debuff': 'Accurate Defense Debuff',
  'Accurate Healing': 'Accurate Healing',
  'Accurate ToHit Debuff': 'Accurate To-Hit Debuff',
  'Blaster Archetype Sets': 'Blaster Archetype Sets',
  'Confuse': 'Confuse',
  'Controller Archetype Sets': 'Controller Archetype Sets',
  'Corruptor Archetype Sets': 'Corruptor Archetype Sets',
  'Defender Archetype Sets': 'Defender Archetype Sets',
  'Defense': 'Defense Sets',
  'Defense Debuff': 'Defense Debuff',
  'Dominator Archetype Sets': 'Dominator Archetype Sets',
  'Endurance Modification': 'Endurance Modification',
  'Fear': 'Fear',
  'Flight': 'Flight',
  'Healing': 'Healing',
  'Hold': 'Hold',
  'Immobilize': 'Immobilize',
  'Jumping': 'Jumping',
  'Knockback': 'Knockback',
  'Mastermind Archetype Sets': 'Mastermind Archetype Sets',
  'Melee Damage': 'Melee Damage',
  'PBAoE Damage': 'PBAoE Damage',
  'Pet Damage': 'Pet Damage',
  'Ranged Damage': 'Ranged Damage',
  'Ranged AoE Damage': 'Ranged AoE Damage',
  'Resist Damage': 'Resist Damage',
  'Running': 'Running',
  'Running & Sprints': 'Running & Sprints',
  'Sleep': 'Sleep',
  'Slow Movement': 'Slow Movement',
  'Sniper Attacks': 'Sniper Attacks',
  'Stuns': 'Stuns',
  'Targeted AoE Damage': 'Targeted AoE Damage',
  'Taunt': 'Taunt',
  'To Hit Buff': 'To Hit Buff',
  'To Hit Debuff': 'To Hit Debuff',
  'Travel': 'Travel',
  'Universal Damage Sets': 'Universal Damage Sets',
  'Universal Travel': 'Universal Travel',
};

// Allow-list for raw allowed_boostset_cats values that already match the
// IOSetCategory union directly (i.e. don't need translation through
// SET_CATEGORY_MAP). New categories added by HC patches can be added here
// without touching the type union immediately.
const KNOWN_IO_SET_CATEGORIES = new Set([
  ...Object.values(SET_CATEGORY_MAP),
  'Defense Sets', 'Resist Damage',
  'Holds', 'Confuse', 'Fear', 'Sleep', 'Knockback', 'Immobilize',
  'Healing', 'Endurance Modification',
  'Pet Damage', 'Recharge Intensive Pets',
  'Sniper Attacks', 'PBAoE Damage',
  'Threat Duration',
  'Leaping', 'Leaping & Sprints', 'Flight', 'Teleport',
  'Blaster Archetype Sets', 'Brute Archetype Sets', 'Controller Archetype Sets',
  'Corruptor Archetype Sets', 'Defender Archetype Sets', 'Dominator Archetype Sets',
  'Mastermind Archetype Sets', 'Scrapper Archetype Sets', 'Stalker Archetype Sets',
  'Tanker Archetype Sets', 'Sentinel Archetype Sets',
]);

// ============================================================================
// inferAllowedSetCategories — derive IO set categories from boost types
// ----------------------------------------------------------------------------
// The bin parser's `allowed_boostset_cats` field is broken (always empty or
// corrupted FX-path fragments — see the binparser-bug audit). Until that's
// fixed at the parser level, we infer the categories from boosts_allowed plus
// the power's targeting/effect-area context. The patterns were derived
// empirically from the previously-correct generated data and verified across
// every archetype.
//
// Inputs:
//   boosts          — bin BOOST_TYPE names from boosts_allowed (e.g. ['Damage', 'Accuracy'])
//   archetypeId     — kebab-case AT id from CATEGORY_MAP (e.g. 'tanker', 'stalker')
//   powerType       — 'primary' | 'secondary' | 'epic' | 'pool' | …
//   effectArea      — 'SingleTarget' | 'AoE' | 'Cone' | 'Location' | 'Character'
//   range           — power range in feet (0 for melee/self)
// Output: list of IOSetCategory values, deduped + alphabetized for stable diffs.
// ============================================================================

// Boost types that map 1:1 to a single IOSetCategory (no context needed).
const BOOST_TO_CATEGORY = {
  Buff_Defense: 'Defense Sets',
  Defense: 'Defense Sets',
  Res_Damage: 'Resist Damage',
  Resistance: 'Resist Damage',
  Heal: 'Healing',
  Healing: 'Healing',
  Buff_ToHit: 'To Hit Buff',
  ToHit: 'To Hit Buff',
  Debuff_ToHit: 'To Hit Debuff',
  Debuff_Defense: 'Defense Debuff',
  Hold: 'Holds',
  Stun: 'Stuns',
  Confuse: 'Confuse',
  Sleep: 'Sleep',
  Fear: 'Fear',
  Immobilize: 'Immobilize',
  Knockback: 'Knockback',
  Slow: 'Slow Movement',
  Taunt: 'Threat Duration',
  EnduranceModification: 'Endurance Modification',
  Recovery: 'Endurance Modification',
  Endurance_Drain: 'Endurance Modification',
};

// "Damage ATO" — these archetypes' ATO sets attach to any damaging power.
const DAMAGE_ATO_BY_AT = {
  blaster:    'Blaster Archetype Sets',
  brute:      'Brute Archetype Sets',
  corruptor:  'Corruptor Archetype Sets',
  defender:   'Defender Archetype Sets',
  scrapper:   'Scrapper Archetype Sets',
  sentinel:   'Sentinel Archetype Sets',
  stalker:    'Stalker Archetype Sets',
  tanker:     'Tanker Archetype Sets',
  'arachnos-soldier': 'Soldiers of Arachnos Archetype Sets',
  'arachnos-widow':   'Soldiers of Arachnos Archetype Sets',
  peacebringer: 'Kheldian Archetype Sets',
  warshade:     'Kheldian Archetype Sets',
};

// "Control ATO" — Controller/Dominator ATOs attach to mez/control powers.
const CONTROL_ATO_BY_AT = {
  controller: 'Controller Archetype Sets',
  dominator:  'Dominator Archetype Sets',
};
const MEZ_BOOSTS = new Set(['Hold', 'Stun', 'Confuse', 'Sleep', 'Fear', 'Immobilize']);

function inferAllowedSetCategories(boosts, archetypeId, powerType, effectArea, range) {
  const cats = new Set();
  const boostSet = new Set(boosts || []);

  // Simple 1:1 mappings
  for (const b of boostSet) {
    if (BOOST_TO_CATEGORY[b]) cats.add(BOOST_TO_CATEGORY[b]);
  }

  // "Accurate" debuff/heal categories: a power that also carries Accuracy
  // alongside a Debuff/Heal boost typically accepts the "Accurate X" set
  // in addition to the plain X set (e.g. Touch of Fear → ToHit Debuff +
  // Accurate ToHit Debuff). Damage boost isn't required — many control
  // powers with secondary -ToHit (foe-target attacks) get this.
  const hasAccuracy = boostSet.has('Accuracy');
  if (hasAccuracy || boostSet.has('Damage')) {
    if (boostSet.has('Debuff_Defense') || boostSet.has('Defense Debuff')) cats.add('Accurate Defense Debuff');
    if (boostSet.has('Debuff_ToHit') || boostSet.has('ToHit Debuff')) cats.add('Accurate To-Hit Debuff');
    if (boostSet.has('Heal') || boostSet.has('Healing')) cats.add('Accurate Healing');
  }

  // Damage is context-sensitive
  if (boostSet.has('Damage')) {
    const hasRange = boostSet.has('Range');
    cats.add('Universal Damage Sets');
    const area = effectArea || 'SingleTarget';
    if (area === 'SingleTarget') {
      if (hasRange) {
        cats.add('Ranged Damage');
        // Sniper attacks: range typically >= 150. Plain ranged caps around 80.
        if (range && range >= 150) cats.add('Sniper Attacks');
      } else {
        cats.add('Melee Damage');
      }
    } else if (area === 'Cone' || area === 'AoE') {
      cats.add(hasRange ? 'Ranged AoE Damage' : 'Melee AoE Damage');
    }
    // Location-targeted attacks (Trip Mine, Caltrops, etc.) typically get
    // Targeted/Ranged AoE Damage. Pet Damage applies to summon powers handled below.
    else if (area === 'Location') {
      cats.add('Ranged AoE Damage');
    }

    // ATO category on any damaging power of the AT
    const ato = DAMAGE_ATO_BY_AT[archetypeId];
    if (ato) cats.add(ato);
  }

  // Control ATO (Controller/Dominator) goes on any power with a mez boost —
  // including hybrid attack/control powers like Cryo Freeze Ray (Damage + Hold).
  const controlAto = CONTROL_ATO_BY_AT[archetypeId];
  if (controlAto) {
    const hasMez = [...boostSet].some(b => MEZ_BOOSTS.has(b));
    if (hasMez) cats.add(controlAto);
  }

  return [...cats].sort();
}


/**
 * Resolve a redirect/power reference name to a file path.
 * The first segment is the category directory (e.g., "Redirects", "Pets", "Villain_Pets").
 * Remaining segments form the powerset/power path within that category.
 *
 * Examples:
 *   "Redirects.Regeneration.Second_Wind_Awake" → ".../powers/redirects/regeneration/second_wind_awake.json"
 *   "Pets.Defender_Archery_Snipe.Ranged_Shot_Normal" → ".../powers/pets/defender_archery_snipe/ranged_shot_normal.json"
 *   "Villain_Pets.Broad_Sword_Assassins_Strike.Assassins_Slash_Stealth" → ".../powers/villain_pets/..."
 */
function resolveRedirectPath(powerName) {
  const parts = powerName.split('.');
  // All segments form the path: Category/Powerset/PowerName
  const filePath = parts.map(p => p.toLowerCase()).join('/') + '.json';
  return path.join(RAW_DATA_PATH, filePath);
}

/**
 * Some powers redirect to `<AT>_Aux.<Set>.<Power>_AoE`-style refs (Savage
 * Leap, Feral Charge, etc.) — those auxiliary categories aren't in the bin
 * export, but the bin parser rewrites them to `Redirects.<AT>.<Power>` and
 * stores them under `redirects/<at>/<power>.json`. Try the rewrite when a
 * non-Redirects path doesn't exist.
 */
function resolveAuxRedirectPath(powerName) {
  const parts = powerName.split('.');
  if (parts.length !== 3) return null;
  const [category, powerset, powerLeaf] = parts;
  if (!/_Aux$/i.test(category)) return null;

  // Preferred path: the bin exporter writes Aux categories to
  // <category_lower>/<powerset_lower>/<leaf_lower>.json (e.g.
  // dominator_assault_aux/savage_assault/feral_charge_hit.json).
  const auxPath = path.join(
    RAW_DATA_PATH,
    category.toLowerCase(),
    powerset.toLowerCase(),
    powerLeaf.toLowerCase() + '.json',
  );
  if (fs.existsSync(auxPath)) return auxPath;

  // Legacy fallback: some Aux redirects also get rewritten under
  // redirects/<category_minus_aux>/<leaf>.json. Try with and without
  // the _AoE/_Hit suffix.
  const cleanCategory = category.replace(/_Aux$/i, '').toLowerCase();
  const candidates = [
    powerLeaf.toLowerCase(),
    powerLeaf.replace(/_(AoE|Hit|Cone|Patch|Pet)$/i, '').toLowerCase(),
  ];
  for (const leaf of candidates) {
    const filePath = path.join(RAW_DATA_PATH, 'redirects', cleanCategory, leaf + '.json');
    if (fs.existsSync(filePath)) return filePath;
  }
  return null;
}

/**
 * For powers whose main file says effect_area=SingleTarget but actually
 * deliver damage via an Execute_Power redirect (e.g. Savage Leap → leaps
 * to a target then explodes in an AoE), peek at the redirected file's
 * effect_area to decide the *effective* damage delivery.
 *
 * Returns the normalized effective area (e.g. "AoE", "Cone") if the power
 * has a redirect with broader area than its main file, or null when the
 * main file's area should be used as-is.
 */
function inferEffectiveArea(powerJson) {
  // Only relevant when the main power claims SingleTarget but has an
  // Execute_Power redirect. For powers whose own effect_area is already
  // AoE/Cone/Location, no probe needed.
  const mainArea = EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area;
  if (mainArea !== 'SingleTarget') return null;

  const queue = [...(powerJson.effects || [])];
  while (queue.length > 0) {
    const eff = queue.shift();
    for (const t of (eff.templates || [])) {
      const attrib = (t.attribs?.[0] || '').toLowerCase();
      if (attrib !== 'execute_power') continue;
      const powerNames = t.params?.power_names || [];
      for (const pName of powerNames) {
        const isStandardRedirect = pName.toLowerCase().startsWith('redirects.');
        const auxPath = isStandardRedirect ? null : resolveAuxRedirectPath(pName);
        if (!isStandardRedirect && !auxPath) continue;
        const redirectPath = isStandardRedirect ? resolveRedirectPath(pName) : auxPath;
        if (!fs.existsSync(redirectPath)) continue;
        try {
          const redirectJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8'));
          const redirectArea = EFFECT_AREA_MAP[redirectJson.effect_area] ?? redirectJson.effect_area;
          // Only override when the redirect actually broadens the area.
          if (redirectArea && redirectArea !== 'SingleTarget') {
            return redirectArea;
          }
        } catch (_) { /* ignore */ }
      }
    }
    if (eff.child_effects) queue.push(...eff.child_effects);
  }
  return null;
}

// Combat-suppressing events from EVENT_NAME (parser/_enums.py). When an
// AttribMod's Suppress array lists any of these, the buff is suppressed
// during combat (the In-Combat toggle in the planner removes it from totals).
const COMBAT_SUPPRESS_EVENTS = new Set([
  'Attacked', 'Damaged', 'MissionObjectClick', 'PseudoPetAttacked',
  'PseudoPetHelped', 'Helped', 'HitByFoe', 'CommandedPet',
]);

/**
 * Recursively collect templates from effects, following Execute_Power references
 * to redirect files and filtering out dead-state conditionals.
 *
 * @param {Array} effects - Array of effect objects
 * @param {Set} visited - Set of already-visited power names (prevents infinite loops)
 * @param {number} depth - Current recursion depth
 * @returns {Array} - Flat array of all template objects
 */
function collectTemplatesDeep(effects, visited = new Set(), depth = 0, parentCombatGated = false) {
  const templates = [];
  const MAX_DEPTH = 3;

  for (const effect of effects) {
    if (effect.is_pvp === 'PVP_ONLY') continue;
    if (effect.chance === 0 || effect.chance === 0.0) continue;
    if (effect.tags && effect.tags.includes('Containment')) continue;
    // Skip conditional effects that represent archetype inherent mechanics
    // (these are handled separately by the planner's toggle system)
    let combatGated = parentCombatGated;
    if (effect.requires_expression) {
      const req = effect.requires_expression;
      // Dead-state conditionals (rez effects when HP == 0)
      if (req.includes('kHitPoints == 0')) continue;
      // Stalker hidden-state bonus damage (kMeter > 0 = in hide mode)
      if (req.includes('kMeter > 0') || req.includes('kMeter >=')) continue;
      // Scourge/proc-based bonus damage (random chance expressions)
      if (req.includes('rand()')) continue;
      // Out-of-combat gating (pool Stealth, Invisibility) — propagate downward
      if (_isOutOfCombatGate(req)) combatGated = true;
    }

    // Collect templates from this level
    if (effect.templates && effect.templates.length > 0) {
      for (const template of effect.templates) {
        const attrib = template.attribs && template.attribs[0] ? template.attribs[0].toLowerCase() : null;

        // Follow Execute_Power references to redirect files (up to MAX_DEPTH).
        // Two redirect shapes are followed: explicit `Redirects.*` paths and
        // `*_Aux.*` paths that the bin parser rewrites under `redirects/`.
        if (attrib === 'execute_power' && depth < MAX_DEPTH) {
          const powerNames = (template.params && template.params.power_names) || [];
          for (const pName of powerNames) {
            const isStandardRedirect = pName.toLowerCase().startsWith('redirects.');
            const auxPath = isStandardRedirect ? null : resolveAuxRedirectPath(pName);
            if (!isStandardRedirect && !auxPath) continue;
            if (visited.has(pName)) continue;
            visited.add(pName);

            const redirectPath = isStandardRedirect ? resolveRedirectPath(pName) : auxPath;
            if (fs.existsSync(redirectPath)) {
              const redirectJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8'));
              if (redirectJson.effects && redirectJson.effects.length > 0) {
                templates.push(...collectTemplatesDeep(
                  redirectJson.effects, visited, depth + 1, combatGated
                ));
              }
            }
          }
        } else {
          if (combatGated) _tagCombatGated(template);
          templates.push(template);
        }
      }
    }

    // Recurse into child_effects
    if (effect.child_effects && effect.child_effects.length > 0) {
      templates.push(...collectTemplatesDeep(effect.child_effects, visited, depth, combatGated));
    }
  }

  return templates;
}

/**
 * Collect templates from a power's redirect chain.
 * Follows the "Always" condition redirect and any Execute_Power references within,
 * filtering out dead-state conditionals.
 *
 * @param {Object} powerJson - The raw power JSON object
 * @returns {Array} - Flat array of template objects from the redirect chain
 */
function collectRedirectTemplates(powerJson) {
  if (!powerJson.redirect || powerJson.redirect.length === 0) return [];

  // Find the best redirect to follow:
  // 1. Prefer "Always" condition (default fallback behavior)
  // 2. If no "Always", use the first non-dead-state redirect (normal/base behavior)
  let defaultRedirect = powerJson.redirect.find(
    r => r.condition_expression === 'Always'
  );
  if (!defaultRedirect) {
    // Dead-state exclusion — the CoD2 infix form was 'kHitPoints == 0'; the
    // bin-parser form is RPN tokens ('kHitPoints 0 =='). Match either by
    // checking for the kHitPoints token alone, which is specific enough.
    defaultRedirect = powerJson.redirect.find(
      r => !r.condition_expression.includes('kHitPoints')
    );
  }
  if (!defaultRedirect) return [];

  const redirectPath = resolveRedirectPath(defaultRedirect.name);
  if (!fs.existsSync(redirectPath)) {
    console.warn(`  [redirect] File not found: ${redirectPath}`);
    return [];
  }

  const redirectJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8'));
  if (!redirectJson.effects || redirectJson.effects.length === 0) return [];

  // Collect templates, following Execute_Power references and filtering dead-state conditionals
  return collectTemplatesDeep(redirectJson.effects, new Set([defaultRedirect.name]));
}

/**
 * Convert a power name to kebab-case filename
 */
function toKebabCase(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Valid target types (mapped from raw data to our TypeScript types).
// The raw bin format uses some short names ('Friend', 'Position', 'MyPet')
// where CoD2 used longer ones ('Ally (Alive)', 'Location', 'Ally'). Map both.
const TARGET_TYPE_MAP = {
  'Self': 'Self',
  'Foe': 'Foe',
  'Ally': 'Ally',
  'Ally (Alive)': 'Ally (Alive)',
  'Enemy': 'Foe',
  'Teammate': 'Teammate',
  'Teammate (Alive)': 'Teammate (Alive)',
  'Location': 'Location',
  'DeadFoe': 'DeadFoe',
  'DeadOrAlive Teammate': 'DeadOrAlive Teammate',
  'Any': 'Any',
  'Dead Teammate': 'Dead Teammate',
  'Teleport': 'Teleport',
  // Bin-format short names (CoD2 used the longer forms above).
  'Friend': 'Ally (Alive)',                   // alive friendly target (most heal/buff powers)
  'DeadOrAliveFoe': 'Foe',                    // Foe regardless of alive/dead state
  'DeadPlayerFriend': 'Dead Teammate',        // resurrect-on-dead-ally powers
  'DeadMyPet': 'Dead Teammate',               // resurrect-on-dead-pet
  'DeadOrAliveMyPet': 'Ally',                 // pet manipulation, dead or alive
  'MyCreator': 'Self',                        // pet powers referencing summoner
  'MyCreation': 'Ally',                       // pet's own pet/summon
  'Position': 'Location',                     // ground-targeted (caltrops, trip mine)
  'DeadOrAliveLeaguemate': 'Teammate',
  // Map invalid types to closest valid equivalent
  'Anything': 'Location',
  'Leaguemate': 'Teammate',
  'Leaguemate (Alive)': 'Teammate (Alive)',
  'Dead Leaguemate': 'Dead Teammate',
};

// ============================================
// COMPREHENSIVE ATTRIBUTE MAPPING
// ============================================

// Damage type attributes (with and without _Dmg suffix)
const DAMAGE_TYPES = {
  'smashing_dmg': 'Smashing', 'smashing': 'Smashing',
  'lethal_dmg': 'Lethal', 'lethal': 'Lethal',
  'fire_dmg': 'Fire', 'fire': 'Fire',
  'cold_dmg': 'Cold', 'cold': 'Cold',
  'energy_dmg': 'Energy', 'energy': 'Energy',
  'negative_energy_dmg': 'Negative', 'negative_energy': 'Negative',
  'psionic_dmg': 'Psionic', 'psionic': 'Psionic',
  'toxic_dmg': 'Toxic', 'toxic': 'Toxic',
  'special_dmg': 'Special',
  'heal_dmg': 'Heal', // Used for -regen effects sometimes
};

// Defense position types (not damage types)
const DEFENSE_POSITIONS = {
  'melee': 'Melee',
  'ranged': 'Ranged',
  'area': 'AoE',
  'aoe': 'AoE',
};

// Elusivity attributes (defense debuff resistance)
const ELUSIVITY_TYPES = {
  'smashing_elusivity': 'Smashing', 'lethal_elusivity': 'Lethal',
  'fire_elusivity': 'Fire', 'cold_elusivity': 'Cold',
  'energy_elusivity': 'Energy', 'negative_energy_elusivity': 'Negative',
  'psionic_elusivity': 'Psionic', 'melee_elusivity': 'Melee',
  'ranged_elusivity': 'Ranged', 'area_elusivity': 'AoE',
  'elusivitybase': 'All',
};

// Mez effect types (with magnitude) - maps raw attrib to our effect name
const MEZ_TYPES = {
  'held': 'hold', 'hold': 'hold',
  'stunned': 'stun', 'stun': 'stun', 'disorient': 'stun',
  'sleep': 'sleep', 'sleeping': 'sleep', 'slept': 'sleep',
  'immobilized': 'immobilize', 'immobilize': 'immobilize',
  'confused': 'confuse', 'confuse': 'confuse',
  'afraid': 'fear', 'terrorized': 'fear', 'fear': 'fear', 'terrorize': 'fear',
};

// Knockback-type effects (no magnitude, just scale/table)
const KNOCKBACK_TYPES = {
  'knockback': 'knockback',
  'knockup': 'knockup',
  'repel': 'repel',
};

// Movement attributes
const MOVEMENT_TYPES = {
  'runningspeed': 'runSpeed', 'speed_running': 'runSpeed',
  'flyingspeed': 'flySpeed', 'speed_flying': 'flySpeed', 'fly': 'fly',
  'jumpheight': 'jumpHeight',
  'jumpingspeed': 'jumpSpeed', 'speed_jumping': 'jumpSpeed',
  'movementcontrol': 'movementControl',
  'movementfriction': 'movementFriction',
};

// Resource attributes
const RESOURCE_TYPES = {
  'hitpoints': 'hitPoints', 'hit_points': 'hitPoints',
  'endurance': 'endurance',
  'recovery': 'recovery',
  'regeneration': 'regeneration', 'regen': 'regeneration',
  'absorb': 'absorb',
};

// Combat modifier attributes
const COMBAT_MODIFIERS = {
  'tohit': 'toHit', 'to_hit': 'toHit',
  'base_defense': 'defense', 'defense': 'defense',
  'threatlevel': 'threatLevel', 'threat_level': 'threatLevel',
  'rechargetime': 'rechargeTime', 'recharge_time': 'rechargeTime', 'speed_recharge': 'rechargeTime',
  'range': 'range',
  'endurancediscount': 'enduranceDiscount',
};

// Stealth/Perception attributes
const STEALTH_TYPES = {
  'perceptionradius': 'perception',
  'stealthradius_pve': 'stealthPvE',
  'stealthradius_pvp': 'stealthPvP',
  'translucency': 'translucency',
};

// Control attributes
const CONTROL_TYPES = {
  'taunt': 'taunt', 'taunted': 'taunt',
  'placate': 'placate',
  'untouchable': 'untouchable',
  'onlyaffectsself': 'onlyAffectsSelf',
  'teleport': 'teleport',
};

// Special/meta attributes we generally skip (not create_entity - we handle that separately)
const SPECIAL_ATTRIBS = new Set([
  'null', 'grant_power', 'grant_boosted_power',
  'execute_power', 'revoke_power', 'cancel_effects', 'set_mode',
  'set_costume', 'add_token', 'designer_status', 'debt_protection',
  'silent_kill', 'global_chance_mod', 'recharge_power', 'jump pack',
]);

/**
 * Check if an attrib is a damage type
 */
function isDamageTypeAttrib(attrib) {
  return attrib && DAMAGE_TYPES[attrib.toLowerCase()] !== undefined;
}

/**
 * Get normalized damage type name
 */
function getDamageType(attrib) {
  return DAMAGE_TYPES[attrib.toLowerCase()];
}

/**
 * Check if an attrib is a defense position type
 */
function isDefensePosition(attrib) {
  return attrib && DEFENSE_POSITIONS[attrib.toLowerCase()] !== undefined;
}

/**
 * Detect "out-of-combat-for-N-seconds" gating on an Effect's requires_expression.
 * Pool Stealth, Invisibility, and similar powers wrap their suppressible defense
 * buff inside an outer Effect with a requires clause like
 *   `Attacked source.EventTimeSince> 10 > HitByFoe source.EventTimeSince> 10 > && ...`
 * The buff only applies when no combat-related event has fired in the last N seconds,
 * which is functionally identical to template-level Suppress events for our purposes.
 */
function _isOutOfCombatGate(req) {
  if (!req) return false;
  if (!req.includes('EventTimeSince')) return false;
  return /\b(Attacked|Damaged|HitByFoe|MissionObjectClick|PseudoPetAttacked|Helped)\b/.test(req);
}

/** Tag templates with the synthetic property `_combatGated` when their parent
 *  Effect (or any ancestor) is gated out-of-combat. The conversion's
 *  extractEffects function reads this to route the buff into
 *  `defenseBuffSuppressible`.
 */
function _tagCombatGated(template) {
  template._combatGated = true;
}

/**
 * Recursively collect all templates from an effects array, including child_effects.
 * Filters out PVP_ONLY effects and effects with chance=0 (conditional procs).
 *
 * @param {Array} effects - Array of effect objects
 * @param {boolean} parentCombatGated - True when ancestor Effect's requires gates out-of-combat
 * @returns {Array} - Flat array of all template objects
 */
function collectAllTemplates(effects, parentCombatGated = false) {
  const templates = [];

  for (const effect of effects) {
    // Skip PVP-only effects
    if (effect.is_pvp === 'PVP_ONLY') continue;

    // Skip effects with chance=0 (conditional procs that don't normally fire)
    if (effect.chance === 0 || effect.chance === 0.0) continue;

    // Skip effects tagged as Containment (Controller inherent conditional damage).
    // Containment damage is handled separately via the containment toggle in the UI.
    if (effect.tags && effect.tags.includes('Containment')) continue;

    // Skip conditional inherent bonuses (crit damage from hide/placate, Scourge procs).
    // These are handled by the UI's inherent toggle system.
    let combatGated = parentCombatGated;
    if (effect.requires_expression) {
      const req = effect.requires_expression;
      // Dead-state effects (self-rez conditions)
      if (req.includes('kHitPoints == 0')) continue;
      // Stalker/Widow hidden-state bonus damage (kMeter > 0 = in hide mode)
      if (req.includes('kMeter > 0') || req.includes('kMeter >=')) continue;
      // Scourge / random proc conditional damage
      if (req.includes('rand()')) continue;
      // Mode-based conditional bonuses (Bio Armor Adaptation, Kheldian forms, etc.)
      // These are mutually exclusive modes — the base unconditional effects provide
      // the default values; mode-specific bonuses would overwrite them incorrectly
      if (req.includes('Source.Mode?') || req.includes('kMode')) continue;
      // Out-of-combat gating (pool Stealth, Invisibility) — propagate downward
      if (_isOutOfCombatGate(req)) combatGated = true;
    }

    // Collect templates from this level
    if (effect.templates && effect.templates.length > 0) {
      for (const t of effect.templates) {
        if (combatGated) _tagCombatGated(t);
        templates.push(t);
      }
    }

    // Recurse into child_effects
    if (effect.child_effects && effect.child_effects.length > 0) {
      templates.push(...collectAllTemplates(effect.child_effects, combatGated));
    }
  }

  return templates;
}

/**
 * Extract damage effects from raw effect templates
 * Only extracts ACTUAL damage (aspect "Cur" or "Abs"), not damage buffs/debuffs
 */
function extractDamage(templates) {
  const damages = [];

  for (const template of templates) {
    if (!template.attribs || !template.scale) continue;

    const attrib = template.attribs[0]?.toLowerCase();
    const damageType = DAMAGE_TYPES[attrib];
    const aspect = template.aspect?.toLowerCase();

    // Only extract as "damage" if:
    // 1. It's a damage type attribute
    // 2. The aspect indicates actual damage: "Absolute", "Current", "Cur", "Abs"
    // 3. NOT "Strength" (damage buff/debuff) or "Resistance" (resistance debuff)
    const isDamageAspect = !aspect ||
      aspect === 'absolute' ||
      aspect === 'current' ||
      aspect === 'cur' ||
      aspect === 'abs';

    if (damageType && isDamageAspect) {
      // Skip if this is clearly a buff/debuff (check table name)
      if (template.table?.toLowerCase().includes('debuff') ||
          template.table?.toLowerCase().includes('buff')) {
        continue;
      }

      const dmg = {
        type: damageType,
        scale: template.scale,
        table: template.table,
      };

      // Check for DoT
      if (template.duration && template.duration !== '0 seconds') {
        const durationMatch = template.duration.match(/([\d.]+)\s*seconds?/i);
        if (durationMatch) {
          dmg.duration = parseFloat(durationMatch[1]);
        }
      }

      // Check for ticks (periodic damage)
      if (template.application_period && template.application_period > 0) {
        dmg.tickRate = template.application_period;
      }

      damages.push(dmg);
    }
  }

  return damages.length > 0 ? (damages.length === 1 ? damages[0] : damages) : undefined;
}

/**
 * Extract ALL effects from raw effect templates
 *
 * Aspect meanings:
 * - "Strength" = affects target's OUTPUT (damage dealt, etc.) - buff/debuff
 * - "Resistance" = affects target's RESISTANCE to that type - buff/debuff
 * - "Current" / "Absolute" = affects current/absolute value (actual damage, healing)
 * - "Maximum" = affects max value (max HP, max endurance)
 *
 * Template.type meanings:
 * - "Magnitude" = magnitude-based effect
 * - "Duration" = duration-based effect (used for mez)
 */
function extractEffects(templates, powerName) {
  const effects = {};
  const unmappedAttribs = new Set();

  for (const template of templates) {
    if (!template.attribs || template.attribs.length === 0) continue;

    // Skip deactivation-only effects (temporary bursts on toggle off, e.g., Reaction Time speed burst)
    if (template.application_type === 'OnDeactivate') continue;

    // Combat-suppressed defense: route to defenseBuffSuppressible so the
    // In-Combat toggle can suppress it. Two sources mark a template as
    // combat-suppressed:
    //   1. Template-level Suppress events (parsed from binary AttribMod tail,
    //      see EVENT_NAME enum and _parse_effect_template) — used by Hide
    //      and similar powers that explicitly list Attacked/Damaged/etc as
    //      suppression triggers.
    //   2. Ancestor Effect with requires_expression like
    //      `Attacked source.EventTimeSince> 10 >` — used by pool Stealth,
    //      Invisibility, etc. Set as `_combatGated` by collectAllTemplates.
    const isSuppressedByEvents = template.suppress_events?.some(
      se => COMBAT_SUPPRESS_EVENTS.has(se.event)
    );
    const isCombatSuppressed = isSuppressedByEvents || template._combatGated;

    const aspect = template.aspect?.toLowerCase();
    const scale = template.scale || 0;
    const table = template.table;
    const magnitude = template.magnitude || 1;
    const isDebuff = scale < 0 || table?.toLowerCase().includes('debuff');
    const isSelfTargeting = template.target === 'Self';

    // Parse duration if present
    let duration = null;
    if (template.duration && template.duration !== '0 seconds') {
      const match = template.duration.match(/([\d.]+)\s*seconds?/i);
      if (match) duration = parseFloat(match[1]);
    }

    // Helper to create effect object
    const makeEffect = (s = scale, t = table) => ({ scale: Math.abs(s), table: t });
    const makeMezEffect = () => ({ mag: magnitude, scale: Math.abs(scale), table });

    // Helper to record per-effect duration
    const recordDuration = (effectKey) => {
      if (duration && duration > 0) {
        if (!effects.durations) effects.durations = {};
        effects.durations[effectKey] = duration;
      }
    };

    // Process ALL attribs in this template (not just the first)
    for (const rawAttrib of template.attribs) {
      const attrib = rawAttrib?.toLowerCase();
      if (!attrib) continue;

      // Skip special/meta attributes
      if (SPECIAL_ATTRIBS.has(attrib)) continue;

      // ========== ENTITY CREATION (Pets/Pseudopets) ==========
      if (attrib === 'create_entity') {
        const params = template.params;
        if (params && params.type === 'EntCreate') {
          const isPseudoPet = template.flags?.some(f => f.includes('PseudoPet')) || false;
          const hasCopyBoosts = template.flags?.some(f => f.includes('CopyBoosts')) || false;

          if (!effects.summon) {
            // First entity encountered
            const entityInfo = { isPseudoPet };
            if (params.entity_def) entityInfo.entity = params.entity_def;
            if (params.display_name) entityInfo.displayName = DISPLAY_NAME_OVERRIDES[powerName] || params.display_name;
            if (params.redirects?.length > 0) entityInfo.powers = params.redirects;
            if (duration) entityInfo.duration = duration;
            if (hasCopyBoosts) entityInfo.copyBoosts = true;
            effects.summon = entityInfo;
          } else if (effects.summon.entities) {
            // Already tracking multiple entity types - add or increment
            const existing = effects.summon.entities.find(e => e.entity === params.entity_def);
            if (existing) {
              existing.count++;
            } else {
              effects.summon.entities.push({ entity: params.entity_def, count: 1 });
            }
          } else if (effects.summon.entity === params.entity_def) {
            // Same entity_def appearing again = multiple entities summoned
            effects.summon.entityCount = (effects.summon.entityCount || 1) + 1;
          } else if (params.entity_def && !isPseudoPet && effects.summon.entity) {
            // Different entity_def for a real pet - start multi-entity tracking
            effects.summon.entities = [
              { entity: effects.summon.entity, count: effects.summon.entityCount || 1 },
              { entity: params.entity_def, count: 1 },
            ];
            delete effects.summon.entity;
            delete effects.summon.entityCount;
          }
        }
        continue;
      }

      // ========== DAMAGE TYPE ATTRIBUTES ==========
      if (isDamageTypeAttrib(attrib)) {
        const dmgType = getDamageType(attrib);
        const tableLower = table?.toLowerCase() || '';

        // Check if this is a defense buff/debuff (table contains Buff_Def or Debuff_Def)
        const isDefenseEffect = tableLower.includes('buff_def') || tableLower.includes('debuff_def');

        if (aspect === 'strength') {
          // Affects target's damage OUTPUT
          if (isDebuff) {
            // Only include damageDebuff for self-targeting effects (e.g., Granite Armor -30% damage)
            // Skip enemy-targeting damage debuffs (e.g., Time's Juncture Foe -Damage)
            if (isSelfTargeting) {
              effects.damageDebuff = makeEffect();
              effects.selfPenalty = true;
              recordDuration('damageDebuff');
            }
          } else {
            effects.damageBuff = makeEffect();
            recordDuration('damageBuff');
          }
        } else if (aspect === 'resistance') {
          // Affects target's damage RESISTANCE
          if (isDebuff) {
            if (!effects.resistanceDebuff) effects.resistanceDebuff = {};
            effects.resistanceDebuff[dmgType.toLowerCase()] = makeEffect();
            recordDuration('resistanceDebuff');
          } else {
            if (!effects.resistance) effects.resistance = {};
            effects.resistance[dmgType.toLowerCase()] = makeEffect();
            recordDuration('resistance');
          }
        } else if (isDefenseEffect) {
          // Defense buff/debuff by damage type (e.g., Invincibility grants defense vs Smashing/Lethal/etc.)
          if (isDebuff) {
            if (!effects.defenseDebuff) effects.defenseDebuff = {};
            effects.defenseDebuff[dmgType.toLowerCase()] = makeEffect();
            recordDuration('defenseDebuff');
          } else if (isCombatSuppressed) {
            if (!effects.defenseBuffSuppressible) effects.defenseBuffSuppressible = {};
            effects.defenseBuffSuppressible[dmgType.toLowerCase()] = makeEffect();
            recordDuration('defenseBuffSuppressible');
          } else {
            if (!effects.defenseBuff) effects.defenseBuff = {};
            effects.defenseBuff[dmgType.toLowerCase()] = makeEffect();
            recordDuration('defenseBuff');
          }
        }
        // "Current"/"Absolute" aspect without defense table = actual damage, handled by extractDamage()
        continue;
      }

      // ========== DEFENSE POSITION TYPES (Melee/Ranged/AoE) ==========
      if (isDefensePosition(attrib)) {
        const posType = DEFENSE_POSITIONS[attrib];
        if (aspect === 'resistance') {
          if (isDebuff) {
            if (!effects.resistanceDebuff) effects.resistanceDebuff = {};
            effects.resistanceDebuff[posType.toLowerCase()] = makeEffect();
            recordDuration('resistanceDebuff');
          } else {
            if (!effects.resistance) effects.resistance = {};
            effects.resistance[posType.toLowerCase()] = makeEffect();
            recordDuration('resistance');
          }
        } else if (isDebuff) {
          if (!effects.defenseDebuff) effects.defenseDebuff = {};
          effects.defenseDebuff[posType.toLowerCase()] = makeEffect();
          recordDuration('defenseDebuff');
        } else if (isCombatSuppressed) {
          if (!effects.defenseBuffSuppressible) effects.defenseBuffSuppressible = {};
          effects.defenseBuffSuppressible[posType.toLowerCase()] = makeEffect();
          recordDuration('defenseBuffSuppressible');
        } else {
          if (!effects.defenseBuff) effects.defenseBuff = {};
          effects.defenseBuff[posType.toLowerCase()] = makeEffect();
          recordDuration('defenseBuff');
        }
        continue;
      }

      // ========== BASE_DEFENSE special handling ==========
      if (attrib === 'base_defense' || attrib === 'defense') {
        if (aspect === 'resistance') {
          // Defense debuff resistance (reduces effectiveness of -DEF debuffs)
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.defense = makeEffect();
          recordDuration('debuffResistance');
        } else if (isDebuff) {
          effects.defenseDebuff = makeEffect();
          recordDuration('defenseDebuff');
        } else if (isCombatSuppressed) {
          effects.defenseBuffSuppressible = makeEffect();
          recordDuration('defenseBuffSuppressible');
        } else {
          effects.defenseBuff = makeEffect();
          recordDuration('defenseBuff');
        }
        continue;
      }

      // ========== ELUSIVITY (Defense Debuff Resistance) ==========
      if (ELUSIVITY_TYPES[attrib]) {
        const elusType = ELUSIVITY_TYPES[attrib];
        if (!effects.elusivity) effects.elusivity = {};
        effects.elusivity[elusType.toLowerCase()] = makeEffect();
        continue;
      }

      // ========== MEZ EFFECTS ==========
      if (MEZ_TYPES[attrib]) {
        const mezType = MEZ_TYPES[attrib];
        if (aspect === 'resistance') {
          // Status resistance (reduces mez duration) — e.g., Acrobatics Hold resistance
          if (!effects.mezResistance) effects.mezResistance = {};
          if (effects.mezResistance[mezType] && effects.mezResistance[mezType].table === table) {
            effects.mezResistance[mezType].scale += Math.abs(scale);
          } else {
            effects.mezResistance[mezType] = makeEffect();
          }
          recordDuration('mezResistance');
        } else {
          const newMez = makeMezEffect();
          // Keep the higher magnitude mez effect (for powers with multiple mez effects)
          if (!effects[mezType] || newMez.mag > effects[mezType].mag) {
            effects[mezType] = newMez;
          }
          if (duration) effects.effectDuration = duration;
          recordDuration(mezType);
        }
        continue;
      }

      // ========== KNOCKBACK/KNOCKUP/REPEL ==========
      // For KB/KU: aspect "current" means protection (magnitude applied against incoming KB)
      // Multiple templates accumulate (e.g., Acrobatics has unenhanceable base + enhanceable portion)
      if (KNOCKBACK_TYPES[attrib]) {
        const kbType = KNOCKBACK_TYPES[attrib];
        if (aspect === 'resistance') {
          // KB/KU resistance (reduces duration/magnitude of KB applied to you)
          if (!effects.mezResistance) effects.mezResistance = {};
          effects.mezResistance[kbType] = makeEffect();
          recordDuration('mezResistance');
        } else {
          // KB/KU protection (magnitude threshold) — accumulate if same table
          if (effects[kbType] && effects[kbType].table === table) {
            effects[kbType].scale += Math.abs(scale);
          } else {
            effects[kbType] = makeEffect();
          }
          recordDuration(kbType);
        }
        continue;
      }

      // ========== MOVEMENT ==========
      if (MOVEMENT_TYPES[attrib]) {
        const moveType = MOVEMENT_TYPES[attrib];
        if (aspect === 'resistance') {
          // Resistance to movement debuffs (slow resistance)
          if (!effects.debuffResistance) effects.debuffResistance = {};
          effects.debuffResistance.movement = makeEffect();
          recordDuration('debuffResistance');
        } else if (isSelfTargeting && (isDebuff || scale < 0)) {
          // Self-targeting movement penalty (e.g., Granite Armor -70% run speed)
          if (!effects.slow) effects.slow = {};
          effects.slow[moveType] = makeEffect();
          effects.selfPenalty = true;
          recordDuration('slow');
        } else if (isSelfTargeting) {
          // Self-targeting movement buff (e.g., Lightning Reflexes +run speed)
          if (!effects.movement) effects.movement = {};
          effects.movement[moveType] = makeEffect();
          recordDuration('movement');
        }
        // Skip non-self movement effects (enemy slows like Time's Juncture)
        continue;
      }

      // ========== RESOURCES (HP, End, Recovery, Regen, Absorb) ==========
      if (RESOURCE_TYPES[attrib]) {
        const resType = RESOURCE_TYPES[attrib];

        // Helper to accumulate scales for resource effects that may appear multiple times
        // (e.g., maxHPBuff with 2x templates of scale 1.0 should sum to scale 2.0)
        const addOrAccumulate = (key) => {
          if (effects[key] && effects[key].table === table) {
            effects[key].scale += Math.abs(scale);
          } else {
            effects[key] = makeEffect();
          }
          recordDuration(key);
        };

        if (resType === 'hitPoints') {
          if (aspect === 'maximum') {
            addOrAccumulate('maxHPBuff');
          } else {
            addOrAccumulate('healing');
          }
        } else if (resType === 'endurance') {
          if (aspect === 'resistance') {
            if (!effects.debuffResistance) effects.debuffResistance = {};
            effects.debuffResistance.endurance = makeEffect();
            recordDuration('debuffResistance');
          } else if (aspect === 'maximum') {
            addOrAccumulate('maxEndBuff');
          } else if (isDebuff || scale < 0) {
            addOrAccumulate('enduranceDrain');
          } else {
            addOrAccumulate('enduranceGain');
          }
        } else if (resType === 'recovery') {
          if (aspect === 'resistance') {
            if (!effects.debuffResistance) effects.debuffResistance = {};
            effects.debuffResistance.recovery = makeEffect();
            recordDuration('debuffResistance');
          } else if (isDebuff || scale < 0) {
            addOrAccumulate('recoveryDebuff');
          } else {
            addOrAccumulate('recoveryBuff');
          }
        } else if (resType === 'regeneration') {
          if (aspect === 'resistance') {
            if (!effects.debuffResistance) effects.debuffResistance = {};
            effects.debuffResistance.regeneration = makeEffect();
            recordDuration('debuffResistance');
          } else if (isDebuff || scale < 0) {
            addOrAccumulate('regenDebuff');
          } else {
            addOrAccumulate('regenBuff');
          }
        } else if (resType === 'absorb') {
          addOrAccumulate('absorb');
        }
        continue;
      }

      // ========== COMBAT MODIFIERS ==========
      if (COMBAT_MODIFIERS[attrib]) {
        const modType = COMBAT_MODIFIERS[attrib];

        if (modType === 'toHit') {
          if (aspect === 'resistance') {
            if (!effects.debuffResistance) effects.debuffResistance = {};
            effects.debuffResistance.tohit = makeEffect();
            recordDuration('debuffResistance');
          } else if (isDebuff) {
            // Only include tohitDebuff for self-targeting effects
            // Skip enemy-targeting tohit debuffs (e.g., Time's Juncture Foe -ToHit)
            if (isSelfTargeting) {
              effects.tohitDebuff = makeEffect();
              effects.selfPenalty = true;
              recordDuration('tohitDebuff');
            }
          } else {
            effects.tohitBuff = makeEffect();
            recordDuration('tohitBuff');
          }
        } else if (modType === 'defense') {
          // Skip - handled by BASE_DEFENSE section above
        } else if (modType === 'rechargeTime') {
          if (aspect === 'resistance') {
            if (!effects.debuffResistance) effects.debuffResistance = {};
            effects.debuffResistance.recharge = makeEffect();
            recordDuration('debuffResistance');
          } else if (isDebuff || scale < 0 || table?.toLowerCase().includes('slow')) {
            // Only include rechargeDebuff for self-targeting effects (e.g., Granite Armor -65% recharge)
            // Skip enemy-targeting recharge debuffs (e.g., Reaction Time Foe -Recharge)
            if (isSelfTargeting) {
              effects.rechargeDebuff = makeEffect();
              effects.selfPenalty = true;
              recordDuration('rechargeDebuff');
            }
          } else {
            effects.rechargeBuff = makeEffect();
            recordDuration('rechargeBuff');
          }
        } else if (modType === 'threatLevel') {
          if (isDebuff || scale < 0) {
            effects.threatDebuff = makeEffect();
            recordDuration('threatDebuff');
          } else {
            effects.threatBuff = makeEffect();
            recordDuration('threatBuff');
          }
        } else if (modType === 'range') {
          if (aspect === 'resistance') {
            if (!effects.debuffResistance) effects.debuffResistance = {};
            effects.debuffResistance.range = makeEffect();
            recordDuration('debuffResistance');
          } else {
            effects.rangeBuff = makeEffect();
            recordDuration('rangeBuff');
          }
        } else if (modType === 'enduranceDiscount') {
          effects.enduranceDiscount = makeEffect();
          recordDuration('enduranceDiscount');
        }
        continue;
      }

      // ========== STEALTH/PERCEPTION ==========
      if (STEALTH_TYPES[attrib]) {
        const stealthType = STEALTH_TYPES[attrib];
        if (stealthType === 'perception') {
          if (aspect === 'resistance') {
            // Perception debuff resistance (e.g., Beryl Crystals)
            if (!effects.debuffResistance) effects.debuffResistance = {};
            effects.debuffResistance.perception = makeEffect();
            recordDuration('debuffResistance');
          } else if (isDebuff || scale < 0) {
            effects.perceptionDebuff = makeEffect();
            recordDuration('perceptionDebuff');
          } else {
            effects.perceptionBuff = makeEffect();
            recordDuration('perceptionBuff');
          }
        } else {
          if (!effects.stealth) effects.stealth = {};
          effects.stealth[stealthType] = makeEffect();
          recordDuration('stealth');
        }
        continue;
      }

      // ========== CONTROL (Taunt, Placate, etc.) ==========
      if (CONTROL_TYPES[attrib]) {
        const ctrlType = CONTROL_TYPES[attrib];
        if (aspect === 'resistance') {
          // Status resistance for control effects (e.g., Teleport resistance from Energy Aura)
          if (!effects.mezResistance) effects.mezResistance = {};
          if (effects.mezResistance[ctrlType] && effects.mezResistance[ctrlType].table === table) {
            effects.mezResistance[ctrlType].scale += Math.abs(scale);
          } else {
            effects.mezResistance[ctrlType] = makeEffect();
          }
          recordDuration('mezResistance');
        } else {
          effects[ctrlType] = makeEffect();
          recordDuration(ctrlType);
        }
        continue;
      }

      // ========== CATCH-ALL for unmapped attributes ==========
      // Log unmapped attributes for future addition
      unmappedAttribs.add(attrib);
    } // end for each attrib
  } // end for each template

  // Log any unmapped attributes (helps identify missing mappings)
  if (unmappedAttribs.size > 0) {
    // Uncomment for debugging:
    // console.log('  Unmapped attribs:', [...unmappedAttribs].join(', '));
  }

  // Derive buffDuration from durations map — use the most common duration among buff/debuff effects
  // Skip toggle/auto powers (their tick durations aren't meaningful as "buff duration")
  if (effects.durations && Object.keys(effects.durations).length > 0) {
    // Count how often each duration value appears
    const durationCounts = {};
    for (const [, dur] of Object.entries(effects.durations)) {
      durationCounts[dur] = (durationCounts[dur] || 0) + 1;
    }
    // Pick the most common duration (ties broken by largest value)
    let bestDur = null;
    let bestCount = 0;
    for (const [dur, count] of Object.entries(durationCounts)) {
      const d = parseFloat(dur);
      if (count > bestCount || (count === bestCount && d > (bestDur || 0))) {
        bestDur = d;
        bestCount = count;
      }
    }
    if (bestDur && bestDur > 0) {
      effects.buffDuration = bestDur;
    }
  }

  return effects;
}

// ============================================
// PER-TARGET STACKING DETECTION
// ============================================

/**
 * Collect all templates from effects with parent-level tags preserved.
 * Returns array of { template, tags } objects.
 */
function collectTemplatesWithMeta(effects) {
  const results = [];
  for (const effect of effects) {
    if (effect.is_pvp === 'PVP_ONLY') continue;
    if (effect.chance === 0 || effect.chance === 0.0) continue;
    if (effect.tags && effect.tags.includes('Containment')) continue;

    // Skip conditional effects (dead-state, hide, scourge)
    if (effect.requires_expression) {
      const req = effect.requires_expression;
      if (req.includes('kHitPoints == 0')) continue;
      if (req.includes('kMeter > 0') || req.includes('kMeter >=')) continue;
      if (req.includes('rand()')) continue;
    }

    const tags = effect.tags || [];

    if (effect.templates && effect.templates.length > 0) {
      for (const t of effect.templates) {
        results.push({ template: t, tags });
      }
    }
    if (effect.child_effects && effect.child_effects.length > 0) {
      const childResults = collectTemplatesWithMeta(effect.child_effects);
      for (const cr of childResults) {
        results.push({ template: cr.template, tags: [...tags, ...cr.tags] });
      }
    }
  }
  return results;
}

/**
 * Classify a raw template into our effect key system for stacking detection.
 * Returns array of { effectKey, subKey? } or empty if not a self-buff.
 */
function classifyTemplateForStacking(template) {
  if (!template.attribs || template.attribs.length === 0) return [];
  if (template.target !== 'Self') return [];

  const aspect = template.aspect?.toLowerCase();
  const scale = template.scale || 0;
  const table = template.table || '';
  const tableLower = table.toLowerCase();
  const isDebuff = scale < 0 || tableLower.includes('debuff');

  // Only care about self-buffs (positive effects)
  if (isDebuff) return [];

  const results = [];

  for (const rawAttrib of template.attribs) {
    const attrib = rawAttrib?.toLowerCase();
    if (!attrib) continue;
    if (SPECIAL_ATTRIBS.has(attrib)) continue;

    // Damage type attributes
    if (DAMAGE_TYPES[attrib]) {
      if (aspect === 'strength') {
        return [{ effectKey: 'damageBuff' }];
      }
      if (aspect === 'resistance') {
        results.push({ effectKey: 'resistance', subKey: DAMAGE_TYPES[attrib].toLowerCase() });
        continue;
      }
      if (tableLower.includes('buff_def')) {
        results.push({ effectKey: 'defenseBuff', subKey: DAMAGE_TYPES[attrib].toLowerCase() });
        continue;
      }
      continue;
    }

    // Defense positions
    if (DEFENSE_POSITIONS[attrib]) {
      const posType = DEFENSE_POSITIONS[attrib].toLowerCase();
      if (aspect === 'resistance') {
        results.push({ effectKey: 'resistance', subKey: posType });
      } else {
        results.push({ effectKey: 'defenseBuff', subKey: posType });
      }
      continue;
    }

    // Resources — skip resistance aspect (debuff resistance, not a stacking buff)
    if (RESOURCE_TYPES[attrib]) {
      if (aspect === 'resistance') continue;
      const resType = RESOURCE_TYPES[attrib];
      if (resType === 'hitPoints') {
        if (aspect === 'maximum') return [{ effectKey: 'maxHPBuff' }];
      }
      if (resType === 'endurance') {
        if (aspect === 'maximum') return [{ effectKey: 'maxEndBuff' }];
        if (!isDebuff) return [{ effectKey: 'enduranceGain' }];
      }
      if (resType === 'recovery') return [{ effectKey: 'recoveryBuff' }];
      if (resType === 'regeneration') return [{ effectKey: 'regenBuff' }];
      if (resType === 'absorb') return [{ effectKey: 'absorb' }];
      continue;
    }

    // Combat modifiers
    if (COMBAT_MODIFIERS[attrib]) {
      const modType = COMBAT_MODIFIERS[attrib];
      if (modType === 'toHit' && !isDebuff) return [{ effectKey: 'tohitBuff' }];
      if (modType === 'rechargeTime' && !isDebuff && !tableLower.includes('slow')) return [{ effectKey: 'rechargeBuff' }];
      if (modType === 'threatLevel') return [{ effectKey: 'threatBuff' }];
      if (modType === 'enduranceDiscount') return [{ effectKey: 'enduranceDiscount' }];
      continue;
    }
  }

  return results;
}

/**
 * Detect per-target stacking effects in a raw power JSON.
 * Analyzes Stack/Continuous templates and returns patches to merge into effects.
 *
 * Also detects Execute_Power redirect stacking for non-AoE powers
 * (e.g., Reactive Regeneration → maxStacks from number_allowed).
 */
function detectStackingEffects(rawJson) {
  if (!rawJson.effects || rawJson.effects.length === 0) return null;

  const allTemplatesWithMeta = collectTemplatesWithMeta(rawJson.effects);
  const patches = {};
  let maxStacks = null;

  // === AoE per-target stacking (Stack/Continuous + Replace) ===
  // Only for AoE/Cone powers with maxTargets > 1 (not 255 = team-wide).
  // Normalize through EFFECT_AREA_MAP — bin format uses "Sphere" for what
  // the planner calls "AoE", and missing this normalization here was the
  // cause of Invincibility losing its perTarget metadata on regen.
  const effectArea = EFFECT_AREA_MAP[rawJson.effect_area] ?? rawJson.effect_area;
  const maxTargets = rawJson.max_targets_hit;
  const isAoEWithTargets = (effectArea === 'AoE' || effectArea === 'Cone') &&
    maxTargets && maxTargets > 1 && maxTargets !== 255;

  const selfBuffs = [];
  if (isAoEWithTargets) for (const { template, tags } of allTemplatesWithMeta) {
    if (template.target !== 'Self') continue;
    if (template.stack !== 'Stack' && template.stack !== 'Continuous' && template.stack !== 'Replace') continue;

    const isDefiance = tags.some(t =>
      typeof t === 'string' && t.toLowerCase().includes('defiance')
    );

    const classifications = classifyTemplateForStacking(template);
    if (classifications.length === 0) continue;

    for (const classification of classifications) {
      selfBuffs.push({
        ...classification,
        scale: Math.abs(template.scale || 0),
        table: template.table,
        stack: template.stack,
        isDefiance,
      });
    }
  }

  // Group by effectKey + subKey
  const groups = {};
  for (const buff of selfBuffs) {
    const groupKey = buff.subKey ? `${buff.effectKey}.${buff.subKey}` : buff.effectKey;
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(buff);
  }

  // Compute perTarget for each group
  for (const [, entries] of Object.entries(groups)) {
    // Stack/Continuous = per-target increment; Replace = base
    const stacks = entries.filter(e => (e.stack === 'Stack' || e.stack === 'Continuous') && !e.isDefiance);
    const replaces = entries.filter(e => e.stack === 'Replace' && !e.isDefiance);

    if (stacks.length === 0) continue;

    const stackScale = stacks.reduce((sum, e) => sum + e.scale, 0);
    const replaceScale = replaces.reduce((sum, e) => sum + e.scale, 0);
    const table = stacks[0].table;
    const combinedScale = replaceScale + stackScale;
    const perTarget = stackScale;

    const firstEntry = stacks[0];
    if (firstEntry.subKey) {
      if (!patches[firstEntry.effectKey]) patches[firstEntry.effectKey] = {};
      patches[firstEntry.effectKey][firstEntry.subKey] = { scale: combinedScale, table, perTarget };
    } else {
      patches[firstEntry.effectKey] = { scale: combinedScale, table, perTarget };
    }
  }

  // === Execute_Power redirect stacking (non-AoE, e.g., Reactive Regeneration) ===
  for (const { template } of allTemplatesWithMeta) {
    const attrib = template.attribs && template.attribs[0] ? template.attribs[0].toLowerCase() : null;
    if (attrib !== 'execute_power') continue;
    if (template.stack !== 'Stack') continue;

    const powerNames = (template.params && template.params.power_names) || [];
    for (const pName of powerNames) {
      if (!pName.toLowerCase().startsWith('redirects.')) continue;

      const redirectPath = resolveRedirectPath(pName);
      if (!fs.existsSync(redirectPath)) continue;

      let redirectJson;
      try { redirectJson = JSON.parse(fs.readFileSync(redirectPath, 'utf-8')); } catch { continue; }

      // number_allowed on the redirect power = max stacks
      if (redirectJson.number_allowed && redirectJson.number_allowed > 1) {
        maxStacks = redirectJson.number_allowed;
      }

      // Extract stacking effects from the redirect power's templates
      if (redirectJson.effects && redirectJson.effects.length > 0) {
        const redirectTemplates = collectTemplatesWithMeta(redirectJson.effects);
        for (const { template: rt } of redirectTemplates) {
          if (rt.target !== 'Self') continue;
          if (rt.stack !== 'Stack') continue;

          const classifications = classifyTemplateForStacking(rt);
          for (const cls of classifications) {
            const scale = Math.abs(rt.scale || 0);
            if (cls.subKey) {
              if (!patches[cls.effectKey]) patches[cls.effectKey] = {};
              const prev = patches[cls.effectKey][cls.subKey];
              patches[cls.effectKey][cls.subKey] = {
                scale: prev?.scale || 0,
                table: rt.table,
                perTarget: (prev?.perTarget || 0) + scale,
              };
            } else {
              // Accumulate perTarget for same effectKey (multiple Stack templates)
              const existing = patches[cls.effectKey];
              const prevPerTarget = (existing && typeof existing === 'object' && 'perTarget' in existing) ? existing.perTarget : 0;
              patches[cls.effectKey] = {
                scale: (existing && typeof existing === 'object' && 'scale' in existing) ? existing.scale : 0,
                table: rt.table,
                perTarget: prevPerTarget + scale,
              };
            }
          }
        }
      }
    }
  }

  if (Object.keys(patches).length === 0 && maxStacks === null) return null;
  return { patches, maxStacks };
}

/**
 * Merge stacking patches into an existing effects object.
 * Updates scale values and adds perTarget fields.
 */
function mergeStackingPatches(effects, stackingResult) {
  if (!stackingResult) return;

  const { patches, maxStacks } = stackingResult;

  if (maxStacks) {
    effects.maxStacks = maxStacks;
  }

  for (const [key, patchValue] of Object.entries(patches)) {
    if (typeof patchValue === 'object' && !('scale' in patchValue)) {
      // By-type patch (e.g., resistance: { smashing: {...} })
      if (!effects[key] || typeof effects[key] !== 'object') {
        effects[key] = {};
      }
      for (const [subKey, subVal] of Object.entries(patchValue)) {
        const existing = effects[key][subKey];
        if (existing && typeof existing === 'object') {
          // For redirect stacking: add perTarget to existing base scale
          if (subVal.scale === 0 && existing.scale) {
            effects[key][subKey] = { ...existing, perTarget: subVal.perTarget };
          } else {
            effects[key][subKey] = { scale: subVal.scale, table: subVal.table || existing.table, perTarget: subVal.perTarget };
          }
        } else {
          effects[key][subKey] = subVal;
        }
      }
    } else {
      // Simple effect patch (e.g., tohitBuff, damageBuff, regenBuff)
      const existing = effects[key];
      if (existing && typeof existing === 'object' && 'scale' in existing) {
        // For redirect stacking: add perTarget to existing base scale
        if (patchValue.scale === 0 && existing.scale) {
          effects[key] = { ...existing, perTarget: patchValue.perTarget };
        } else {
          effects[key] = { scale: patchValue.scale, table: patchValue.table || existing.table, perTarget: patchValue.perTarget };
        }
      } else if (patchValue.scale > 0) {
        effects[key] = patchValue;
      } else if (existing !== undefined && patchValue.perTarget) {
        // existing is a number or something else — wrap with perTarget
        const s = typeof existing === 'number' ? existing : (existing?.scale || 0);
        effects[key] = { scale: s, table: patchValue.table, perTarget: patchValue.perTarget };
      }
    }
  }
}

// Display name overrides for powers where clientmessages has stale/incorrect names
const DISPLAY_NAME_OVERRIDES = {
  // Note: Paralyzing_Blast is the internalName but in-game display is "Tesla Coil" (from clientmessages)
  'Adaptation': 'Adaptation',              // Bio Armor: clientmessages shows "Evolving Armor", in-game is "Adaptation"
  'Evolution': 'Evolving Armor',           // Bio Armor: clientmessages shows "Adaptation", in-game is "Evolving Armor"
};

// Icon overrides for powers where binary data references a renamed/missing icon file
const ICON_OVERRIDES = {
  'regeneration_resist.png': 'regeneration_resilience.png',  // Resilience icon renamed on HC
  'electriccontrol_paralyzingblastpatch.png': 'electriccontrol_paralyzingblast.png',  // Paralyzing Blast (was Tesla Coil)
  "martialarts_warrior'schallenge.png": 'martialarts_warrior%27schallenge.png',  // Apostrophe in filename
  'psionicarmor_worldofconfusion.png': 'psionicarmor_auraofinsanity.png',  // Aura of Insanity uses wrong icon name
  // Sonic Melee icons now extracted from live pigg — no overrides needed
};

// Ensure icon path has a file extension. Bin export emits bare names like
// "atomicmanipulation_weakpunch"; the planner's icon resolver expects ".png"
// (or .ico for set icons). Append .png if no extension is present.
function normalizeIconPath(icon) {
  if (!icon) return icon;
  // Already has an extension
  if (/\.[a-z0-9]{2,4}$/i.test(icon)) return icon;
  return icon + '.png';
}

// Additional allowedEnhancements not present in boosts_allowed but confirmed in-game
const ALLOWED_ENHANCEMENT_OVERRIDES = {
  // Storm Blast: Cloudburst accepts Slow in-game despite missing from binary data
  'Cloudburst': ['Slow'],
};

/**
 * Convert a single power file
 */
function convertPower(powerJson, availableLevel, archetypeId, powerType) {
  // Map target type to valid TypeScript type (or undefined if unknown)
  const rawTargetType = powerJson.target_type;
  const mappedTargetType = rawTargetType ? TARGET_TYPE_MAP[rawTargetType] : undefined;

  const power = {
    name: DISPLAY_NAME_OVERRIDES[powerJson.name] || powerJson.display_name,
    internalName: powerJson.name,
    available: availableLevel,
    description: powerJson.display_help?.replace(/<[^>]+>/g, '').trim(),
    shortHelp: powerJson.display_short_help,
    icon: normalizeIconPath(ICON_OVERRIDES[powerJson.icon] || powerJson.icon),
    // Map bin's "GlobalBoost" to the planner's "Global Enhancement" type.
    // Other types (Click/Toggle/Auto) match between bin and planner.
    powerType: powerJson.type === 'GlobalBoost' ? 'Global Enhancement' : powerJson.type,
    targetType: mappedTargetType,
    effectArea: EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area,
  };

  // Basic stats
  power.stats = {
    accuracy: powerJson.accuracy,
    range: powerJson.range,
    radius: powerJson.radius,
    arc: powerJson.arc,
    recharge: powerJson.recharge_time,
    endurance: powerJson.endurance_cost,
    castTime: powerJson.activation_time,
    activatePeriod: powerJson.activate_period,
    maxTargets: powerJson.max_targets_hit,
  };

  // Remove zero/null values
  Object.keys(power.stats).forEach(key => {
    if (!power.stats[key]) delete power.stats[key];
  });

  // Allowed enhancements (always include, even if empty, for type safety).
  // Accept both CoD2's descriptive names (via BOOST_TYPE_MAP) and the
  // bin-crawler's short names (via BIN_BOOST_MAP). Anything else is noise
  // (CoD2 emits origin tags like 'Natural_Boost' for some powers) and
  // gets filtered out.
  power.allowedEnhancements = (powerJson.boosts_allowed || [])
    .map(b => BOOST_TYPE_MAP[b] || BIN_BOOST_MAP[b])
    .filter(Boolean);

  // Allowed IO set categories — inferred from boost types because the bin
  // parser's allowed_boostset_cats field is broken (always empty for most
  // powers, garbage FX-path fragments otherwise — see binparser-bug audit).
  // Mapping rules derived empirically from the previously-correct generated
  // data; see inferAllowedSetCategories for the table.
  //
  // Special case 1: leap/charge attacks (Savage Leap, Feral Charge, Lightning
  // Rod, etc.) have main effect_area=SingleTarget but deliver damage via
  // an Execute_Power redirect that's actually AoE. Probe the redirect — if
  // the AoE came via redirect, treat as MELEE AoE (the leap range is just
  // travel; damage is melee around the landing point).
  //
  // Special case 2: location-targeted teleport AoEs (Shield Charge) have
  // effect_area=Location but the player teleports TO the spot and damages
  // foes around the landing point — that's melee delivery, not ranged.
  // target_type "Location (Teleport)" disambiguates from true ranged
  // location AoEs like Rain of Fire.
  const redirectArea = inferEffectiveArea(powerJson);
  // Detect location-teleport AoE by presence of a Teleport AttribMod alongside
  // effect_area=Location. The bin's target_type is unreliable here (Shield
  // Charge reports DeadMyPet instead of CoD2's "Location (Teleport)").
  const hasTeleportAttrib = (powerJson.effects || []).some(eff =>
    (eff.templates || []).some(t => (t.attribs?.[0] || '').toLowerCase() === 'teleport')
  );
  const isLocationTeleport = (powerJson.effect_area === 'Location' && hasTeleportAttrib);
  const effectiveArea = redirectArea
    ?? (isLocationTeleport ? 'AoE' : (EFFECT_AREA_MAP[powerJson.effect_area] ?? powerJson.effect_area));
  // For redirect-AoE / location-teleport attacks: drop the `Range` boost
  // from the inference input so the power gets `Melee AoE Damage`, not
  // `Ranged AoE Damage`.
  const boostsForCategory = (redirectArea || isLocationTeleport)
    ? (powerJson.boosts_allowed || []).filter(b => b !== 'Range')
    : (powerJson.boosts_allowed || []);
  const inferred = inferAllowedSetCategories(
    boostsForCategory,
    archetypeId,
    powerType,
    effectiveArea,
    powerJson.range,
  );
  if (inferred.length > 0) {
    power.allowedSetCategories = inferred;
  }

  // NOTE: Do NOT infer allowedEnhancements from set categories.
  // The raw data's boosts_allowed is the authoritative source.
  // If boosts_allowed is empty, the power genuinely accepts no generic IOs.
  // allowedSetCategories only determines which IO SETS can be slotted.

  // Apply manual overrides for powers where in-game allows enhancements not in binary data
  const extraEnhancements = ALLOWED_ENHANCEMENT_OVERRIDES[powerJson.name];
  if (extraEnhancements) {
    for (const enh of extraEnhancements) {
      if (!power.allowedEnhancements.includes(enh)) {
        power.allowedEnhancements.push(enh);
      }
    }
  }

  // Max slots — if allowedEnhancements is empty, the power accepts no enhancements
  power.maxSlots = (power.allowedEnhancements.length === 0) ? 0 : (powerJson.max_boosts || 6);

  // Extract effects from templates
  // Recursively collect from child_effects AND follow Execute_Power redirects
  // (e.g. Fault → Redirects.Stone_Melee.Fault_Brute / Fault_Cone_Brute, where
  // the actual damage/knockback/stun lives in the redirect targets).
  let allTemplates = [];
  if (powerJson.effects?.length) {
    allTemplates = collectTemplatesDeep(powerJson.effects);
  } else if (powerJson.redirect?.length > 0) {
    // Power has empty effects but redirects to other powers — follow the redirect chain
    allTemplates = collectRedirectTemplates(powerJson);
    if (allTemplates.length > 0) {
      console.log(`  [redirect] Resolved ${allTemplates.length} templates from redirect chain for ${powerJson.display_name}`);
    }
  }

  // Also collect templates from activation_effects. Two distinct patterns share
  // this slot:
  //   1. Continuous self-targeted toggle/auto buffs (Dynamo +regen/+recovery,
  //      Reaction Time +recovery) — keep target=Self only, skip IgnoreStrength
  //      duplicates (the enhanceable copy is the unflagged one).
  //   2. Click powers whose effects live entirely behind an ActivationEffect
  //      Execute_Power redirect (Ground Zero → Ground_Zero_Ally + Foe; the
  //      redirect targets emit AnyAffected damage/heal templates). Those need
  //      to bypass the Self filter — the redirect target dictates the target.
  if (powerJson.activation_effects?.length) {
    // Direct templates from activation_effects (no redirect traversal).
    const directBuffs = collectAllTemplates(powerJson.activation_effects)
      .filter(t =>
        t.target === 'Self' &&
        !(t.flags || []).some(f => f.startsWith('IgnoreStrength'))
      );
    if (directBuffs.length > 0) {
      allTemplates = allTemplates.concat(directBuffs);
    }
    // Templates surfaced by following Execute_Power redirects within
    // activation_effects. Exclude anything that already came in via the
    // directBuffs pass (matched on identity since both pulls share array refs).
    const directSet = new Set(directBuffs);
    const redirected = collectTemplatesDeep(powerJson.activation_effects)
      .filter(t =>
        !directSet.has(t) &&
        !(t.flags || []).some(f => f.startsWith('IgnoreStrength'))
      );
    if (redirected.length > 0) {
      allTemplates = allTemplates.concat(redirected);
    }
  }

  if (allTemplates.length > 0) {
    const damage = extractDamage(allTemplates);
    if (damage) power.damage = damage;

    const effects = extractEffects(allTemplates, powerJson.name);

    // Detect per-target stacking (Stack/Continuous templates, Execute_Power redirects)
    const stackingResult = detectStackingEffects(powerJson);
    if (stackingResult) {
      mergeStackingPatches(effects, stackingResult);
    }

    if (Object.keys(effects).length) power.effects = effects;

  }

  // Requirements
  if (powerJson.requires) {
    power.requires = powerJson.requires;
  }

  // Mechanic power type detection
  const showInManage = powerJson.show_in_manage !== false; // defaults to true
  const maxBoosts = powerJson.max_boosts || 0;
  const autoIssue = powerJson.auto_issue === true;
  const showInInventory = powerJson.show_in_inventory || 'Show';
  const showInInfo = powerJson.show_in_info !== false; // defaults to true

  if (!showInManage && maxBoosts === 0) {
    if (autoIssue && availableLevel === -1) {
      power.mechanicType = 'childToggle';
    } else if (showInInventory === 'Never' && !showInInfo) {
      power.mechanicType = 'hiddenAuto';
    } else {
      power.mechanicType = 'hiddenPassive';
    }
  } else if (maxBoosts === 0 && availableLevel >= 0 && (!showInManage || powerJson.type === 'Auto')) {
    power.mechanicType = 'parentMechanic';
  }

  return power;
}

/**
 * Convert an entire powerset
 */
function convertPowerset(category, powersetName) {
  const categoryInfo = CATEGORY_MAP[category];
  if (!categoryInfo) {
    console.error(`Unknown category: ${category}`);
    console.log('Available categories:', Object.keys(CATEGORY_MAP).join(', '));
    process.exit(1);
  }

  const rawPath = path.join(RAW_DATA_PATH, category, powersetName);
  const indexPath = path.join(rawPath, 'index.json');

  if (!fs.existsSync(indexPath)) {
    console.error(`Powerset not found: ${rawPath}`);
    process.exit(1);
  }

  const indexJson = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));

  // Compatibility shim: bin-crawler export uses `powers` + `help` where CoD2
  // used `power_names` + `display_help`. Normalize to the CoD2-style names the
  // rest of this script expects so we don't have to rewrite every usage.
  if (!indexJson.power_names && indexJson.powers) indexJson.power_names = indexJson.powers;
  if (!indexJson.display_help && indexJson.help) indexJson.display_help = indexJson.help;
  if (!indexJson.display_short_help && indexJson.short_help) indexJson.display_short_help = indexJson.short_help;

  // Three parallel output directories — see src/data/README.md for the layering.
  const relPath = path.join(
    categoryInfo.archetype,
    categoryInfo.type,
    toKebabCase(indexJson.display_name),
  );
  const generatedDir = path.join(OUTPUT_GENERATED_PATH, relPath);
  const overridesDir = path.join(OUTPUT_OVERRIDES_PATH, relPath);
  const composedDir = path.join(OUTPUT_PATH, relPath);

  for (const d of [generatedDir, overridesDir, composedDir]) {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  }

  console.log(`Converting ${indexJson.display_name} to ${composedDir}`);

  // Convert each power
  const powers = [];
  const powerFiles = fs.readdirSync(rawPath).filter(f => f.endsWith('.json') && f !== 'index.json');

  for (const file of powerFiles) {
    const powerJson = JSON.parse(fs.readFileSync(path.join(rawPath, file), 'utf-8'));

    // Find the available level for this power. The bin-export `powers` array
    // is alphabetical (CoD2's `power_names` was game-pick order), so we use
    // available_level as the canonical sort key — matches in-game pick order.
    const powerIndex = indexJson.power_names.findIndex(n =>
      n.toLowerCase().endsWith(powerJson.name.toLowerCase())
    );
    const availableLevel = powerIndex >= 0 ? indexJson.available_level[powerIndex] : 0;

    const power = convertPower(powerJson, availableLevel, categoryInfo.archetype, categoryInfo.type);
    powers.push({ power, powerIndex: powerIndex >= 0 ? powerIndex : 999, availableLevel, file });
  }

  // Sort by available_level (game pick order). Ties broken by powerIndex so
  // same-level powers (e.g. two level-0 starters) keep a deterministic order
  // matching the bin's input listing.
  powers.sort((a, b) => {
    if (a.availableLevel !== b.availableLevel) return a.availableLevel - b.availableLevel;
    return a.powerIndex - b.powerIndex;
  });

  // Write individual power files into the three layers.
  //   - generated/<power>.ts: always rewritten with the fresh extraction
  //   - overrides/<power>.ts: scaffolded as empty `{}` only if missing
  //   - powersets/<power>.ts: composed export scaffolded only if missing
  // Re-running convert-powerset never clobbers hand-edited overrides/composed.
  for (const { power, file } of powers) {
    const powerFileName = toKebabCase(power.internalName) + '.ts';
    const exportName = power.name.replace(/[^a-zA-Z0-9]/g, '');
    const genRel = path.posix.join(
      '@/data/generated/powersets',
      categoryInfo.archetype, categoryInfo.type,
      toKebabCase(indexJson.display_name), toKebabCase(power.internalName),
    );
    const ovrRel = path.posix.join(
      '@/data/overrides/powersets',
      categoryInfo.archetype, categoryInfo.type,
      toKebabCase(indexJson.display_name), toKebabCase(power.internalName),
    );

    // 1. generated layer — always overwritten
    const generatedContent = `/**
 * ${power.name} — GENERATED LAYER
 * AUTO-GENERATED by \`node scripts/convert-powerset.cjs ${category} ${powersetName}\`.
 * Do not hand-edit. Manual deltas go in the parallel overrides file.
 *
 * Source: ${category}/${powersetName}/${file}
 */

import type { Power } from '@/types';

export const ${exportName}: Power = ${JSON.stringify(power, null, 2)};
`;
    fs.writeFileSync(path.join(generatedDir, powerFileName), generatedContent);

    // 2. & 3. overrides + composed — scaffolded individually if missing.
    //    Each is independent; a missing composed gets created (importing
    //    whatever override exists or scaffolding an empty one), and a
    //    missing override gets an empty stub. Both are safe-to-rebuild —
    //    the composed file is just the layering shim, and the empty
    //    override is a no-op.
    const composedPath = path.join(composedDir, powerFileName);
    const overridePath = path.join(overridesDir, powerFileName);
    const composedExists = fs.existsSync(composedPath);
    const overrideExists = fs.existsSync(overridePath);
    if (!overrideExists) {
      const overrideContent = `/**
 * ${power.name} — OVERRIDES LAYER
 *
 * Hand-written deltas applied on top of the generated power object via
 * \`withOverrides()\` in the composed file. Survives regeneration.
 * Empty \`{}\` means no overrides — the generated extraction is accepted
 * as-is. Add fields here when convert-powerset produces the wrong value
 * or is missing a planner-only field (maxStacks, stacksLinear, etc.).
 */
import type { Power } from '@/types';

export const overrides: Partial<Power> = {};
`;
      fs.writeFileSync(overridePath, overrideContent);
    }
    if (!composedExists) {
      const composedContent = `/**
 * ${power.name} — COMPOSED EXPORT
 *
 * The planner imports from here. Composes the auto-generated power object
 * with hand-written overrides via \`withOverrides\`. See src/data/README.md
 * for the layering pattern.
 *
 * To re-generate the base power:
 *   node scripts/convert-powerset.cjs ${category} ${powersetName}
 */
import type { Power } from '@/types';
import { withOverrides } from '@/data/_layer';
import { ${exportName} as base } from '${genRel}';
import { overrides } from '${ovrRel}';

export const ${exportName}: Power = withOverrides(base, overrides);
`;
      fs.writeFileSync(composedPath, composedContent);
    }

    console.log(`  - ${power.name}`);
  }

  // Generate unique variable names (handle duplicates)
  const usedNames = new Map(); // name -> count
  const powerVarNames = powers.map(({ power: p }) => {
    const baseName = p.name.replace(/[^a-zA-Z0-9]/g, '');
    const count = usedNames.get(baseName) || 0;
    usedNames.set(baseName, count + 1);
    return count > 0 ? `${baseName}${count + 1}` : baseName;
  });

  // Write index file
  const indexContent = `/**
 * ${indexJson.display_name} Powerset
 * ${indexJson.display_help?.replace(/<[^>]+>/g, '').trim()}
 *
 * Archetype: ${categoryInfo.archetype}
 * Category: ${categoryInfo.type}
 * Source: ${category}/${powersetName}
 */

import type { Powerset } from '@/types';

${powers.map(({ power: p }, i) => `import { ${p.name.replace(/[^a-zA-Z0-9]/g, '')} as ${powerVarNames[i]} } from './${toKebabCase(p.internalName)}';`).join('\n')}

export const powerset: Powerset = {
  id: '${categoryInfo.archetype}/${toKebabCase(indexJson.display_name)}',
  name: '${indexJson.display_name}',
  description: '${indexJson.display_help?.replace(/<[^>]+>/g, '').replace(/'/g, "\\'")}',
  icon: '${indexJson.icon}',
  archetype: '${categoryInfo.archetype}',
  category: '${categoryInfo.type}',
  powers: [
${powerVarNames.map(name => `    ${name},`).join('\n')}
  ],
};

export default powerset;
`;

  // index.ts lives with the composed files and imports from them by their
  // kebab-case filename (same as pre-layering), so the import paths stay
  // stable across the layering migration.
  fs.writeFileSync(path.join(composedDir, 'index.ts'), indexContent);
  console.log(`\nWrote ${powers.length} powers to ${composedDir}`);

  return { powerset: indexJson, powers, outputDir: composedDir };
}

// Export for reuse by other scripts (e.g., audit-powerset-effects.cjs,
// migrate-to-layered.cjs)
module.exports = {
  extractEffects,
  extractDamage,
  inferAllowedSetCategories,
  normalizeIconPath,
  toKebabCase,
  CATEGORY_MAP,
  BOOST_TYPE_MAP,
  BIN_BOOST_MAP,
  EFFECT_AREA_MAP,
  SET_CATEGORY_MAP,
  DAMAGE_TYPES,
  DEFENSE_POSITIONS,
  ELUSIVITY_TYPES,
  MEZ_TYPES,
  KNOCKBACK_TYPES,
  MOVEMENT_TYPES,
  RESOURCE_TYPES,
  COMBAT_MODIFIERS,
  STEALTH_TYPES,
  CONTROL_TYPES,
  SPECIAL_ATTRIBS,
  RAW_DATA_PATH,
  collectAllTemplates,
  resolveRedirectPath,
  collectRedirectTemplates,
  collectTemplatesDeep,
  detectStackingEffects,
  mergeStackingPatches,
};

// Main execution (only when run directly)
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node scripts/convert-powerset.js <category> <powerset>');
    console.log('Example: node scripts/convert-powerset.js defender_buff radiation_emission');
    console.log('\nAvailable categories:', Object.keys(CATEGORY_MAP).join(', '));
    process.exit(1);
  }

  convertPowerset(args[0], args[1]);
}
