/**
 * Header component - top bar with build name, archetype, powersets, and controls
 * Matches the legacy app layout with archetype and powerset selectors in the header
 */

import { useBuildStore, useUIStore } from '@/stores';
import { getPowersetsForArchetype, MAX_LEVEL } from '@/data';
import { Button, Select, Slider, Toggle, Tooltip } from '@/components/ui';
import type { ArchetypeId, Powerset } from '@/types';

const ARCHETYPE_OPTIONS = [
  { value: '', label: 'Select Archetype...' },
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

// Support/buff/debuff powerset patterns (primary for Defender, secondary for most others)
const SUPPORT_PATTERNS = [
  'affinity',
  'miasma',
  'kinetics',
  'radiation emission',
  'cold domination',
  'force field',
  'empathy',
  'pain domination',
  'nature affinity',
  'poison',
  'sonic resonance',
  'storm summoning',
  'thermal radiation',
  'time manipulation',
  'traps',
  'trick arrow',
];

// Armor/defense powerset patterns (primary for Tanker/Brute, secondary for Scrapper/Stalker)
const ARMOR_PATTERNS = [
  'aura',
  'ninjitsu',
  'regeneration',
  'shield defense',
  'super reflexes',
  'willpower',
  'bio armor',
  'bio organic armor',
  'dark armor',
  'electric armor',
  'energy aura',
  'fiery aura',
  'ice armor',
  'invulnerability',
  'radiation armor',
  'stone armor',
  'psionic armor',
];

// Manipulation patterns (always secondary)
// Note: 'mastery' removed - it incorrectly caught 'Beast Mastery' (Mastermind primary)
const MANIPULATION_PATTERNS = [
  'manipulation',
  'devices',
  'martial combat',
];

/**
 * Determine if a powerset is primary based on archetype
 * - Defender: Support is PRIMARY, Blast is SECONDARY
 * - Tanker: Armor is PRIMARY, Melee is SECONDARY
 * - Brute: Melee is PRIMARY, Armor is SECONDARY
 * - Scrapper/Stalker: Melee is PRIMARY, Armor is SECONDARY
 * - Dominator: Control is PRIMARY, Assault is SECONDARY
 * - Most others: Attack is PRIMARY, Support/Manipulation is SECONDARY
 */
function isPrimaryPowerset(powerset: Powerset, archetypeId: string | null): boolean {
  const nameLower = powerset.name.toLowerCase();

  // Check if it's a support set
  const isSupport = SUPPORT_PATTERNS.some(pattern => nameLower.includes(pattern));

  // Check if it's an armor set
  const isArmor = ARMOR_PATTERNS.some(pattern => nameLower.includes(pattern));

  // Check if it's a manipulation set (always secondary)
  const isManipulation = MANIPULATION_PATTERNS.some(pattern => nameLower.includes(pattern));

  // Check if it's a control set (for Dominator/Controller)
  const isControl = nameLower.includes('control');

  // Check if it's an assault set (for Dominator)
  const isAssault = nameLower.includes('assault');

  // Special handling by archetype
  switch (archetypeId) {
    case 'defender':
      // Defender: Support is PRIMARY, Blast is SECONDARY
      return isSupport;

    case 'tanker':
      // Tanker: Armor is PRIMARY, Melee is SECONDARY
      return isArmor;

    case 'brute':
    case 'scrapper':
    case 'stalker':
      // Melee is PRIMARY, Armor is SECONDARY
      return !isArmor && !isManipulation;

    case 'dominator':
      // Dominator: Control is PRIMARY, Assault is SECONDARY
      return isControl && !isAssault;

    default:
      // Default: Attack/damage sets are primary, support/manipulation/armor are secondary
      if (isManipulation || isSupport || isArmor) {
        return false;
      }
      return true;
  }
}

export function Header() {
  const build = useBuildStore((s) => s.build);
  const setArchetype = useBuildStore((s) => s.setArchetype);
  const setBuildName = useBuildStore((s) => s.setBuildName);
  const setPrimary = useBuildStore((s) => s.setPrimary);
  const setSecondary = useBuildStore((s) => s.setSecondary);

  const setLevel = useBuildStore((s) => s.setLevel);
  const resetBuild = useBuildStore((s) => s.resetBuild);
  const clearPowers = useBuildStore((s) => s.clearPowers);

  const globalIOLevel = useUIStore((s) => s.globalIOLevel);
  const setGlobalIOLevel = useUIStore((s) => s.setGlobalIOLevel);
  const exemplarMode = useUIStore((s) => s.exemplarMode);
  const toggleExemplarMode = useUIStore((s) => s.toggleExemplarMode);
  const openExportImportModal = useUIStore((s) => s.openExportImportModal);

  const archetypeId = build.archetype.id;

  // Get powerset options based on selected archetype
  const allPowersets = archetypeId ? getPowersetsForArchetype(archetypeId) : [];
  const primaryPowersets = allPowersets.filter((ps) => isPrimaryPowerset(ps, archetypeId));
  const secondaryPowersets = allPowersets.filter((ps) => !isPrimaryPowerset(ps, archetypeId));

  const primaryOptions = [
    { value: '', label: 'Select Primary...' },
    ...primaryPowersets.filter((ps) => ps.id).map((ps) => ({
      value: ps.id as string,
      label: ps.name,
    })),
  ];

  const secondaryOptions = [
    { value: '', label: 'Select Secondary...' },
    ...secondaryPowersets.filter((ps) => ps.id).map((ps) => ({
      value: ps.id as string,
      label: ps.name,
    })),
  ];

  const handleArchetypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      setArchetype(value as ArchetypeId);
    }
  };

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPrimary(e.target.value);
  };

  const handleSecondaryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSecondary(e.target.value);
  };

  return (
    <header className="bg-slate-800 border-b border-slate-700 px-4 py-2">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Build name */}
        <input
          type="text"
          id="build-name"
          name="build-name"
          value={build.name}
          onChange={(e) => setBuildName(e.target.value)}
          placeholder="Build Name"
          className="bg-slate-700 border border-slate-600 rounded px-3 py-1.5 text-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40 min-w-[120px]"
        />

        {/* Archetype selector */}
        <Select
          id="archetype-select"
          name="archetype"
          options={ARCHETYPE_OPTIONS}
          value={archetypeId || ''}
          onChange={handleArchetypeChange}
          className="max-w-[200px] min-w-[125px]"
        />

        {/* Primary powerset selector */}
        <Select
          id="primary-select"
          name="primary"
          options={archetypeId ? primaryOptions : [{ value: '', label: 'Select Primary...' }]}
          value={build.primary.id || ''}
          onChange={handlePrimaryChange}
          className="max-w-[200px] min-w-[125px]"
          disabled={!archetypeId}
        />

        {/* Secondary powerset selector */}
        <Select
          id="secondary-select"
          name="secondary"
          options={archetypeId ? secondaryOptions : [{ value: '', label: 'Select Secondary...' }]}
          value={build.secondary.id || ''}
          onChange={handleSecondaryChange}
          className="max-w-[200px] min-w-[125px]"
          disabled={!archetypeId}
        />

        {/* Exemplar Mode toggle */}
        <Tooltip content="When enabled, set bonuses are suppressed based on build level (simulates exemplaring down)">
          <div className="flex items-center bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
            <Toggle
              id="exemplar-mode-toggle"
              name="exemplarMode"
              checked={exemplarMode}
              onChange={toggleExemplarMode}
              label="Exemplar"
            />
          </div>
        </Tooltip>

        {/* Level selector */}
        <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
          <span className="text-xs text-slate-400 font-semibold uppercase">Level</span>
          <span className="text-sm font-bold text-emerald-400 w-6">{build.level}</span>
          <Slider
            value={build.level}
            min={1}
            max={MAX_LEVEL}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="w-24"
            showValue={false}
            showRange={false}
          />
        </div>

        {/* IO Level slider */}
        <div className="flex items-center gap-1 bg-slate-700/50 px-2 py-1.5 rounded border border-slate-600">
          <span className="text-xs text-slate-400 font-semibold uppercase">IO</span>
          <span className="text-sm font-bold text-blue-400 w-6">{globalIOLevel}</span>
          <Slider
            value={globalIOLevel}
            min={10}
            max={50}
            onChange={(e) => setGlobalIOLevel(Number(e.target.value))}
            className="w-20"
            showValue={false}
            showRange={false}
          />
        </div>

        {/* Import/Export/Reset */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openExportImportModal()}
          title="Export your build to a file"
        >
          Export
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => openExportImportModal()}
          title="Import a build from a file"
        >
          Import
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (window.confirm('Are you sure you want to reset? This will clear your entire build.')) {
              resetBuild();
            }
          }}
          title="Reset build and start fresh"
        >
          New
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            if (window.confirm('Clear all powers and enhancements? Archetype and powerset selections will be kept.')) {
              clearPowers();
            }
          }}
          title="Clear powers and slots, keep archetype and powersets"
        >
          Clear
        </Button>
      </div>
    </header>
  );
}
