import z from "zod";

export const userProfileSchema = z.object({
    email: z.string().email(),
    fullName: z.string().min(1, "Full name is required"),
    phone: z.string().min(1, "Phone number is required"),
    sex: z.string().min(1, "Gender is required"),
    birthday: z.string().min(1, "Birthday is required"),
    nationality: z.string().min(1, "Nationality is required"),
    nationalIdCardNumber: z.string().optional(),
})

export type UserProfileFormData = z.infer<typeof userProfileSchema>;