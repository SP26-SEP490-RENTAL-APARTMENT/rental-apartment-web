import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import LandlordSideBar from "./LandlordSideBar";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { notificationApi } from "@/services/privateApi/tenantApi";
import NotifyButton from "@/components/ui/notification/NotifyButton";
import type { Notification } from "@/types/notification";

function LandlordLayout() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"unread" | "read">("unread");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async (readStatus: boolean) => {
    try {
      setLoading(true);

      const response = await notificationApi.getNotifications({
        page: 1,
        pageSize: 20,
        isRead: readStatus,
      });

      setNotifications(response.data.items ?? []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;

    fetchNotifications(tab === "read");
  }, [tab, open]);
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <LandlordSideBar />

        <main className="flex-1">
          <div className="p-4 flex justify-between items-center">
            <SidebarTrigger />
            <NotifyButton
              loading={loading}
              notifications={notifications}
              open={open}
              setOpen={setOpen}
              tab={tab}
              setTab={setTab}
            />
          </div>

          <div className="">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

export default LandlordLayout;
