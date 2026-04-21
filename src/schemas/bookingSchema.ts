import { z } from "zod";

export const bookingQuoteSchema = z
  .object({
    apartmentId: z.string().uuid("Invalid apartment ID"),
    packageId: z.string().uuid("Invalid package ID"),
    noOfAdults: z
      .number()
      .int()
      .positive("Number of adults must be at least 1"),
    noOfInfants: z
      .number()
      .int()
      .min(0, "Number of infants cannot be negative"),
    noOfPets: z.number().int().min(0, "Number of pets cannot be negative"),
    checkInDateTime: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Invalid check-in date"),
    checkOutDateTime: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), "Invalid check-out date"),
  })
  .refine((data) => new Date(data.checkOutDateTime) > new Date(data.checkInDateTime), {
    message: "Check-out date must be after check-in date",
    path: ["checkOutDateTime"],
  });

export const bookingConfirmSchema = z.object({
  apartmentId: z.string(),
  checkInDateTime: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid check-in date"),
  checkOutDateTime: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Invalid check-out date"),
  nights: z.number().int().positive("Number of nights must be at least 1"),
  noOfAdults: z.number().int().positive("Number of adults must be at least 1"),
  noOfInfants: z.number().int().min(0, "Number of infants cannot be negative"),
  noOfPets: z.number().int().min(0, "Number of pets cannot be negative"),
  packageId: z.string().nullable(),
  paymentMode: z.enum(["partial", "full"]),
  paymentProvider: z.enum(["stripe", "momo"]),
});

export type BookingQuoteFormData = z.infer<typeof bookingQuoteSchema>;
export type BookingConfirmFormData = z.infer<typeof bookingConfirmSchema>;
