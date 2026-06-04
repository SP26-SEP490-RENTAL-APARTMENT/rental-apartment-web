import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  inspectionChema,
  type InspectionFormData,
} from "@/schemas/inspectionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: InspectionFormData, files: File[]) => void;
}

function InspectionForm({ open, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InspectionFormData>({ resolver: zodResolver(inspectionChema) });
  const [files, setFiles] = useState<File[]>([]);
  const [previewMedia, setPreviewMedia] = useState<
    { url: string; type: "image" | "video" }[]
  >([]);

  const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

  const ALLOWED_VIDEO_TYPES = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/x-matroska",
    "video/webm",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    const validFiles = selectedFiles.filter((file) => {
      // Ảnh
      if (file.type.startsWith("image/")) {
        return true;
      }

      // Video
      if (ALLOWED_VIDEO_TYPES.includes(file.type)) {
        if (file.size > MAX_VIDEO_SIZE) {
          toast.error(`${file.name} can not exceed 100MB`);
          return false;
        }

        return true;
      }

      toast.error(`${file.name} is not a supported format`);
      return false;
    });

    const updatedFiles = [...files, ...validFiles];

    setFiles(updatedFiles);
    setValue("Photos", updatedFiles);

    const previews = validFiles.map((file) => ({
      url: URL.createObjectURL(file),
      type: file.type.startsWith("image/")
        ? ("image" as const)
        : ("video" as const),
    }));

    setPreviewMedia((prev) => [...prev, ...previews]);

    e.target.value = "";
  };

  const handleRemoveMedia = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previewMedia.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviewMedia(updatedPreviews);
    setValue("Photos", updatedFiles);
  };

  const handleFormSubmit = async (data: InspectionFormData) => {
    try {
      await onSubmit(data, files);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    reset();
    setFiles([]);
    setPreviewMedia([]);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Inspection Form</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Overall Condition</Label>
            <Input
              placeholder="Overall Condition"
              {...register("OverallCondition")}
            />
            {errors.OverallCondition && (
              <p className="text-red-500 text-sm">
                {errors.OverallCondition.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Issues</Label>
            <Textarea placeholder="Issues Found" {...register("IssuesFound")} />
            {errors.IssuesFound && (
              <p className="text-red-500 text-sm">
                {errors.IssuesFound.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Recommendations</Label>
            <Textarea
              placeholder="Recommendations"
              {...register("Recommendations")}
            />
            {errors.Recommendations && (
              <p className="text-red-500 text-sm">
                {errors.Recommendations.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Upload pictures</Label>

            <Input
              type="file"
              multiple
              accept="
    image/*,
    .mp4,
    .mov,
    .avi,
    .mkv,
    .webm
  "
              onChange={handleFileChange}
              className="cursor-pointer"
            />

            {errors.Photos && (
              <p className="text-red-500 text-sm">{errors.Photos.message}</p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-3">
            {previewMedia.map((item, index) => (
              <div key={index} className="relative group">
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                )}

                <button
                  type="button"
                  onClick={() => handleRemoveMedia(index)}
                  className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Button */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                reset();
                setPreviewMedia([]);
                onClose();
              }}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default InspectionForm;
