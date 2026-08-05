import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthChangeEvent, Session, User } from '@supabase/supabase-js';

// Capture the handler Supabase would be given so the test can drive arbitrary
// auth events through it.
let handler: ((event: AuthChangeEvent, session: Session | null) => void) | null = null;
const unsubscribe = vi.fn();

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      onAuthStateChange: (cb: (e: AuthChangeEvent, s: Session | null) => void) => {
        handler = cb;
        return { data: { subscription: { unsubscribe } } };
      },
    },
  },
}));

import { onAuthStateChange } from './auth';

const sessionFor = (id: string): Session =>
  ({ user: { id } as User }) as Session;

function fire(event: AuthChangeEvent, session: Session | null) {
  handler!(event, session);
}

beforeEach(() => {
  handler = null;
  unsubscribe.mockClear();
});

/**
 * Why this file exists: a same-user TOKEN_REFRESHED hands back a brand-new
 * `User` object. Forwarding it re-set the auth store with a fresh identity,
 * which retriggered every effect keyed on `user` — and since
 * updateBuildVisibility refreshes the session on every click, one visibility
 * toggle remounted the whole My Builds grid mid-write and reset the lock icon.
 */
describe('onAuthStateChange', () => {
  it('swallows a same-user TOKEN_REFRESHED', () => {
    const cb = vi.fn();
    onAuthStateChange(cb);

    fire('SIGNED_IN', sessionFor('user-1'));
    expect(cb).toHaveBeenCalledTimes(1);

    fire('TOKEN_REFRESHED', sessionFor('user-1'));
    fire('TOKEN_REFRESHED', sessionFor('user-1'));
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('still forwards USER_UPDATED for the same user (profile changes must propagate)', () => {
    const cb = vi.fn();
    onAuthStateChange(cb);

    fire('SIGNED_IN', sessionFor('user-1'));
    fire('USER_UPDATED', sessionFor('user-1'));
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it('forwards a TOKEN_REFRESHED that lands on a different user', () => {
    const cb = vi.fn();
    onAuthStateChange(cb);

    fire('SIGNED_IN', sessionFor('user-1'));
    fire('TOKEN_REFRESHED', sessionFor('user-2'));
    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'user-2' }));
  });

  it('forwards sign-out, and a later sign-in for the same user', () => {
    const cb = vi.fn();
    onAuthStateChange(cb);

    fire('SIGNED_IN', sessionFor('user-1'));
    fire('SIGNED_OUT', null);
    expect(cb).toHaveBeenLastCalledWith(null);

    fire('SIGNED_IN', sessionFor('user-1'));
    expect(cb).toHaveBeenCalledTimes(3);
    expect(cb).toHaveBeenLastCalledWith(expect.objectContaining({ id: 'user-1' }));
  });

  it('forwards the first event even when it is a TOKEN_REFRESHED', () => {
    const cb = vi.fn();
    onAuthStateChange(cb);

    fire('TOKEN_REFRESHED', sessionFor('user-1'));
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('unsubscribes the underlying subscription', () => {
    const stop = onAuthStateChange(vi.fn());
    stop();
    expect(unsubscribe).toHaveBeenCalledTimes(1);
  });
});
