import {
  LayoutDashboard,
  User,
  Box,
  Blocks,
  RollerCoaster,
  Ungroup,
  Package,
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
  {
    title: "Amenities",
    url: "/admin/amenities",
    icon: Blocks,
  },
  {
    title: "Nearby Attractions",
    url: "/admin/nearby-attractions",
    icon: RollerCoaster,
  },
  {
    title: "Package",
    url: "/admin/packages",
    icon: Package,
  },
  {
    title: "Package Items",
    url: "/admin/package-items",
    icon: Ungroup,
  },
];
