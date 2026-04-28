import { useState } from "react";
import { supportTicketApi } from "@/services/privateApi/tenantApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTicketDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateTicketDialogProps) {
  const { t } = useTranslation("support");
  const { t: commonT } = useTranslation("common");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    category: "",
    priority: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categoryOptions = [
    { value: "booking_issue", label: t("support.categories.booking_issue") },
    {
      value: "payment_problem",
      label: t("support.categories.payment_problem"),
    },
    {
      value: "listing_problem",
      label: t("support.categories.listing_problem"),
    },
    {
      value: "account_verification",
      label: t("support.categories.account_verification"),
    },
    { value: "cancellation", label: t("support.categories.cancellation") },
    { value: "dispute", label: t("support.categories.dispute") },
    {
      value: "property_quality",
      label: t("support.categories.property_quality"),
    },
    { value: "other", label: t("support.categories.other") },
  ];

  const priorityOptions = [
    { value: "low", label: t("support.priorities.low") },
    { value: "medium", label: t("support.priorities.medium") },
    { value: "high", label: t("support.priorities.high") },
    { value: "urgent", label: t("support.priorities.urgent") },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = t("support.validation.subjectRequired");
    } else if (formData.subject.length < 5) {
      newErrors.subject = t("support.validation.subjectMinLength");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("support.validation.descriptionRequired");
    } else if (formData.description.length < 10) {
      newErrors.description = t("support.validation.descriptionMinLength");
    }

    if (!formData.category) {
      newErrors.category = t("support.validation.categoryRequired");
    }

    if (!formData.priority) {
      newErrors.priority = t("support.validation.priorityRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await supportTicketApi.createTicket({
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
      });

      toast.success(t("support.ticketCreatedSuccess"));
      setFormData({
        subject: "",
        description: "",
        category: "",
        priority: "",
      });
      setErrors({});
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message || t("support.createTicketError"),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("support.createTicket")}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">{t("support.fields.subject")}</Label>
            <Input
              id="subject"
              placeholder={t("support.placeholders.subject")}
              value={formData.subject}
              onChange={(e) => {
                setFormData({ ...formData, subject: e.target.value });
                if (errors.subject) {
                  setErrors({ ...errors, subject: "" });
                }
              }}
              disabled={loading}
              className={errors.subject ? "border-red-500" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-red-500">{errors.subject}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              {t("support.fields.description")}
            </Label>
            <Textarea
              id="description"
              placeholder={t("support.placeholders.description")}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description) {
                  setErrors({ ...errors, description: "" });
                }
              }}
              disabled={loading}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">{t("support.fields.category")}</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({ ...formData, category: value });
                if (errors.category) {
                  setErrors({ ...errors, category: "" });
                }
              }}
              disabled={loading}
            >
              <SelectTrigger
                id="category"
                className={errors.category ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("support.placeholders.category")} />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">{t("support.fields.priority")}</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => {
                setFormData({ ...formData, priority: value });
                if (errors.priority) {
                  setErrors({ ...errors, priority: "" });
                }
              }}
              disabled={loading}
            >
              <SelectTrigger
                id="priority"
                className={errors.priority ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("support.placeholders.priority")} />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-sm text-red-500">{errors.priority}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {commonT("button.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? commonT("button.creating") : commonT("button.create")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
