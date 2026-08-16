/**
 * ProcSettingsModal - Configure which proc categories contribute to dashboard stats
 */

import { useUIStore } from '@/stores';
import type { ProcSettings, ProcSettingsKey } from '@/stores/uiStore';
import { Modal, ModalBody, ModalFooter } from './Modal';
import { Button, Toggle } from '@/components/ui';

interface ProcCategory {
  key: ProcSettingsKey;
  label: string;
  description: string;
  colorClass: string;
}

const PROC_CATEGORIES: ProcCategory[] = [
  { key: 'damage', label: 'Damage Procs', description: 'Proc damage included in per-power DPS calculations', colorClass: 'text-red-400' },
  { key: 'recovery', label: 'Recovery & Endurance', description: 'Performance Shifter, Panacea, Numina\'s', colorClass: 'text-blue-300' },
  { key: 'regeneration', label: 'Regeneration & Heal', description: 'Numina\'s, Preventive Medicine', colorClass: 'text-green-300' },
  { key: 'recharge', label: 'Recharge', description: 'LotG +7.5% Recharge', colorClass: 'text-amber-400' },
  { key: 'toHit', label: 'ToHit', description: 'Kismet +6% ToHit', colorClass: 'text-yellow-400' },
  { key: 'defense', label: 'Defense', description: 'Reactive Defenses, Gladiator\'s Armor', colorClass: 'text-purple-400' },
  { key: 'resistance', label: 'Resistance', description: 'Aegis, Shield Wall, Steadfast', colorClass: 'text-orange-400' },
  { key: 'buildUp', label: 'Build Up', description: 'Decimation, Gaussian\'s (avg damage/tohit)', colorClass: 'text-yellow-300' },
  { key: 'movement', label: 'Movement & Other', description: 'Run Speed, KB Protection, Mez Resist', colorClass: 'text-teal-400' },
];

interface ProcSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProcSettingsModal({ isOpen, onClose }: ProcSettingsModalProps) {
  const procSettings = useUIStore((s) => s.procSettings);
  const toggleProcCategory = useUIStore((s) => s.toggleProcCategory);
  const setProcSettings = useUIStore((s) => s.setProcSettings);
  const foldProcsIntoFinalDamage = useUIStore((s) => s.foldProcsIntoFinalDamage);
  const toggleFoldProcsIntoFinalDamage = useUIStore((s) => s.toggleFoldProcsIntoFinalDamage);

  const enabledCount = Object.values(procSettings).filter(Boolean).length;
  const allEnabled = enabledCount === PROC_CATEGORIES.length;
  const noneEnabled = enabledCount === 0;

  const handleEnableAll = () => {
    const all: ProcSettings = { damage: true, recovery: true, regeneration: true, recharge: true, toHit: true, defense: true, resistance: true, buildUp: true, movement: true };
    setProcSettings(all);
  };

  const handleDisableAll = () => {
    const none: ProcSettings = { damage: false, recovery: false, regeneration: false, recharge: false, toHit: false, defense: false, resistance: false, buildUp: false, movement: false };
    setProcSettings(none);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Proc Settings"
      size="sm"
    >
      <ModalBody>
        <div className="px-1 py-1">
          <p className="text-sm text-gray-400 mb-3">
            Choose which proc categories are calculated in your powers and dashboard totals.
          </p>

          <div className="space-y-1">
            {PROC_CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                className="flex items-center justify-between px-3 py-2 rounded bg-slate-700/40 hover:bg-slate-700/60 transition-colors"
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className={`text-sm font-medium ${cat.colorClass}`}>
                    {cat.label}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {cat.description}
                  </div>
                </div>
                <Toggle
                  id={`proc-${cat.key}`}
                  name={cat.key}
                  checked={procSettings[cat.key]}
                  onChange={() => toggleProcCategory(cat.key)}
                />
              </div>
            ))}
          </div>

          {/* Display preference, not a calculation one — it moves the same proc
              damage from its own annotation line into the Final number. Kept
              apart from the categories above (and out of Enable/Disable All)
              because those decide what is COMPUTED. */}
          <div className="mt-4 pt-3 border-t border-slate-700">
            <div className="flex items-center justify-between px-3 py-2 rounded bg-slate-700/40 hover:bg-slate-700/60 transition-colors">
              <div className="flex-1 min-w-0 mr-3">
                <div className="text-sm font-medium text-cyan-400">
                  Procs in Final damage
                </div>
                <div className="text-xs text-gray-500">
                  Add proc damage to the Final number instead of listing it separately
                </div>
              </div>
              <Toggle
                id="proc-fold-final"
                name="foldProcsIntoFinalDamage"
                checked={foldProcsIntoFinalDamage}
                onChange={toggleFoldProcsIntoFinalDamage}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 px-3">
              Proc damage is flat — it does not scale with damage buffs and is not
              subject to the damage cap, so the (+%) under Final keeps excluding it
              either way.
            </p>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEnableAll}
            disabled={allEnabled}
          >
            Enable All
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisableAll}
            disabled={noneEnabled}
          >
            Disable All
          </Button>
          <span className="text-xs text-gray-500 ml-auto">
            {enabledCount}/{PROC_CATEGORIES.length} enabled
          </span>
        </div>
      </ModalFooter>
    </Modal>
  );
}
