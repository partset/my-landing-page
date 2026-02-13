// src/components/sections/ContactForm.tsx
"use client";

import { useState } from "react";
import { supabaseClient } from "@/lib/supabase/client";

export default function ContactForm() {
  // 1. State management for new fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!agreed) {
      alert("Please agree to our Terms and Privacy Policy.");
      return;
    }

    setLoading(true);
    
    // 2. Insert data using the new column names (first_name, last_name, etc.)
    const res = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          message,
          agreed,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        console.error(data);
        alert("Something went wrong. Please check your inputs.");
        setLoading(false);
        return;
      }
      
        alert("Thank you! Your message has been successfully sent.");
        setLoading(false);
  };


  return (
    <section className="w-full max-w-2xl mx-auto p-8 bg-white rounded-3xl shadow-sm border border-zinc-100 text-left my-12">
      <h2 className="text-3xl font-bold text-zinc-900 mb-2">Send Us a Message</h2>
      <p className="text-zinc-600 mb-10">Fill in the form below and we'll get back to you shortly.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Name Grid: First and Last Name in one row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            placeholder="First name" 
            value={firstName} 
            onChange={(e) => setFirstName(e.target.value)}
            className="p-4 bg-zinc-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-zinc-100"
            required
          />
          <input 
            placeholder="Last name" 
            value={lastName} 
            onChange={(e) => setLastName(e.target.value)}
            className="p-4 bg-zinc-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-zinc-100"
            required
          />
        </div>

        {/* Contact Grid: Email and Phone in one row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            type="email" 
            placeholder="Email address" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            className="p-4 bg-zinc-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-zinc-100"
            required
          />
          <input 
            type="tel" 
            placeholder="Phone Number" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)}
            className="p-4 bg-zinc-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-zinc-100"
            required
          />
        </div>

        {/* Message area */}
        <textarea 
          placeholder="How can we help you?" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className="p-4 bg-zinc-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all border border-zinc-100 resize-none"
          required
        />

        {/* Agreement Checkbox */}
        <div className="flex items-center gap-3 py-2">
          <input 
            type="checkbox" 
            id="policy" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
          />
          <label htmlFor="policy" className="text-sm text-zinc-600 cursor-pointer">
            I agree with the <span className="underline">Terms</span> and <span className="underline">Privacy Policy</span>
          </label>
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={loading}
          className="w-full sm:w-32 bg-zinc-900 text-white p-4 rounded-xl font-bold hover:bg-zinc-800 transition-colors disabled:bg-zinc-400 mt-2 shadow-lg shadow-zinc-200"
        >
          {loading ? "..." : "Submit"}
        </button>
      </form>
    </section>
  );
}