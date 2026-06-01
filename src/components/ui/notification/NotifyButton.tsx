import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { Button } from "../button";
import { ArrowUpRightIcon, Bell } from "lucide-react";
import IsReadTabs from "./IsReadTabs";
import type { Notification } from "@/types/notification";
import { notificationApi } from "@/services/privateApi/tenantApi";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  tab: "unread" | "read";
  setTab: (value: "unread" | "read") => void;
  notifications: Notification[];
  loading: boolean;
}

function NotifyButton({
  open,
  setOpen,
  tab,
  setTab,
  notifications,
  loading,
}: Props) {
  const handleMarkAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      toast.success("All notifications marked as read");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
      console.log(error);
    }
  };
  return (
    <DropdownMenu
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (value) {
          // mỗi lần mở mặc định về Unread
          setTab("unread");
        }
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="flex items-center gap-2">
          <Bell size={20} />
          Notifications
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-105 p-0">
        <IsReadTabs
          tab={tab}
          setTab={setTab}
          notiList={notifications}
          loading={loading}
          onNotificationRead={() => setOpen(false)}
        />
        <div className="bg-muted flex justify-end">
          <Button
            className="cursor-pointer"
            variant="secondary"
            size="sm"
            onClick={handleMarkAllAsRead}
          >
            Read all <ArrowUpRightIcon size={16} />
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotifyButton;
