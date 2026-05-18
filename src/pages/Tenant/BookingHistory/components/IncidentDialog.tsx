import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef } from "react";
import { occupiedIncident } from "@/services/privateApi/tenantApi";
import { toast } from "sonner";
import { Loader2, Trash2, Upload } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  bookingId?: string;
}

function IncidentDialog({ open, onClose, bookingId }: Props) {
  const [details, setDetails] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // Generate previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPreviews((prev) => [...prev, event.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!bookingId) {
      toast.error("Booking ID is missing");
      return;
    }

    if (!details.trim()) {
      toast.error("Please provide incident details");
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("Details", details);

      selectedFiles.forEach((file) => {
        formData.append("EvidencePhotos", file);
      });

      await occupiedIncident.reportIncident(bookingId, formData);
      toast.success("Incident reported successfully");
      handleClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to report incident");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDetails("");
    setSelectedFiles([]);
    setPreviews([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Report Incident</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Details Textarea */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Details *</label>
            <Textarea
              placeholder="Describe the incident in detail..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              disabled={loading}
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Evidence Photos *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="w-full flex flex-col items-center gap-2 p-4 text-center hover:bg-gray-50 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium">
                  Click to upload photos
                </span>
                <span className="text-xs text-gray-500">or drag and drop</span>
              </button>
            </div>
          </div>

          {/* Photo Preview Grid */}
          {previews.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Photos ({previews.length})
              </label>
              <div className="grid grid-cols-3 gap-3">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      disabled={loading}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end pt-4">
            <Button variant="outline" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                loading || !details.trim() || selectedFiles.length === 0
              }
              className="gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default IncidentDialog;
