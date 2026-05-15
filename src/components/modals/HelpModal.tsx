/**
 * HelpModal - Searchable help system with category tabs and animated demos.
 */

import { useState, useMemo, useRef, useEffect, type ReactNode } from 'react';
import { Modal, ModalBody } from './Modal';
import {
  HELP_CATEGORIES,
  HELP_TOPICS,
  searchHelpTopics,
  getTopicsByCategory,
  type HelpCategory,
  type HelpTopic,
} from '@/data/help-topics';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** If provided when the modal opens, expand this topic and scroll it into view. */
  initialTopicId?: string | null;
}

export function HelpModal({ isOpen, onClose, initialTopicId }: HelpModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<HelpCategory | 'all'>('all');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const topicRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (isOpen) {
      // When opened with an initial topic, jump to its category, expand the
      // topic, and scroll to it — skip auto-focusing the search input so the
      // viewport doesn't snap back to the top.
      if (initialTopicId) {
        const topic = HELP_TOPICS.find((t) => t.id === initialTopicId);
        if (topic) {
          setActiveCategory(topic.category);
          setExpandedTopic(initialTopicId);
          // Wait for the topic list to render after the category change.
          const scrollTimer = setTimeout(() => {
            const el = topicRefs.current.get(initialTopicId);
            el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 50);
          return () => clearTimeout(scrollTimer);
        }
      }
      const timer = setTimeout(() => searchInputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
    setSearchQuery('');
    setActiveCategory('all');
    setExpandedTopic(null);
  }, [isOpen, initialTopicId]);

  const filteredTopics = useMemo(() => {
    let topics: HelpTopic[];

    if (searchQuery.trim()) {
      topics = searchHelpTopics(searchQuery);
      if (activeCategory !== 'all') {
        topics = topics.filter((t) => t.category === activeCategory);
      }
    } else if (activeCategory !== 'all') {
      topics = getTopicsByCategory(activeCategory);
    } else {
      topics = HELP_TOPICS;
    }

    return topics;
  }, [searchQuery, activeCategory]);

  const groupedTopics = useMemo(() => {
    if (activeCategory !== 'all') {
      const cat = HELP_CATEGORIES.find((c) => c.id === activeCategory);
      return cat ? [{ category: cat, topics: filteredTopics }] : [];
    }

    return HELP_CATEGORIES
      .map((cat) => ({
        category: cat,
        topics: filteredTopics.filter((t) => t.category === cat.id),
      }))
      .filter((group) => group.topics.length > 0);
  }, [filteredTopics, activeCategory]);

  const highlightMatch = (text: string): ReactNode => {
    if (!searchQuery.trim()) return text;
    const words = searchQuery.trim().split(/\s+/).filter(Boolean);
    const pattern = new RegExp(`(${words.map(escapeRegex).join('|')})`, 'gi');
    const parts = text.split(pattern);
    return parts.map((part, i) =>
      pattern.test(part)
        ? <mark key={i} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5">{part}</mark>
        : part
    );
  };

  const resultCount = filteredTopics.length;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton={true}>
      <ModalBody className="p-0">
        {/* Search bar */}
        <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-700 px-4 py-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help topics..."
              className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {searchQuery.trim() && (
            <div className="text-xs text-gray-500 mt-1">
              {resultCount} {resultCount === 1 ? 'result' : 'results'} found
            </div>
          )}
        </div>

        {/* Category tabs */}
        <div className="sticky top-[73px] z-10 bg-gray-900 border-b border-gray-700 px-4 py-2 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            <CategoryTab
              label="All"
              active={activeCategory === 'all'}
              onClick={() => setActiveCategory('all')}
              color="text-gray-300"
            />
            {HELP_CATEGORIES.map((cat) => (
              <CategoryTab
                key={cat.id}
                label={cat.label}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
                color={cat.color}
                count={
                  searchQuery.trim()
                    ? filteredTopics.filter((t) => t.category === cat.id).length
                    : undefined
                }
              />
            ))}
          </div>
        </div>

        {/* Topic list */}
        <div className="px-4 py-3 space-y-4">
          {groupedTopics.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No help topics match your search.</p>
              <p className="text-xs mt-1">Try different keywords or clear the search.</p>
            </div>
          ) : (
            groupedTopics.map((group) => (
              <div key={group.category.id}>
                {activeCategory === 'all' && (
                  <h3 className={`text-sm font-semibold ${group.category.color} mb-2 flex items-center gap-2`}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={group.category.icon} />
                    </svg>
                    {group.category.label}
                  </h3>
                )}

                <div className="space-y-1">
                  {group.topics.map((topic) => (
                    <HelpTopicItem
                      key={topic.id}
                      topic={topic}
                      expanded={expandedTopic === topic.id}
                      onToggle={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                      highlightMatch={highlightMatch}
                      onRef={(el) => {
                        if (el) topicRefs.current.set(topic.id, el);
                        else topicRefs.current.delete(topic.id);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </ModalBody>
    </Modal>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

function CategoryTab({
  label,
  active,
  onClick,
  color,
  count,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  color: string;
  count?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-xs rounded-md transition-colors whitespace-nowrap ${
        active
          ? `bg-gray-700 ${color} font-medium`
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      {label}
      {count !== undefined && count > 0 && (
        <span className="ml-1 text-[10px] opacity-70">({count})</span>
      )}
    </button>
  );
}

function HelpTopicItem({
  topic,
  expanded,
  onToggle,
  highlightMatch,
  onRef,
}: {
  topic: HelpTopic;
  expanded: boolean;
  onToggle: () => void;
  highlightMatch: (text: string) => ReactNode;
  onRef?: (el: HTMLDivElement | null) => void;
}) {
  const DemoComponent = topic.demoComponent;

  return (
    <div ref={onRef} className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-3 py-2 flex items-center gap-2 hover:bg-gray-800 transition-colors"
      >
        <svg
          className={`w-3.5 h-3.5 text-gray-500 transition-transform shrink-0 ${expanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-sm text-gray-200 font-medium">{highlightMatch(topic.title)}</span>
      </button>

      {expanded && (
        <div className="px-3 pb-3 pt-1 border-t border-gray-700/50 space-y-2">
          <p className="text-sm text-gray-400 leading-relaxed">
            {highlightMatch(topic.description)}
          </p>

          {topic.steps && topic.steps.length > 0 && (
            <ol className="space-y-1 text-sm text-gray-400 ml-1">
              {topic.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-xs text-gray-600 font-mono shrink-0 mt-0.5 w-4 text-right">
                    {i + 1}.
                  </span>
                  <span>{highlightMatch(step)}</span>
                </li>
              ))}
            </ol>
          )}

          {topic.tips && topic.tips.length > 0 && (
            <div className="bg-blue-900/20 border border-blue-800/30 rounded p-2 space-y-1">
              {topic.tips.map((tip, i) => (
                <p key={i} className="text-xs text-blue-300 flex items-start gap-1.5">
                  <span className="shrink-0">*</span>
                  {tip}
                </p>
              ))}
            </div>
          )}

          {DemoComponent && (
            <div className="bg-gray-900 rounded-lg border border-gray-600 p-3 mt-2">
              <DemoComponent />
            </div>
          )}

          {topic.mediaUrl && (
            <MediaEmbed url={topic.mediaUrl} type={topic.mediaType ?? 'gif'} />
          )}
        </div>
      )}
    </div>
  );
}

function MediaEmbed({ url, type }: { url: string; type: 'gif' | 'video' }) {
  if (type === 'video') {
    return (
      <video
        src={url}
        controls
        muted
        loop
        playsInline
        className="w-full rounded-lg border border-gray-600 mt-2"
      >
        Your browser does not support video playback.
      </video>
    );
  }

  return (
    <img
      src={url}
      alt="Demo animation"
      loading="lazy"
      className="w-full rounded-lg border border-gray-600 mt-2"
    />
  );
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
