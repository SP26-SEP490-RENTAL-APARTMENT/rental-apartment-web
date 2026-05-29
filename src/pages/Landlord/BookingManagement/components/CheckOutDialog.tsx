import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2, X, Upload, Eye } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { formatLocalDateTime } from "./formatTime";

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
}

function CheckOutDialog({ open, onClose, onSubmit }: Props) {
  const { t } = useTranslation("landlord");
  const [actualCheckOut, setActualCheckOut] = useState(
    formatLocalDateTime(new Date()),
  );
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [previewModal, setPreviewModal] = useState<{
    open: boolean;
    src: string;
  }>({ open: false, src: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not a valid image`);
        return false;
      }
      return true;
    });

    setPhotos((prev) => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!actualCheckOut) {
      toast.error("Please select a check-out date and time");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("ActualCheckOut", actualCheckOut);
      formData.append("Notes", note);

      // Add photos
      photos.forEach((photo) => {
        formData.append("PhotoEvidence", photo);
      });

      await onSubmit(formData);

      // Reset form
      setActualCheckOut(formatLocalDateTime(new Date()));
      setNote("");
      setPhotos([]);
      setPreviews([]);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Check-out failed");
      console.error("Check-out error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("booking.form.checkOut")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* DateTime Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("booking.form.checkOutDate")}
              </label>
              <input
                type="datetime-local"
                value={actualCheckOut}
                onChange={(e) => setActualCheckOut(e.target.value)}
                className="border rounded-lg px-3 py-2 w-full"
              />
            </div>

            {/* Note Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">
                {t("booking.form.notes")}
              </label>
              <textarea
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
                  accept="image/*"
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
                <span className="text-sm text-gray-500 py-2">
                  {t("booking.form.selectedPhotos")}: {photos.length}
                </span>
              </div>

              {/* Photo Previews */}
              {previews.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-3 sm:grid-cols-3 md:grid-cols-4">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative group rounded-lg overflow-hidden bg-gray-100 aspect-square"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setPreviewModal({ open: true, src: preview })
                          }
                          className="text-white hover:bg-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
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
                      <span className="absolute top-1 right-1 bg-blue-500 text-white text-xs rounded px-2 py-1">
                        {index + 1}
                      </span>
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
                {t("booking.form.checkOut")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      {previewModal.open && (
        <Dialog
          open={previewModal.open}
          onOpenChange={() => setPreviewModal({ ...previewModal, open: false })}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
            </DialogHeader>
            <div className="w-full flex justify-center">
              <img
                src={previewModal.src}
                alt="Preview"
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

export default CheckOutDialog;
