import z from "zod";

export const occupantSchema = z.object({
    fullName: z.string().min(1, "Full name is required"),
    passportId: z.string().min(1, "Passport ID is required"),
    nationalIdCardNumber: z.string().min(1, "National ID card number is required"),
    nationality: z.string().min(1, "Nationality is required"),
    sex: z.string(),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Invalid email address").min(1, "Email is required"),
    proofPhoto: z.array(z.instanceof(File)).min(1, "Phải upload ít nhất 1 ảnh"),
})

export type OccupantFormData = z.infer<typeof occupantSchema>;