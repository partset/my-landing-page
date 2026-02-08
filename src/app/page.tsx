import ContactForm from "@/components/sections/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 py-24 px-6 font-sans">
      <div className="max-w-4xl mx-auto text-center">
        {/* Removed specific brand names as requested */}
        <h1 className="text-6xl font-black text-zinc-900 mb-6 tracking-tighter">
          Our Service
        </h1>
        
        <div className="w-full max-w-lg mx-auto">
          <ContactForm />
        </div>
        
        <footer className="mt-20 text-zinc-400 text-sm">
          © 2026. Company Name
        </footer>
      </div>
    </main>
  );
}