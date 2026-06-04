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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatLocalDateTime } from "@/pages/Landlord/BookingManagement/components/formatTime";
import {
  assignInspectionSchema,
  type AssignInspectionFormData,
} from "@/schemas/assignInspection";
import { userManagementApi } from "@/services/privateApi/adminApi";
import type { UserProfile } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

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
  const [staffList, setStaffList] = useState<UserProfile[]>([]);

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
    control,
    formState: { errors, isSubmitting },
  } = useForm<AssignInspectionFormData>({
    resolver: zodResolver(assignInspectionSchema),
    mode: "onTouched",
    defaultValues: {
      apartmentId: apartmentId,
      inspectorId: "",
      scheduledDateTime: formatLocalDateTime(new Date()),
    },
  });
  useEffect(() => {
    reset({
      apartmentId,
      inspectorId: "",
      scheduledDateTime: formatLocalDateTime(new Date()),
    });
  }, [apartmentId, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: AssignInspectionFormData) => {
    const formattedData = {
      ...data,
      scheduledDateTime: new Date(data.scheduledDateTime).toISOString(),
    };

    await onSubmit(formattedData);
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
            {/* Inspector */}
            <div className="grid gap-2">
              <Label htmlFor="inspectorId">Inspector *</Label>
              <Controller
                name="inspectorId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inspector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {staffList.map((staff) => (
                          <SelectItem key={staff.userId} value={staff.userId}>
                            {staff.fullName}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.inspectorId && (
                <p className="text-sm text-red-500">
                  {errors.inspectorId.message}
                </p>
              )}
            </div>

            {/* Scheduled Date & Time */}
            <div className="grid gap-2">
              <Label htmlFor="scheduledDateTime">Scheduled Date & Time *</Label>
              <Input
                type="datetime-local"
                {...register("scheduledDateTime")}
                className="border rounded px-3 py-2"
              />
              {errors.scheduledDateTime && (
                <p className="text-sm text-red-500">
                  {errors.scheduledDateTime.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
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
