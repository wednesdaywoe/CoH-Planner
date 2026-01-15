/**
 * StatsDashboard component - displays key stats in a horizontal bar
 */

import { useCalculatedStats, useTotalSlotsUsed, useSlotsRemaining } from '@/hooks';
import { useBuildStore } from '@/stores';
import { Tooltip } from '@/components/ui';

export function StatsDashboard() {
  const stats = useCalculatedStats();
  const slotsUsed = useTotalSlotsUsed();
  const slotsRemaining = useSlotsRemaining();
  const build = useBuildStore((s) => s.build);

  return (
    <div className="bg-gray-900/50 border-b border-gray-800 px-4 py-2">
      <div className="flex items-center justify-between gap-4">
        {/* Slot counter */}
        <div className="flex items-center gap-6">
          <StatItem
            label="Slots"
            value={`${slotsUsed}/67`}
            tooltip={`${slotsRemaining} slots remaining`}
            className={slotsRemaining < 5 ? 'text-yellow-400' : 'text-gray-300'}
          />

          {/* Global buffs from set bonuses */}
          {stats.globalRecharge > 0 && (
            <StatItem
              label="Recharge"
              value={`+${stats.globalRecharge.toFixed(1)}%`}
              color="text-blue-400"
              tooltip="Global recharge from set bonuses"
            />
          )}

          {stats.globalDamage > 0 && (
            <StatItem
              label="Damage"
              value={`+${stats.globalDamage.toFixed(1)}%`}
              color="text-red-400"
              tooltip="Global damage from set bonuses"
            />
          )}

          {stats.globalAccuracy > 0 && (
            <StatItem
              label="Accuracy"
              value={`+${stats.globalAccuracy.toFixed(1)}%`}
              color="text-yellow-400"
              tooltip="Global accuracy from set bonuses"
            />
          )}
        </div>

        {/* Defense summary */}
        <div className="flex items-center gap-4">
          <DefenseCluster stats={stats} />
        </div>

        {/* HP and Endurance */}
        <div className="flex items-center gap-4">
          {build.archetype?.stats && (
            <>
              <StatItem
                label="HP"
                value={formatHP(stats.maxHP, stats.hpBuff)}
                color="text-green-400"
                tooltip={`Base: ${stats.maxHP} | Buff: +${stats.hpBuff.toFixed(1)}%`}
              />
              <StatItem
                label="End"
                value={`${stats.maxEndurance}`}
                color="text-cyan-400"
                tooltip="Maximum endurance"
              />
            </>
          )}

          {stats.regenBuff > 0 && (
            <StatItem
              label="Regen"
              value={`+${stats.regenBuff.toFixed(1)}%`}
              color="text-green-300"
              tooltip="Regeneration bonus from set bonuses"
            />
          )}

          {stats.recoveryBuff > 0 && (
            <StatItem
              label="Recovery"
              value={`+${stats.recoveryBuff.toFixed(1)}%`}
              color="text-cyan-300"
              tooltip="Recovery bonus from set bonuses"
            />
          )}
        </div>
      </div>
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  color?: string;
  tooltip?: string;
  className?: string;
}

function StatItem({ label, value, color = 'text-gray-300', tooltip, className = '' }: StatItemProps) {
  const content = (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="text-xs text-gray-500 uppercase tracking-wide">{label}</span>
      <span className={`text-sm font-medium ${color}`}>{value}</span>
    </div>
  );

  if (tooltip) {
    return <Tooltip content={tooltip}>{content}</Tooltip>;
  }

  return content;
}

interface DefenseClusterProps {
  stats: ReturnType<typeof useCalculatedStats>;
}

function DefenseCluster({ stats }: DefenseClusterProps) {
  const defenses = [
    { key: 'smashing', label: 'S/L', value: Math.max(stats.defense.smashing, stats.defense.lethal) },
    { key: 'fire', label: 'F/C', value: Math.max(stats.defense.fire, stats.defense.cold) },
    { key: 'energy', label: 'E/N', value: Math.max(stats.defense.energy, stats.defense.negative) },
    { key: 'psionic', label: 'Psi', value: stats.defense.psionic },
    { key: 'melee', label: 'Melee', value: stats.defense.melee },
    { key: 'ranged', label: 'Ranged', value: stats.defense.ranged },
    { key: 'aoe', label: 'AoE', value: stats.defense.aoe },
  ];

  const hasAnyDefense = defenses.some((d) => d.value > 0);

  if (!hasAnyDefense) {
    return (
      <span className="text-xs text-gray-500">
        No defense bonuses
      </span>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 uppercase tracking-wide">Def:</span>
      {defenses.map((def) => (
        def.value > 0 && (
          <Tooltip key={def.key} content={`${def.label} Defense: ${def.value.toFixed(1)}%`}>
            <span className={`text-xs ${getDefenseColor(def.value)}`}>
              {def.label} {def.value.toFixed(1)}%
            </span>
          </Tooltip>
        )
      ))}
    </div>
  );
}

function getDefenseColor(value: number): string {
  if (value >= 45) return 'text-green-400 font-medium'; // Soft-capped
  if (value >= 32.5) return 'text-green-300'; // Near soft-cap
  if (value >= 20) return 'text-yellow-400';
  return 'text-gray-400';
}

function formatHP(base: number, buff: number): string {
  if (base === 0) return '—';
  const buffed = base * (1 + buff / 100);
  if (buff > 0) {
    return `${Math.floor(buffed)}`;
  }
  return `${base}`;
}
