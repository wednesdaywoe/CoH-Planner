Summary of fixes
power-row-utils.ts — toggle heuristic rewrite
Replaced the brittle targetType==='self' / shortHelp regex with a proper "has persistent caster-affecting buff" check. Expanded BUFF_EFFECT_KEYS (now CASTER_BUFF_KEYS) to include unsuffixed fields like resistance, defense, movement buffs, mez/debuff resistance, plus respects selfPenalty for Granite-Armor-style self-debuffs. Adds an ally-only targetType exclusion.

Sprint: works (was already Toggle-typed)
Healing Flames: now toggleable (resistance.toxic + buffDuration: 60 matches)
Inferno: no longer toggleable (no persistent buff fields, only damage)
Snipes: no longer toggleable (the misleading "Self +Range" shortHelp regex is gone)
Speed Boost: no longer toggleable on caster (Ally (Alive) excluded)
ChronologicalInherentsSection.tsx — wire Sprint's toggle
Imports shouldShowToggle, threads togglePowerActive from buildStore, and passes toggleSize/isActive/onToggle to PowerRow. Sprint, Combat Jumping (if shown as inherent), and Prestige sprints will now have a working toggle.

character-totals.ts — skip ally-only powers
Added ALLY_ONLY_TARGET_TYPES set (Ally, Ally (Alive)) and a continue at the top of applyActivePowerBonuses. Even if a build had Speed Boost/Fortitude/etc. previously toggled active, their buffs no longer apply to the caster.

damage.ts — InherentDamage filter fallback
When the existing PvP/InherentDamage filter would strip all damage entries (Peacebringer Bright Nova Bolt etc., where every entry uses Ranged_InherentDamage), fall back to using the InherentDamage entries — they're the actual damage of form-required powers, not conditional bonuses.

Not yet fixed (deferred)
Sniper Blast (Energy Assault, Energy Blast, Assault Rifle, etc.) has no damage field at all in the generated data — this is an upstream extraction issue, not a planner-logic one. The bin-crawler export needs to capture snipe damage entries. Worth investigating whether they live behind a different table prefix or need a special requires-aware extraction path.
Damage section for non-damaging powers with damage procs slotted (Infrigidate, Siphon Speed) — this is more of a feature than a bug fix and needs a UI change in PowerInfoTooltip.tsx to inspect slotted enhancements for damage procs and synthesize a Damage row. Happy to tackle separately.
Per-snipe fast-snipe behavior — combatMode is the right global mechanism; making it actually move the needle on totals requires populating quickSnipe data on snipe powers (and probably a generic "+27% damage in fast-snipe state" effect since it's the same for all snipes). Also a separate task.