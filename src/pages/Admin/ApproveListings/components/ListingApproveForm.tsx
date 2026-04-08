import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  listingApproveSchema,
  type ListingApproveFormData,
} from "@/schemas/listingApproveSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  apartmentId: string;
  onSubmit: (data: ListingApproveFormData) => void;
}
function ListingApproveForm({ isOpen, onClose, apartmentId, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ListingApproveFormData>({
    resolver: zodResolver(listingApproveSchema),
    mode: "onTouched",
    defaultValues: {
      apartmentId: apartmentId,
      approved: true,
      rejectionReason: "",
    },
  });

  const approved = watch("approved");

  useEffect(() => {
    if (isOpen && apartmentId) {
      reset({
        apartmentId: apartmentId,
        approved: true,
        rejectionReason: "",
      });
    }
  }, [apartmentId, isOpen, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };
  const handleFormSubmit = async (data: ListingApproveFormData) => {
    try {
      await onSubmit(data);
      handleClose();
    } catch (error) {
      // Error handled in parent component
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Apartment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Document ID */}
            <div className="grid gap-2">
              <Label htmlFor="documentId">Document ID</Label>
              <div className="bg-gray-100 p-2 rounded text-sm break-all">
                {apartmentId}
              </div>
            </div>

            {/* Approval Decision */}
            <div className="grid gap-2">
              <Label>Decision</Label>
              <Controller
                name="approved"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    value={field.value ? "true" : "false"}
                    onValueChange={(val) => field.onChange(val === "true")}
                    className="flex gap-6"
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="true" id="approve" />
                      <Label htmlFor="approve" className="cursor-pointer">
                        Approve
                      </Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value="false" id="reject" />
                      <Label htmlFor="reject" className="cursor-pointer">
                        Reject
                      </Label>
                    </div>
                  </RadioGroup>
                )}
              />
            </div>

            {!approved && (
              <div className="grid gap-2">
                <Label htmlFor="rejectionReason">Rejection Reason *</Label>
                <Textarea
                  id="rejectionReason"
                  placeholder="Please provide a reason for rejection..."
                  {...register("rejectionReason")}
                  className="min-h-24"
                />
                {errors.rejectionReason && (
                  <p className="text-sm text-red-500">
                    {errors.rejectionReason.message}
                  </p>
                )}
              </div>
            )}

            {errors.approved && (
              <p className="text-sm text-red-500">{errors.approved.message}</p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant={approved ? "default" : "destructive"}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : approved ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default ListingApproveForm;
