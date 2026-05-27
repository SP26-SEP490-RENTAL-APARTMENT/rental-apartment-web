import { useLanguageStore } from "@/store/languageStore";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useSyncLanguage = () => {
  const { i18n } = useTranslation();
  const currentLanguage = useLanguageStore((state) => state.currentLanguage);

  useEffect(() => {
    if (i18n.language !== currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage]);
};
