import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Textarea } from "@/components/ui/textarea";
import { formatLocalDateTime } from "./formatTime";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "@/constants/validTypeUpload";

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

function CheckInDialog({ open, onClose, onSubmit }: Props) {
  const { t } = useTranslation("landlord");
  const [actualCheckIn, setActualCheckIn] = useState(
    formatLocalDateTime(new Date()),
  );
  const [note, setNote] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<
    {
      url: string;
      type: "image" | "video";
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    const validFiles = files.filter((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not a supported file`);
        return false;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds 100MB limit`);
        return false;
      }

      return true;
    });

    setMediaFiles((prev) => [...prev, ...validFiles]);

    validFiles.forEach((file) => {
      const url = URL.createObjectURL(file);

      setPreviews((prev) => [
        ...prev,
        {
          url,
          type: file.type.startsWith("video/") ? "video" : "image",
        },
      ]);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    URL.revokeObjectURL(previews[index].url);

    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!actualCheckIn) {
      toast.error("Please select a check-in date and time");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ActualCheckIn", actualCheckIn);
      formData.append("Notes", note);

      // Add photos
      mediaFiles.forEach((file) => {
        formData.append("PhotoEvidence", file);
      });

      await onSubmit(formData);

      // Reset form
      setActualCheckIn(formatLocalDateTime(new Date()));
      setNote("");
      setMediaFiles([]);
      setPreviews([]);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Check-in failed");
      console.error("Check-in error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("booking.form.checkIn")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* DateTime Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("booking.form.checkInDate")}
              </label>
              <input
                type="datetime-local"
                value={actualCheckIn}
                onChange={(e) => setActualCheckIn(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>

            {/* Note Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("booking.form.notes")}
              </label>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("booking.form.notesPlaceholder")}
                className="border rounded-lg px-3 py-2 w-full min-h-24 resize-none"
              />
            </div>

            {/* Photo Evidence */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("booking.form.evidence")}
              </label>

              {/* Upload Button */}
              <div className="flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="
                          image/*,
                          video/mp4,
                          video/quicktime,
                          video/x-msvideo,
                          video/x-matroska,
                          video/webm
                        "
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {t("booking.form.uploadImage")}
                </Button>
              </div>

              {/* Photo Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-3 md:grid-cols-4">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                    >
                      {preview.type === "image" ? (
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={preview.url}
                          className="w-full h-full object-cover"
                          controls
                          muted
                        />
                      )}

                      <div className="absolute inset-10 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-start justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePhoto(index)}
                          className="text-white hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                {t("booking.form.cancel")}
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {t("booking.form.checkIn")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default CheckInDialog;
