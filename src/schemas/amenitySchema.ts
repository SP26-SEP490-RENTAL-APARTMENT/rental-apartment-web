import z from "zod";

export const createAmenitySchema = z.object({
  nameEn: z.string().optional(),
  nameVi: z.string().optional(),
});

export const updateAmenitySchema = z.object({
  nameEn: z.string().optional(),
  nameVi: z.string().optional(),
});

export type CreateAmenityFormData = z.infer<typeof createAmenitySchema>;
export type UpdateAmenityFormData = z.infer<typeof updateAmenitySchema>;