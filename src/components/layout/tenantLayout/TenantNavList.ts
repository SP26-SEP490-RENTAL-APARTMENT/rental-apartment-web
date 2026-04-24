import { useAuthStore } from "@/store/authStore";
import { Album, BookUser, History, IdCard } from "lucide-react";
import { useTranslation } from "react-i18next";

export const useTenantNavList = () => {
  const { t } = useTranslation("user");
  const { user } = useAuthStore();

  const isExactTenantLandlord = user?.roles.includes("tenant");

  return [
    {
      title: t("profile.profile"),
      url: "/tenant/profile",
      icon: BookUser,
    },
    {
      title: t("identityVerification.label"),
      url: "/tenant/identity",
      icon: IdCard,
    },
    ...(isExactTenantLandlord
      ? [
          {
            title: t("profile.myBookings"),
            url: "/tenant/booking-history",
            icon: History,
          },
          {
            title: t("profile.collections"),
            url: "/tenant/collections",
            icon: Album,
          },
        ]
      : []),
  ];
};
