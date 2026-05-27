import { useState, useRef, useEffect } from "react";
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
import { Loader2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface FilePreview {
  file: File;
  preview: string;
  id: string;
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
  const [selectedFiles, setSelectedFiles] = useState<FilePreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup function to revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      selectedFiles.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
    };
  }, []);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    Array.from(files).forEach((file) => {
      // Validate file size
      if (file.size > maxSize) {
        toast.error(
          t("support.validation.fileSizeTooLarge") ||
            `File ${file.name} quá lớn (max 5MB)`,
        );
        return;
      }

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          t("support.validation.invalidFileType") ||
            `File ${file.name} không hỗ trợ`,
        );
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        const preview: FilePreview = {
          file,
          preview: reader.result as string,
          id: Math.random().toString(36).substr(2, 9),
        };
        setSelectedFiles((prev) => [...prev, preview]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => {
      const newFiles = prev.filter((f) => f.id !== id);
      // Revoke the object URL to free up memory
      const removedFile = prev.find((f) => f.id === id);
      if (removedFile) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return newFiles;
    });
  };

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
      // Create FormData to handle file uploads
      const formDataToSend = new FormData();
      formDataToSend.append("subject", formData.subject);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("priority", formData.priority);

      // Append files if any
      selectedFiles.forEach((filePreview) => {
        formDataToSend.append("files", filePreview.file);
      });

      await supportTicketApi.createTicket(formDataToSend);

      toast.success(t("support.ticketCreatedSuccess"));
      setFormData({
        subject: "",
        description: "",
        category: "",
        priority: "",
      });
      // Clean up file previews
      selectedFiles.forEach((file) => {
        URL.revokeObjectURL(file.preview);
      });
      setSelectedFiles([]);
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
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (!newOpen) {
          // Clean up when dialog closes
          selectedFiles.forEach((file) => {
            URL.revokeObjectURL(file.preview);
          });
          setSelectedFiles([]);
          setFormData({
            subject: "",
            description: "",
            category: "",
            priority: "",
          });
          setErrors({});
        }
        onOpenChange(newOpen);
      }}
    >
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
          <div className="flex justify-between">
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
                  <SelectValue
                    placeholder={t("support.placeholders.category")}
                  />
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
                  <SelectValue
                    placeholder={t("support.placeholders.priority")}
                  />
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
          </div>

          {/* Files */}
          <div className="space-y-2">
            <Label htmlFor="files">{t("support.uploadImage")}</Label>
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                id="files"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={loading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {commonT("button.browse")}
              </Button>
            </div>

            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-sm font-medium">
                  Selected ({selectedFiles.length})
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedFiles.map((filePreview) => (
                    <div
                      key={filePreview.id}
                      className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                    >
                      <img
                        src={filePreview.preview}
                        alt={filePreview.file.name}
                        className="w-full h-24 object-cover relative z-10"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto z-20">
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(filePreview.id)}
                          className="bg-white rounded-full p-1 hover:bg-red-500 hover:text-white transition-colors"
                          title={t("common.remove") || "Xóa"}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="px-2 py-1 text-xs truncate text-gray-700">
                        {filePreview.file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
