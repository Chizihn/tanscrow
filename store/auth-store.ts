import { User } from "@/types/user";
import { cookieStorage } from "@/utils/session";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface PersistAuth {
  user: Partial<User> | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthState extends PersistAuth {
  setUser: (user: Partial<User>) => void;
  setToken: (token: string | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),

      setToken: (token) =>
        set((state) => ({
          ...state,
          token,
        })),

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      logout: () => {
        cookieStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: "tanscrow-auth", // name of the persisted store
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
