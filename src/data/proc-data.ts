/**
 * Proc enhancement data - detailed information about IO set procs
 * Includes PPM values, mechanics, damage values, and effect descriptions
 */
import { PROC_GLOBAL_EFFECTS } from './generated/proc-globals.generated';
import { PROC_DAMAGE_EFFECTS } from './generated/proc-damage.generated';
import { PROC_OTHER_EFFECTS } from './generated/proc-effects.generated';
import { PROC_PPM } from './generated/proc-ppm.generated';
import { PROC_RESIDUAL_EFFECTS } from './proc-residual-effects';
import { PROC_VARIABLE_CONTROLS } from './proc-variable-controls';
import type { ProcOverride } from '../types/build';

export type ProcType = 'Proc' | 'Proc120s' | 'Global';

/** Categorization of proc effects for display and calculation */
export type ProcEffectCategory =
  | 'Damage'
  | 'Endurance'
  | 'Heal'
  | 'Absorb'
  | 'Resistance'
  | 'Defense'
  | 'ToHit'
  | 'Regeneration'
  | 'Recovery'
  | 'Recharge'
  | 'RunSpeed'
  | 'MaxHP'
  | 'KnockbackProtection'
  | 'MezResist'
  | 'SlowResistance'
  | 'RechargeResistance'
  | 'Stealth'
  | 'BuildUp'
  | 'Control'
  | 'Debuff'
  | 'Special';

/** Structured proc effect data */
export interface ParsedProcEffect {
  category: ProcEffectCategory;
  /** Value (percentage or flat) */
  value?: number;
  /** Secondary value (for ranges like 7-72 damage) */
  valueMax?: number;
  /** Damage/effect type (Fire, Cold, All, etc.) */
  effectType?: string;
  /** Duration in seconds */
  duration?: number;
  /** Whether this is a buff to self vs debuff to foe */
  isBuff: boolean;
  /** Raw description */
  description: string;
  /** Secondary effect category (for combined effects like Numina's Recovery+Regen) */
  secondaryCategory?: ProcEffectCategory;
  /** Secondary effect value */
  secondaryValue?: number;
  /** Secondary effect type */
  secondaryEffectType?: string;
}

/**
 * A single structured proc/global effect. Binary-sourced (see
 * scripts/extract-proc-data.py + PROC-DATA-BINARY-SOURCING.md). Replaces the
 * fragile parseProcEffect(mechanics) round-trip: a proc carries a LIST of these
 * (a global like Aegis has Resistance + MezResist; Winter's Gift has Slow +
 * Recharge resist). Each maps directly to applySingleProcEffect.
 */
export interface ProcEffect {
  category: ProcEffectCategory;
  /** Value (percentage, flat, or feet for stealth) */
  value?: number;
  /** Max value (damage ranges, stealth PvP radius) */
  valueMax?: number;
  /** Damage/effect type (Fire, Cold, All, Psionic, …) */
  effectType?: string;
  /** Duration in seconds (for timed effects) */
  duration?: number;
  /** Effect target. 'pets' = buffs the player's pets (MM auras); 'foe' = debuff/
   *  mez/knock applied to the enemy. The player-dashboard path skips both.
   *  Omitted = self. */
  target?: 'self' | 'pets' | 'foe';
  /** Trigger chance when < 1 (chance-gated, not steady always-on). The
   *  always-on dashboard path skips these. Omitted = always on. */
  chance?: number;
  /** True when the value is an HP-scaling floor (Reactive Defenses 3%–12.9%).
   *  `value` is the floor (at full HP), `valueMax` the cap (near 0 HP). */
  scaling?: boolean;
  /** Max concurrent stacks for a self-stacking buff proc (Might of the Tanker
   *  = 3). Present ⇒ this effect exposes a stack slider; contribution is
   *  per-stack `value` × stacks. */
  maxStacks?: number;
  /** AT modifier table for a "By the Slotted Power" effect whose magnitude is
   *  `scale × table[level]`, NOT a literal percent. When set, `value` holds the
   *  raw `scale × 100` (as the generator emits it) and the resolved per-stack
   *  magnitude is `value × getTableValue(archetype, scaleTable, level)` — e.g.
   *  Might of the Tanker: 50 (scale 0.5×100) × 0.10 (Tanker Melee_Res_Dmg) = 5%.
   *  Absent ⇒ `value` is already the resolved literal (Reactive Defenses = 3%). */
  scaleTable?: string;
}

export interface ProcData {
  /** Set category (e.g., "Ranged Damage", "Holds") */
  setCategory: string;
  /** IO Set name */
  setName: string;
  /** Proc IO name */
  ioName: string;
  /** Procs Per Minute value (null for Globals and some Proc120s) */
  ppm: number | null;
  /** Detailed mechanics description */
  mechanics: string;
  /** PvP-specific notes */
  pvpNotes: string;
  /** Type: Proc, Proc120s, or Global */
  type: ProcType;
  /** Level range as string (e.g., "25--40", "50") */
  levelRange: string;
  /** Pool/rarity (e.g., "A-rare", "C", "PvPIO", "Winter") */
  pool: string;
  /** Whether unique or exclusive */
  unique: 'Unique' | 'Exclusive' | '';
  /**
   * Structured, binary-sourced effects. When present, consumers read these
   * directly instead of parsing `mechanics`. Populated for always-on globals
   * (Phase 2); damage/PPM procs follow in later phases.
   */
  effects?: ProcEffect[];
}

/**
 * Complete proc database indexed by IO name for fast lookup
 */
export const PROC_DATABASE: Record<string, ProcData> = {
  // Buff Procs
  "Chance for Build Up": {
    setCategory: "Ranged Damage",
    setName: "Decimation",
    ioName: "Chance for Build Up",
    ppm: 1,
    mechanics: "Buff(Build up (15% ToHit 100% Dam)) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "25--40",
    pool: "A-rare",
    unique: "Unique"
  },
  "Gaussian's Synchronized Fire-Control: Chance for Build Up": {
    setCategory: "To Hit Buff",
    setName: "Gaussian's Synchronized Fire-Control",
    ioName: "Chance for Build Up",
    ppm: 1,
    mechanics: "Buff(Build up (15% ToHit 100% Dam)) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "21--50",
    pool: "A-rare",
    unique: "Unique"
  },
  "Chance for Endurance Buff": {
    setCategory: "Endurance Modification",
    setName: "Performance Shifter",
    ioName: "Chance for Endurance Buff",
    ppm: 1.5,
    mechanics: "Buff(Endurance 7.5% of Max Endurance)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "21--50",
    pool: "A-rare",
    unique: ""
  },
  "Chance for +HP & +End": {
    setCategory: "Healing",
    setName: "Panacea",
    ioName: "Chance for +HP & +End",
    ppm: 3,
    mechanics: "Buff(Heal 6.7% AT HP), Buff(Endurance 7.5% of Max End), Buff(Regeneration 20% or 0.08/sec - PVP Only)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "PvPIO",
    unique: "Unique"
  },
  "Theft of Essence: Chance for Endurance Buff": {
    setCategory: "Accurate Healing",
    setName: "Theft of Essence",
    ioName: "Chance for Endurance Buff",
    ppm: 3.5,
    mechanics: "Buff(Endurance 10%)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Chance for Heal Self": {
    setCategory: "Sleep",
    setName: "Call of the Sandman",
    ioName: "Chance for Heal Self",
    ppm: 2,
    mechanics: "Buff(Heal 5%)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Entropic Chaos: Chance for Heal Self": {
    setCategory: "Ranged Damage",
    setName: "Entropic Chaos",
    ioName: "Chance for Heal Self",
    ppm: 3,
    mechanics: "Buff(Heal 5%)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "20--35",
    pool: "A-rare",
    unique: ""
  },
  "Power Transfer: Chance for Heal Self": {
    setCategory: "Endurance Modification",
    setName: "Power Transfer",
    ioName: "Chance for Heal Self",
    ppm: 3,
    mechanics: "Buff(Heal 5%)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "21--50",
    pool: "A-rare",
    unique: ""
  },
  "Chance for +Absorb": {
    setCategory: "Holds",
    setName: "Entomb",
    ioName: "Chance for +Absorb",
    ppm: 2,
    mechanics: "Buff(Absorption 10% of HP)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "Winter",
    unique: "Unique"
  },
  "Superior Entomb: Chance for +Absorb": {
    setCategory: "Holds",
    setName: "Superior Entomb",
    ioName: "Chance for +Absorb",
    ppm: 3,
    mechanics: "Buff(Absorption 10% of HP)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Winter",
    unique: "Unique"
  },
  // Preventive Medicine (Healing set) - Global IO, health-threshold trigger
  "+Absorb/Chance for +Absorb": {
    setCategory: "Healing",
    setName: "Preventive Medicine",
    ioName: "Chance for +Absorb",
    ppm: null,
    mechanics: "Buff(Absorption 20% of HP), triggers at low health, 90s cooldown",
    pvpNotes: "",
    type: "Global",
    levelRange: "20--50",
    pool: "A-rare",
    unique: "Unique"
  },
  // Gauntleted Fist (Tanker ATO) - Absorb proc
  "Gauntleted Fist: Recharge/Chance for +Absorb": {
    setCategory: "Tanker Archetype Sets",
    setName: "Gauntleted Fist",
    ioName: "Chance for +Absorb",
    ppm: 2,
    mechanics: "Buff(Absorption) by the slotted power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Gauntleted Fist: Recharge/Chance for +Absorb": {
    setCategory: "Tanker Archetype Sets",
    setName: "Superior Gauntleted Fist",
    ioName: "Chance for +Absorb",
    ppm: 3,
    mechanics: "Buff(Absorption) by the slotted power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  // Sentinel's Ward (Sentinel ATO) - Absorb proc
  "Sentinel's Ward: Recharge/Chance for +Absorb": {
    setCategory: "Sentinel Archetype Sets",
    setName: "Sentinel's Ward",
    ioName: "Chance for +Absorb",
    ppm: 5,
    mechanics: "Buff(Absorption 50% of HP for 30s) by the slotted power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Sentinel's Ward: Recharge/Chance for +Absorb": {
    setCategory: "Sentinel Archetype Sets",
    setName: "Superior Sentinel's Ward",
    ioName: "Chance for +Absorb",
    ppm: 6,
    mechanics: "Buff(Absorption 50% of HP for 30s) by the slotted power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  // Vigilant Assault (Defender ATO) - PBAoE Absorb proc
  "Vigilant Assault: Recharge/Chance for +Absorb": {
    setCategory: "Defender Archetype Sets",
    setName: "Vigilant Assault",
    ioName: "Chance for Minor PBAoE +Absorb",
    ppm: 4,
    mechanics: "PBAoE Buff(Absorption) to caster and nearby allies",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Vigilant Assault: Recharge/Chance for +Absorb": {
    setCategory: "Defender Archetype Sets",
    setName: "Superior Vigilant Assault",
    ioName: "Chance for Minor PBAoE +Absorb",
    ppm: 5,
    mechanics: "PBAoE Buff(Absorption) to caster and nearby allies",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for Recharge Buff": {
    setCategory: "Knockback",
    setName: "Force Feedback",
    ioName: "Chance for Recharge Buff",
    ppm: 2,
    mechanics: "Buff(Recharge 100%) for 5s/target with cooldowns",
    pvpNotes: "",
    type: "Proc",
    levelRange: "21--50",
    pool: "A-rare",
    unique: ""
  },
  "Soulbound Allegiance: Chance for Build Up": {
    setCategory: "Pet Damage",
    setName: "Soulbound Allegiance",
    ioName: "Chance for Build Up",
    ppm: 3,
    mechanics: "Buff(Pet Build up (15% ToHit 100% Dam)) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },

  // Damage Procs
  "Chance for Fire Damage": {
    setCategory: "Melee AoE Damage",
    setName: "Armageddon",
    ioName: "Chance for Fire Damage",
    ppm: 4.5,
    mechanics: "Damage (Fire 10-107)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },
  "Bombardment: Chance for Fire Damage": {
    setCategory: "Ranged AoE Damage",
    setName: "Bombardment",
    ioName: "Chance for Fire Damage",
    ppm: 3.5,
    mechanics: "Damage(Energy 7 - 72)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "30--50",
    pool: "",
    unique: ""
  },
  "Chance for Cold Damage": {
    setCategory: "Slow Movement",
    setName: "Ice Mistral's Torment",
    ioName: "Chance for Cold Damage",
    ppm: 3.5,
    mechanics: "Damage (Cold 10-72)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "20--50",
    pool: "",
    unique: ""
  },
  "Chance for Energy Damage": {
    setCategory: "Confuse",
    setName: "Cacophony",
    ioName: "Chance for Energy Damage",
    ppm: 3.5,
    mechanics: "Damage(Energy 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Eradication: Chance for Energy Damage": {
    setCategory: "Melee AoE Damage",
    setName: "Eradication",
    ioName: "Chance for Energy Damage",
    ppm: 3.5,
    mechanics: "Damage(Energy 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Positron's Blast: Chance for Energy Damage": {
    setCategory: "Ranged AoE Damage",
    setName: "Positron's Blast",
    ioName: "Chance for Energy Damage",
    ppm: 3.5,
    mechanics: "Damage(Energy 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Chance for Lethal Damage": {
    setCategory: "Melee Damage",
    setName: "Mako's Bite",
    ioName: "Chance for Lethal Damage",
    ppm: 3.5,
    mechanics: "Damage(Lethal 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "30--50",
    pool: "C",
    unique: ""
  },
  "Scirocco's Dervish: Chance for Lethal Damage": {
    setCategory: "Melee AoE Damage",
    setName: "Scirocco's Dervish",
    ioName: "Chance for Lethal Damage",
    ppm: 3.5,
    mechanics: "Damage(Lethal 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Shield Breaker: Chance for Lethal Damage": {
    setCategory: "Accurate Defense Debuff",
    setName: "Shield Breaker",
    ioName: "Chance for Lethal Damage",
    ppm: 3.5,
    mechanics: "Damage(Lethal 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Trap of the Hunter: Chance for Lethal Damage": {
    setCategory: "Immobilize",
    setName: "Trap of the Hunter",
    ioName: "Chance for Lethal Damage",
    ppm: 3.5,
    mechanics: "Damage(Lethal 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Javelin Volley: Chance for Lethal Damage": {
    setCategory: "Ranged AoE Damage",
    setName: "Javelin Volley",
    ioName: "Chance for Lethal Damage",
    ppm: 3.5,
    mechanics: "Damage(Lethal 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--50",
    pool: "PvPIO",
    unique: ""
  },
  "Gladiator's Net: Chance for Lethal Damage": {
    setCategory: "Holds",
    setName: "Gladiator's Net",
    ioName: "Chance for Lethal Damage",
    ppm: 3.5,
    mechanics: "Damage(Lethal 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--50",
    pool: "PvPIO",
    unique: ""
  },
  "Chance for Negative Energy Damage": {
    setCategory: "Ranged Damage",
    setName: "Apocalypse",
    ioName: "Chance for Negative Energy Damage",
    ppm: 4.5,
    mechanics: "Damage(Negative Energy 10 - 107)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },
  "Hecatomb: Chance for Negative Energy Damage": {
    setCategory: "Melee Damage",
    setName: "Hecatomb",
    ioName: "Chance for Negative Energy Damage",
    ppm: 4.5,
    mechanics: "Damage(Negative Energy 10 - 107)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },
  "Touch of Death: Chance for Negative Energy Damage": {
    setCategory: "Melee Damage",
    setName: "Touch of Death",
    ioName: "Chance for Negative Energy Damage",
    ppm: 3.5,
    mechanics: "Damage(Negative Energy 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "25--40",
    pool: "A-rare",
    unique: ""
  },
  "Touch of the Nictus: Chance for Negative Energy Damage": {
    setCategory: "Accurate Healing",
    setName: "Touch of the Nictus",
    ioName: "Chance for Negative Energy Damage",
    ppm: 3.5,
    mechanics: "Damage(Negative Energy 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "30--50",
    pool: "C",
    unique: ""
  },
  "Cloud Senses: Chance for Negative Energy Damage": {
    setCategory: "Accurate To Hit Debuff",
    setName: "Cloud Senses",
    ioName: "Chance for Negative Energy Damage",
    ppm: 3.5,
    mechanics: "Damage(Negative Energy 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Touch of Lady Grey: Chance for Negative Energy Damage": {
    setCategory: "Defense Debuff",
    setName: "Touch of Lady Grey",
    ioName: "Chance for Negative Energy Damage",
    ppm: 3.5,
    mechanics: "Damage(Negative Energy 7 - 72)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "21--50",
    pool: "A-rare",
    unique: ""
  },
  "Chance for Psionic Damage": {
    setCategory: "Holds",
    setName: "Ghost Widow's Embrace",
    ioName: "Chance for Psionic Damage",
    ppm: 3.5,
    mechanics: "Damage(Psionic 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Glimpse of the Abyss: Chance for Psionic Damage": {
    setCategory: "Fear",
    setName: "Glimpse of the Abyss",
    ioName: "Chance for Psionic Damage",
    ppm: 3.5,
    mechanics: "Damage(Psionic 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Malaise's Illusions: Chance for Psionic Damage": {
    setCategory: "Confuse",
    setName: "Malaise's Illusions",
    ioName: "Chance for Psionic Damage",
    ppm: 3.5,
    mechanics: "Damage(Psionic 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Perfect Zinger: Chance for Psionic Damage": {
    setCategory: "Threat Duration",
    setName: "Perfect Zinger",
    ioName: "Chance for Psionic Damage",
    ppm: 3.5,
    mechanics: "Damage(Psionic 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "21--50",
    pool: "A-rare",
    unique: ""
  },
  "Chance for Psionic DoT": {
    setCategory: "Holds",
    setName: "Neuronic Shutdown",
    ioName: "Chance for Psionic DoT",
    ppm: 3.5,
    mechanics: "Damage(Psionic 7 - 72) ?DoT?",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Chance for Smashing Damage": {
    setCategory: "Holds",
    setName: "Unbreakable Constraint",
    ioName: "Chance for Smashing Damage",
    ppm: 4.5,
    mechanics: "Damage(Smashing 10 - 107)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },
  "Explosive Strike: Chance for Smashing Damage": {
    setCategory: "Knockback",
    setName: "Explosive Strike",
    ioName: "Chance for Smashing Damage",
    ppm: 3.5,
    mechanics: "Damage(Smashing 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--20",
    pool: "B",
    unique: ""
  },
  "Impeded Swiftness: Chance for Smashing Damage": {
    setCategory: "Slow Movement",
    setName: "Impeded Swiftness",
    ioName: "Chance for Smashing Damage",
    ppm: 3.5,
    mechanics: "Damage(Smashing 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Obliteration: Chance for Smashing Damage": {
    setCategory: "Melee AoE Damage",
    setName: "Obliteration",
    ioName: "Chance for Smashing Damage",
    ppm: 3.5,
    mechanics: "Damage(Smashing 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "30--50",
    pool: "C",
    unique: ""
  },
  "Gladiator's Strike: Chance for Smashing Damage": {
    setCategory: "Melee Damage",
    setName: "Gladiator's Strike",
    ioName: "Chance for Smashing Damage",
    ppm: 3.5,
    mechanics: "Damage(Smashing 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--50",
    pool: "PvPIO",
    unique: ""
  },
  "Chance for Toxic Damage": {
    setCategory: "Sniper Attacks",
    setName: "Sting of the Manticore",
    ioName: "Chance for Toxic Damage",
    ppm: 3.5,
    mechanics: "Damage(Toxic 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "35--50",
    pool: "C",
    unique: ""
  },
  "Gladiator's Javelin: Chance for Toxic Damage": {
    setCategory: "Ranged Damage",
    setName: "Gladiator's Javelin",
    ioName: "Chance for Toxic Damage",
    ppm: 3.5,
    mechanics: "Damage(Toxic 7 - 72)",
    pvpNotes: "Irresistable",
    type: "Proc",
    levelRange: "10--50",
    pool: "PvPIO",
    unique: ""
  },

  // Debuff Procs
  "Chance for -Res Debuff": {
    setCategory: "Defense Debuff",
    setName: "Achilles' Heel",
    ioName: "Chance for -Res Debuff",
    ppm: 3.5,
    mechanics: "Foe(-Resistance 20%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--20",
    pool: "B",
    unique: ""
  },
  "Fury of the Gladiator: Chance for -Res Debuff": {
    setCategory: "Melee AoE Damage",
    setName: "Fury of the Gladiator",
    ioName: "Chance for -Res Debuff",
    ppm: 3.5,
    mechanics: "Foe(-Resistance 20%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "PvPIO",
    unique: "Unique"
  },
  "Annihilation: Chance for -Res Debuff": {
    setCategory: "Ranged AoE Damage",
    setName: "Annihilation",
    ioName: "Chance for -Res Debuff",
    ppm: 3,
    mechanics: "Foe(-Resistance 12.5%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },
  "Chance for Recharge Slow": {
    setCategory: "To Hit Debuff",
    setName: "Dark Watcher's Despair",
    ioName: "Chance for Recharge Slow",
    ppm: 3.5,
    mechanics: "Foe(-Rechage 25%) for 20s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "21--50",
    pool: "A-rare",
    unique: ""
  },
  "Induced Coma: Chance for Recharge Slow": {
    setCategory: "Sleep",
    setName: "Induced Coma",
    ioName: "Chance for Recharge Slow",
    ppm: 3.5,
    mechanics: "Foe(-Recharge 20%) for 20s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Pacing of the Turtle: Chance for Recharge Slow": {
    setCategory: "Slow Movement",
    setName: "Pacing of the Turtle",
    ioName: "Chance for Recharge Slow",
    ppm: 3.5,
    mechanics: "Foe(-Recharge 20%) for 20s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Basilisk's Gaze: Chance for Recharge Slow": {
    setCategory: "Holds",
    setName: "Basilisk's Gaze",
    ioName: "Chance for Recharge Slow",
    ppm: 3.5,
    mechanics: "Foe(-Recharge 25%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Winter's Bite: Chance for Recharge Slow": {
    setCategory: "Ranged Damage",
    setName: "Winter's Bite",
    ioName: "Chance for Recharge Slow",
    ppm: 4,
    mechanics: "Foe(-Recharge 20%) for 20s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "Winter",
    unique: "Unique"
  },
  "Chance for Recovery Debuff": {
    setCategory: "To Hit Debuff",
    setName: "Deflated Ego",
    ioName: "Chance for Recovery Debuff",
    ppm: 3.5,
    mechanics: "Foe(-Recovery 25%) for 10.25s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--20",
    pool: "B",
    unique: ""
  },
  "Chance for ToHit Debuff": {
    setCategory: "Stuns",
    setName: "Absolute Amazement",
    ioName: "Chance for ToHit Debuff",
    ppm: 4.5,
    mechanics: "Foe(-ToHit 7.5%) for 15s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },
  "Chance for End Drain": {
    setCategory: "Ranged Damage",
    setName: "Tempest",
    ioName: "Chance for End Drain",
    ppm: 3.5,
    mechanics: "Foe(-Endurance 13% PvE / 3.33% PvP)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "15--30",
    pool: "C",
    unique: ""
  },

  // Control Procs
  "Chance for Hold": {
    setCategory: "Ranged Damage",
    setName: "Devastation",
    ioName: "Chance for Hold",
    ppm: 3,
    mechanics: "Hold (Mag 2) for 8s PvE / 6s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "30--50",
    pool: "C",
    unique: ""
  },
  "Lockdown: Chance for Hold Mag 2": {
    setCategory: "Holds",
    setName: "Lockdown",
    ioName: "Chance for Hold Mag 2",
    ppm: 2.5,
    mechanics: "Hold (Mag 2) for 8s PvE / 6s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Gravitational Anchor: Chance for Hold": {
    setCategory: "Immobilize",
    setName: "Gravitational Anchor",
    ioName: "Chance for Hold",
    ppm: 3.5,
    mechanics: "Hold (Mag 2) for 8s PvE / 6s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },
  "Blistering Cold: Chance for Hold": {
    setCategory: "Melee Damage",
    setName: "Blistering Cold",
    ioName: "Chance for Hold",
    ppm: 3,
    mechanics: "Hold (Mag 3) for 8s PvE / 2s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "Winter",
    unique: "Unique"
  },
  "Chance for Stun": {
    setCategory: "Stuns",
    setName: "Stupefy",
    ioName: "Chance for Stun",
    ppm: 3.5,
    mechanics: "Foe(Disorient Mag 2) for 8s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Chance for Disorient": {
    setCategory: "Threat Duration",
    setName: "Triumphant Insult",
    ioName: "Chance for Disorient",
    ppm: 2,
    mechanics: "Foe(Disorient Mag 1) for 3s PvE / 2s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--20",
    pool: "B",
    unique: ""
  },
  "Unspeakable Terror: Chance for Disorient": {
    setCategory: "Fear",
    setName: "Unspeakable Terror",
    ioName: "Chance for Disorient",
    ppm: 3,
    mechanics: "Foe(Disorient Mag 1) for 8s PvE / 5.3s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Energy Manipulator: Chance for Disorient": {
    setCategory: "Endurance Modification",
    setName: "Energy Manipulator",
    ioName: "Chance for Disorient",
    ppm: 2,
    mechanics: "Foe(Disorient Mag 2) for 8s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--20",
    pool: "B",
    unique: ""
  },
  "Debilitative Action: Chance for Disorient": {
    setCategory: "Immobilize",
    setName: "Debilitative Action",
    ioName: "Chance for Disorient",
    ppm: 3,
    mechanics: "Foe(Disorient Mag 2) for 8s PvE / 5.3s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Pounding Slugfest: Chance for Disorient": {
    setCategory: "Melee Damage",
    setName: "Pounding Slugfest",
    ioName: "Chance for Disorient",
    ppm: 2.5,
    mechanics: "Foe(Disorient Mag 2) for 8s PvE / 5.3s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "15--30",
    pool: "C",
    unique: ""
  },
  "Chance for Immobilize": {
    setCategory: "Stuns",
    setName: "Razzle Dazzle",
    ioName: "Chance for Immobilize",
    ppm: 3.5,
    mechanics: "Foe(Immobilize Mag 2) for 8s PvE / 5.3s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Frozen Blast: Chance for Immobilize": {
    setCategory: "Ranged AoE Damage",
    setName: "Frozen Blast",
    ioName: "Chance for Immobilize",
    ppm: 2.5,
    mechanics: "Foe(Immobilize Mag 3) for 8s PvE / 2s PvP",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "Winter",
    unique: "Unique"
  },
  "Chance for Knockdown": {
    setCategory: "Melee Damage",
    setName: "Kinetic Combat",
    ioName: "Chance for Knockdown",
    ppm: 3,
    mechanics: "Foe(Knockback Mag .67 = Knockdown)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "20--35",
    pool: "A-rare",
    unique: ""
  },
  "Avalanche: Chance for Knockdown": {
    setCategory: "Melee AoE Damage",
    setName: "Avalanche",
    ioName: "Chance for Knockdown",
    ppm: 2.5,
    mechanics: "Foe(Knockback Mag .67 = Knockdown)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "Winter",
    unique: "Unique"
  },
  "Ragnarok: Chance for Knockdown": {
    setCategory: "Ranged AoE Damage",
    setName: "Ragnarok",
    ioName: "Chance for Knockdown",
    ppm: 3.5,
    mechanics: "Foe(Knockback Mag .67 = Knockdown)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },
  "Chance for Knockback": {
    setCategory: "Stuns",
    setName: "Stupefy",
    ioName: "Chance for Knockback",
    ppm: 3.5,
    mechanics: "Foe(Knockback Mag 6)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "20--50",
    pool: "C",
    unique: ""
  },
  "Chance for Confusion": {
    setCategory: "Confuse",
    setName: "Coercive Persuasion",
    ioName: "Chance for Confusion",
    ppm: 4.5,
    mechanics: "Foe(Confusion) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },
  "Chance for Placate": {
    setCategory: "Sleep",
    setName: "Fortunata Hypnosis",
    ioName: "Chance for Placate",
    ppm: 4.5,
    mechanics: "Foe(Placate Mag 2) for 8s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "A-purp",
    unique: "Unique"
  },

  // Global IOs
  "Max HP": {
    setCategory: "Resist Damage",
    setName: "Unbreakable Guard",
    ioName: "Max HP",
    ppm: null,
    mechanics: "Buff(Maximum Hit Points +7.5% )",
    pvpNotes: "",
    type: "Global",
    levelRange: "20--50",
    pool: "",
    unique: "Unique"
  },
  "Buff Recharge": {
    setCategory: "Defense",
    setName: "Luck of the Gambler",
    ioName: "Buff Recharge",
    ppm: null,
    mechanics: "Buff(Recharge 7.5%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "25--50",
    pool: "C",
    unique: ""
  },
  "Buff Run Speed": {
    setCategory: "Defense",
    setName: "Gift of the Ancients",
    ioName: "Buff Run Speed",
    ppm: null,
    mechanics: "Buff(RunSpeed 7.5%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "15--40",
    pool: "C",
    unique: ""
  },
  "Synapse's Shock: Buff Run Speed": {
    setCategory: "Endurance Modification",
    setName: "Synapse's Shock",
    ioName: "Buff Run Speed",
    ppm: null,
    mechanics: "Buff(RunSpeed 15%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "21--50",
    pool: "",
    unique: "Unique"
  },
  "Damage Resistance/+Def(All)": {
    setCategory: "Resist Damage",
    setName: "Steadfast Protection",
    ioName: "Damage Resistance/+Def(All)",
    ppm: null,
    mechanics: "Defense(All 3%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--30",
    pool: "A-rare",
    unique: "Unique"
  },
  "+Def(All)": {
    setCategory: "Resist Damage",
    setName: "Gladiator's Armor",
    ioName: "+Def(All)",
    ppm: null,
    mechanics: "Defense(All 3%)\nTeleport Protection for 10.25s",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "PvPIO",
    unique: "Unique"
  },
  "Teleportation Protection, +Res(All)": {
    setCategory: "Defense",
    setName: "Shield Wall",
    ioName: "Teleportation Protection, +Res(All)",
    ppm: null,
    mechanics: "Resistance(All 5%)\nTeleport Protection for 10.25s",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "PvPIO",
    unique: "Unique"
  },
  "Scaling +Res(All)": {
    setCategory: "Defense",
    setName: "Reactive Defenses",
    ioName: "Scaling +Res(All)",
    ppm: null,
    mechanics: "Resistance(All 3%--12.9%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "20--50",
    pool: "",
    unique: "Unique"
  },
  "Protection from Knockback": {
    setCategory: "Universal Travel",
    setName: "Blessing of the Zephyr",
    ioName: "Protection from Knockback",
    ppm: null,
    mechanics: "Protection(Knockback Mag 4)",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "C",
    unique: ""
  },
  "Karma: Protection from Knockback": {
    setCategory: "Defense",
    setName: "Karma",
    ioName: "Protection from Knockback",
    ppm: null,
    mechanics: "Protection(Knockback Mag 4)",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--30",
    pool: "A-unc",
    unique: ""
  },
  "Steadfast Protection: Knockback Protection": {
    setCategory: "Resist Damage",
    setName: "Steadfast Protection",
    ioName: "Knockback Protection",
    ppm: null,
    mechanics: "Protection(Knockback Mag 4)",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--30",
    pool: "A-rare",
    unique: ""
  },
  "Aegis: Psionic and Mez Resistance": {
    setCategory: "Resist Damage",
    setName: "Aegis",
    ioName: "Psionic and Mez Resistance",
    ppm: null,
    mechanics: "Resistance(Psionic 5%), MezResist(All 20%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "20--40",
    pool: "",
    unique: "Unique"
  },
  "Impervium Armor: +Res(Psionic)": {
    setCategory: "Resist Damage",
    setName: "Impervium Armor",
    ioName: "+Res(Psionic)",
    ppm: null,
    mechanics: "Resistance(Psionic 5%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "15--40",
    pool: "A-rare",
    unique: ""
  },
  "Resist Speed and Recharge Debuffs": {
    setCategory: "Universal Travel",
    setName: "Winter's Gift",
    ioName: "Resist Speed and Recharge Debuffs",
    ppm: null,
    mechanics: "Resist(-Speed 20% & -Recharge 20%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "canes",
    unique: "Unique"
  },

  // Proc120s
  "Buff Recovery & Regeneration": {
    setCategory: "Healing",
    setName: "Numina's Convalescence",
    ioName: "Buff Recovery & Regeneration",
    ppm: null,
    mechanics: "Buff(Recovery 10% & Regeneration 20% or 0.08%/sec) for 120s",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "30--50",
    pool: "C",
    unique: "Unique"
  },
  "Buff Recovery": {
    setCategory: "Healing",
    setName: "Miracle",
    ioName: "Buff Recovery",
    ppm: null,
    mechanics: "Buff(Recovery 15%) for 120s",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "20--40",
    pool: "C",
    unique: "Unique"
  },
  "Buff Regeneration": {
    setCategory: "Healing",
    setName: "Regenerative Tissue",
    ioName: "Buff Regeneration",
    ppm: null,
    mechanics: "Buff(Regeneration 25% or 0.10%/sec) for 120s",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--30",
    pool: "B",
    unique: "Unique"
  },
  "Impervious Skin: +Regeneration/+Res Mez(All)": {
    setCategory: "Resist Damage",
    setName: "Impervious Skin",
    ioName: "+Regeneration/+Res Mez(All)",
    ppm: null,
    mechanics: "Buff(Regeneration 25%) for 120s",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--30",
    pool: "B",
    unique: "Unique"
  },
  "Buff Stealth": {
    setCategory: "Running",
    setName: "Celerity",
    ioName: "Buff Stealth",
    ppm: null,
    mechanics: "Buff(Stealth 35 ft. PvE / 389 ft. PvP) for 120s",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "15--50",
    pool: "C",
    unique: "Exclusive"
  },
  "Buff ToHit": {
    setCategory: "Defense",
    setName: "Kismet",
    ioName: "Buff ToHit",
    ppm: null,
    mechanics: "Buff(ToHit 6%) for 120s",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--30",
    pool: "A-rare",
    unique: "Unique"
  },
  "Convert Knockback to Knockdown": {
    setCategory: "Knockback",
    setName: "Sudden Acceleration",
    ioName: "Convert Knockback to Knockdown",
    ppm: null,
    mechanics: "Power(Convert Knockback to Knockdown)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "21--50",
    pool: "",
    unique: ""
  },

  // Archetype Enhancement Procs
  "Critical Hit Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Scrapper's Strike",
    ioName: "Critical Hit Bonus",
    ppm: null,
    mechanics: "+Critical Hit Chance (+2% vs Minions, +4% others) for ALL powers",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  // ATO passive-global / pet-proc 6th-piece specials. The binary tags these
  // proc:false (the special isn't a self chance-proc), so they were dropped from
  // the slot UI and the totals — see the extractor's HC_PIECE_PATCHES. Values
  // binary-sourced from Set_Bonus.Global_Bonus.* except Scrapper's Strike crit
  // (a special crit mechanic; std +2/+4%, sup +3/+6% confirmed in-game by
  // @Redlynne). Pet-targeted globals are skipped by the player calc (they buff
  // pets), so they display only; Kheldian's Grace is a SELF global that applies.
  "Superior Scrapper's Strike: Critical Hit Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Superior Scrapper's Strike",
    ioName: "Critical Hit Bonus",
    ppm: null,
    mechanics: "+Critical Hit Chance (+3% vs Minions, +6% others) for ALL powers",
    pvpNotes: "",
    type: "Global",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Command of the Mastermind: Pet Defense Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Command of the Mastermind",
    ioName: "Pet Defense Bonus",
    ppm: null,
    mechanics: "Buff(+Def AoE 10%) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Command of the Mastermind: Pet Defense Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Superior Command of the Mastermind",
    ioName: "Pet Defense Bonus",
    ppm: null,
    mechanics: "Buff(+Def AoE 15%) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Kheldian's Grace: Resistance Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Kheldian's Grace",
    ioName: "Resistance Bonus",
    ppm: null,
    mechanics: "+Resistance (All) 3.5%, +Max HP 7.5%",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Kheldian's Grace: Resistance Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Superior Kheldian's Grace",
    ioName: "Resistance Bonus",
    ppm: null,
    mechanics: "+Resistance (All) 5%, +Max HP 10%",
    pvpNotes: "",
    type: "Global",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Mark of Supremacy: Pet Resistance Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Mark of Supremacy",
    ioName: "Pet Resistance Bonus",
    ppm: null,
    mechanics: "Buff(+Res All 10%) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Mark of Supremacy: Pet Resistance Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Superior Mark of Supremacy",
    ioName: "Pet Resistance Bonus",
    ppm: null,
    mechanics: "Buff(+Res All 15%) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Spider's Bite: Pet Toxic Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Spider's Bite",
    ioName: "Pet Toxic Bonus",
    ppm: null,
    mechanics: "Grants your pets' damage powers an 8% chance for minor Toxic damage",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Spider's Bite: Pet Toxic Bonus": {
    setCategory: "Archetype Enhancement",
    setName: "Superior Spider's Bite",
    ioName: "Pet Toxic Bonus",
    ppm: null,
    mechanics: "Grants your pets' damage powers an 8% chance for Toxic damage",
    pvpNotes: "",
    type: "Global",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for Critical Hit": {
    setCategory: "Archetype Enhancement",
    setName: "Critical Strikes",
    ioName: "Chance for Critical Hit",
    ppm: 2,
    mechanics: "Chance to give +50% chance to Critical Hit for 3.25s for slotted power",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for Hide": {
    setCategory: "Archetype Enhancement",
    setName: "Stalker's Guile",
    ioName: "Chance for Hide",
    ppm: 4,
    mechanics: "Puts you in a HIDDEN state (Enemy NOT Placated) by the Slotted Power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance to Recharge Build Up": {
    setCategory: "Archetype Enhancement",
    setName: "Assassin's Mark",
    ioName: "Chance to Recharge Build Up",
    ppm: null,
    mechanics: "Gives 4% Chance to Recharge Build Up by most damaging powers",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for Minor PBAoE Heal": {
    setCategory: "Archetype Enhancement",
    setName: "Defender's Bastion",
    ioName: "Chance for Minor PBAoE Heal",
    ppm: 4,
    mechanics: "PBAoE Heal by the Slotted Power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for +RES(ALL)": {
    setCategory: "Archetype Enhancement",
    setName: "Might of the Tanker",
    ioName: "Chance for +RES(ALL)",
    ppm: 5,
    mechanics: "Chance for +5% Resistance(All) for 10.25 secs, By the Slotted Power, stacks 3 times",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for +Fury": {
    setCategory: "Archetype Enhancement",
    setName: "Brute's Fury",
    ioName: "Chance for +Fury",
    ppm: 4,
    mechanics: "Chance for +5 Fury by the Slotted Power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for +Damage": {
    setCategory: "Archetype Enhancement",
    setName: "Ascendancy of the Dominator",
    ioName: "Chance for +Damage",
    ppm: 5,
    mechanics: "14.19% Damage buff that stacks up to 3 times by the Slotted Power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for Fiery Orb": {
    setCategory: "Archetype Enhancement",
    setName: "Dominating Grasp",
    ioName: "Chance for Fiery Orb",
    ppm: 1,
    mechanics: "Pet(Damage and Disorient)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Chance for Energy Font": {
    setCategory: "Archetype Enhancement",
    setName: "Overpowering Presence",
    ioName: "Chance for Energy Font",
    ppm: 1,
    mechanics: "Chance for Energy Font Pet(Stun & Damage)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },

  // ============================================
  // Missing ATOs — Superior variants
  // ============================================
  "Superior Ascendancy of the Dominator: Recharge/Chance for +Dam(All)": {
    setCategory: "Dominator Archetype Sets",
    setName: "Superior Ascendancy of the Dominator",
    ioName: "Recharge/Chance for +Dam(All)",
    ppm: 3,
    mechanics: "Buff(+21.25% Damage) stacks 3x by the slotted power",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Blaster's Wrath: Recharge/Chance for Fire Damage": {
    setCategory: "Blaster Archetype Sets",
    setName: "Blaster's Wrath",
    ioName: "Recharge/Chance for Fire Damage",
    ppm: 4,
    mechanics: "Damage (Fire 72)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Blaster's Wrath: Recharge/Chance for Fire Damage": {
    setCategory: "Blaster Archetype Sets",
    setName: "Superior Blaster's Wrath",
    ioName: "Recharge/Chance for Fire Damage",
    ppm: 5,
    mechanics: "Damage (Fire 107)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Defiant Barrage: Recharge/Chance for Mez Protection,Resistance": {
    setCategory: "Blaster Archetype Sets",
    setName: "Defiant Barrage",
    ioName: "Recharge/Chance for Mez Protection,Resistance",
    ppm: 3,
    mechanics: "Buff(Mez Protection Mag 1 Hold/Stun/Sleep/Immob/Confuse/Fear) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Defiant Barrage: Recharge/Chance for Mez Protection,Resistance": {
    setCategory: "Blaster Archetype Sets",
    setName: "Superior Defiant Barrage",
    ioName: "Recharge/Chance for Mez Protection,Resistance",
    ppm: 4,
    mechanics: "Buff(Mez Protection Mag 1 Hold/Stun/Sleep/Immob/Confuse/Fear) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Essence Transfer: Recharge/Chance for +Health": {
    setCategory: "Kheldian Archetype Sets",
    setName: "Essence Transfer",
    ioName: "Recharge/Chance for +Health",
    ppm: null,
    mechanics: "Buff(Heal 54 HP) 12% chance",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Essence Transfer: Recharge/Chance for +Health": {
    setCategory: "Kheldian Archetype Sets",
    setName: "Superior Essence Transfer",
    ioName: "Recharge/Chance for +Health",
    ppm: null,
    mechanics: "Buff(Heal 70 HP) 18% chance",
    pvpNotes: "",
    type: "Global",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Malice of the Corruptor: Recharge/Chance for Negative Energy Damage": {
    setCategory: "Corruptor Archetype Sets",
    setName: "Malice of the Corruptor",
    ioName: "Recharge/Chance for Negative Energy Damage",
    ppm: 4,
    mechanics: "Damage (Negative 72)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Malice of the Corruptor: Recharge/Chance for Negative Energy Damage": {
    setCategory: "Corruptor Archetype Sets",
    setName: "Superior Malice of the Corruptor",
    ioName: "Recharge/Chance for Negative Energy Damage",
    ppm: 5,
    mechanics: "Damage (Negative 107)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Scourging Blast: Recharge/Chance for +Endurance,+Health": {
    setCategory: "Corruptor Archetype Sets",
    setName: "Scourging Blast",
    ioName: "Recharge/Chance for +Endurance,+Health",
    ppm: 2,
    mechanics: "PBAoE Buff(+5% End, Heal 67 HP)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Scourging Blast: Recharge/Chance for +Endurance,+Health": {
    setCategory: "Corruptor Archetype Sets",
    setName: "Superior Scourging Blast",
    ioName: "Recharge/Chance for +Endurance,+Health",
    ppm: 3,
    mechanics: "PBAoE Buff(+7.5% End, Heal 100 HP)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Will of the Controller: Recharge/Chance for Psionic Damage": {
    setCategory: "Controller Archetype Sets",
    setName: "Will of the Controller",
    ioName: "Recharge/Chance for Psionic Damage",
    ppm: 4,
    mechanics: "Damage (Psionic 72)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Will of the Controller: Recharge/Chance for Psionic Damage": {
    setCategory: "Controller Archetype Sets",
    setName: "Superior Will of the Controller",
    ioName: "Recharge/Chance for Psionic Damage",
    ppm: 5,
    mechanics: "Damage (Psionic 107)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  // ── Rebirth Halloween: Endless Nightmare (Sleep) ───────────────────
  // Triggers Fear on the slept target plus Psionic damage if the foe
  // was woken early by an attack. PPM per wiki; Superior PPM reported
  // by user verification as 2.5 (wiki uncertainty noted — confirm if
  // tested directly in-game).
  "Endless Nightmare: Recharge/Chance for Fear, Psionic Damage": {
    setCategory: "Sleep",
    setName: "Endless Nightmare",
    ioName: "Recharge/Chance for Fear, Psionic Damage",
    ppm: 2.5,
    mechanics: "Foe Fear(8s) + Damage(Psionic 7 - 72) if woken early",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "Halloween",
    unique: "Unique"
  },
  "Superior Endless Nightmare: Recharge/Chance for Fear, Psionic Damage": {
    setCategory: "Sleep",
    setName: "Superior Endless Nightmare",
    ioName: "Recharge/Chance for Fear, Psionic Damage",
    ppm: 2.5,
    mechanics: "Foe Fear(8s) + Damage(Psionic 10 - 107) if woken early",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Halloween",
    unique: "Unique"
  },
  "Unrelenting Fury: Recharge/Chance for +End Discount,+Regeneration": {
    setCategory: "Brute Archetype Sets",
    setName: "Unrelenting Fury",
    ioName: "Recharge/Chance for +End Discount,+Regeneration",
    ppm: 6,
    mechanics: "Buff(+15% Regen, +5% End Discount) stacks 5x",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Unrelenting Fury: Recharge/Chance for +End Discount,+Regeneration": {
    setCategory: "Brute Archetype Sets",
    setName: "Superior Unrelenting Fury",
    ioName: "Recharge/Chance for +End Discount,+Regeneration",
    ppm: 7,
    mechanics: "Buff(+20% Regen, +6.65% End Discount) stacks 5x",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Opportunity Strikes: Recharge/Chance for +Opportunity": {
    setCategory: "Sentinel Archetype Sets",
    setName: "Opportunity Strikes",
    ioName: "Recharge/Chance for +Opportunity",
    ppm: 1,
    mechanics: "Buff(Opportunity 148)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Opportunity Strikes: Recharge/Chance for +Opportunity": {
    setCategory: "Sentinel Archetype Sets",
    setName: "Superior Opportunity Strikes",
    ioName: "Recharge/Chance for +Opportunity",
    ppm: 1,
    mechanics: "Buff(Opportunity 210)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },

  // ============================================
  // Missing ATO Superior variants for existing base procs
  // ============================================
  "Superior Critical Strikes: Recharge/Chance for +Critical Hit%": {
    setCategory: "Scrapper Archetype Sets",
    setName: "Superior Critical Strikes",
    ioName: "Recharge/Chance for +Critical Hit%",
    ppm: null,
    mechanics: "+Critical Hit Chance (+5% vs Minions, +8% others) for ALL powers",
    pvpNotes: "",
    type: "Global",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Stalker's Guile: Recharge/Chance for Hidden Status": {
    setCategory: "Stalker Archetype Sets",
    setName: "Superior Stalker's Guile",
    ioName: "Recharge/Chance for Hidden Status",
    ppm: 3,
    mechanics: "Buff(Hide Status) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Assassin's Mark: Recharge/Chance for Recharge Power": {
    setCategory: "Stalker Archetype Sets",
    setName: "Superior Assassin's Mark",
    ioName: "Recharge/Chance for Recharge Power",
    ppm: 2,
    mechanics: "Buff(Recharge Assassin's Strike) after defeating foe",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Defender's Bastion: Recharge/Chance for +Health": {
    setCategory: "Defender Archetype Sets",
    setName: "Superior Defender's Bastion",
    ioName: "Recharge/Chance for +Health",
    ppm: 3,
    mechanics: "PBAoE Buff(Heal) to caster and nearby allies",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Might of the Tanker: Recharge/Chance for +Res(All)": {
    setCategory: "Tanker Archetype Sets",
    setName: "Superior Might of the Tanker",
    ioName: "Recharge/Chance for +Res(All)",
    ppm: 3,
    mechanics: "Buff(+Res All 3.13%)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Brute's Fury: Recharge/Chance for +Rage": {
    setCategory: "Brute Archetype Sets",
    setName: "Superior Brute's Fury",
    ioName: "Recharge/Chance for +Rage",
    ppm: 4,
    mechanics: "Buff(+Fury 25)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Dominating Grasp: Recharge/Chance for Fiery Orb": {
    setCategory: "Dominator Archetype Sets",
    setName: "Superior Dominating Grasp",
    ioName: "Recharge/Chance for Fiery Orb",
    ppm: 1,
    mechanics: "Pet(Damage and Disorient)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Overpowering Presence: Recharge/Chance for Energy Font": {
    setCategory: "Controller Archetype Sets",
    setName: "Superior Overpowering Presence",
    ioName: "Recharge/Chance for Energy Font",
    // Superior ATO procs run +1 PPM over their non-superior version (cf.
    // Entomb 2 → Superior Entomb 3, Gauntleted Fist 2 → Superior 3). The
    // base "Chance for Energy Font" is 1 PPM, so the Superior piece is 2.
    ppm: 2,
    mechanics: "Chance for Energy Font Pet(Stun & Damage)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },
  "Dominion of Arachnos: Recharge/Chance for -Dam(All)/Chance for Terror": {
    setCategory: "Arachnos Archetype Sets",
    setName: "Dominion of Arachnos",
    ioName: "Recharge/Chance for -Dam(All)/Chance for Terror",
    ppm: 4,
    mechanics: "Foe(-Damage All, Fear) for 8s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Exclusive"
  },
  "Superior Dominion of Arachnos: Recharge/Chance for -Dam(All)/Chance for Terror": {
    setCategory: "Arachnos Archetype Sets",
    setName: "Superior Dominion of Arachnos",
    ioName: "Recharge/Chance for -Dam(All)/Chance for Terror",
    ppm: 5,
    mechanics: "Foe(-Damage All, Fear) for 8s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Exclusive"
  },

  // ============================================
  // Missing Winter set Superior variants
  // ============================================
  "Superior Avalanche: Recharge/Chance for Knockback": {
    setCategory: "Targeted AoE Damage",
    setName: "Superior Avalanche",
    ioName: "Recharge/Chance for Knockback",
    ppm: 3,
    mechanics: "Foe(Knockback Mag 6)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Winter",
    unique: "Unique"
  },
  "Superior Blistering Cold: Recharge/Chance for Hold": {
    setCategory: "Ranged Damage",
    setName: "Superior Blistering Cold",
    ioName: "Recharge/Chance for Hold",
    ppm: 3,
    mechanics: "Foe(Hold Mag 2) for 4s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Winter",
    unique: "Unique"
  },
  "Superior Frozen Blast: Recharge/Chance for Immobilize": {
    setCategory: "Melee Damage",
    setName: "Superior Frozen Blast",
    ioName: "Recharge/Chance for Immobilize",
    ppm: 3,
    mechanics: "Foe(Immobilize) for 4s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Winter",
    unique: "Unique"
  },
  "Superior Winter's Bite: Recharge/Chance for -Recharge,Slow": {
    setCategory: "Slow Movement",
    setName: "Superior Winter's Bite",
    ioName: "Recharge/Chance for -Recharge,Slow",
    ppm: 3,
    mechanics: "Foe(-Recharge 20%, -Speed 20%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Winter",
    unique: "Unique"
  },

  // ============================================
  // Missing standard set procs
  // ============================================
  "Cupid's Crush: Damage/Chance for Confuse": {
    setCategory: "Universal Damage Sets",
    setName: "Cupid's Crush",
    ioName: "Damage/Chance for Confuse",
    ppm: 2.5,
    mechanics: "Foe(Confusion) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Unique"
  },
  "Overwhelming Force: Damage/Chance for Knockdown/Knockback to Knockdown": {
    setCategory: "Universal Damage Sets",
    setName: "Overwhelming Force",
    ioName: "Damage/Chance for Knockdown/Knockback to Knockdown",
    ppm: 2.5,
    mechanics: "Foe(Knockdown + KB to KD conversion)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Unique"
  },
  "Analyze Weakness: Chance for +ToHit": {
    setCategory: "Accurate Defense Debuff",
    setName: "Analyze Weakness",
    ioName: "Chance for +ToHit",
    ppm: 2,
    mechanics: "Buff(+ToHit 9%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "30--50",
    pool: "",
    unique: ""
  },
  "Siphon Insight: Chance for +ToHit": {
    setCategory: "Accurate To Hit Debuff",
    setName: "Siphon Insight",
    ioName: "Chance for +ToHit",
    ppm: 2,
    mechanics: "Buff(+ToHit 9%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "30--50",
    pool: "",
    unique: ""
  },

  // ============================================
  // Missing global/travel procs
  // ============================================
  "Call to Arms: +Def(All)": {
    setCategory: "Pet Damage",
    setName: "Call to Arms",
    ioName: "+Def(All)",
    ppm: null,
    mechanics: "Buff(+Def All 3%) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },
  "Commanding Presence: +Resist Threat": {
    setCategory: "Pet Damage",
    setName: "Commanding Presence",
    ioName: "+Resist Threat",
    ppm: null,
    mechanics: "Buff(+Threat Resistance) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },
  "Edict of the Master: +Def(All)": {
    setCategory: "Pet Damage",
    setName: "Edict of the Master",
    ioName: "+Def(All)",
    ppm: null,
    mechanics: "Buff(+Def All 5%) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "30--50",
    pool: "A-rare",
    unique: ""
  },
  "Expedient Reinforcement: +Res(All)": {
    setCategory: "Pet Damage",
    setName: "Expedient Reinforcement",
    ioName: "+Res(All)",
    ppm: null,
    mechanics: "Buff(+Res All 5%) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },
  "Sovereign Right: +Res(All)": {
    setCategory: "Pet Damage",
    setName: "Sovereign Right",
    ioName: "+Res(All)",
    ppm: null,
    mechanics: "Buff(+Res All 10%) to pets",
    pvpNotes: "",
    type: "Global",
    levelRange: "30--50",
    pool: "A-rare",
    unique: ""
  },
  "Freebird: +Stealth": {
    setCategory: "Universal Travel",
    setName: "Freebird",
    ioName: "+Stealth",
    ppm: null,
    mechanics: "Buff(Stealth) while moving",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },
  "Time & Space Manipulation: +Stealth": {
    setCategory: "Universal Travel",
    setName: "Time & Space Manipulation",
    ioName: "+Stealth",
    ppm: null,
    mechanics: "Buff(Stealth) while moving",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "30--50",
    pool: "A-rare",
    unique: ""
  },
  "Unbounded Leap: +Stealth": {
    setCategory: "Leaping",
    setName: "Unbounded Leap",
    ioName: "+Stealth",
    ppm: null,
    mechanics: "Buff(Stealth) while moving",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Rectified Reticle: +Perception": {
    setCategory: "Ranged Damage",
    setName: "Rectified Reticle",
    ioName: "+Perception",
    ppm: null,
    mechanics: "Buff(+Perception)",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--30",
    pool: "C",
    unique: ""
  },
  "Warp: Range/+Perception": {
    setCategory: "Universal Travel",
    setName: "Warp",
    ioName: "Range/+Perception",
    ppm: null,
    mechanics: "Buff(+Perception)",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },
  "Launch: Jump/+Jump Height/+Max Jump Height": {
    setCategory: "Universal Travel",
    setName: "Launch",
    ioName: "Jump/+Jump Height/+Max Jump Height",
    ppm: null,
    mechanics: "Buff(+Jump Height, +Max Jump Height)",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },
  "Thrust: Run/+Run Speed": {
    setCategory: "Universal Travel",
    setName: "Thrust",
    ioName: "Run/+Run Speed",
    ppm: null,
    mechanics: "Buff(+Run Speed)",
    pvpNotes: "",
    type: "Proc120s",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },

  // ============================================
  // Rebirth: Witchcraft (Halloween event Sleep set)
  // ============================================
  "Witchcraft: Chance for -Res Debuff": {
    setCategory: "Sleep",
    setName: "Witchcraft",
    ioName: "Chance for -Res Debuff",
    ppm: 3.5,
    mechanics: "Foe(-Resistance 20%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: "Unique"
  },
  "Superior Witchcraft: Chance for -Res Debuff": {
    setCategory: "Sleep",
    setName: "Superior Witchcraft",
    ioName: "Chance for -Res Debuff",
    ppm: 6,
    mechanics: "Foe(-Resistance 20%) for 10s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "",
    unique: "Unique"
  },

  // ============================================
  // Rebirth-only special/proc pieces (interim, hand-curated).
  // Effect descriptions are binary-sourced (followed the Create_Entity /
  // Null / Set_Mode redirects in the Rebirth bins to the real granted/summoned
  // power), but `ppm` is intentionally null: the Rebirth bins don't expose a
  // clean PPM for these and null keeps them out of the proc-damage calc.
  // These restore the proc-effect tooltip (was blank — no PROC_DATABASE entry).
  // To be superseded by binary-sourced proc effects. See [[proc-piece-name-misresolution]].
  // ============================================
  "Imperial Might: Chance for Knockdown": {
    setCategory: "Knockback",
    setName: "Imperial Might",
    ioName: "Chance for Knockdown",
    ppm: null,
    mechanics: "Foe(Knockback Mag 0.67 = Knockdown); converts your Knockback to Knockdown",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "",
    unique: ""
  },
  "Absolute Resolution: Chance for Energy Damage": {
    setCategory: "Guardian ATO",
    setName: "Absolute Resolution",
    ioName: "Chance for Energy Damage",
    ppm: null,
    mechanics: "Damage(Energy 7 - 72)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "ATO",
    unique: "Unique"
  },
  "Superior Absolute Resolution: Chance for Energy Damage": {
    setCategory: "Guardian ATO",
    setName: "Superior Absolute Resolution",
    ioName: "Chance for Energy Damage",
    ppm: null,
    mechanics: "Damage(Energy 72)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "ATO",
    unique: "Unique"
  },
  "Guardian's Gift: Chance for PBAoE Resolve": {
    setCategory: "Guardian ATO",
    setName: "Guardian's Gift",
    ioName: "Chance for PBAoE Resolve",
    ppm: null,
    mechanics: "PBAoE allies: Absorb + Mez Protection + Mez Resistance for 15s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "ATO",
    unique: "Unique"
  },
  "Superior Guardian's Gift: Chance for PBAoE Resolve": {
    setCategory: "Guardian ATO",
    setName: "Superior Guardian's Gift",
    ioName: "Chance for PBAoE Resolve",
    ppm: null,
    mechanics: "PBAoE allies: Absorb + Mez Protection + Mez Resistance for 15s",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "ATO",
    unique: "Unique"
  },
  "The Haunting: Chance to Summon Haunts": {
    setCategory: "Fear",
    setName: "The Haunting",
    ioName: "Chance to Summon Haunts",
    ppm: null,
    mechanics: "Foe: chance to summon Haunt ghosts",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "Event",
    unique: "Unique"
  },
  "Superior Haunting: Chance to Summon Haunts": {
    setCategory: "Fear",
    setName: "Superior Haunting",
    ioName: "Chance to Summon Haunts",
    ppm: null,
    mechanics: "Foe: chance to summon Haunt ghosts",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Event",
    unique: "Unique"
  },
  "Vampire's Bite: Chance for Heal": {
    setCategory: "Halloween",
    setName: "Vampire's Bite",
    ioName: "Chance for Heal",
    ppm: null,
    mechanics: "Chance to Heal (self/ally)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "Event",
    unique: "Unique"
  },
  "Superior Vampire's Bite: Chance for Heal": {
    setCategory: "Halloween",
    setName: "Superior Vampire's Bite",
    ioName: "Chance for Heal",
    ppm: null,
    mechanics: "Chance to Heal (self/ally)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Event",
    unique: "Unique"
  },
  "Return From The Grave: Chance for Self Resurrect": {
    setCategory: "Brute ATO",
    setName: "Return From The Grave",
    ioName: "Chance for Self Resurrect",
    ppm: null,
    mechanics: "On defeat: chance to self-resurrect with Heal + Endurance",
    pvpNotes: "",
    type: "Proc",
    levelRange: "10--50",
    pool: "ATO",
    unique: "Unique"
  },
  "Superior Return From The Grave: Chance for Self Resurrect": {
    setCategory: "Brute ATO",
    setName: "Superior Return From The Grave",
    ioName: "Chance for Self Resurrect",
    ppm: null,
    mechanics: "On defeat: chance to self-resurrect with Heal + Endurance",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "ATO",
    unique: "Unique"
  },
  "Superior Winter's Gift: Slow Resistance": {
    setCategory: "Universal Travel",
    setName: "Superior Winter's Gift",
    ioName: "Slow Resistance",
    ppm: null,
    mechanics: "Resist(-Speed 25% & -Recharge 25%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "50",
    pool: "Event",
    unique: "Unique"
  },
  "Inexhaustibility: Chance for Heal/Endurance/Regen": {
    setCategory: "Rest",
    setName: "Inexhaustibility",
    ioName: "Chance for Heal, Endurance, Regeneration",
    ppm: null,
    mechanics: "50% chance: Heal + Endurance + Regeneration",
    pvpNotes: "",
    type: "Proc",
    levelRange: "1--50",
    pool: "",
    unique: "Unique"
  },
};

// Merge binary-sourced structured global effects (Phase 2: always-on globals).
// The generated PROC_GLOBAL_EFFECTS is keyed by PROC_DATABASE key; attach each
// to its entry's `effects`. Consumers prefer `effects` over parsing `mechanics`.
for (const [key, effects] of Object.entries(PROC_GLOBAL_EFFECTS)) {
  const entry = PROC_DATABASE[key];
  if (entry) entry.effects = effects;
}
// Binary-sourced damage proc effects (Phase 3): N-M = scale × Melee_ProcDamage at
// levels 1 and 50. Inert until the damage/display consumers read `.effects`.
for (const [key, effects] of Object.entries(PROC_DAMAGE_EFFECTS)) {
  const entry = PROC_DATABASE[key];
  if (entry) entry.effects = effects;
}
// Binary-sourced non-global proc payloads (Phase 3b): self-buff / foe debuff / mez /
// knock / Build Up. Inert until the PPM/Build-Up/display consumers read `.effects`.
for (const [key, effects] of Object.entries(PROC_OTHER_EFFECTS)) {
  const entry = PROC_DATABASE[key];
  if (entry) entry.effects = effects;
}
// Binary-sourced per-proc PPM (P6): overlays the hand value (which had drift —
// e.g. Superior ATOs carrying the base PPM). Drives proc DPS + PPM recovery.
for (const [key, ppm] of Object.entries(PROC_PPM)) {
  const entry = PROC_DATABASE[key];
  if (entry) entry.ppm = ppm;
}
// Hand-curated residual (P4/P5): the genuinely underivable procs the generator
// can't reach — Rebirth-only sets, Create_Entity pet summons, PBAoE ally buffs,
// self-meter/conditional stacks. Faithful structured transcriptions so EVERY
// entry has `.effects` and `getProcEffects` never needs to parse `mechanics`.
for (const [key, effects] of Object.entries(PROC_RESIDUAL_EFFECTS)) {
  const entry = PROC_DATABASE[key];
  if (entry) entry.effects = effects;
}

// Additive variable-control overlay (must run LAST, after every effects-setting
// merge): patch maxStacks/valueMax/scaleTable onto the matching existing effect
// IN PLACE, preserving the `effects` array reference (the coverage guard asserts
// getProcEffects === entry.effects). See proc-variable-controls.ts.
for (const [key, control] of Object.entries(PROC_VARIABLE_CONTROLS)) {
  const entry = PROC_DATABASE[key];
  if (!entry?.effects) continue;
  for (const eff of entry.effects) {
    if (eff.category !== control.category) continue;
    if (control.maxStacks !== undefined) eff.maxStacks = control.maxStacks;
    if (control.valueMax !== undefined) eff.valueMax = control.valueMax;
    if (control.scaleTable !== undefined) eff.scaleTable = control.scaleTable;
  }
}

/**
 * Unified accessor for a proc's structured effects. Every PROC_DATABASE entry
 * now carries binary-sourced (generated) or hand-curated (`proc-residual-effects`)
 * `.effects`, so this is just a typed read. The old parseProcEffect(mechanics)
 * fallback is retired — a guard test enforces 100% `.effects` coverage.
 */
export function getProcEffects(procData: ProcData): ProcEffect[] {
  return procData.effects ?? [];
}

/**
 * Display-oriented summary of a proc's effects in the legacy ParsedProcEffect
 * shape (primary + one secondary), sourced from getProcEffects. A drop-in for
 * parseProcEffect(mechanics) in display code so tooltips show the binary values.
 */
export function procEffectSummary(procData: ProcData): ParsedProcEffect {
  const e = getProcEffects(procData);
  return {
    category: e[0]?.category ?? 'Special',
    value: e[0]?.value,
    valueMax: e[0]?.valueMax,
    effectType: e[0]?.effectType,
    duration: e[0]?.duration,
    isBuff: true,
    description: procData.mechanics,
    secondaryCategory: e[1]?.category,
    secondaryValue: e[1]?.value,
    secondaryEffectType: e[1]?.effectType,
  };
}

/**
 * Look up proc data with fuzzy matching
 * Prioritizes set-prefixed match when setName is provided to avoid
 * ambiguous bare keys (e.g. multiple procs share "Chance for Negative Energy Damage"
 * but have different PPM values across sets)
 */
export function findProcData(enhancementName: string, setName?: string): ProcData | undefined {
  // Try with set name prefix first (most specific match)
  if (setName) {
    const withSetName = PROC_DATABASE[`${setName}: ${enhancementName}`];
    if (withSetName) return withSetName;
  }

  // Try exact match on bare name
  const exact = PROC_DATABASE[enhancementName];
  // When a set is provided, only accept the bare-name exact hit if the set
  // also matches; otherwise continue into set-aware IO-name matching.
  if (exact && (!setName || exact.setName === setName)) return exact;

  // Try to find by IO name only (scan all entries)
  // When setName is provided, prefer matching set; otherwise return first match
  let firstMatch: ProcData | undefined;
  for (const [key, data] of Object.entries(PROC_DATABASE)) {
    const nameMatches = data.ioName === enhancementName || key.endsWith(`: ${enhancementName}`);
    if (!nameMatches) continue;
    if (setName && data.setName === setName) return data;
    if (!firstMatch) firstMatch = data;
  }
  // Only use firstMatch when no setName was provided — otherwise ambiguous
  // ioName matches (e.g. "+Res(All)" shared by Reactive Defenses and pet sets)
  // would return the wrong entry before the setName fallback below
  if (firstMatch && !setName) return firstMatch;

  // Fallback: match by set name (handles name mismatches like LotG "Defense/+Recharge" vs "Buff Recharge")
  if (setName) {
    for (const data of Object.values(PROC_DATABASE)) {
      if (data.setName === setName) {
        return data;
      }
    }
  }

  // Last resort: return ioName match even with mismatched set (better than nothing)
  if (firstMatch) return firstMatch;

  return undefined;
}

/**
 * Placeholder names the IO-set binary extractor emits for a proc piece whose
 * effect it can't derive from the template (a `Null` global, a `Grant_Power`
 * ATO proc, or an unmapped effect attrib). See `extract-rebirth-io-sets-v2.py`
 * and the proc-piece-name-misresolution notes.
 */
const PLACEHOLDER_PROC_NAMES: ReadonlySet<string> = new Set(['Chance', 'Recharge/Chance']);

/**
 * Resolve a proc piece's *display* name. The authoritative identity of a proc
 * lives in PROC_DATABASE (binary-sourced), not in the IO-set piece label — the
 * extractor can only name a proc when its effect is derivable from the binary
 * template, and otherwise falls back to a bare "Chance"/"Recharge/Chance".
 *
 * When that placeholder is shown, look the real `ioName` up from PROC_DATABASE
 * (the same resolution the proc tooltip already uses for its body), so a slot
 * reads "Chance for +Absorb" instead of "Chance". Non-proc pieces and pieces
 * whose extractor name is already meaningful (curated globals like
 * "Defense/+Recharge") are returned unchanged — this only rescues placeholders.
 *
 * Used at the two places a proc name surfaces: `createIOSetEnhancement` (every
 * slotted enhancement, re-derived on build load) and the enhancement picker.
 */
export function resolveProcPieceName(
  name: string,
  setName: string | undefined,
  isProc: boolean | undefined,
): string {
  if (!isProc || !PLACEHOLDER_PROC_NAMES.has(name)) return name;
  return findProcData(name, setName)?.ioName ?? name;
}

/**
 * Get a user-friendly display name for proc effect category
 */
export function getProcEffectLabel(category: ProcEffectCategory): string {
  switch (category) {
    case 'Damage': return 'Damage';
    case 'Endurance': return '+Endurance';
    case 'Heal': return '+HP';
    case 'Absorb': return '+Absorb';
    case 'Resistance': return '+Resistance';
    case 'Defense': return '+Defense';
    case 'ToHit': return '+ToHit';
    case 'Regeneration': return '+Regen';
    case 'Recovery': return '+Recovery';
    case 'Recharge': return '+Recharge';
    case 'RunSpeed': return '+Run Speed';
    case 'MaxHP': return '+Max HP';
    case 'KnockbackProtection': return 'KB Protection';
    case 'MezResist': return '+Mez Resist';
    case 'SlowResistance': return 'Slow Resist';
    case 'RechargeResistance': return 'Rech Debuff Resist';
    case 'Stealth': return 'Stealth';
    case 'BuildUp': return 'Build Up';
    case 'Control': return 'Control';
    case 'Debuff': return 'Debuff';
    case 'Special': return 'Special';
  }
}

/**
 * Get CSS color class for proc effect category
 */
export function getProcEffectColor(category: ProcEffectCategory): string {
  switch (category) {
    case 'Damage': return 'text-red-400';
    case 'Endurance': return 'text-blue-400';
    case 'Heal': return 'text-green-400';
    case 'Absorb': return 'text-cyan-400';
    case 'Resistance': return 'text-orange-400';
    case 'Defense': return 'text-purple-400';
    case 'ToHit': return 'text-yellow-400';
    case 'Regeneration': return 'text-green-300';
    case 'Recovery': return 'text-blue-300';
    case 'Recharge': return 'text-amber-400';
    case 'RunSpeed': return 'text-teal-400';
    case 'MaxHP': return 'text-pink-400';
    case 'KnockbackProtection': return 'text-slate-300';
    case 'MezResist': return 'text-violet-400';
    case 'SlowResistance': return 'text-teal-300';
    case 'RechargeResistance': return 'text-amber-300';
    case 'Stealth': return 'text-gray-400';
    case 'BuildUp': return 'text-yellow-300';
    case 'Control': return 'text-indigo-400';
    case 'Debuff': return 'text-rose-400';
    case 'Special': return 'text-slate-400';
  }
}

/**
 * Check if a proc provides a "always-on" benefit when slotted in an Auto or Toggle power
 * These are Proc120s and Globals - they provide constant benefits while the power is active
 */
export function isProcAlwaysOn(procData: ProcData): boolean {
  return procData.type === 'Global' || procData.type === 'Proc120s';
}

// ============================================
// PPM CALCULATION FUNCTIONS
// ============================================

/**
 * AoE penalty denominator used by the PPM formula.
 * denom = 0.25 + 0.75 × (1 + radius × (11 × arc + 540) / 30,000)
 * A full sphere (arc 360) reduces to 0.25 + 0.75 × (1 + 0.15 × radius); cones
 * scale the radius term down linearly with arc. Single target (radius 0)
 * returns 1.0 regardless of arc.
 */
export function getPPMAreaDenominator(radius: number, arcDegrees: number): number {
  if (radius <= 0) return 1.0;
  return 0.25 + 0.75 * (1 + radius * (11 * arcDegrees + 540) / 30000);
}

/**
 * Area factor (1 / denom) for PPM calculation based on radius and arc.
 * @param radius AoE radius in feet (0 for single target)
 * @param arcDegrees cone arc in degrees; default 360 treats AoE as a sphere
 */
export function getPPMAreaFactor(radius: number, arcDegrees: number = 360): number {
  return 1 / getPPMAreaDenominator(radius, arcDegrees);
}

/**
 * Convert a raw arc value (which may be radians or already degrees) to degrees.
 * Bin data stores arc in radians, but some upstream callers pre-convert. Anything
 * <= 2π is assumed to still be in radians.
 */
export function arcToDegrees(rawArc: number | undefined | null): number {
  if (!rawArc) return 0;
  return rawArc <= 2 * Math.PI ? rawArc * (180 / Math.PI) : rawArc;
}

/** Minimum proc chance clamp: 5% + PPM × 1.5% */
function ppmMinChance(ppm: number): number {
  return 0.05 + ppm * 0.015;
}

/** Apply min/max clamps (max 90%, min 5+PPM×1.5%). */
function clampProcChance(rawChance: number, ppm: number): number {
  return Math.min(0.9, Math.max(ppmMinChance(ppm), rawChance));
}

/**
 * Calculate proc chance per activation using the PPM formula.
 *
 * Formula: Proc% = PPM × (ModifiedRecharge + CastTime) / (60 × AreaDenom)
 *   where ModifiedRecharge = BaseRecharge / (1 + EnhancedRechargeBonus)
 *   and AreaDenom = 0.25 + 0.75 × (1 + radius × (11 × arc + 540) / 30,000)
 *
 * Subject to clamps: min = 5% + PPM × 1.5%, max = 90%.
 *
 * @param ppm - Procs Per Minute value from the enhancement
 * @param baseRecharge - Base (unenhanced) recharge time in seconds
 * @param castTime - Activation/cast time in seconds
 * @param radius - AoE radius in feet (0 for single target)
 * @param arcDegrees - cone arc in degrees (default 360 = sphere)
 * @param enhancedRechargeBonus - decimal recharge enhancement applied to *this power's*
 *        slotted enhancements only (NOT global recharge / set bonuses / Hasten).
 *        e.g. 0.95 for +95%. Default 0.
 */
export function calculateProcChance(
  ppm: number,
  baseRecharge: number,
  castTime: number,
  radius: number = 0,
  arcDegrees: number = 360,
  enhancedRechargeBonus: number = 0
): number {
  const modifiedRecharge = baseRecharge / (1 + enhancedRechargeBonus);
  const areaDenom = getPPMAreaDenominator(radius, arcDegrees);
  const raw = (ppm * (modifiedRecharge + castTime)) / (60 * areaDenom);
  return clampProcChance(raw, ppm);
}

/**
 * Calculate expected procs per minute based on power usage
 *
 * @param ppm - Procs Per Minute value
 * @param baseRecharge - Base recharge time in seconds
 * @param castTime - Cast time in seconds
 * @param radius - AoE radius (0 for single target)
 * @param enhancedRechargeBonus - Total recharge enhancement bonus as decimal (e.g., 0.95 for +95%)
 * @returns Expected number of procs per minute
 */
export function calculateProcsPerMinute(
  ppm: number,
  baseRecharge: number,
  castTime: number,
  radius: number = 0,
  enhancedRechargeBonus: number = 0,
  arcDegrees: number = 360
): number {
  const procChance = calculateProcChance(
    ppm,
    baseRecharge,
    castTime,
    radius,
    arcDegrees,
    enhancedRechargeBonus,
  );

  // Calculate actual cycle time with enhanced recharge
  // Enhanced recharge reduces recharge time: actualRecharge = baseRecharge / (1 + bonus)
  const actualRecharge = baseRecharge / (1 + enhancedRechargeBonus);
  const cycleTime = actualRecharge + castTime;

  // Activations per minute
  const activationsPerMinute = 60 / cycleTime;

  return procChance * activationsPerMinute;
}

// ============================================================================
// VARIABLE-PROC CONTROLS (per-proc toggles & stack / HP sliders)
// ============================================================================

/**
 * Which control a slotted proc exposes in the InfoPanel and how its dashboard
 * contribution is modelled:
 *  - `stacks` — self-stacking buff (maxStacks); a discrete 0..maxStacks slider.
 *  - `hp`     — HP-scaling floor→cap (scaling); a 0..100 %HP slider.
 *  - `toggle` — plain on/off (globals like Steadfast: genuinely always-on).
 */
export type ProcControlType = 'stacks' | 'hp' | 'toggle';

/** The single control-type inference used by both the UI and the calc. */
export function getProcControlType(effect: ProcEffect): ProcControlType {
  if (effect.maxStacks !== undefined) return 'stacks';
  if (effect.scaling) return 'hp';
  return 'toggle';
}

/** True when any of a proc's effects exposes a variable (stacks/HP) control. */
export function isVariableProc(procData: ProcData): boolean {
  return getProcEffects(procData).some((e) => getProcControlType(e) !== 'toggle');
}

export const DEFAULT_PROC_OVERRIDE: ProcOverride = { enabled: true, mode: 'auto' };

/** The Build.procOverrides map key for a slotted proc. */
export function procOverrideKey(powerName: string, slotIndex: number): string {
  return `${powerName}:${slotIndex}`;
}

/** True when an override equals the default (enabled + auto) — prune to absent. */
export function isDefaultProcOverride(ov: ProcOverride): boolean {
  return ov.enabled && ov.mode === 'auto';
}

/**
 * Drop procOverrides entries belonging to any removed power. Returns the same
 * map reference when nothing changed (so callers can skip a needless update).
 */
export function pruneProcOverridesForRemovedPowers(
  map: Record<string, ProcOverride> | undefined,
  removedPowerNames: Set<string>,
): Record<string, ProcOverride> | undefined {
  if (!map) return map;
  let changed = false;
  const next: Record<string, ProcOverride> = {};
  for (const [key, ov] of Object.entries(map)) {
    // key === `${powerName}:${slotIndex}` — the power name is everything before
    // the final ':' (slotIndex is a plain integer).
    const sep = key.lastIndexOf(':');
    const powerName = sep >= 0 ? key.slice(0, sep) : key;
    if (removedPowerNames.has(powerName)) {
      changed = true;
      continue;
    }
    next[key] = ov;
  }
  return changed ? next : map;
}

/**
 * Re-key procOverrides after a single slot is removed from `powerName`: drop the
 * removed slot's entry and shift higher slot indices on that power down by one,
 * mirroring how slotOrder is reindexed. Returns the same map when unchanged.
 */
export function reindexProcOverridesForRemovedSlot(
  map: Record<string, ProcOverride> | undefined,
  powerName: string,
  slotIndex: number,
): Record<string, ProcOverride> | undefined {
  if (!map) return map;
  let changed = false;
  const next: Record<string, ProcOverride> = {};
  for (const [key, ov] of Object.entries(map)) {
    const sep = key.lastIndexOf(':');
    const keyPower = sep >= 0 ? key.slice(0, sep) : key;
    const keyIdx = sep >= 0 ? Number(key.slice(sep + 1)) : NaN;
    if (keyPower !== powerName || !Number.isInteger(keyIdx)) {
      next[key] = ov;
      continue;
    }
    if (keyIdx === slotIndex) {
      changed = true; // removed slot → drop
      continue;
    }
    if (keyIdx > slotIndex) {
      changed = true;
      next[procOverrideKey(powerName, keyIdx - 1)] = ov;
    } else {
      next[key] = ov;
    }
  }
  return changed ? next : map;
}

/**
 * Default discrete stack count for a stacking buff proc the user hasn't pinned.
 * Stacks are integers (you hold 0/1/2/3 of a buff, never a fraction), so the
 * default is a concrete, conservative baseline rather than a time-averaged
 * "expected uptime" — a fractional average is a moment the player is never
 * actually in. Users slide to model their real stack count.
 */
export const DEFAULT_STACK_COUNT = 1;

/**
 * Interpolate an HP-scaling proc's magnitude. Reactive Defenses scales inversely
 * with current HP: full HP (100%) ⇒ `floor`; ~0 HP ⇒ `cap`. Linear in %HP.
 */
export function interpolateScalingValue(floor: number, cap: number, hpPct: number): number {
  const clamped = Math.max(0, Math.min(100, hpPct));
  return floor + (cap - floor) * (1 - clamped / 100);
}

/**
 * Resolve a single slotted proc effect's steady-state dashboard contribution,
 * honouring its per-proc override. AT-modifier resolution is done by the caller:
 * `perUnitValue` is the already-resolved per-stack (stacks) / floor (hp) / full
 * (toggle) magnitude; `capValue` is the resolved cap for an HP-scaling proc.
 *
 * Stacks default (no override / `auto` mode) is a discrete {@link DEFAULT_STACK_COUNT}
 * clamped to the cap — never a fractional average.
 *
 * Returns 0 when the proc is disabled or resolves to nothing.
 */
export function resolveProcContribution(args: {
  controlType: ProcControlType;
  perUnitValue: number;
  capValue?: number;
  maxStacks?: number;
  override?: ProcOverride;
}): number {
  const { controlType, perUnitValue, capValue, maxStacks, override } = args;
  const ov = override ?? DEFAULT_PROC_OVERRIDE;
  if (!ov.enabled) return 0;

  switch (controlType) {
    case 'stacks': {
      const cap = maxStacks ?? 1;
      const stacks =
        ov.mode === 'stacks'
          ? Math.max(0, Math.min(cap, ov.stacks ?? 0))
          : Math.min(DEFAULT_STACK_COUNT, cap); // auto → discrete default (1 stack)
      return perUnitValue * stacks;
    }
    case 'hp': {
      const floor = perUnitValue;
      const cap = capValue ?? floor;
      // auto → the honest always-on floor; hp override → interpolate to %HP.
      return ov.mode === 'hp' ? interpolateScalingValue(floor, cap, ov.hpPct ?? 100) : floor;
    }
    case 'toggle':
    default:
      return perUnitValue; // enabled non-variable proc contributes its full value
  }
}

/**
 * Calculate expected damage per second from a damage proc
 *
 * @param ppm - Procs Per Minute value
 * @param minDamage - Minimum damage value
 * @param maxDamage - Maximum damage value
 * @param baseRecharge - Base recharge time in seconds
 * @param castTime - Cast time in seconds
 * @param radius - AoE radius (0 for single target)
 * @param enhancedRechargeBonus - Recharge enhancement bonus as decimal
 * @returns Expected DPS contribution from this proc
 */
/**
 * Interpolate proc damage at a specific IO level
 * Proc damage scales linearly across the IO set's level range
 */
export function interpolateProcDamage(
  minDmg: number,
  maxDmg: number,
  levelRange: string,
  currentLevel: number
): number {
  const parts = levelRange.split('--');
  if (parts.length === 1) {
    // Single level (e.g. "50") — always max damage
    return maxDmg;
  }

  const minLevel = parseInt(parts[0], 10);
  const maxLevel = parseInt(parts[1], 10);

  if (isNaN(minLevel) || isNaN(maxLevel) || maxLevel <= minLevel) {
    return maxDmg;
  }

  const clamped = Math.max(minLevel, Math.min(maxLevel, currentLevel));
  const dmg = minDmg + (maxDmg - minDmg) * (clamped - minLevel) / (maxLevel - minLevel);
  return Math.round(dmg * 100) / 100; // 2 decimals (e.g. 71.75, not 72)
}

export function calculateProcDPS(
  ppm: number,
  minDamage: number,
  maxDamage: number,
  baseRecharge: number,
  castTime: number,
  radius: number = 0,
  enhancedRechargeBonus: number = 0,
  arcDegrees: number = 360
): number {
  const procsPerMinute = calculateProcsPerMinute(
    ppm,
    baseRecharge,
    castTime,
    radius,
    enhancedRechargeBonus,
    arcDegrees
  );

  // Average damage per proc (damage is uniformly distributed)
  const avgDamage = (minDamage + maxDamage) / 2;

  // DPS = (procs per minute × avg damage) / 60
  return (procsPerMinute * avgDamage) / 60;
}

/**
 * Special case: Calculate proc rate for Auto powers
 * Auto powers use a 10-second pseudo-recharge for PPM calculation
 */
export const AUTO_POWER_PSEUDO_RECHARGE = 10;

/**
 * Calculate proc chance for Auto/Toggle powers.
 * Toggles use a 10s pseudo-recharge with 0 cast time, then apply the same
 * area-factor and clamps as click powers.
 *
 * Formula: Proc% = PPM × 10 / (60 × AreaDenom), clamped [5+PPM×1.5%, 90%]
 *
 * @param ppm - Procs Per Minute value
 * @param radius - AoE radius in feet (0 for single target toggles)
 * @param arcDegrees - cone arc in degrees (default 360 = sphere)
 */
export function calculateAutoToggleProcChance(
  ppm: number,
  radius: number = 0,
  arcDegrees: number = 360,
): number {
  const areaDenom = getPPMAreaDenominator(radius, arcDegrees);
  const raw = (ppm * AUTO_POWER_PSEUDO_RECHARGE) / (60 * areaDenom);
  return clampProcChance(raw, ppm);
}

/**
 * Calculate expected procs per minute for Auto/Toggle powers.
 * Toggles get 6 proc checks per minute (every 10s).
 */
export function calculateAutoToggleProcsPerMinute(
  ppm: number,
  radius: number = 0,
  arcDegrees: number = 360,
): number {
  const procChance = calculateAutoToggleProcChance(ppm, radius, arcDegrees);
  // 6 ticks per minute (every 10 seconds)
  return procChance * 6;
}

/**
 * Interface for power data needed for proc calculations
 */
export interface PowerProcCalcData {
  baseRecharge: number;
  castTime: number;
  radius?: number;
  /** Cone arc in degrees. Defaults to 360 (sphere) when omitted. */
  arcDegrees?: number;
  powerType: 'Click' | 'Toggle' | 'Auto';
}

/**
 * Calculate comprehensive proc statistics for a power
 */
export function calculateProcStats(
  procData: ProcData,
  power: PowerProcCalcData,
  enhancedRechargeBonus: number = 0
): {
  procChance: number;
  procsPerMinute: number;
  dps?: number;
  effectPerMinute?: number;
} | null {
  if (procData.ppm === null) {
    // Global or Proc120s - always on, no PPM calculation needed
    return null;
  }

  const isAutoOrToggle = power.powerType === 'Auto' || power.powerType === 'Toggle';

  let procChance: number;
  let procsPerMinute: number;

  const arcDegrees = power.arcDegrees ?? 360;

  if (isAutoOrToggle) {
    procChance = calculateAutoToggleProcChance(procData.ppm, power.radius || 0, arcDegrees);
    procsPerMinute = calculateAutoToggleProcsPerMinute(procData.ppm, power.radius || 0, arcDegrees);
  } else {
    procChance = calculateProcChance(
      procData.ppm,
      power.baseRecharge,
      power.castTime,
      power.radius || 0,
      arcDegrees,
      enhancedRechargeBonus,
    );
    procsPerMinute = calculateProcsPerMinute(
      procData.ppm,
      power.baseRecharge,
      power.castTime,
      power.radius || 0,
      enhancedRechargeBonus,
      arcDegrees,
    );
  }

  const result: {
    procChance: number;
    procsPerMinute: number;
    dps?: number;
    effectPerMinute?: number;
  } = {
    procChance,
    procsPerMinute,
  };

  // Calculate DPS for damage procs (reads binary-sourced structured effects)
  const effect = procEffectSummary(procData);
  if (effect.category === 'Damage' && effect.value !== undefined && effect.valueMax !== undefined) {
    const avgDamage = (effect.value + effect.valueMax) / 2;
    result.dps = (procsPerMinute * avgDamage) / 60;
  }

  // Calculate effect per minute for buff procs
  if (effect.value !== undefined && effect.category !== 'Damage') {
    result.effectPerMinute = procsPerMinute * effect.value;
  }

  return result;
}
