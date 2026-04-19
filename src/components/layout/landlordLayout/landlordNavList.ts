import {
  // LayoutDashboard,
  Home,
  CalendarCheck,
  Hotel,
  Layers,
} from "lucide-react";

export const landlordNavList = [
  // {
  //   title: "Dashboard",
  //   url: "/landlord/dashboard",
  //   icon: LayoutDashboard,
  // },
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
    url: "/landlord/booking-management",
    icon: CalendarCheck,
  },
  {
    title: "My subscriptions",
    url: "/landlord/my-subscriptions",
    icon: Layers,
  },
];