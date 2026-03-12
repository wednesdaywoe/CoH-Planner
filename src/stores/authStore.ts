/**
 * Auth Store — manages OAuth state (Discord, Google, Twitch)
 *
 * No persistence needed — Supabase persists the session in its own localStorage key.
 */

import { create } from 'zustand';
import { signInWithProvider, signOut, getSession, onAuthStateChange } from '@/services/auth';
import type { AuthProvider } from '@/services/auth';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  /** Current authenticated user (null if not logged in) */
  user: User | null;
  /** True during initial session check */
  loading: boolean;
  /** True once the first auth check has completed */
  initialized: boolean;
}

interface AuthActions {
  /** Initialize auth — call once on app mount. Returns unsubscribe function. */
  initialize: () => () => void;
  /** Sign in with an OAuth provider (defaults to Discord) */
  login: (provider?: AuthProvider) => Promise<void>;
  /** Sign out */
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  loading: true,
  initialized: false,

  initialize: () => {
    // Check existing session
    getSession().then((session) => {
      set({ user: session?.user ?? null, loading: false, initialized: true });
    }).catch(() => {
      set({ user: null, loading: false, initialized: true });
    });

    // Listen for auth changes (login, logout, token refresh)
    const unsubscribe = onAuthStateChange((user) => {
      set({ user, loading: false, initialized: true });
    });

    return unsubscribe;
  },

  login: async (provider: AuthProvider = 'discord') => {
    await signInWithProvider(provider);
  },

  logout: async () => {
    await signOut();
    set({ user: null });
  },
}));
