import type { SupportTicket } from "@/types/supportTicket";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

import SupportTicketDetail from "@/components/ui/supportTicketDetail/SupportTicketDetail";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  MessageSquare,
  Send,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { supportTicketApi } from "@/services/privateApi/tenantApi";
import { toast } from "sonner";

interface TicketDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket | null;
  refetch: () => void;
}

export function TicketDetailDialog({
  open,
  onOpenChange,
  ticket,
  refetch,
}: TicketDetailDialogProps) {
  const { t: commonT } = useTranslation("common");
  const { t } = useTranslation("support");
  const [adminResponse, setAdminResponse] = useState(false);
  const [form, setForm] = useState({
    newStatus: "",
    statusChangeNotes: "",
  });
  const [loading, setLoading] = useState(false);

  const handleResponseChange = async () => {
    setLoading(true);
    if (!ticket) return;
    try {
      await supportTicketApi.respondToSolution(ticket.ticketId, form);
      toast.success("Response submitted successfully");
      setAdminResponse(false);
      setForm({ newStatus: "", statusChangeNotes: "" });
      onOpenChange(false);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit response");
    } finally {
      setLoading(false);
    }
  };

  if (!ticket) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{ticket.subject}</DialogTitle>
        </DialogHeader>

        <SupportTicketDetail ticket={ticket} />

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {commonT("button.close")}
          </Button>
          {(ticket.status === "resolved" || ticket.status === "escalated") && (
            <Button
              onClick={() => setAdminResponse(!adminResponse)}
              className="gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <p>{t("support.detail.solutionResponse")}</p>
              {adminResponse ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>

        {/* Admin Response Section */}
        {adminResponse && (
          <div className="mt-6 space-y-6 rounded-lg border border-slate-200 bg-linear-to-br from-slate-50 to-slate-100 p-6 dark:border-slate-700 dark:from-slate-900 dark:to-slate-800">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {t("support.response.title")}
                </h3>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {t("support.response.description")}
              </p>
            </div>

            {/* Response Options */}
            <div className="space-y-4">
              <Label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                {t("support.response.decision")}
              </Label>
              <RadioGroup
                value={form.newStatus}
                onValueChange={(value) =>
                  setForm({ ...form, newStatus: value })
                }
                className="space-y-3"
              >
                {/* Accept Option */}
                <Label
                  htmlFor="accept-solution"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-all hover:border-green-400 hover:bg-green-50 dark:border-slate-700 dark:hover:border-green-600 dark:hover:bg-green-900/20 cursor-pointer"
                >
                  <RadioGroupItem value="closed" id="accept-solution" />

                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />

                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {t("support.response.accept")}
                      </span>

                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {t("support.response.acceptDescription")}
                      </span>
                    </div>
                  </div>
                </Label>

                {/* Reject Option */}
                <Label
                  htmlFor="reject-solution"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 transition-all hover:border-red-400 hover:bg-red-50 dark:border-slate-700 dark:hover:border-red-600 dark:hover:bg-red-900/20 cursor-pointer"
                >
                  <RadioGroupItem value="escalated" id="reject-solution" />

                  <div className="flex items-center gap-2">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />

                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900 dark:text-slate-100">
                        {t("support.response.reject")}
                      </span>

                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {t("support.response.rejectDescription")}
                      </span>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>

            {/* Additional Notes - Show only when Reject is selected */}
            {form.newStatus === "escalated" && (
              <div className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/50 dark:bg-amber-900/20">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-5 rounded bg-amber-600" />
                  <Label
                    htmlFor="notes"
                    className="text-base font-semibold text-slate-900 dark:text-slate-100"
                  >
                    {t("support.response.rejectDetail")}
                  </Label>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 ml-3">
                  {t("support.response.rejectDetailDescription")}
                </p>
                <Textarea
                  id="notes"
                  placeholder={t("support.response.reasonPlaceholder")}
                  value={form.statusChangeNotes}
                  onChange={(e) =>
                    setForm({ ...form, statusChangeNotes: e.target.value })
                  }
                  className="ml-3 resize-none border-amber-300 bg-white dark:border-amber-900 dark:bg-slate-800"
                  rows={4}
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleResponseChange}
                disabled={loading || !form.newStatus}
                className="gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Send className="w-4 h-4" />
                {commonT("button.submitResponse")}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAdminResponse(false);
                  setForm({ newStatus: "", statusChangeNotes: "" });
                }}
                disabled={loading}
              >
                {commonT("button.cancel")}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
