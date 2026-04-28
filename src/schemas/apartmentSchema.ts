import z from "zod";

export const createApartmentSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    maxPets: z.number().min(0, "Max pets must be 0 or more").nullable(),
    description: z.string().min(1, "Description is required"),
    maxOccupants: z.number().min(1, "Max occupants must be at least 1"),
    isPetAllowed: z.boolean(),
    address: z.string().min(1),
    city: z.string().optional(),
    district: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
    basePricePerNight: z
      .number()
      .min(0, "Price must be greater than or equal to 0"),
  })
  .refine(
    (data) => {
      if (data.isPetAllowed) {
        return data.maxPets !== null && data.maxPets !== undefined;
      }
      return true;
    },
    {
      message: "Max pets is required when pets are allowed",
      path: ["maxPets"],
    },
  );

export const updateApartmentSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    maxPets: z.number().min(0, "Max pets must be 0 or more").nullable(),
    description: z.string().min(1, "Description is required"),
    maxOccupants: z.number().min(1, "Max occupants must be at least 1"),
    isPetAllowed: z.boolean(),
    address: z.string().min(1),
    city: z.string().optional(),
    district: z.string().optional(),
    latitude: z.number(),
    longitude: z.number(),
    basePricePerNight: z
      .number()
      .min(0, "Price must be greater than or equal to 0"),
  })
  .refine(
    (data) => {
      if (data.isPetAllowed) {
        return data.maxPets !== null && data.maxPets !== undefined;
      }
      return true;
    },
    {
      message: "Max pets is required when pets are allowed",
      path: ["maxPets"],
    },
  );

export type CreateApartmentFormData = z.infer<typeof createApartmentSchema>;
export type UpdateApartmentFormData = z.infer<typeof updateApartmentSchema>;
