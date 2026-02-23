/**
 * Enhancement outline utilities - color-coded outlines for proc and unique enhancements
 */

import { findProcData, parseProcEffect } from '@/data/proc-data';
import type { ProcEffectCategory } from '@/data/proc-data';

export interface EnhancementOutlineStyle {
  show: boolean;
  color: string;
  secondaryColor?: string;
  type: 'proc' | 'unique' | null;
}

/**
 * Map proc effect category to outline color (CSS hex)
 *
 * Damage:              Red
 * Heal/Regen/Absorb:   Green
 * Endurance/Recovery:   Blue
 * Defense:              Purple
 * Resistance:           Orange
 * Mez (Control):        Pink
 * Acc/ToHit/BuildUp:    Yellow
 * Recharge:             Teal
 * Other:                Light grey
 */
function getProcOutlineColor(category: ProcEffectCategory): string {
  switch (category) {
    case 'Damage':
      return '#f87171'; // red-400
    case 'Heal':
    case 'Regeneration':
    case 'Absorb':
      return '#4ade80'; // green-400
    case 'Endurance':
    case 'Recovery':
      return '#60a5fa'; // blue-400
    case 'Defense':
      return '#c084fc'; // purple-400
    case 'Resistance':
      return '#fb923c'; // orange-400
    case 'Control':
      return '#f9a8d4'; // pink-300
    case 'ToHit':
      return '#facc15'; // yellow-400
    case 'Recharge':
      return '#2dd4bf'; // teal-400
    default:
      return '#94a3b8'; // slate-400
  }
}

const NO_OUTLINE: EnhancementOutlineStyle = { show: false, color: 'transparent', type: null };

/**
 * Determine outline style for an enhancement piece
 */
export function getEnhancementOutline(
  piece: { name: string; proc: boolean; unique: boolean },
  setName: string,
): EnhancementOutlineStyle {
  if (piece.proc) {
    const procData = findProcData(piece.name, setName);
    if (procData) {
      const effect = parseProcEffect(procData.mechanics);
      const color = getProcOutlineColor(effect.category);
      const secondaryColor = effect.secondaryCategory
        ? getProcOutlineColor(effect.secondaryCategory)
        : undefined;
      // Only use secondary if it's actually a different color
      return {
        show: true,
        color,
        secondaryColor: secondaryColor && secondaryColor !== color ? secondaryColor : undefined,
        type: 'proc',
      };
    }
    // Proc but no data found
    return { show: true, color: '#94a3b8', type: 'proc' };
  }
  if (piece.unique) {
    return { show: true, color: 'rgba(251, 191, 36, 0.5)', type: 'unique' };
  }
  return NO_OUTLINE;
}
