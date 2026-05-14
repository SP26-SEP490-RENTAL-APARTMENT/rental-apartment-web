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
import { useTranslation } from "react-i18next";

export interface Props {
  isOpen: boolean;
  mode: "create" | "update";
  onClose: () => void;
  onSubmit: (data: CreateRoomFormData | UpdateRoomFormData) => void;
  room: Partial<Room> | null;
  apartment: Apartment | null;
}
function RoomForm({ isOpen, mode, onClose, onSubmit, room, apartment }: Props) {
  const { t } = useTranslation("landlord");
  const { t: statusT } = useTranslation("status");
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
          <DialogTitle>{isCreate ? t("apartment.room.createTitle") : t("apartment.room.updateTitle")}</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid gap-4 py-4">
            {/* NAME */}

            <Input disabled type="hidden" {...register("apartmentId")} />
            {errors.apartmentId && (
              <p className="text-sm text-destructive">
                {errors.apartmentId.message}
              </p>
            )}

            <div className="grid gap-2">
              <Label>{t("apartment.room.title")}</Label>
              <Input
                type="text"
                {...register("title")}
                placeholder={t("apartment.room.titlePlaceholder")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label>{t("apartment.room.description")}</Label>
              <Input
                type="text"
                {...register("description")}
                placeholder={t("apartment.room.descriptionPlaceholder")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="roomType">{t("apartment.room.type")}</Label>
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
                        {statusT("room.roomType.pSingle")}
                      </SelectItem>
                      <SelectItem value="private_double">
                        {statusT("room.roomType.pDouble")}
                      </SelectItem>
                      <SelectItem value="shared_bed">
                        {statusT("room.roomType.sBed")}
                      </SelectItem>
                      <SelectItem value="studio">
                        {statusT("room.roomType.studio")}
                      </SelectItem>
                      <SelectItem value="other">
                        {statusT("room.roomType.other")}
                      </SelectItem>
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
              <Label htmlFor="bedType">{t("apartment.room.bed")}</Label>
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
                      <SelectItem value="single">
                        {statusT("room.bedType.single")}
                      </SelectItem>
                      <SelectItem value="double">
                        {statusT("room.bedType.double")}
                      </SelectItem>
                      <SelectItem value="queen">
                        {statusT("room.bedType.queen")}
                      </SelectItem>
                      <SelectItem value="king">
                        {statusT("room.bedType.king")}
                      </SelectItem>
                      <SelectItem value="bunk">
                        {statusT("room.bedType.bunk")}
                      </SelectItem>
                      <SelectItem value="shared">
                        {statusT("room.bedType.shared")}
                      </SelectItem>
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
              <Label>{t("apartment.room.size")}</Label>
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
              <Label>{t("apartment.room.privateBathroom")}</Label>
              <RadioGroup
                value={watchedIsActive ? "true" : "false"}
                onValueChange={(val) =>
                  setValue("isPrivateBathroom", val === "true")
                }
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="true" id="active-yes" />
                  <Label htmlFor="active-yes">{t("apartment.infor.yes")}</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="false" id="active-no" />
                  <Label htmlFor="active-no">{t("apartment.infor.no")}</Label>
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
              {t("apartment.button.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isCreate ? t("apartment.room.create") : t("apartment.room.update")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RoomForm;
