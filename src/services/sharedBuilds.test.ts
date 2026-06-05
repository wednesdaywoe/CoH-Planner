import { describe, it, expect } from 'vitest';
import {
  RateLimitError,
  RATE_LIMITS,
  formatRateLimitMessage,
  rateLimitHint,
} from './sharedBuilds';

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
