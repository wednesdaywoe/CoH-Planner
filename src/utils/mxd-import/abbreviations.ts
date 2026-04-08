/**
 * MXD Enhancement Abbreviation Dictionary
 *
 * Maps Mids Reborn short codes to our IO set IDs.
 * Built by cross-referencing MXD files against io-sets-raw.ts.
 *
 * Format: 'MidsAbbrev' -> 'our_set_id'
 * Generic IOs use the stat name directly.
 */

// ============================================
// IO SET ABBREVIATIONS -> set IDs
// ============================================

export const SET_ABBREVIATIONS: Record<string, string> = {
  // --- A ---
  'AchHee': 'achilles_heel',
  'Ags': 'aegis',
  'Ann': 'annihilation',
  'Apc': 'apocalypse',
  'Arm': 'armageddon',
  'AdjTgt': 'adjusted_targeting',
  'AbsAmz': 'absolute_amazement',
  'AirBrst': 'air_burst',

  // --- B ---
  'BslGaz': 'basilisks_gaze',
  'BlsoftheZ': 'blessing_of_the_zephyr',
  'BldMnd': 'blood_mandate',
  'Bmbdmt': 'bombardment',
  'BntHntr': 'bounty_hunter',
  'BrtFry': 'brutes_fury',

  // --- C ---
  'CaltoArm': 'call_to_arms',
  'CldSns': 'cloud_senses',
  'ClvBl': 'cleaving_blow',
  'CrcPrs': 'coercive_persuasion',
  'CrtStrk': 'critical_strikes',
  'CrshImp': 'crushing_impact',
  'Clt': 'celerity',

  // --- D ---
  'Dcm': 'decimation',
  'DctWnd': 'doctored_wounds',
  'DrkWtch': 'dark_watchers_despair',
  'Dtn': 'detonation',
  'Dvs': 'devastation',

  // --- E ---
  'EdcoftheM': 'edict_of_the_master',
  'Erd': 'eradication',
  'EffAdp': 'efficacy_adaptor',
  'EnfOpr': 'enfeebled_operation',
  'EntChs': 'entropic_chaos',
  'ExcCnt': 'executioners_contract',
  'ExpRnf': 'expedient_reinforcement',
  'ExpStr': 'explosive_strike',

  // --- F ---
  'FrcFdb': 'force_feedback',
  'FrtHyp': 'fortunata_hypnosis',
  'FuryGld': 'fury_of_the_gladiator',

  // --- G ---
  'GldArm': 'gladiators_armor',
  'GldJvl': 'gladiators_javelin',
  'GldNet': 'gladiators_net',
  'GldStr': 'gladiators_strike',
  'GhstWdw': 'ghost_widows_embrace',
  'GftAnc': 'gift_of_the_ancients',
  'GrvAnc': 'gravitational_anchor',
  'GssSynFr': 'gaussians_synchronized_firecontrol',
  'GlmAby': 'glimpse_of_the_abyss',

  // --- H ---
  'Hct': 'hecatomb',
  'HrmHl': 'harmonized_healing',
  'Hyp': 'hypersonic',
  'HprMdKn': 'hyper_advanced_medical_knowledge',

  // --- I ---
  'ImpSki': 'impervious_skin',
  'ImpSwf': 'impeded_swiftness',
  'ImpArm': 'impervium_armor',
  'IndCma': 'induced_coma',

  // --- J ---
  'JvlVll': 'javelin_volley',

  // --- K ---
  'KntCbt': 'kinetic_combat',
  'KntCrs': 'kinetic_crash',
  'Krm': 'karma',
  'Ksm': 'kismet',

  // --- L ---
  'Lck': 'lockdown',
  'LthRps': 'lethargic_repose',
  'LucoftheG': 'luck_of_the_gambler',

  // --- M ---
  'MkosBt': 'makos_bite',
  'MlcCrp': 'malice_of_the_corruptor',
  'MlsIll': 'malaises_illusions',
  'MrkSpr': 'mark_of_supremacy',
  'Mrc': 'miracle',
  'MltStr': 'multi_strike',

  // --- N ---
  'NmnCnv': 'numinas_convalesence',
  'NrnSht': 'neuronic_shutdown',

  // --- O ---
  'Obl': 'obliteration',
  'OvrFrc': 'overwhelming_force',

  // --- P ---
  'Pnc': 'panacea',
  'PcnTrt': 'pacing_of_the_turtle',
  'PrfShf': 'performance_shifter',
  'PrfZng': 'perfect_zinger',
  'PstBls': 'positrons_blast',
  'Prv': 'preventive_medicine',
  'PrmOpt': 'preemptive_optimization',
  'PwrTrns': 'power_transfer',

  // --- R ---
  'Rct': 'reactive_defenses',
  'RctArm': 'reactive_armor',
  'RedFrt': 'red_fortune',
  'Rgn': 'ragnarok',
  'RgnTss': 'regenerative_tissue',
  'Rn': 'ruin',

  // --- S ---
  'ScrDrv': 'sciroccos_dervish',
  'ShlWal': 'shield_wall',
  'SlbAll': 'soulbound_allegiance',
  'StdPrt': 'steadfast_protection',
  'StngMnt': 'sting_of_the_manticore',
  'SdnAcc': 'sudden_acceleration',
  'SvrRgh': 'sovereign_right',
  'SynShk': 'synapses_shock',

  // --- Superior Sets ---
  'SprAvl': 'superior_avalanche',
  'SprBlsCld': 'superior_blistering_cold',
  'SprBrtFry': 'superior_brutes_fury',
  'SprCrtStr': 'superior_critical_strikes',
  'SprDfnBrg': 'superior_defiant_barrage',
  'SprDmnofA': 'superior_dominion_of_arachnos',
  'SprFrzBls': 'superior_frozen_blast',
  'SprGntFst': 'superior_gauntleted_fist',
  'SprMrkSpr': 'superior_mark_of_supremacy',
  'SprOvrPrs': 'superior_overpowering_presence',
  'SprSpdBit': 'superior_spiders_bite',
  'SprUnrFry': 'superior_unrelenting_fury',
  'SprWilCtr': 'superior_will_of_the_controller',
  'SprAscofD': 'superior_ascendency_of_the_dominator',
  'SprCmdMst': 'superior_command_of_the_mastermind',
  'SprSntWrd': 'superior_sentinels_ward',
  'SprEssTrn': 'superior_essence_transfer',
  'SprDmnGrp': 'superior_dominating_grasp',
  'SprAsstkn': 'superior_assassins_mark',

  // --- T ---
  'TchofDth': 'touch_of_death',
  'TchLdyGr': 'touch_of_lady_grey',
  'TchNct': 'touch_of_the_nictus',
  'ThfofEss': 'theft_of_essence',
  'ThnStr': 'thunderstrike',
  'TtnCtg': 'titanium_coating',
  'TrpHnt': 'trap_of_the_hunter',

  // --- U ---
  'UnbCns': 'unbreakable_constraint',
  'UnbGrd': 'unbreakable_guard',

  // --- W ---
  'WntGft': 'winters_gift',
  'WntBte': 'superior_winters_bite',

  // --- Purple sets ---
  'Apoc': 'apocalypse',

  // ============================================
  // ALTERNATE ABBREVIATIONS (from older Mids versions)
  // Discovered by parsing 49 user-provided MXD files.
  // These are variant spellings of sets already mapped above.
  // ============================================

  // Alternate Superior ATO spellings
  'SprUnrFur': 'superior_unrelenting_fury',
  'SprBrtFur': 'superior_brutes_fury',
  'SprScrStr': 'superior_critical_strikes',
  'SprScrBls': 'superior_blistering_cold',
  'SprMlcoft': 'superior_malice_of_the_corruptor',
  'SprBlsCol': 'superior_blistering_cold',
  'SprWntBit': 'superior_winters_bite',
  'SprDfnBrr': 'superior_defiant_barrage',
  'SprDfnBst': 'superior_defiant_barrage',
  'SprVglAss': 'superior_vigilant_assault',
  'SprGntFis': 'superior_gauntleted_fist',
  'SprMghoft': 'superior_might_of_the_tanker',
  'SprAscoft': 'superior_ascendency_of_the_dominator',
  'SprEnt': 'superior_entomb',
  'SprMarofS': 'superior_mark_of_supremacy',
  'SprCmmoft': 'superior_command_of_the_mastermind',
  'SprDmnGrs': 'superior_dominating_grasp',
  'SprSntWar': 'superior_sentinels_ward',
  'SprOppStr': 'superior_opportunity_strikes',
  'SprWiloft': 'superior_will_of_the_controller',
  'SprBlsWrt': 'superior_blasters_wrath',

  // Alternate standard set spellings
  'TtnCtn': 'titanium_coating',
  'GifoftheA': 'gift_of_the_ancients',
  'AdjTrg': 'adjusted_targeting',
  'SynSck': 'synapses_shock',
  'CrsImp': 'crushing_impact',
  'SuddAcc': 'sudden_acceleration',
  'WntGif': 'winters_gift',
  'FuroftheG': 'fury_of_the_gladiator',
  'EnrMnp': 'energy_manipulator',
  'TchofLadG': 'touch_of_lady_grey',
  'StnoftheM': 'sting_of_the_manticore',
  'GhsWdwEmb': 'ghost_widows_embrace',
  'TchoftheN': 'touch_of_the_nictus',
  'KntCmb': 'kinetic_combat',
  'MckBrt': 'makos_bite',
  'PreOptmz': 'preemptive_optimization',
  'ClvBlo': 'cleaving_blow',
  'GlmoftheA': 'glimpse_of_the_abyss',
  'Thn': 'thunderstrike',
  'ShlBrk': 'shield_breaker',
  'Clr': 'celerity',
  'IceMisTrmt': 'ice_mistrals_torment',
  'Mlt': 'multi_strike',
  'Jnt': 'jaunt',
  'TraoftheH': 'trap_of_the_hunter',
  'AscoftheD': 'ascendency_of_the_dominator',
  'UnbLea': 'unbreakable_constraint',
  'Bit': 'blistering_cold',
  'ExpVln': 'exploit_weakness',
  'RctRtc': 'reactive_armor',
  'EncAcc': 'encouraged_accuracy',
  'Srn': 'serendipity',
  'PndSlg': 'pounding_slugfest',
  'Tmp': 'tempered_readiness',
};

// ============================================
// GENERIC IO ABBREVIATIONS -> stat names
// ============================================

export const GENERIC_ABBREVIATIONS: Record<string, string> = {
  'Acc': 'Accuracy',
  'Dmg': 'Damage',
  'EndRdx': 'EnduranceReduction',
  'RechRdx': 'Recharge',
  'DefBff': 'Defense',
  'Heal': 'Healing',
  'Run': 'Run Speed',
  'Jump': 'Jump',
  'Fly': 'Fly Speed',
  'Slow': 'Slow',
  'Intrdct': 'Interrupt',
  'EndMod': 'EnduranceModification',
  'ThtDmg': 'Resistance',
  'ToHit': 'ToHit',
  'Range': 'Range',
  'Dsrnt': 'Stun',
  'Hold': 'Hold',
  'Immob': 'Immobilize',
  'Sleep': 'Sleep',
  'Cnf': 'Confuse',
  'Fear': 'Fear',
  'Taunt': 'Taunt',
  'KB': 'Knockback',
  'IntRdx': 'Interrupt',
  'Flight': 'Fly Speed',
  'KBDist': 'Knockback',
};

// ============================================
// PIECE ASPECT ABBREVIATIONS -> stat names
// Used to match piece abbreviations to piece numbers
// ============================================

export const ASPECT_ABBREVIATIONS: Record<string, string> = {
  'Acc': 'Accuracy',
  'Dmg': 'Damage',
  'Dam': 'Damage',
  'EndRdx': 'EnduranceReduction',
  'Rchg': 'Recharge',
  'Def': 'Defense',
  'Rng': 'Range',
  'Heal': 'Healing',
  'ResDam': 'Resistance',
  'EndMod': 'EnduranceModification',
  'ToHit': 'ToHit',
  'Immob': 'Immobilize',
  'Hold': 'Hold',
  'Slow': 'Slow',
  'Fear': 'Fear',
  'Cnf': 'Confuse',
  'KB': 'Knockback',
  'Knock': 'Knockback',
  'Stun': 'Stun',
  'Dsrnt': 'Stun',
  'Intrdct': 'Interrupt',
  'Taunt': 'Taunt',
  'Sleep': 'Sleep',
};

// Special piece suffixes that indicate procs/uniques
export const PROC_INDICATORS = [
  '%',      // e.g., "Dam%", "ResDeb%", "Knock%"
  '+',      // e.g., "Def/Rchg+", "+FireDmg", "+Heal"
  'Proc',   // e.g., "3defTpProc"
  'Build%', // e.g., "Build%"
  'Global', // e.g., "Rchg/Global Toxic"
];

// ============================================
// ARCHETYPE NAME MAPPING
// ============================================

export const CLASS_TO_ARCHETYPE: Record<string, string> = {
  'Blaster': 'blaster',
  'Brute': 'brute',
  'Controller': 'controller',
  'Corruptor': 'corruptor',
  'Defender': 'defender',
  'Dominator': 'dominator',
  'Mastermind': 'mastermind',
  'Scrapper': 'scrapper',
  'Sentinel': 'sentinel',
  'Stalker': 'stalker',
  'Tanker': 'tanker',
  'Peacebringer': 'peacebringer',
  'Warshade': 'warshade',
  'Arachnos Soldier': 'arachnos-soldier',
  'Arachnos Widow': 'arachnos-widow',
};
