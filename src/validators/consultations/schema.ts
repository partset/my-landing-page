import { z } from "zod";

/**
 * Consultation “raw input” validation rules.
 * - This runs on both server & client.
 * - Goal: reject invalid shapes early (400 on server / show errors on client).
 */
export const consultationSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required"),

  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required"),

  email: z
    .string()
    .trim()
    .email("Invalid email"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(32, "Phone number is too long"),

  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message is too long"),

  // If you want to enforce Terms/Privacy consent in API:
  // consent: z.literal(true, { errorMap: () => ({ message: "You must agree to the Terms & Privacy Policy" }) }),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;