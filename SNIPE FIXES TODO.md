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

~~Sniper Blast (Energy Assault, Energy Blast, Assault Rifle, etc.) has no damage field at all in the generated data~~ **— FIXED 2026-04-29.**
Root cause was the bin exporter's PLAYER_CATEGORIES set excluding `Pets` and `Villain_Pets`. Snipe powers carry empty `effects` and a top-level `redirect` array pointing at e.g. `Pets.Blaster_Energy_Snipe.Sniper_Blast_Normal` (and `_Quick` for the fast-snipe variant). Without those pet files on disk, `collectRedirectTemplates` couldn't load the actual damage. Added both pet categories to PLAYER_CATEGORIES and re-exported. Snipe powers (Sniper Blast, Sniper Rifle, Moonbeam, Zapp, Blazing Bolt, etc.) now have correct damage scales — Sniper Blast = Smashing 1.5 + Energy 3.0 from `Ranged_Damage` table. The Quick variant data is also on disk for when fast-snipe support lands.

~~Damage section for non-damaging powers with damage procs slotted (Infrigidate, Siphon Speed)~~ **— FIXED 2026-04-29.**
InfoPanel now synthesizes a "Damage from Procs" section when a power has no base damage but carries one or more slotted damage procs. Computes per-proc chance (PPM × cycle-time × area-factor), interpolated avg damage, per-cast contribution, and DPS, plus a total row.

~~Per-snipe fast-snipe behavior~~ **— FIXED 2026-04-29.**
The InfoPanel was already wired to swap in `power.quickSnipe.{stats,damage}` when In-Combat is on; the data side just wasn't populated. Added `extractQuickSnipeData` to `convert-powerset.cjs`: when a power's redirect array carries a `kEngaged` / `Experienced_Marksman`-conditioned variant alongside the `Always` (Normal) variant, the Quick variant's damage and cast time are extracted into `power.quickSnipe`. 41 snipe powers now ship with quickSnipe data, so the In-Combat toggle correctly shows the fast-snipe scale (typically ~50% of charged with no interrupt window).