import type { SupportTicket } from "@/types/supportTicket";
import { Separator } from "../separator";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "@/pages/Tenant/SupportRequest/components";
import { useTranslation } from "react-i18next";

function SupportTicketDetail({ ticket }: { ticket: SupportTicket }) {
  const { i18n, t } = useTranslation("support");
  const createdDate = new Date(ticket.createdAt);
  const updatedDate = new Date(ticket.updatedAt);
  return (
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

      {ticket.attachments && ticket.attachments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-700">{t("support.attachments")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ticket.attachments.map((attachment, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={attachment.fileUrl}
                    alt={`Attachment ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23f3f4f6' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='14' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3EImage Error%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
    </div>
  );
}

export default SupportTicketDetail;
