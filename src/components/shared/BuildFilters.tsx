/**
 * BuildFilters — search bar and filter dropdowns for the shared builds browser
 */

import { useState, useEffect } from 'react';
import { getArchetypeIds, getArchetype } from '@/data';
import { getPowersetsForArchetype } from '@/data/powersets';
import type { SearchFilters } from '@/types/shared';

interface BuildFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function BuildFilters({ filters, onFiltersChange }: BuildFiltersProps) {
  const [searchInput, setSearchInput] = useState(filters.query ?? '');
  const archetypeIds = getArchetypeIds();

  // Get powersets for selected archetype
  const [primarySets, setPrimarySets] = useState<{ id: string; name: string }[]>([]);
  const [secondarySets, setSecondarySets] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (filters.archetype) {
      const powersets = getPowersetsForArchetype(filters.archetype);
      setPrimarySets(
        powersets
          .filter((ps) => ps.category === 'Primary')
          .map((ps) => ({ id: ps.id ?? '', name: ps.name }))
      );
      setSecondarySets(
        powersets
          .filter((ps) => ps.category === 'Secondary')
          .map((ps) => ({ id: ps.id ?? '', name: ps.name }))
      );
    } else {
      setPrimarySets([]);
      setSecondarySets([]);
    }
  }, [filters.archetype]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, query: searchInput.trim() || undefined, page: 1 });
  };

  const handleArchetypeChange = (archetype: string) => {
    onFiltersChange({
      ...filters,
      archetype: archetype || undefined,
      primarySet: undefined,
      secondarySet: undefined,
      page: 1,
    });
  };

  const selectClass =
    'bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search builds..."
          className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
        >
          Search
        </button>
      </form>

      {/* Filter row */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Archetype */}
        <select
          value={filters.archetype ?? ''}
          onChange={(e) => handleArchetypeChange(e.target.value)}
          className={selectClass}
        >
          <option value="">All Archetypes</option>
          {archetypeIds.map((id) => {
            const at = getArchetype(id);
            return (
              <option key={id} value={id}>
                {at?.name ?? id}
              </option>
            );
          })}
        </select>

        {/* Primary Powerset */}
        <select
          value={filters.primarySet ?? ''}
          onChange={(e) =>
            onFiltersChange({ ...filters, primarySet: e.target.value || undefined, page: 1 })
          }
          className={selectClass}
          disabled={!filters.archetype}
        >
          <option value="">All Primaries</option>
          {primarySets.map((ps) => (
            <option key={ps.id} value={ps.id}>
              {ps.name}
            </option>
          ))}
        </select>

        {/* Secondary Powerset */}
        <select
          value={filters.secondarySet ?? ''}
          onChange={(e) =>
            onFiltersChange({ ...filters, secondarySet: e.target.value || undefined, page: 1 })
          }
          className={selectClass}
          disabled={!filters.archetype}
        >
          <option value="">All Secondaries</option>
          {secondarySets.map((ps) => (
            <option key={ps.id} value={ps.id}>
              {ps.name}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy ?? 'newest'}
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              sortBy: e.target.value as 'newest' | 'views',
              page: 1,
            })
          }
          className={selectClass}
        >
          <option value="newest">Newest</option>
          <option value="views">Most Viewed</option>
        </select>
      </div>
    </div>
  );
}
