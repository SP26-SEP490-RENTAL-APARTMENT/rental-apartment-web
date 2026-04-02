import {
  LayoutDashboard,
  Home,
  CalendarCheck,
  Wallet,
  MessageCircle,
  Settings,
  Hotel,
} from "lucide-react";

export const landlordNavList = [
  {
    title: "Dashboard",
    url: "/landlord/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Apartments",
    url: "/landlord/apartments",
    icon: Hotel,
  },
  {
    title: "Rooms",
    url: "/landlord/rooms",
    icon: Home,
  },
  {
    title: "Bookings",
    url: "/landlord/bookings",
    icon: CalendarCheck,
  },
  {
    title: "Earnings",
    url: "/landlord/earnings",
    icon: Wallet,
  },
  {
    title: "Messages",
    url: "/landlord/messages",
    icon: MessageCircle,
  },
  {
    title: "Settings",
    url: "/landlord/settings",
    icon: Settings,
  },
];