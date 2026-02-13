/**
 * Proc enhancement data - detailed information about IO set procs
 * Includes PPM values, mechanics, damage values, and effect descriptions
 */

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
  | 'Stealth'
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
  "Entomb (Superior): Chance for +Absorb": {
    setCategory: "Holds",
    setName: "Entomb (Superior)",
    ioName: "Chance for +Absorb",
    ppm: 3,
    mechanics: "Buff(Absorption 10% of HP)",
    pvpNotes: "",
    type: "Proc",
    levelRange: "50",
    pool: "Winter",
    unique: "Unique"
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
  "Defense to All": {
    setCategory: "Resist Damage",
    setName: "Steadfast Protection",
    ioName: "Defense to All",
    ppm: null,
    mechanics: "Defense(All 3%)",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--30",
    pool: "A-rare",
    unique: "Unique"
  },
  "Teleportation Protection, +Def(All)": {
    setCategory: "Resist Damage",
    setName: "Gladiator's Armor",
    ioName: "Teleportation Protection, +Def(All)",
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
  "Steadfast Protection: Protection from Knockback": {
    setCategory: "Resist Damage",
    setName: "Steadfast Protection",
    ioName: "Protection from Knockback",
    ppm: null,
    mechanics: "Protection(Knockback Mag 4)",
    pvpNotes: "",
    type: "Global",
    levelRange: "10--30",
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
    setName: "Ascendency of the Dominator",
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
};

/**
 * Look up proc data by enhancement name (exact match)
 */
export function getProcDataByName(name: string): ProcData | undefined {
  return PROC_DATABASE[name];
}

/**
 * Look up proc data with fuzzy matching
 * First tries exact match, then tries to find by IO name alone
 */
export function findProcData(enhancementName: string, setName?: string): ProcData | undefined {
  // Try exact match first
  const exact = PROC_DATABASE[enhancementName];
  if (exact) return exact;

  // Try with set name prefix
  if (setName) {
    const withSetName = PROC_DATABASE[`${setName}: ${enhancementName}`];
    if (withSetName) return withSetName;
  }

  // Try to find by IO name only (scan all entries)
  for (const [key, data] of Object.entries(PROC_DATABASE)) {
    if (data.ioName === enhancementName) {
      return data;
    }
    // Also check if the key ends with the enhancement name
    if (key.endsWith(`: ${enhancementName}`)) {
      return data;
    }
  }

  // Fallback: match by set name (handles name mismatches like LotG "Defense/+Recharge" vs "Buff Recharge")
  if (setName) {
    for (const data of Object.values(PROC_DATABASE)) {
      if (data.setName === setName) {
        return data;
      }
    }
  }

  return undefined;
}

/**
 * Parse damage range from mechanics string
 * Returns [min, max] or null if not a damage proc
 */
export function parseDamageRange(mechanics: string): [number, number] | null {
  // Match patterns like "Damage(Fire 10-107)" or "Damage(Energy 7 - 72)"
  const match = mechanics.match(/Damage\s*\(\s*\w+\s+(\d+)\s*-\s*(\d+)\s*\)/i);
  if (match) {
    return [parseInt(match[1], 10), parseInt(match[2], 10)];
  }
  return null;
}

/**
 * Parse damage type from mechanics string
 */
export function parseDamageType(mechanics: string): string | null {
  const match = mechanics.match(/Damage\s*\(\s*(\w+(?:\s+\w+)?)\s+\d+/i);
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * Parse buff value from mechanics string
 * Returns the percentage value or null
 */
export function parseBuffValue(mechanics: string): number | null {
  // Match patterns like "Buff(Recharge 100%)" or "Buff(Heal 5%)"
  const match = mechanics.match(/Buff\s*\([^)]*?(\d+(?:\.\d+)?)\s*%/i);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

/**
 * Parse duration from mechanics string
 */
export function parseDuration(mechanics: string): number | null {
  // Match patterns like "for 10s" or "for 120s"
  const match = mechanics.match(/for\s+(\d+(?:\.\d+)?)\s*s/i);
  if (match) {
    return parseFloat(match[1]);
  }
  return null;
}

/**
 * Parse proc mechanics string into structured effect data
 */
export function parseProcEffect(mechanics: string): ParsedProcEffect {
  const durationRaw = parseDuration(mechanics);
  const duration = durationRaw ?? undefined; // Convert null to undefined
  const lowerMech = mechanics.toLowerCase();

  // ============================================
  // COMBINED EFFECTS (must check before individual effects)
  // ============================================

  // Numina's style: Buff(Recovery X% & Regeneration Y%)
  const numinaMatch = mechanics.match(/Buff\s*\(\s*Recovery\s+(\d+(?:\.\d+)?)\s*%\s*&\s*Regeneration\s+(\d+(?:\.\d+)?)\s*%/i);
  if (numinaMatch) {
    return {
      category: 'Recovery',
      value: parseFloat(numinaMatch[1]),
      secondaryCategory: 'Regeneration',
      secondaryValue: parseFloat(numinaMatch[2]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Panacea style: Buff(Heal X%), Buff(Endurance Y%)
  const panaceaHealMatch = mechanics.match(/Buff\s*\(\s*Heal\s+(\d+(?:\.\d+)?)\s*%/i);
  const panaceaEndMatch = mechanics.match(/Buff\s*\(\s*Endurance\s+(\d+(?:\.\d+)?)\s*%/i);
  if (panaceaHealMatch && panaceaEndMatch) {
    // Has both heal and endurance - return combined
    return {
      category: 'Heal',
      value: parseFloat(panaceaHealMatch[1]),
      secondaryCategory: 'Endurance',
      secondaryValue: parseFloat(panaceaEndMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Winter's Gift style: Resist(-Speed X% & -Recharge Y%)
  const winterGiftMatch = mechanics.match(/Resist\s*\(\s*-Speed\s+(\d+(?:\.\d+)?)\s*%\s*&\s*-Recharge\s+(\d+(?:\.\d+)?)\s*%/i);
  if (winterGiftMatch) {
    return {
      category: 'RunSpeed',
      effectType: 'Slow Resistance',
      value: parseFloat(winterGiftMatch[1]),
      secondaryCategory: 'Recharge',
      secondaryEffectType: 'Recharge Resistance',
      secondaryValue: parseFloat(winterGiftMatch[2]),
      isBuff: true,
      description: mechanics,
    };
  }

  // ============================================
  // SINGLE EFFECTS
  // ============================================

  // Damage procs
  const damageMatch = mechanics.match(/Damage\s*\(\s*(\w+(?:\s+\w+)?)\s+(\d+)\s*-\s*(\d+)\s*\)/i);
  if (damageMatch) {
    return {
      category: 'Damage',
      effectType: damageMatch[1],
      value: parseInt(damageMatch[2], 10),
      valueMax: parseInt(damageMatch[3], 10),
      isBuff: false,
      description: mechanics,
    };
  }

  // Endurance buff (includes Performance Shifter, Theft of Essence)
  const endMatch = mechanics.match(/Buff\s*\(\s*Endurance\s+(\d+(?:\.\d+)?)\s*%/i);
  if (endMatch) {
    return {
      category: 'Endurance',
      value: parseFloat(endMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // HP/Heal buff (includes Panacea, Call of the Sandman)
  const healMatch = mechanics.match(/Buff\s*\(\s*Heal\s+(\d+(?:\.\d+)?)\s*%/i);
  if (healMatch) {
    return {
      category: 'Heal',
      value: parseFloat(healMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Max HP buff (Unbreakable Guard)
  const maxHpMatch = mechanics.match(/Buff\s*\(\s*Maximum Hit Points\s+\+?(\d+(?:\.\d+)?)\s*%/i);
  if (maxHpMatch) {
    return {
      category: 'MaxHP',
      value: parseFloat(maxHpMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Absorb buff (Entomb)
  const absorbMatch = mechanics.match(/Buff\s*\(\s*Absorption\s+(\d+(?:\.\d+)?)\s*%/i);
  if (absorbMatch) {
    return {
      category: 'Absorb',
      value: parseFloat(absorbMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Regeneration buff
  const regenMatch = mechanics.match(/(?:Buff\s*\()?Regeneration\s+(\d+(?:\.\d+)?)\s*%/i);
  if (regenMatch) {
    return {
      category: 'Regeneration',
      value: parseFloat(regenMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Recovery buff (Miracle, Numina's)
  const recoveryMatch = mechanics.match(/Buff\s*\(\s*Recovery\s+(\d+(?:\.\d+)?)\s*%/i);
  if (recoveryMatch) {
    return {
      category: 'Recovery',
      value: parseFloat(recoveryMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Recharge buff (Force Feedback, LotG)
  const rechargeMatch = mechanics.match(/Buff\s*\(\s*Recharge\s+(\d+(?:\.\d+)?)\s*%/i);
  if (rechargeMatch) {
    return {
      category: 'Recharge',
      value: parseFloat(rechargeMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Run Speed buff
  const runSpeedMatch = mechanics.match(/Buff\s*\(\s*RunSpeed\s+(\d+(?:\.\d+)?)\s*%/i);
  if (runSpeedMatch) {
    return {
      category: 'RunSpeed',
      value: parseFloat(runSpeedMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Defense buff (Steadfast, Gladiator's Armor)
  const defenseMatch = mechanics.match(/Defense\s*\(\s*(\w+)\s+(\d+(?:\.\d+)?)\s*%\s*\)/i);
  if (defenseMatch) {
    return {
      category: 'Defense',
      effectType: defenseMatch[1],
      value: parseFloat(defenseMatch[2]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Resistance buff (Shield Wall, Reactive Defenses, Might of the Tanker)
  const resistMatch = mechanics.match(/Resistance\s*\(\s*(\w+)\s+(\d+(?:\.\d+)?)\s*%/i);
  if (resistMatch) {
    return {
      category: 'Resistance',
      effectType: resistMatch[1],
      value: parseFloat(resistMatch[2]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // ToHit buff (Kismet, Build Up)
  const toHitMatch = mechanics.match(/(?:Buff\s*\()?ToHit\s+(\d+(?:\.\d+)?)\s*%/i);
  if (toHitMatch) {
    return {
      category: 'ToHit',
      value: parseFloat(toHitMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Knockback Protection
  const kbMatch = mechanics.match(/Protection\s*\(\s*Knockback\s+Mag\s+(\d+(?:\.\d+)?)\s*\)/i);
  if (kbMatch) {
    return {
      category: 'KnockbackProtection',
      value: parseFloat(kbMatch[1]),
      isBuff: true,
      description: mechanics,
    };
  }

  // Stealth buff
  const stealthMatch = mechanics.match(/Buff\s*\(\s*Stealth\s+(\d+(?:\.\d+)?)\s*ft/i);
  if (stealthMatch) {
    return {
      category: 'Stealth',
      value: parseFloat(stealthMatch[1]),
      duration,
      isBuff: true,
      description: mechanics,
    };
  }

  // Control effects (Hold, Stun, Immobilize, etc.)
  if (lowerMech.includes('hold') || lowerMech.includes('disorient') ||
      lowerMech.includes('immobilize') || lowerMech.includes('knockback') ||
      lowerMech.includes('knockdown') || lowerMech.includes('confusion') ||
      lowerMech.includes('placate') || lowerMech.includes('sleep')) {
    return {
      category: 'Control',
      duration,
      isBuff: false,
      description: mechanics,
    };
  }

  // Debuff effects (Foe -something)
  if (lowerMech.includes('foe(') || lowerMech.includes('foe (')) {
    return {
      category: 'Debuff',
      duration,
      isBuff: false,
      description: mechanics,
    };
  }

  // Special/Other
  return {
    category: 'Special',
    duration,
    isBuff: true,
    description: mechanics,
  };
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
    case 'Stealth': return 'Stealth';
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
    case 'Stealth': return 'text-gray-400';
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
 * Area factor for PPM calculation based on power radius
 * Formula: AreaFactor = max(0.25, 1.0 - radius × 0.011)
 * - Single target (radius 0): 1.0
 * - 15ft radius: 0.835
 * - 25ft radius: 0.725
 * - 40ft radius: 0.56
 * - Capped at minimum 0.25 for very large AoE
 */
export function getPPMAreaFactor(radius: number): number {
  if (radius <= 0) return 1.0;
  return Math.max(0.25, 1.0 - radius * 0.011);
}

/**
 * Calculate proc chance per activation using PPM formula
 *
 * @param ppm - Procs Per Minute value from the enhancement
 * @param baseRecharge - Base (unenhanced) recharge time in seconds
 * @param castTime - Activation/cast time in seconds
 * @param radius - AoE radius in feet (0 for single target)
 * @returns Proc chance as decimal (0-1, capped at 0.9)
 *
 * Formula: Proc% = PPM × (BaseRecharge + CastTime) / 60 × AreaFactor
 * Note: Enhanced recharge does NOT affect proc chance - only base recharge matters
 */
export function calculateProcChance(
  ppm: number,
  baseRecharge: number,
  castTime: number,
  radius: number = 0
): number {
  const areaFactor = getPPMAreaFactor(radius);
  const procChance = (ppm * (baseRecharge + castTime) / 60) * areaFactor;
  // Proc chance is capped at 90%
  return Math.min(0.9, procChance);
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
  enhancedRechargeBonus: number = 0
): number {
  const procChance = calculateProcChance(ppm, baseRecharge, castTime, radius);

  // Calculate actual cycle time with enhanced recharge
  // Enhanced recharge reduces recharge time: actualRecharge = baseRecharge / (1 + bonus)
  const actualRecharge = baseRecharge / (1 + enhancedRechargeBonus);
  const cycleTime = actualRecharge + castTime;

  // Activations per minute
  const activationsPerMinute = 60 / cycleTime;

  return procChance * activationsPerMinute;
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
export function calculateProcDPS(
  ppm: number,
  minDamage: number,
  maxDamage: number,
  baseRecharge: number,
  castTime: number,
  radius: number = 0,
  enhancedRechargeBonus: number = 0
): number {
  const procsPerMinute = calculateProcsPerMinute(
    ppm,
    baseRecharge,
    castTime,
    radius,
    enhancedRechargeBonus
  );

  // Average damage per proc (damage is uniformly distributed)
  const avgDamage = (minDamage + maxDamage) / 2;

  // DPS = (procs per minute × avg damage) / 60
  return (procsPerMinute * avgDamage) / 60;
}

/**
 * Calculate effective uptime for buff procs (like Performance Shifter's +End)
 * For procs that fire periodically and grant a one-time benefit
 *
 * @param ppm - Procs Per Minute value
 * @param baseRecharge - Base recharge time in seconds
 * @param castTime - Cast time in seconds
 * @param radius - AoE radius (0 for single target)
 * @param enhancedRechargeBonus - Recharge enhancement bonus as decimal
 * @returns Expected procs per minute (for one-shot buffs like +End)
 */
export function calculateBuffProcRate(
  ppm: number,
  baseRecharge: number,
  castTime: number,
  radius: number = 0,
  enhancedRechargeBonus: number = 0
): number {
  return calculateProcsPerMinute(ppm, baseRecharge, castTime, radius, enhancedRechargeBonus);
}

/**
 * Special case: Calculate proc rate for Auto powers
 * Auto powers use a 10-second pseudo-recharge for PPM calculation
 */
export const AUTO_POWER_PSEUDO_RECHARGE = 10;

/**
 * Special case: Calculate proc rate for Toggle powers
 * Toggles tick every 10 seconds for damage/effect application
 * For PPM, they use 10-second pseudo-recharge
 */
export const TOGGLE_POWER_TICK_INTERVAL = 10;

/**
 * Calculate proc chance for Auto/Toggle powers
 * These use a special 10-second pseudo-recharge time
 *
 * @param ppm - Procs Per Minute value
 * @returns Proc chance per tick (every 10 seconds)
 */
export function calculateAutoToggleProcChance(ppm: number): number {
  // Auto/Toggle powers: PPM × (10 + 0) / 60 = PPM × 10 / 60 = PPM / 6
  const procChance = ppm * AUTO_POWER_PSEUDO_RECHARGE / 60;
  return Math.min(0.9, procChance);
}

/**
 * Calculate expected procs per minute for Auto/Toggle powers
 *
 * @param ppm - Procs Per Minute value
 * @returns Expected procs per minute
 */
export function calculateAutoToggleProcsPerMinute(ppm: number): number {
  const procChance = calculateAutoToggleProcChance(ppm);
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

  if (isAutoOrToggle) {
    procChance = calculateAutoToggleProcChance(procData.ppm);
    procsPerMinute = calculateAutoToggleProcsPerMinute(procData.ppm);
  } else {
    procChance = calculateProcChance(
      procData.ppm,
      power.baseRecharge,
      power.castTime,
      power.radius || 0
    );
    procsPerMinute = calculateProcsPerMinute(
      procData.ppm,
      power.baseRecharge,
      power.castTime,
      power.radius || 0,
      enhancedRechargeBonus
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

  // Calculate DPS for damage procs
  const effect = parseProcEffect(procData.mechanics);
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
