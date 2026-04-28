import type { SupportTicket } from "@/types/supportTicket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

import { StatusBadge, PriorityBadge, CategoryBadge } from "./BadgeComponents";

interface TicketDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket | null;
}

export function TicketDetailDialog({
  open,
  onOpenChange,
  ticket,
}: TicketDetailDialogProps) {
  const { i18n, t } = useTranslation("support");
  const { t: commonT } = useTranslation("common");

  if (!ticket) return null;

  const createdDate = new Date(ticket.createdAt);
  const updatedDate = new Date(ticket.updatedAt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ticket.subject}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status and Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={ticket.status} />
              <CategoryBadge value={ticket.category} />
              <PriorityBadge value={ticket.priority} />
            </div>
          </div>

          <Separator />

          {/* Main Content */}
          <div className="space-y-4">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                {t("support.fields.description")}
              </h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">
                {ticket.description}
              </p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  {t("support.detail.createdAt")}
                </p>
                {/* <p className="text-sm text-gray-900">{createdTime}</p> */}
                <p className="text-xs text-gray-500 mt-1">
                  {createdDate.toLocaleString(
                    i18n.language === "vi" ? "vi-VN" : "en-US",
                  )}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  {t("support.detail.updatedAt")}
                </p>
                {/* <p className="text-sm text-gray-900">{updatedTime}</p> */}
                <p className="text-xs text-gray-500 mt-1">
                  {updatedDate.toLocaleString(
                    i18n.language === "vi" ? "vi-VN" : "en-US",
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Resolution Section (if exists) */}
          {(ticket.status === "resolved" || ticket.resolutionNotes) && (
            <>
              <Separator />
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <h3 className="text-sm font-semibold text-green-900">
                  {t("support.detail.resolutionNotes")}
                </h3>
                {ticket.resolutionNotes ? (
                  <p className="text-sm text-green-800 whitespace-pre-wrap">
                    {ticket.resolutionNotes}
                  </p>
                ) : (
                  <p className="text-sm text-green-700">
                    {t("support.detail.noResolutionNotes")}
                  </p>
                )}
                {ticket.resolvedAt && (
                  <p className="text-xs text-green-700 mt-2">
                    {t("support.detail.resolvedAt")}:{" "}
                    {new Date(ticket.resolvedAt).toLocaleString(
                      i18n.language === "vi" ? "vi-VN" : "en-US",
                    )}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Ticket ID for reference */}
          {/* <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Ticket ID:</span> {ticket.ticketId}
            </p>
          </div> */}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {commonT("button.close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
