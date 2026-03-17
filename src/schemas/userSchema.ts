import z from "zod";

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["admin", "tenant", "landlord", "staff"]),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  identityVerified: z.boolean(),
});

export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["admin", "tenant", "landlord", "staff"]),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  identityVerified: z.boolean(),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
