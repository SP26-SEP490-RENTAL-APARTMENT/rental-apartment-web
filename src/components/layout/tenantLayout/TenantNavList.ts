import { useAuthStore } from "@/store/authStore";
import { Album, BookUser, History, IdCard } from "lucide-react";
import { useTranslation } from "react-i18next";

export const useTenantNavList = () => {
  const { t: tenantT } = useTranslation("tenant");
  const { user } = useAuthStore();

  const isExactTenantLandlord = user?.roles.includes("tenant");

  return [
    {
      title: tenantT("profile"),
      url: "/tenant/profile",
      icon: BookUser,
    },
    {
      title: tenantT("identityStatus"),
      url: "/tenant/identity",
      icon: IdCard,
    },
    ...(isExactTenantLandlord
      ? [
          {
            title: tenantT("myBookings"),
            url: "/tenant/booking-history",
            icon: History,
          },
          {
            title: tenantT("collections"),
            url: "/tenant/collections",
            icon: Album,
          },
        ]
      : []),
  ];
};
