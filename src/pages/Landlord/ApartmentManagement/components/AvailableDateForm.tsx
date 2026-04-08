import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addAvailableDateSchema,
  type AddAvailableDateFormData,
} from "@/schemas/availableDateSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Trash2, Plus } from "lucide-react";

export interface AvailableDateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AddAvailableDateFormData) => Promise<void>;
  // apartmentId: string;
}

function AvailableDateForm({
  isOpen,
  onClose,
  onSubmit,
  // apartmentId,
}: AvailableDateFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AddAvailableDateFormData>({
    resolver: zodResolver(addAvailableDateSchema),
    mode: "onTouched",
    defaultValues: {
      ranges: [{ startDate: new Date(), endDate: new Date(), reason: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ranges",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    reset({
      ranges: [{ startDate: new Date(), endDate: new Date(), reason: "" }],
    });
  }, [isOpen, reset]);

  const handleFormSubmit = async (data: AddAvailableDateFormData) => {
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleAddRange = () => {
    append({ startDate: new Date(), endDate: new Date(), reason: "" });
  };

  const handleRemoveRange = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Available Dates</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-3 bg-slate-50"
              >
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-medium">
                    Date Range {index + 1}
                  </Label>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveRange(index)}
                      disabled={isSubmitting}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>

                {/* Start Date */}
                <div className="grid gap-2">
                  <Label
                    htmlFor={`ranges.${index}.startDate`}
                    className="text-xs"
                  >
                    Start Date *
                  </Label>
                  <Input
                    id={`ranges.${index}.startDate`}
                    type="datetime-local"
                    disabled={isSubmitting}
                    {...register(`ranges.${index}.startDate`, {
                      valueAsDate: true,
                    })}
                  />
                  {errors.ranges?.[index]?.startDate && (
                    <p className="text-xs text-destructive">
                      {errors.ranges[index]?.startDate?.message}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div className="grid gap-2">
                  <Label
                    htmlFor={`ranges.${index}.endDate`}
                    className="text-xs"
                  >
                    End Date *
                  </Label>
                  <Input
                    id={`ranges.${index}.endDate`}
                    type="datetime-local"
                    disabled={isSubmitting}
                    {...register(`ranges.${index}.endDate`, {
                      valueAsDate: true,
                    })}
                  />
                  {errors.ranges?.[index]?.endDate && (
                    <p className="text-xs text-destructive">
                      {errors.ranges[index]?.endDate?.message}
                    </p>
                  )}
                </div>

                {/* Reason */}
                <div className="grid gap-2">
                  <Label htmlFor={`ranges.${index}.reason`} className="text-xs">
                    Reason *
                  </Label>
                  <Input
                    id={`ranges.${index}.reason`}
                    placeholder="e.g., Maintenance, Special Event, etc."
                    disabled={isSubmitting}
                    {...register(`ranges.${index}.reason`)}
                  />
                  {errors.ranges?.[index]?.reason && (
                    <p className="text-xs text-destructive">
                      {errors.ranges[index]?.reason?.message}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Error for ranges array */}
            {errors.ranges &&
              typeof errors.ranges === "object" &&
              "message" in errors.ranges && (
                <p className="text-sm text-destructive">
                  {(errors.ranges as any).message}
                </p>
              )}

            {/* Add More Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleAddRange}
              disabled={isSubmitting}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Date Range
            </Button>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Available Dates"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AvailableDateForm;
