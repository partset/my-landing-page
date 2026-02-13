import { NextResponse } from "next/server";
import { consultationSchema } from "@/validators/consultations/schema";
import { normalizeConsultation } from "@/validators/consultations/normalize";

export async function POST(request: Request)
{
  let body: unknown;

  try
  {
    body = await request.json();
  }
  catch
  {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = consultationSchema.safeParse(body);

  if (!parsed.success)
  {
    return NextResponse.json(
      {
        ok: false,
        error: "Validation failed",
        details: parsed.error, // flatten() - if you don't want the flatten than just only put parsed.error
      },
      { status: 400 }
    );
  }

  const normalized = normalizeConsultation(parsed.data);

  return NextResponse.json({ ok: true, normalized }, { status: 200 });
}