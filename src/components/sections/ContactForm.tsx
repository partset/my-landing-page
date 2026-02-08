"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // Changed to React.FormEvent<HTMLFormElement> to resolve the deprecation warning
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase
      .from("contacts")
      .insert([{ name, phone }]);

    if (error) {
      console.error("Submission error:", error.message);
      alert("Something went wrong. Please try again.");
    } else {
      alert("Thank you! Your consultation request has been submitted.");
      setName("");
      setPhone("");
    }
    setLoading(false);
  };

  return (
    <section className="p-8 bg-white rounded-2xl shadow-sm border border-zinc-100 max-w-md mx-auto my-10">
      <h2 className="text-3xl font-bold mb-2 text-zinc-900 text-left text-balance">Free Consultation</h2>
      {/* whitespace-nowrap */}
      <p className="mb-8 text-zinc-600 text-left whitespace-nowrap">Please leave your details below.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2 text-left">
          <label className="text-sm font-semibold text-zinc-700 ml-1">Full Name</label>
          <input 
            type="text" 
            placeholder="e.g. John Doe" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 border border-zinc-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex flex-col gap-2 text-left">
          <label className="text-sm font-semibold text-zinc-700 ml-1">Phone Number</label>
          <input 
            type="tel" 
            placeholder="e.g., 214-000-0000" 
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="p-4 border border-zinc-200 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-4 bg-blue-600 text-white p-4 rounded-xl font-bold text-xl hover:bg-blue-700 transition-all disabled:bg-zinc-300 shadow-md"
        >
          {loading ? "Sending..." : "Request Consultation"}
        </button>
      </form>
    </section>
  );
}