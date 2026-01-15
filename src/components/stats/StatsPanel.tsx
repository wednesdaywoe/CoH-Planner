/**
 * StatsPanel component - comprehensive stats display panel
 */

import { useCalculatedStats } from '@/hooks';
import { StatItem, StatBar } from './StatItem';

export function StatsPanel() {
  const stats = useCalculatedStats();

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-200">Build Statistics</h3>
      </div>

      <div className="p-4 space-y-6">
        {/* Global Buffs */}
        <StatsSection title="Global Buffs">
          <StatItem
            label="Recharge"
            value={stats.globalRecharge}
            category="recharge"
          />
          <StatItem
            label="Damage"
            value={stats.globalDamage}
            category="damage"
          />
          <StatItem
            label="Accuracy"
            value={stats.globalAccuracy}
            category="accuracy"
          />
        </StatsSection>

        {/* Health & Endurance */}
        <StatsSection title="Health & Endurance">
          <StatItem
            label="Max HP"
            value={stats.maxHP + (stats.maxHP * stats.hpBuff / 100)}
            unit=""
            category="health"
          />
          <StatItem
            label="HP Buff"
            value={stats.hpBuff}
            category="health"
            cap={100} // Approximate HP buff cap
          />
          <StatItem
            label="Regeneration"
            value={stats.regenBuff}
            category="health"
          />
          <StatItem
            label="Max Endurance"
            value={stats.maxEndurance}
            unit=""
            category="endurance"
          />
          <StatItem
            label="Recovery"
            value={stats.recoveryBuff}
            category="endurance"
          />
        </StatsSection>

        {/* Defense */}
        <StatsSection title="Defense">
          <StatBar label="Smashing" value={stats.defense.smashing} max={45} category="defense" />
          <StatBar label="Lethal" value={stats.defense.lethal} max={45} category="defense" />
          <StatBar label="Fire" value={stats.defense.fire} max={45} category="defense" />
          <StatBar label="Cold" value={stats.defense.cold} max={45} category="defense" />
          <StatBar label="Energy" value={stats.defense.energy} max={45} category="defense" />
          <StatBar label="Negative" value={stats.defense.negative} max={45} category="defense" />
          <StatBar label="Psionic" value={stats.defense.psionic} max={45} category="defense" />
          <StatBar label="Melee" value={stats.defense.melee} max={45} category="defense" />
          <StatBar label="Ranged" value={stats.defense.ranged} max={45} category="defense" />
          <StatBar label="AoE" value={stats.defense.aoe} max={45} category="defense" />
        </StatsSection>

        {/* Resistance */}
        <StatsSection title="Resistance">
          <StatBar label="Smashing" value={stats.resistance.smashing} max={90} category="resistance" />
          <StatBar label="Lethal" value={stats.resistance.lethal} max={90} category="resistance" />
          <StatBar label="Fire" value={stats.resistance.fire} max={90} category="resistance" />
          <StatBar label="Cold" value={stats.resistance.cold} max={90} category="resistance" />
          <StatBar label="Energy" value={stats.resistance.energy} max={90} category="resistance" />
          <StatBar label="Negative" value={stats.resistance.negative} max={90} category="resistance" />
          <StatBar label="Psionic" value={stats.resistance.psionic} max={90} category="resistance" />
          <StatBar label="Toxic" value={stats.resistance.toxic} max={90} category="resistance" />
        </StatsSection>

        {/* Mez Resistance */}
        {hasAnyMezResistance(stats.mezResistance) && (
          <StatsSection title="Mez Resistance">
            {stats.mezResistance.hold > 0 && (
              <StatItem label="Hold" value={stats.mezResistance.hold} category="mez" />
            )}
            {stats.mezResistance.stun > 0 && (
              <StatItem label="Stun" value={stats.mezResistance.stun} category="mez" />
            )}
            {stats.mezResistance.immobilize > 0 && (
              <StatItem label="Immobilize" value={stats.mezResistance.immobilize} category="mez" />
            )}
            {stats.mezResistance.sleep > 0 && (
              <StatItem label="Sleep" value={stats.mezResistance.sleep} category="mez" />
            )}
            {stats.mezResistance.confuse > 0 && (
              <StatItem label="Confuse" value={stats.mezResistance.confuse} category="mez" />
            )}
            {stats.mezResistance.fear > 0 && (
              <StatItem label="Fear" value={stats.mezResistance.fear} category="mez" />
            )}
            {stats.mezResistance.knockback > 0 && (
              <StatItem label="Knockback" value={stats.mezResistance.knockback} category="mez" />
            )}
          </StatsSection>
        )}

        {/* Movement */}
        {hasAnyMovement(stats) && (
          <StatsSection title="Movement">
            {stats.runSpeed > 0 && (
              <StatItem label="Run Speed" value={stats.runSpeed} category="movement" />
            )}
            {stats.jumpHeight > 0 && (
              <StatItem label="Jump" value={stats.jumpHeight} category="movement" />
            )}
            {stats.flySpeed > 0 && (
              <StatItem label="Fly Speed" value={stats.flySpeed} category="movement" />
            )}
          </StatsSection>
        )}
      </div>
    </div>
  );
}

interface StatsSectionProps {
  title: string;
  children: React.ReactNode;
}

function StatsSection({ title, children }: StatsSectionProps) {
  return (
    <div>
      <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
        {title}
      </h4>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function hasAnyMezResistance(mez: ReturnType<typeof useCalculatedStats>['mezResistance']): boolean {
  return (
    mez.hold > 0 ||
    mez.stun > 0 ||
    mez.immobilize > 0 ||
    mez.sleep > 0 ||
    mez.confuse > 0 ||
    mez.fear > 0 ||
    mez.knockback > 0
  );
}

function hasAnyMovement(stats: ReturnType<typeof useCalculatedStats>): boolean {
  return stats.runSpeed > 0 || stats.jumpHeight > 0 || stats.flySpeed > 0;
}
