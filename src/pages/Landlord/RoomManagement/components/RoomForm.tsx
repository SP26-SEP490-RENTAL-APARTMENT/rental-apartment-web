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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createRoomSchema,
  updateRoomSchema,
  type CreateRoomFormData,
  type UpdateRoomFormData,
} from "@/schemas/roomSchema";
import type { Apartment, Room } from "@/types/apartment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export interface Props {
  isOpen: boolean;
  mode: "create" | "update";
  onClose: () => void;
  onSubmit: (data: CreateRoomFormData | UpdateRoomFormData) => void;
  room: Partial<Room> | null;
  apartment: Apartment | null;
}
function RoomForm({ isOpen, mode, onClose, onSubmit, room, apartment }: Props) {
  const isCreate = mode === "create";
  const schema = isCreate ? createRoomSchema : updateRoomSchema;
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomFormData | UpdateRoomFormData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });
  const watchedIsActive = watch("isPrivateBathroom");
  useEffect(() => {
    if (isCreate) {
      reset({
        apartmentId: apartment?.apartmentId || "",
        bedType: "shared",
        description: "",
        isPrivateBathroom: false,
        roomType: "private_single",
        sizeSqm: 1,
        title: "",
      });
    } else if (room) {
      reset({
        apartmentId: room.apartmentId,
        bedType: room.bedType,
        description: room.description,
        isPrivateBathroom: room.isPrivateBathroom,
        roomType: room.roomType,
        sizeSqm: room.sizeSqm,
        title: room.title,
      });
    }
  }, [room, isCreate, reset, apartment?.apartmentId]);
  const handleFormSubmit = async (
      data: CreateRoomFormData | UpdateRoomFormData,
    ) => {
      try {
        await onSubmit(data);
        reset();
        onClose();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        /* empty */
      }
    };
  const handleClose = () => {
    reset();
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{isCreate ? "Create Room" : "Edit Room"}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            {/* NAME */}
            <div className="grid gap-2">
              <Label>Apartment</Label>
              <Input disabled type="text" {...register("apartmentId")} />
              {errors.apartmentId && (
                <p className="text-sm text-destructive">
                  {errors.apartmentId.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Title</Label>
              <Input type="text" {...register("title")} />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Description</Label>
              <Input type="text" {...register("description")} />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roomType">Room type</Label>
              <Controller
                name="roomType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="roomType">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private_single">
                        Private Single
                      </SelectItem>
                      <SelectItem value="private_double">
                        Private Double
                      </SelectItem>
                      <SelectItem value="shared_bed">Shared Bed</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.roomType && (
                <p className="text-sm text-destructive">
                  {errors.roomType.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="bedType">Bed type</Label>
              <Controller
                name="bedType"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger id="bedType">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="double">Double</SelectItem>
                      <SelectItem value="queen">Queen</SelectItem>
                      <SelectItem value="king">King</SelectItem>
                      <SelectItem value="bunk">Bunk</SelectItem>
                      <SelectItem value="shared">Shared</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bedType && (
                <p className="text-sm text-destructive">
                  {errors.bedType.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Size</Label>
              <Input
                type="number"
                {...register("sizeSqm", { valueAsNumber: true })}
              />
              {errors.sizeSqm && (
                <p className="text-sm text-destructive">
                  {errors.sizeSqm.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>Private bathroom</Label>
              <RadioGroup
                value={watchedIsActive ? "true" : "false"}
                onValueChange={(val) =>
                  setValue("isPrivateBathroom", val === "true")
                }
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="true" id="active-yes" />
                  <Label htmlFor="active-yes">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="active-no" />
                  <Label htmlFor="active-no">No</Label>
                </div>
              </RadioGroup>

              {errors.isPrivateBathroom && (
                <p className="text-sm text-destructive">
                  {errors.isPrivateBathroom.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Loading" : isCreate ? "Create" : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoomForm;
