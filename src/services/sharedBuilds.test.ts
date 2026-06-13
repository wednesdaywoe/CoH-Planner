import { describe, it, expect, vi, beforeEach, afterEach, type Mock } from 'vitest';

// Mock the Supabase singleton + auth store so we can drive shareBuild and
// inspect the payload it sends to the edge function.
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { refreshSession: vi.fn().mockResolvedValue({ error: null }) },
    functions: { invoke: vi.fn().mockResolvedValue({ data: { id: 'abc' }, error: null }) },
  },
}));
vi.mock('@/stores/authStore', () => ({
  useAuthStore: { getState: () => ({ user: { id: 'user-1' } }) },
}));

import { supabase } from '@/lib/supabase';
import {
  RateLimitError,
  RATE_LIMITS,
  formatRateLimitMessage,
  rateLimitHint,
  shareBuild,
} from './sharedBuilds';
import type { ShareBuildInput } from '@/types/shared';

const invoke = () => (supabase!.functions.invoke as Mock);

function baseInput(overrides: Partial<ShareBuildInput> = {}): ShareBuildInput {
  return {
    name: 'Test Build',
    description: '',
    author_name: '',
    server: '',
    tags: [],
    build_json: {
      version: '1',
      build: {
        name: 'Test Build',
        level: 50,
        archetype: { id: 'blaster', name: 'Blaster' },
        primary: { id: 'fire', name: 'Fire Blast' },
        secondary: { id: 'fire_manip', name: 'Fire Manipulation' },
      },
    } as unknown as ShareBuildInput['build_json'],
    ...overrides,
  };
}

/**
 * Visibility-preservation contract: a re-save (vault / quick-share) that omits
 * is_public must NOT send the field, so the backend leaves the row's current
 * public/private state untouched. Forcing is_public on update was reverting
 * builds the user had made public via the visibility toggle.
 */
describe('shareBuild is_public payload', () => {
  beforeEach(() => {
    // The suite runs in node (no DOM package); stub the globals shareBuild reads.
    vi.stubGlobal('window', { location: { origin: 'http://test' } });
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    });
    invoke().mockClear();
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('omits is_public from the payload when the caller does not set it', async () => {
    await shareBuild(baseInput({ existingId: 'row-1' }));
    const body = invoke().mock.calls[0][1].body;
    expect('is_public' in body).toBe(false);
    expect(body.existing_id).toBe('row-1');
  });

  it('sends is_public:false when explicitly creating a private entry', async () => {
    await shareBuild(baseInput({ is_public: false }));
    expect(invoke().mock.calls[0][1].body.is_public).toBe(false);
  });

  it('sends is_public:true when explicitly sharing publicly', async () => {
    await shareBuild(baseInput({ is_public: true }));
    expect(invoke().mock.calls[0][1].body.is_public).toBe(true);
  });
});

/**
 * The save/share rate limit is server-enforced and was previously invisible
 * until hit (raw "Rate limit exceeded" / a silent Quick-Share failure). These
 * pin the user-facing strings: the proactive hint, and the on-hit message with
 * a precise countdown (from the server's retryAfter) or a generic fallback.
 */
describe('rate-limit messaging', () => {
  it('proactive hint names the per-hour limit for each bucket', () => {
    expect(rateLimitHint('share')).toBe(`Up to ${RATE_LIMITS.share} public shares per hour.`);
    expect(rateLimitHint('vault')).toBe(`Up to ${RATE_LIMITS.vault} saved builds per hour.`);
  });

  it('formats a precise countdown when the server reports retryAfter', () => {
    const err = new RateLimitError({ action: 'share', limit: 10, retryAfterSeconds: 720, resetAt: null });
    expect(formatRateLimitMessage(err)).toBe("You've hit the hourly limit (10 public shares). Try again in ~12 mins.");
  });

  it('rounds up to whole minutes and uses singular for ~1 min', () => {
    const err = new RateLimitError({ action: 'vault', limit: 50, retryAfterSeconds: 30, resetAt: null });
    expect(formatRateLimitMessage(err)).toBe("You've hit the hourly limit (50 saved builds). Try again in ~1 min.");
  });

  it('falls back to a generic message when retryAfter is unknown (older server)', () => {
    const err = new RateLimitError({ action: 'share', limit: 10, retryAfterSeconds: 0, resetAt: null });
    expect(formatRateLimitMessage(err)).toBe("You've hit the hourly limit (10 public shares). Please try again within the hour.");
  });

  it('RateLimitError carries the bucket and limit', () => {
    const err = new RateLimitError({ action: 'vault', limit: 50, retryAfterSeconds: 100, resetAt: '2026-06-05T12:00:00Z' });
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('RateLimitError');
    expect(err.action).toBe('vault');
    expect(err.limit).toBe(50);
    expect(err.resetAt).toBe('2026-06-05T12:00:00Z');
  });
});
