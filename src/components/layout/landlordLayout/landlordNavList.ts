import {
  // LayoutDashboard,
  Home,
  CalendarCheck,
  Hotel,
  Layers,
  CreditCard,
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
    title: "Payments History",
    url: "/landlord/payments-history",
    icon: CreditCard,
  },
  {
    title: "My subscriptions",
    url: "/landlord/my-subscriptions",
    icon: Layers,
  },
];
