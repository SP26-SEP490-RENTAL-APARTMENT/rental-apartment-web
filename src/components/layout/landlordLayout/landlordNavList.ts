import {
  LayoutDashboard,
  Home,
  CalendarCheck,
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
    url: "/landlord/booking-management",
    icon: CalendarCheck,
  },
];