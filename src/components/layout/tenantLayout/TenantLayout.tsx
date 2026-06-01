import { Outlet } from "react-router-dom";
import TenantSideBar from "./TenantSideBar";
import { useEffect, useState } from "react";
import type { Notification } from "@/types/notification";
import { notificationApi } from "@/services/privateApi/tenantApi";
import NotifyButton from "@/components/ui/notification/NotifyButton";

function TenantLayout() {
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
    <div className="flex min-h-screen bg-gray-50">
      <TenantSideBar />

      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow fixed top-0 right-0 left-64 z-10">
          <div className="m-6 flex items-center justify-between px-6">
            <h1 className="bg-linear-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent text-3xl font-bold">
              Account Center
            </h1>
            <NotifyButton
              open={open}
              setOpen={setOpen}
              tab={tab}
              setTab={setTab}
              notifications={notifications}
              loading={loading}
            />
          </div>
        </header>

        <div className="pt-20">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default TenantLayout;
