import type { ConsultationInput } from "./schema";

export type NormalizedConsultation = {
  first_name: string;
  last_name: string;
  email: string;   // lowercased
  phone: string;   // digits only (for now)
  message: string;
};

function normalizeSpaces(value: string): string
{
  // Collapse multiple spaces into one, then trim
  return value.replace(/\s+/g, " ").trim();
}

export function normalizeConsultation(input: ConsultationInput): NormalizedConsultation
{
  const email = input.email.trim().toLowerCase();
  const phoneDigits = input.phone.replace(/[^\d]/g, "");

  return {
    first_name: normalizeSpaces(input.first_name),
    last_name: normalizeSpaces(input.last_name),
    email,
    phone: phoneDigits,
    message: input.message.trim(),
  };
}