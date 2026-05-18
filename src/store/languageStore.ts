import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "vi";
export type Role = "tenant" | "landlord" | "admin" | "staff";

interface LanguageState {
  preferredLanguage: Language;
  currentLanguage: Language;

  setPreferredLanguage: (lang: Language) => void;
  syncLanguageByRole: (role?: Role) => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      preferredLanguage: "en",
      currentLanguage: "en",

      setPreferredLanguage: (lang) =>
        set({
          preferredLanguage: lang,
          currentLanguage: lang,
        }),

      syncLanguageByRole: (role) => {
        const preferred = get().preferredLanguage;

        set({
          currentLanguage:
            role === "admin" || role === "staff"
              ? "en"
              : preferred,
        });
      },
    }),
    {
      name: "language-storage",
    }
  )
);