/**
 * Types for the shared builds feature (Supabase-backed public build repository)
 */

import type { BuildExport } from './build';

/** A build that has been shared to the public repository */
export interface SharedBuild {
  id: string;
  name: string;
  description: string;
  archetype: string;
  archetype_name: string;
  primary_set: string;
  primary_name: string;
  secondary_set: string;
  secondary_name: string;
  level: number;
  author_name: string;
  server: string;
  tags: string[];
  build_json: BuildExport;
  created_at: string;
  updated_at: string;
  views: number;
  /** User ID from Discord OAuth (null for anonymous builds) */
  user_id?: string | null;
}

/** Input for sharing a build */
export interface ShareBuildInput {
  name: string;
  description: string;
  author_name: string;
  server: string;
  tags: string[];
  build_json: BuildExport;
  /** If set, updates an existing build instead of creating a new one */
  existingId?: string;
}

/** Filters for searching shared builds */
export interface SearchFilters {
  archetype?: string;
  primarySet?: string;
  secondarySet?: string;
  query?: string;
  authorId?: string;
  authorName?: string;
  sortBy?: 'newest' | 'views';
  page?: number;
  pageSize?: number;
}

/** Paginated search result */
export interface SearchResult {
  builds: SharedBuild[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
