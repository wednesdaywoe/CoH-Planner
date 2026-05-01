/**
 * BuildFilters — search bar and filter dropdowns for the shared builds browser
 */

import { useState, useEffect, useRef } from 'react';
import { getArchetypeIds, getArchetype } from '@/data';
import { getPowersetsForArchetype } from '@/data/powersets';
import { searchAuthors, type AuthorSearchResult } from '@/services/profile';
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
          .filter((ps) => ps.category === 'primary')
          .map((ps) => ({ id: ps.id ?? '', name: ps.name }))
      );
      setSecondarySets(
        powersets
          .filter((ps) => ps.category === 'secondary')
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

        {/* Author autocomplete */}
        <AuthorAutocomplete
          onSelect={(result) =>
            onFiltersChange({
              ...filters,
              authorId: result.user_id,
              authorName: result.display_name,
              page: 1,
            })
          }
        />
      </div>
    </div>
  );
}

// ---- AuthorAutocomplete ----

interface AuthorAutocompleteProps {
  onSelect: (result: AuthorSearchResult) => void;
}

function AuthorAutocomplete({ onSelect }: AuthorAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<AuthorSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced fuzzy search
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const r = await searchAuthors(q, 8);
        setResults(r);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const handleSelect = (result: AuthorSearchResult) => {
    onSelect(result);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  const showDropdown = open && (loading || results.length > 0 || query.trim().length >= 2);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder="Search by author..."
        className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
      />

      {showDropdown && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-80 overflow-auto">
          {loading && (
            <div className="px-3 py-2 text-xs text-gray-500">Searching…</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-3 py-2 text-xs text-gray-500">No authors found.</div>
          )}
          {!loading &&
            results.map((r) => (
              <button
                key={r.user_id}
                type="button"
                onClick={() => handleSelect(r)}
                className="w-full text-left px-3 py-2 hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                {r.avatar_url ? (
                  <img src={r.avatar_url} alt="" className="w-6 h-6 rounded-full shrink-0" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-700 shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-white truncate">{r.display_name}</div>
                  {r.handle && (
                    <div className="text-xs text-gray-400 truncate">@{r.handle}</div>
                  )}
                </div>
                <span className="text-xs text-gray-500 shrink-0">
                  {r.build_count} build{r.build_count === 1 ? '' : 's'}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
