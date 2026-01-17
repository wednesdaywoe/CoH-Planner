/**
 * IOSetList component - displays a list of IO sets
 */

import type { IOSet, IOSetRarity } from '@/types';
import { RarityBadge } from '@/components/ui';

interface IOSetListProps {
  sets: IOSet[];
  selectedSetId?: string | null;
  onSelectSet: (set: IOSet) => void;
}

export function IOSetList({ sets, selectedSetId, onSelectSet }: IOSetListProps) {
  if (sets.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No IO sets found for this category
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {sets.map((set) => (
        <IOSetListItem
          key={set.id}
          set={set}
          isSelected={set.id === selectedSetId}
          onClick={() => onSelectSet(set)}
        />
      ))}
    </div>
  );
}

interface IOSetListItemProps {
  set: IOSet;
  isSelected: boolean;
  onClick: () => void;
}

function IOSetListItem({ set, isSelected, onClick }: IOSetListItemProps) {
  const iconPath = set.icon ? `/img/Enhancements/${set.icon}` : '/img/Unknown.png';
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 p-2 rounded
        transition-colors text-left
        ${
          isSelected
            ? 'bg-blue-900/30 border-2 border-blue-500'
            : 'bg-gray-800 border border-gray-700 hover:border-gray-600'
        }
      `}
    >
      <img
        src={iconPath}
        alt=""
        className="w-8 h-8 rounded"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/img/Unknown.png';
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-200 truncate">{set.name}</span>
          <RarityBadge rarity={set.category as IOSetRarity} />
        </div>
        <div className="text-xs text-gray-500">
          Level {set.minLevel}-{set.maxLevel} • {set.pieces.length} pieces
        </div>
      </div>
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

/**
 * Category filter tabs for IO sets
 */
interface CategoryFilterProps {
  categories: { id: string; label: string; count: number }[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-700">
      <button
        onClick={() => onSelectCategory(null)}
        className={`
          px-3 py-1 rounded text-sm transition-colors
          ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }
        `}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelectCategory(cat.id)}
          className={`
            px-3 py-1 rounded text-sm transition-colors
            ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }
          `}
        >
          {cat.label} ({cat.count})
        </button>
      ))}
    </div>
  );
}
