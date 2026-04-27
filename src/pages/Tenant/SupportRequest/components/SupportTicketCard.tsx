import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, FileText } from "lucide-react";
import type { SupportTicket } from "@/types/supportTicket";
import { StatusBadge, PriorityBadge, CategoryBadge } from "./BadgeComponents";
import { formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useTranslation } from "react-i18next";

interface SupportTicketCardProps {
  ticket: SupportTicket;
  onView?: (ticket: SupportTicket) => void;
}

export function SupportTicketCard({ ticket, onView }: SupportTicketCardProps) {
  const { i18n, t } = useTranslation("support");
  const locale = i18n.language === "vi" ? vi : enUS;

  const createdDate = new Date(ticket.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true, locale });

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <CardHeader className="pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-500 shrink-0" />
              <CardTitle className="line-clamp-2">{ticket.subject}</CardTitle>
            </div>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {timeAgo}
            </p>
          </div>
          <StatusBadge value={ticket.status} />
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <CategoryBadge value={ticket.category} />
          <PriorityBadge value={ticket.priority} />
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
          {ticket.description}
        </p>

        {/* Resolution Info (if resolved) */}
        {ticket.status === "resolved" && ticket.resolutionNotes && (
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
            <p className="text-xs font-semibold text-green-900 mb-1">
              {t("resolutionNotes")}
            </p>
            <p className="text-xs text-green-800 line-clamp-2">
              {ticket.resolutionNotes}
            </p>
          </div>
        )}

        {/* Action Button */}
        <Button
          variant="ghost"
          className="w-full justify-between text-blue-600 hover:text-blue-700"
          onClick={() => onView?.(ticket)}
        >
          <span>{t("viewDetails")}</span>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
