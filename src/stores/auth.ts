import type { UserPayload } from "@/types/auth";
import type { Corporate } from "@/types/corporate";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStoreState {
  isAuthenticated: boolean;
  user: UserPayload | null;
  token: string | null;

  selectedCorporate: string | null;
  userCorporate: Corporate[];

  login: (user: UserPayload, token: string) => void;

  setSelectedCorporate: (corporateId: string) => void;
  setUserCorporate: (corporate: Corporate[]) => void;

  logout: () => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,

      selectedCorporate: null,
      userCorporate: [],

      login: (user, token) =>
        set({
          isAuthenticated: true,
          user: user,
          token: token,
        }),

      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          token: null,
          selectedCorporate: null,
          userCorporate: [],
        }),

      setSelectedCorporate: (corporateId) =>
        set({ selectedCorporate: corporateId }),

      setUserCorporate: (corporates) =>
        set((state) => ({
          userCorporate: corporates,
          selectedCorporate:
            state.selectedCorporate ||
            (corporates.length > 0 ? corporates[0].corporate_id : null),
        })),
    }),
    {
      name: "auth-storage",
    },
  ),
);
