import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { consultationSchema, normalizedConsultationSchema } from "@/validators/consultations/schema";
import { normalizeConsultation } from "@/validators/consultations/normalize";

type FieldErrors = Record<string, string>;

function zodToFieldErrors(error: any): FieldErrors
{
  const flat = error.flatten();
  const out: FieldErrors = {};

  for (const key of Object.keys(flat.fieldErrors))
  {
    const msgs = flat.fieldErrors[key];
    if (msgs && msgs.length > 0)
    {
      out[key] = msgs[0];
    }
  }

  return out;
}

// Create a Supabase client for server-side insert.
// NOTE: We use the anon key here because RLS allows inserts.
// For admin read/manage later, use server-only service role key.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function POST(request: Request)
{
  let body: unknown;

  try
  {
    body = await request.json();
  }
  catch
  {
    return NextResponse.json({ ok: false, fieldErrors: { _form: "Invalid JSON" } }, { status: 400 });
  }

  const parsed = consultationSchema.safeParse(body);

  if (!parsed.success)
  {
    return NextResponse.json(
      { ok: false, fieldErrors: zodToFieldErrors(parsed.error) },
      { status: 400 }
    );
  }

  const normalized = normalizeConsultation(parsed.data);

  const normalizedParsed = normalizedConsultationSchema.safeParse(normalized);

  if (!normalizedParsed.success)
  {
    return NextResponse.json(
      { ok: false, fieldErrors: zodToFieldErrors(normalizedParsed.error) },
      { status: 400 }
    );
  }

  // Insert into Supabase contacts table
  const { error } = await supabase
    .from("contacts")
    .insert([
      {
        first_name: normalizedParsed.data.first_name,
        last_name: normalizedParsed.data.last_name,
        email: normalizedParsed.data.email,
        phone: normalizedParsed.data.phone,
        message: normalizedParsed.data.message,
      },
    ]);

  if (error)
  {
    // Do not leak DB details to the client
    return NextResponse.json(
      { ok: false, fieldErrors: { _form: "Failed to save. Please try again." } },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}