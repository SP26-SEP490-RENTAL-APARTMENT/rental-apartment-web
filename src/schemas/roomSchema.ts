import z from "zod";

export const createRoomSchema = z.object({
  apartmentId: z.string(),
  title: z.string(),
  description: z.string(),
  roomType: z.enum([
    "private_single",
    "private_double",
    "shared_bed",
    "studio",
    "other",
  ]),
  bedType: z.enum(["single", "double", "queen", "king", "bunk", "shared"]),
  sizeSqm: z.number().min(1, "Size must be greater than or equal to 1 sqm"),
  isPrivateBathroom: z.boolean(),
});

export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomFormData = z.infer<typeof createRoomSchema>;
export type UpdateRoomFormData = z.infer<typeof updateRoomSchema>;