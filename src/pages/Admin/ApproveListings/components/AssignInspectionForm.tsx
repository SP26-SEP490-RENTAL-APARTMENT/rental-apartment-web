import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  assignInspectionSchema,
  type AssignInspectionFormData,
} from "@/schemas/assignInspection";
import { userManagementApi } from "@/services/privateApi/adminApi";
import type { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  apartmentId: string;
  onSubmit: (data: AssignInspectionFormData) => void;
}
function AssignInspectionForm({
  isOpen,
  onClose,
  apartmentId,
  onSubmit,
}: Props) {
  const [staffList, setStaffList] = useState<User[]>([]);

  const fetchStaffList = async () => {
    try {
      const response = await userManagementApi.getAllUsers({
        page: 1,
        pageSize: 30,
        search: "",
        sortBy: "fullName",
        sortOrder: "asc",
      });
      const staffOnly = response.data.items.filter(
        (user) => user.role === "staff",
      );

      setStaffList(staffOnly);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaffList();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignInspectionFormData>({
    resolver: zodResolver(assignInspectionSchema),
    mode: "onTouched",
    defaultValues: {
      apartmentId: apartmentId,
      inspectorId: "",
      scheduledDate: "",
    },
  });
  useEffect(() => {
    reset({
      apartmentId,
      inspectorId: "",
      scheduledDate: "",
    });
  }, [apartmentId, reset]);
  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: AssignInspectionFormData) => {
    await onSubmit(data);
    handleClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review Apartment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid gap-4 py-4">
            {/* Apartment */}
            {/* <div className="grid gap-2">
              <Label htmlFor="apartmentId">Apartment</Label>
              <input disabled id="apartmentId" {...register("apartmentId")} />
            </div> */}

            {/* Inspector */}
            <div className="grid gap-2">
              <Label htmlFor="inspectorId">Inspector *</Label>
              <select
                id="inspectorId"
                {...register("inspectorId")}
                className="border rounded px-3 py-2"
              >
                <option value="">Select inspector</option>
                {staffList.map((staff) => (
                  <option key={staff.userId} value={staff.userId}>
                    {staff.fullName}
                  </option>
                ))}
              </select>
              {errors.inspectorId && (
                <p className="text-sm text-red-500">
                  {errors.inspectorId.message}
                </p>
              )}
            </div>

            {/* Scheduled Date */}
            <div className="grid gap-2">
              <Label htmlFor="scheduledDate">Scheduled Date *</Label>
              <input
                type="date"
                {...register("scheduledDate")}
                className="border rounded px-3 py-2"
              />
              {errors.scheduledDate && (
                <p className="text-sm text-red-500">
                  {errors.scheduledDate.message}
                </p>
              )}
            </div>
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
            <Button type="submit" disabled={isSubmitting}>
              Assign
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AssignInspectionForm;
