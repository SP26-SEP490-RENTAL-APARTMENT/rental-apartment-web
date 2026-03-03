import {
  LayoutDashboard,
  Home,
  CalendarCheck,
  Wallet,
  MessageCircle,
  Settings,
} from "lucide-react";

export const adminNavList = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Apartments",
    url: "/admin/apartments",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "/admin/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Earnings",
    url: "/admin/earnings",
    icon: Wallet,
  },
  {
    title: "Messages",
    url: "/admin/messages",
    icon: MessageCircle,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];