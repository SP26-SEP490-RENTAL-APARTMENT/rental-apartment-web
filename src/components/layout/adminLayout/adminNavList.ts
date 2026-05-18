import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  User,
  Box,
  Blocks,
  RollerCoaster,
  Ungroup,
  Package,
  Hotel,
  Search,
  Ticket,
  MessageSquareWarning,
} from "lucide-react";

export const useAadminNavList = () => {
  const { user } = useAuthStore();

  if (user?.role === "staff") {
    return [
      {
        title: "Inspection",
        url: "/admin/inspection",
        icon: Search,
      },
      {
        title: "Support",
        url: "/admin/support",
        icon: Ticket,
      },
    ];
  }

  return [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Apartments",
      url: "/admin/apartments",
      icon: Hotel,
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
    // {
    //   title: "Documents",
    //   url: "/admin/documents",
    //   icon: FileMinus,
    // },
    {
      title: "Approve Listings",
      url: "/admin/approve-listings",
      icon: Hotel,
    },
    {
      title: "Inspection",
      url: "/admin/inspection",
      icon: Search,
    },
    {
      title: "Support",
      url: "/admin/support",
      icon: Ticket,
    },
    {
      title: "Occupied Incidents",
      url: "/admin/occupied-management",
      icon: MessageSquareWarning,
    },
  ];
};
