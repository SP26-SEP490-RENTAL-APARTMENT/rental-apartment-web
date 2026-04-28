import { z } from "zod";

export const supportTicketSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum([
    "booking_issue",
    "payment_problem",
    "listing_problem",
    "account_verification",
    "cancellation",
    "dispute",
    "property_quality",
    "other",
  ]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

export type SupportTicketFormData = z.infer<typeof supportTicketSchema>;
