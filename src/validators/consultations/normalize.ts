import type { ConsultationInput, NormalizedConsultation } from "./schema";

function normalizeSpaces(value: string): string
{
  // Collapse multiple spaces into one, then trim.
  return value.replace(/\s+/g, " ").trim();
}

function normalizePhoneToUS10Digits(value: string): string
{
  // Keep digits only.
  let digits = value.replace(/[^\d]/g, "");

  // If user includes country code "1" (11 digits), drop leading 1.
  if (digits.length === 11 && digits.startsWith("1"))
  {
    digits = digits.slice(1);
  }

  return digits;
}

export function normalizeConsultation(input: ConsultationInput): NormalizedConsultation
{
  return {
    first_name: normalizeSpaces(input.first_name),
    last_name: normalizeSpaces(input.last_name),
    email: input.email.trim().toLowerCase(),
    phone: normalizePhoneToUS10Digits(input.phone),
    message: input.message.trim(),
  };
}