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
import type { OccupantFormData } from "@/schemas/occupantSchema";
import { useForm } from "react-hook-form";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (occupantData: OccupantFormData) => void;
}
function AddOccupantDialog({ open, onClose, onSubmit }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OccupantFormData>({
    defaultValues: {
      fullName: "",
      passportId: "",
      nationalIdCardNumber: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      nationality: "VN",
      sex: "male",
    },
  });
  const handleClose = () => {
    reset();
    onClose();
  };
  const handleFormSubmit = (data: OccupantFormData) => {
    try {
      onSubmit(data);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Occupant</DialogTitle>
        </DialogHeader>
        <form
          className="grid grid-cols-2 gap-4"
          onSubmit={handleSubmit(handleFormSubmit)}
        >
          <div className="grid gap-2">
            <Label>Full name</Label>
            <Input
              type="text"
              placeholder="Full name"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">
                {errors.fullName.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Passport ID</Label>
            <Input
              type="text"
              placeholder="Passport ID"
              {...register("passportId")}
            />
            {errors.passportId && (
              <p className="text-sm text-destructive">
                {errors.passportId.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>National ID Card Number</Label>
            <Input
              type="text"
              placeholder="National ID Card Number"
              {...register("nationalIdCardNumber")}
            />
            {errors.nationalIdCardNumber && (
              <p className="text-sm text-destructive">
                {errors.nationalIdCardNumber.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>DOB</Label>
            <Input type="date" placeholder="DOB" {...register("dateOfBirth")} />
            {errors.dateOfBirth && (
              <p className="text-sm text-destructive">
                {errors.dateOfBirth.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Nationality</Label>
            <select
              {...register("nationality")}
              className="border rounded px-3 py-2"
            >
              <option value="VN">Vietnam</option>
              <option value="OTHER">Other</option>
            </select>
            {errors.nationality && (
              <p className="text-sm text-destructive">
                {errors.nationality.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Gender</Label>
            <select {...register("sex")} className="border rounded px-3 py-2">
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.sex && (
              <p className="text-sm text-destructive">{errors.sex.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input type="email" placeholder="Email" {...register("email")} />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input type="tel" placeholder="Phone" {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label>Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setValue("proofPhoto", file as File, { shouldValidate: true });
              }}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading..." : "Add Occupant"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddOccupantDialog;
