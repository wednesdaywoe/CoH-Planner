/**
 * Header component - top bar with build name, archetype, and controls
 */

import { useBuildStore, useUIStore } from '@/stores';
import { getArchetype } from '@/data';
import { Button, Select, Slider, Toggle } from '@/components/ui';
import type { ArchetypeId } from '@/types';

const ARCHETYPE_OPTIONS = [
  { value: '', label: 'Select Archetype' },
  // Heroes
  { value: 'blaster', label: 'Blaster' },
  { value: 'controller', label: 'Controller' },
  { value: 'defender', label: 'Defender' },
  { value: 'scrapper', label: 'Scrapper' },
  { value: 'tanker', label: 'Tanker' },
  { value: 'sentinel', label: 'Sentinel' },
  // Villains
  { value: 'brute', label: 'Brute' },
  { value: 'corruptor', label: 'Corruptor' },
  { value: 'dominator', label: 'Dominator' },
  { value: 'mastermind', label: 'Mastermind' },
  { value: 'stalker', label: 'Stalker' },
  // Epic
  { value: 'peacebringer', label: 'Peacebringer' },
  { value: 'warshade', label: 'Warshade' },
  { value: 'arachnos-soldier', label: 'Arachnos Soldier' },
  { value: 'arachnos-widow', label: 'Arachnos Widow' },
];

export function Header() {
  const build = useBuildStore((s) => s.build);
  const setArchetype = useBuildStore((s) => s.setArchetype);
  const setBuildName = useBuildStore((s) => s.setBuildName);
  const setLevel = useBuildStore((s) => s.setLevel);

  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const setGlobalIOLevel = useUIStore((s) => s.setGlobalIOLevel);
  const attunementEnabled = useUIStore((s) => s.attunementEnabled);
  const toggleAttunement = useUIStore((s) => s.toggleAttunement);

  const handleArchetypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setArchetype(value as ArchetypeId);
    }
  };

  return (
    <header className="bg-gray-900 border-b border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Left section: Build name and archetype */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={build.name}
            onChange={(e) => setBuildName(e.target.value)}
            placeholder="Build Name"
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1.5 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Select
            options={ARCHETYPE_OPTIONS}
            value={build.archetype?.name ? getArchetypeIdFromName(build.archetype.name) : ''}
            onChange={handleArchetypeChange}
            className="w-44"
          />

          {build.archetype.id && (
            <span className="text-gray-400 text-sm">
              {getArchetype(build.archetype.id)?.side === 'hero' ? 'Hero' : 'Villain'}
            </span>
          )}
        </div>

        {/* Center section: Level */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Level:</span>
            <span className="text-lg font-bold text-white">{build.level}</span>
          </div>
          <Slider
            value={build.level}
            min={1}
            max={50}
            onChange={(e) => setLevel(Number(e.target.value))}
            showValue={false}
            className="w-32"
          />
        </div>

        {/* Right section: IO Level and settings */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">IO Level:</span>
            <Slider
              value={globalIOLevel}
              min={10}
              max={50}
              onChange={(e) => setGlobalIOLevel(Number(e.target.value))}
              className="w-24"
            />
          </div>

          <Toggle
            checked={attunementEnabled}
            onChange={toggleAttunement}
            label="Attuned"
          />

          <Button variant="secondary" size="sm">
            Import/Export
          </Button>
        </div>
      </div>
    </header>
  );
}

/**
 * Helper to get archetype ID from display name
 * This is a workaround until we store the ID in the build
 */
function getArchetypeIdFromName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}
