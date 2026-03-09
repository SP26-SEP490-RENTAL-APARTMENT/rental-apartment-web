import {
  LayoutDashboard,
  User,
  Box,
} from "lucide-react";

export const adminNavList = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
  },
  {
    title: "Subscription Plans",
    url: "/admin/subscription-plans",
    icon: Box,
  },
  // {
  //   title: "Bookings",
  //   url: "/admin/bookings",
  //   icon: CalendarCheck,
  // },
  // {
  //   title: "Earnings",
  //   url: "/admin/earnings",
  //   icon: Wallet,
  // },
  // {
  //   title: "Messages",
  //   url: "/admin/messages",
  //   icon: MessageCircle,
  // },
  // {
  //   title: "Settings",
  //   url: "/admin/settings",
  //   icon: Settings,
  // },
];
