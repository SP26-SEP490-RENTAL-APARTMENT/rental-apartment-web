import {
  // LayoutDashboard,
  Home,
  CalendarCheck,
  Hotel,
  Layers,
  CreditCard,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export const useLandlordNavList = () => {
  const {t} = useTranslation("label");
  return [
    // {
    //   title: "Dashboard",
    //   url: "/landlord/dashboard",
    //   icon: LayoutDashboard,
    // },
    {
      title: t("landlord.apartments"),
      url: "/landlord/apartments",
      icon: Hotel,
    },
    {
      title: t("landlord.rooms"),
      url: "/landlord/rooms",
      icon: Home,
    },
    {
      title: t("landlord.bookings"),
      url: "/landlord/booking-management",
      icon: CalendarCheck,
    },
    {
      title: t("landlord.payments"),
      url: "/landlord/payments-history",
      icon: CreditCard,
    },
    {
      title: t("landlord.subscriptions"),
      url: "/landlord/my-subscriptions",
      icon: Layers,
    },
  ];
};
