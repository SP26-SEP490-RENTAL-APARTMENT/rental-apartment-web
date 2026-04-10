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
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    setValue("Photos", updatedFiles);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviewImages(updatedPreviews);
    setValue("Photos", updatedFiles);
  };

  const handleFormSubmit = async (data: InspectionFormData) => {
    try {
      await onSubmit(data, files);
      handleClose()
    } catch (error) {
      console.log(error);
    }
  };
  const handleClose = () => {
    reset();
    setFiles([]);
    setPreviewImages([]);
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill the form</DialogTitle>
        </DialogHeader>

        <div className="p-4 space-y-4">
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
              <Textarea
                placeholder="Issues Found"
                {...register("IssuesFound")}
              />
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
                accept="image/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />

              <p className="text-xs text-gray-500">Bạn có thể chọn nhiều ảnh</p>

              {errors.Photos && (
                <p className="text-red-500 text-sm">{errors.Photos.message}</p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {previewImages.map((src, index) => (
                <div key={index} className="relative group">
                  <img
                    src={src}
                    alt="preview"
                    className="w-full h-24 object-cover rounded-lg border"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Button */}
            <div className="flex gap-2 justify-end">
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>

              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  reset();
                  setPreviewImages([]);
                  onClose();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InspectionForm;
