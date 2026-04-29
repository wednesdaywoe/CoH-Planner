/**
 * Unified color palette for stats and effects display.
 * Single source of truth used by both EFFECT_REGISTRY and StatsDashboard.
 *
 * Pattern: Debuffs use the same hue as their buff counterpart at 60% opacity.
 * Grey/neutral stats use a lower Tailwind shade (300 → 500) for debuffs.
 */
export const STAT_COLORS = {
  // === Damage ===
  damage:            'text-red-400',
  damageDebuff:      'text-red-400/60',

  // === Accuracy / ToHit ===
  accuracy:          'text-yellow-400',
  tohit:             'text-yellow-400',
  tohitDebuff:       'text-yellow-400/60',

  // === Defense ===
  defense:           'text-purple-400',
  defenseDebuff:     'text-purple-400/60',

  // === Resistance ===
  resistance:        'text-orange-400',
  resistanceDebuff:  'text-orange-400/60',

  // === Recharge (neutral grey) ===
  recharge:          'text-slate-300',
  rechargeBuff:      'text-slate-300',
  rechargeDebuff:    'text-slate-500',

  // === Health / Healing / Regen ===
  health:            'text-green-400',
  healing:           'text-green-400',
  maxHP:             'text-green-400',
  regen:             'text-green-400',
  regenDebuff:       'text-green-400/60',
  absorb:            'text-green-400',

  // === Endurance / Recovery ===
  endurance:         'text-blue-400',
  maxEnd:            'text-blue-400',
  recovery:          'text-blue-400',
  recoveryBuff:      'text-blue-400',
  recoveryDebuff:    'text-blue-400/60',
  enduranceDrain:    'text-blue-400/60',
  enduranceDiscount: 'text-blue-400',
  enduranceGain:     'text-blue-400',

  // === Speed / Movement (all teal) ===
  runSpeed:          'text-teal-400',
  flySpeed:          'text-teal-400',
  jumpSpeed:         'text-teal-400',
  jumpHeight:        'text-teal-400',
  teleport:          'text-teal-400',
  fly:               'text-teal-400',
  speed:             'text-teal-400',
  slow:              'text-teal-400/60',

  // === Mez (ALL pink) ===
  hold:              'text-pink-400',
  stun:              'text-pink-400',
  immobilize:        'text-pink-400',
  sleep:             'text-pink-400',
  fear:              'text-pink-400',
  confuse:           'text-pink-400',
  taunt:             'text-pink-400',
  placate:           'text-pink-400',
  knockback:         'text-pink-400',
  knockup:           'text-pink-400',
  repel:             'text-pink-400',

  // === Protection ===
  protection:        'text-pink-400',     // mez protection matches mez color
  elusivity:         'text-teal-400',     // DDR
  debuffResistance:  'text-cyan-400',

  // === Neutral / execution stats ===
  range:             'text-slate-300',
  rangeBuff:         'text-slate-300',
  castTime:          'text-slate-500',
  buffDuration:      'text-slate-500',
  effectDuration:    'text-slate-500',
  radius:            'text-slate-500',
  untouchable:       'text-slate-300',

  // === Threat / Perception ===
  threat:            'text-slate-300',
  threatDebuff:      'text-slate-500',
  perception:        'text-slate-300',
  perceptionDebuff:  'text-slate-500',

  // === Special ===
  summon:            'text-amber-400',

  // === Defaults ===
  default:           'text-slate-300',
  defaultDim:        'text-slate-500',
} as const;
