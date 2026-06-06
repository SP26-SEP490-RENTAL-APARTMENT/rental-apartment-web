import {
  Bell,
  CalendarDays,
  CheckCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CreditCard,
  ShieldCheck,
  ShieldX,
  Building2,
  ClipboardCheck,
  Ticket,
  Star,
  MessageSquare,
} from "lucide-react";
import type { Notification } from "@/types/notification";
import { notificationApi } from "@/services/privateApi/tenantApi";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Props {
  data: Notification;
  onNotificationRead?: () => void;
}

function NotifyItem({ data, onNotificationRead }: Props) {
  const { i18n } = useTranslation();
  
  const handleReadNotification = async () => {
    try {
      await notificationApi.markAsRead(data.notificationId);
      toast.success(i18n.language === "vi" ? "Thông báo đã được đánh dấu là đã đọc" : "Notification marked as read");
      onNotificationRead?.();
    } catch (error) {
      toast.error("Failed to mark notification as read");
      console.log(error);
    }
  };
  const notificationIcons: Record<string, React.ReactNode> = {
    // Booking
    booking_created: <CalendarDays className="h-5 w-5 text-blue-500" />,
    booking_confirmed: <CheckCircle2 className="h-5 w-5 text-green-500" />,
    booking_cancelled: <XCircle className="h-5 w-5 text-red-500" />,
    booking_upcoming: <CalendarDays className="h-5 w-5 text-amber-500" />,

    // Payment
    payment_success: <CreditCard className="h-5 w-5 text-green-500" />,
    payment_failed: <CreditCard className="h-5 w-5 text-red-500" />,

    // Identity
    identity_verified: <ShieldCheck className="h-5 w-5 text-green-500" />,
    identity_rejected: <ShieldX className="h-5 w-5 text-red-500" />,

    // Listing
    listing_approved: <Building2 className="h-5 w-5 text-green-500" />,
    listing_rejected: <Building2 className="h-5 w-5 text-red-500" />,

    // Inspection
    inspection_scheduled: <ClipboardCheck className="h-5 w-5 text-amber-500" />,
    inspection_completed: <ClipboardCheck className="h-5 w-5 text-green-500" />,

    // Support
    support_ticket_created: <Ticket className="h-5 w-5 text-blue-500" />,
    support_ticket_update: <Ticket className="h-5 w-5 text-amber-500" />,
    support_ticket_resolved: <Ticket className="h-5 w-5 text-green-500" />,

    // Review
    review_reminder: <Star className="h-5 w-5 text-yellow-500" />,

    // Message
    new_message: <MessageSquare className="h-5 w-5 text-blue-500" />,

    // System
    system_announcement: <AlertTriangle className="h-5 w-5 text-orange-500" />,

    // Other
    other: <Bell className="h-5 w-5 text-slate-500" />,
  };

  const getNotificationIcon = (type: string) => {
    return (
      notificationIcons[type] ?? <Bell className="h-5 w-5 text-slate-500" />
    );
  };

  const formatTime = (date: string) => {
    const now = new Date().getTime();
    const created = new Date(date).getTime();

    const diffMinutes = Math.floor((now - created) / 1000 / 60);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div
      className={`
        relative flex items-center gap-3 p-4
        border-b transition-all duration-200
        hover:bg-slate-50
        ${!data.isRead ? "bg-blue-50/60" : ""}
      `}
    >
      {!data.isRead && (
        <div className="absolute top-5 left-2 w-2 h-2 rounded-full bg-blue-500" />
      )}

      <div>{getNotificationIcon(data.type)}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`text-sm ${
              !data.isRead ? "font-semibold" : "font-medium"
            }`}
          >
            {i18n.language === "vi" ? data.titleVi : data.title}
          </h4>

          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatTime(data.createdAt)}
          </span>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
          {i18n.language === "vi" ? data.messageVi : data.message}
        </p>
      </div>

      <div>
        {!data.isRead && (
          <CheckCircle
            className="h-5 w-5 text-green-500 cursor-pointer"
            onClick={handleReadNotification}
          />
        )}
      </div>
    </div>
  );
}

export default NotifyItem;
