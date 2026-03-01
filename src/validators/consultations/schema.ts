import { z } from "zod";

/**
 * Raw input schema (what the client sends).
 * - Validate required fields + reject invalid characters early.
 * - Phone: allow digits and common symbols only (no letters).
 */
export const consultationSchema = z.object({
  first_name: z.string().trim().min(1, "First name is required"),
  last_name: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Invalid email"),

  // Allow digits + common formatting symbols only.
  // Reject letters so "abc" won't pass client-side validation.
  phone: z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(
    (v) =>
    {
      // Allow digits + common formatting symbols only
      return /^[0-9\s()+\-\.]*$/.test(v);
    },
    "Must enter numbers only"
  )
  .refine(
    (v) =>
    {
      // Enforce exactly 10 digits (US phone)
      const digits = v.replace(/\D/g, "");
      return digits.length === 10;
    },
    "Phone number must be 10 digits"
  ),

  message: z.string().trim().min(1, "Message is required").max(1000, "Message is too long"),

  // If you want to enforce consent at API level:
  // agreed: z.literal(true, { errorMap: () => ({ message: "You must agree to the Terms & Privacy Policy" }) }),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;

/**
 * Normalized schema (after normalizeConsultation()).
 * - Enforce strict rules (digits-only phone length).
 */
export const normalizedConsultationSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email(),

  // Digits-only US phone (10 digits).
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),

  message: z.string().min(1).max(1000),
});

export type NormalizedConsultation = z.infer<typeof normalizedConsultationSchema>;