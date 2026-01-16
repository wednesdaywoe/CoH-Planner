/**
 * InfoPanel - Displays detailed information about the currently hovered power
 */

import { useUIStore } from '@/stores';
import { getPower, getPowerPool } from '@/data';

export function InfoPanel() {
  const infoPanelContent = useUIStore((s) => s.infoPanel.content);

  if (!infoPanelContent) {
    return (
      <div className="h-full bg-gray-900/50 rounded-lg border border-gray-800 p-4">
        <div className="text-gray-500 text-sm text-center mt-8">
          Hover over a power to see details
        </div>
      </div>
    );
  }

  if (infoPanelContent.type === 'power') {
    return <PowerInfo powerName={infoPanelContent.powerName} powerSet={infoPanelContent.powerSet} />;
  }

  if (infoPanelContent.type === 'enhancement') {
    return <EnhancementInfo enhancementId={infoPanelContent.enhancementId} />;
  }

  return null;
}

interface PowerInfoProps {
  powerName: string;
  powerSet: string;
}

function PowerInfo({ powerName, powerSet }: PowerInfoProps) {
  // Try to get power from powerset first, then from pools
  let power = getPower(powerSet, powerName);

  if (!power) {
    // Try pool powers
    const pool = getPowerPool(powerSet);
    if (pool) {
      power = pool.powers.find(p => p.name === powerName);
    }
  }

  if (!power) {
    return (
      <div className="h-full bg-gray-900/50 rounded-lg border border-gray-800 p-4">
        <div className="text-gray-500 text-sm">Power not found</div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-900/50 rounded-lg border border-gray-800 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-3">
        <div className="flex items-center gap-3">
          <img
            src={power.icon || '/img/Unknown.png'}
            alt=""
            className="w-10 h-10 rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/img/Unknown.png';
            }}
          />
          <div>
            <h3 className="font-semibold text-white">{power.name}</h3>
            <span className="text-xs text-gray-400 capitalize">{power.powerType}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-4">
        {/* Description */}
        <div>
          <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Description</h4>
          <p className="text-sm text-gray-300">{power.description}</p>
        </div>

        {/* Effects */}
        {power.effects && (
          <div>
            <h4 className="text-xs font-medium text-gray-400 uppercase mb-2">Effects</h4>
            <div className="space-y-1 text-sm">
              {power.effects.accuracy && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy</span>
                  <span className="text-yellow-400">{(power.effects.accuracy * 100).toFixed(0)}%</span>
                </div>
              )}
              {power.effects.recharge && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Recharge</span>
                  <span className="text-blue-400">{power.effects.recharge.toFixed(1)}s</span>
                </div>
              )}
              {power.effects.enduranceCost && (
                <div className="flex justify-between">
                  <span className="text-gray-400">End Cost</span>
                  <span className="text-cyan-400">{power.effects.enduranceCost.toFixed(2)}</span>
                </div>
              )}
              {power.effects.castTime && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Cast Time</span>
                  <span className="text-gray-300">{power.effects.castTime.toFixed(2)}s</span>
                </div>
              )}
              {power.effects.range && power.effects.range > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Range</span>
                  <span className="text-gray-300">{power.effects.range} ft</span>
                </div>
              )}
              {power.effects.radius && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Radius</span>
                  <span className="text-gray-300">{power.effects.radius} ft</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available Level */}
        <div>
          <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Available</h4>
          <p className="text-sm text-gray-300">Level {power.available + 1}</p>
        </div>

        {/* Max Slots */}
        <div>
          <h4 className="text-xs font-medium text-gray-400 uppercase mb-1">Max Slots</h4>
          <p className="text-sm text-gray-300">{power.maxSlots}</p>
        </div>
      </div>
    </div>
  );
}

interface EnhancementInfoProps {
  enhancementId: string;
}

function EnhancementInfo({ enhancementId }: EnhancementInfoProps) {
  // TODO: Implement enhancement info display
  return (
    <div className="h-full bg-gray-900/50 rounded-lg border border-gray-800 p-4">
      <div className="text-gray-500 text-sm">
        Enhancement: {enhancementId}
      </div>
    </div>
  );
}
