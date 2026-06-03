import z from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Invalid phone number"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,}$/,
      "Password must be at least 6 characters and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character",
    ),
  role: z.enum(["tenant", "landlord"]),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
