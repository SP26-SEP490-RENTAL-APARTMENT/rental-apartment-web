import { useAuthStore } from "@/store/authStore";
import { Album, BookUser, CreditCard, History, Wrench } from "lucide-react";
import { useTranslation } from "react-i18next";

export const useTenantNavList = () => {
  const { t } = useTranslation("user");
  const {t: paymentT} = useTranslation("paymentHistory");
  const { user } = useAuthStore();

  const isExactTenantLandlord = user?.roles.includes("tenant");

  return [
    {
      title: t("profile.profile"),
      url: "/tenant/profile",
      icon: BookUser,
    },
    {
      title: t("support.label"),
      url: "/tenant/support-request",
      icon: Wrench,
    },
    // {
    //   title: t("identityVerification.label"),
    //   url: "/tenant/identity",
    //   icon: IdCard,
    // },
    ...(isExactTenantLandlord
      ? [
          {
            title: t("booking.label"),
            url: "/tenant/booking-history",
            icon: History,
          },
          {
            title: paymentT("payment.title"),
            url: "/tenant/payment-history",
            icon: CreditCard,
          },
          {
            title: t("collection.label"),
            url: "/tenant/collections",
            icon: Album,
          },
        ]
      : []),
  ];
};
