import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface AuthState {
  token: string | null;
  token_expires_at: string | null;
  user: User | null;
  account_enabled: boolean;
  session: string | null;
  isAuthenticated: boolean;
  setAuthData: (data: {
    token: string;
    token_expires_at: string;
    user: User;
    account_enabled: boolean;
    session: string;
  }) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      token_expires_at: null,
      user: null,
      account_enabled: false,
      session: null,
      isAuthenticated: false,
      setAuthData: (data) =>
        set({
          token: data.token,
          token_expires_at: data.token_expires_at,
          user: data.user,
          account_enabled: data.account_enabled,
          session: data.session,
          isAuthenticated: true,
        }),
      clearAuth: () =>
        set({
          token: null,
          token_expires_at: null,
          user: null,
          account_enabled: false,
          session: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage", // unique name for localStorage key
    }
  )
);
