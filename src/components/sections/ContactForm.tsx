// src/components/sections/ContactForm.tsx
"use client";

import { useState } from "react";
import { consultationSchema } from "@/validators/consultations/schema";

type FieldErrors = Partial<Record<
  "first_name" | "last_name" | "email" | "phone" | "message" | "agreed",
  string
>>;

export default function ContactForm()
{
  // 1) Form values (what the user types)
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    message: "",
    agreed: false,
  });

  // 2) Error messages for each field
  const [errors, setErrors] = useState<FieldErrors>({});

  // 3) Loading state for submit button
  const [loading, setLoading] = useState(false);

  function setField<K extends keyof typeof form>(key: K, value: typeof form[K])
  {
    // Update only one field while keeping others the same
    setForm((prev) => ({ ...prev, [key]: value }));

    // Clear the error message for that field as the user edits
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>)
  {
    e.preventDefault();
    setErrors({});

    // 1) Consent check first (fast exit)
    if (!form.agreed)
    {
        setErrors({ agreed: "You must agree to the Terms and Privacy Policy." });
        return;
    }
    
    // 2) Then run Zod validation
    const parsed = consultationSchema.safeParse(form);
    
    if (!parsed.success)
    {
        const nextErrors: FieldErrors = {};
    
        // Build field errors from Zod issues
        for (const issue of parsed.error.issues)
        {
        const key = issue.path[0] as keyof FieldErrors | undefined;
        if (key && !nextErrors[key])
        {
            nextErrors[key] = issue.message;
        }
        }
    
        setErrors(nextErrors);
        return;
    }

    // B) Server request (authoritative validation + DB insert happens here)
    setLoading(true);

    try
    {
      const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok)
      {
        // Expecting server response: { ok:false, fieldErrors: { phone: "...", email: "..." } }
        const fieldErrors = data?.fieldErrors as FieldErrors | undefined;

        if (fieldErrors)
        {
          setErrors(fieldErrors);
        }
        else
        {
          alert("Server error. Please try again later.");
        }

        return;
      }

      alert("Thank you! Your message has been successfully sent.");

      // Reset form after success
      setForm({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
        agreed: false,
      });
    }
    catch
    {
      alert("Network error. Please check your connection and try again.");
    }
    finally
    {
      setLoading(false);
    }
  }

  return (
    <section className="w-full max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-sm border border-zinc-100 text-left my-12">
      <h2 className="text-3xl font-bold text-zinc-900 mb-2">Send Us a Message</h2>
      <p className="text-zinc-600 mb-10">Fill in the form below and we'll get back to you shortly.</p>

      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              placeholder="First name"
              value={form.first_name}
              onChange={(e) => setField("first_name", e.target.value)}
              className="w-full p-4 bg-zinc-50 rounded-xl outline-none border border-zinc-100"
            />
            {errors.first_name && <p className="mt-2 text-sm text-red-600">{errors.first_name}</p>}
          </div>

          <div>
            <input
              placeholder="Last name"
              value={form.last_name}
              onChange={(e) => setField("last_name", e.target.value)}
              className="w-full p-4 bg-zinc-50 rounded-xl outline-none border border-zinc-100"
            />
            {errors.last_name && <p className="mt-2 text-sm text-red-600">{errors.last_name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <input
              placeholder="Email address"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className="w-full p-4 bg-zinc-50 rounded-xl outline-none border border-zinc-100"
            />
            {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
          </div>

          <div>
            <input
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              className="w-full p-4 bg-zinc-50 rounded-xl outline-none border border-zinc-100"
            />
            {errors.phone && <p className="mt-2 text-sm text-red-600">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <textarea
            placeholder="How can we help you?"
            value={form.message}
            onChange={(e) => setField("message", e.target.value)}
            rows={5}
            className="w-full p-4 bg-zinc-50 rounded-xl outline-none border border-zinc-100 resize-none"
          />
          {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}
        </div>

        <div className="flex items-center gap-3 py-2">
          <input
            type="checkbox"
            id="policy"
            checked={form.agreed}
            onChange={(e) => setField("agreed", e.target.checked)}
            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
          />
          <label htmlFor="policy" className="text-sm text-zinc-600 cursor-pointer">
            I agree with the <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>
          </label>
        </div>
        {errors.agreed && <p className="mt-[-8px] text-sm text-red-600">{errors.agreed}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-32 bg-zinc-900 text-white p-4 rounded-xl font-bold disabled:bg-zinc-400"
        >
          {loading ? "..." : "Submit"}
        </button>
      </form>
    </section>
  );
}