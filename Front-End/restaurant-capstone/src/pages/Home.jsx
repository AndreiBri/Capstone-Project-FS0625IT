import { useState, useEffect, Suspense, lazy } from "react";
import { NavLink } from "react-router-dom";

// Immagini locali per la galleria
import img1 from "../assets/img/Immagini Locale/factory/Monkey+factory-13-1920w.webp";
import img2 from "../assets/img/Immagini Locale/factory/Monkey+factory-18-1920w.webp";
import img3 from "../assets/img/Immagini Locale/cocktail-lab/rfda-design-Monkey-Cocktail-Lab.jpg";
import img4 from "../assets/img/Immagini Locale/cocktail-lab/Cocktails/Screenshot2025-06-05171145.png";
import img5 from "../assets/img/Immagini Locale/factory/Monkey+factory-9-640w.webp";
import img6 from "../assets/img/Immagini Locale/cocktail-lab/Cocktails/Screenshot2025-06-05171145.png";

const galleryImages = [img1, img2, img3, img4, img5, img6];
const VenuesHomeSelector = lazy(() => import("../components/VenuesHomeSelector"));

// --- Hero ---
function Hero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Particelle WebGL */}
      <Suspense fallback={<div className="h-screen bg-[#1a0526]" />}>
        <VenuesHomeSelector particleColors={["#a06cd5"]} particleCount={200} speed={0.1} particleBaseSize={100} />
      </Suspense>

      {/* Overlay testo — sopra le particelle */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
        <p className="text-[#A06CD5] text-sm font-black tracking-[0.4em] uppercase mb-4">Bologna · Dal 2018</p>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-[#DABFFF] tracking-tight leading-none mb-6">
          Due anime,
          <br />
          <span className="text-[#A06CD5]">un'unica</span>
          <br />
          esperienza.
        </h1>
        <p className="text-[#DABFFF]/60 text-lg max-w-md leading-relaxed mb-10">Dal primo caffè del mattino al brindisi sotto le stelle.</p>
        <div className="flex gap-4 flex-wrap justify-center pointer-events-auto">
          <NavLink
            to="/venue/cocktail-lab"
            className="text-xs font-black tracking-widest uppercase px-8 py-4 rounded-full bg-[#A06CD5] text-white hover:bg-[#DABFFF] hover:text-[#320842] transition-all duration-300 shadow-xl shadow-[#A06CD5]/40"
          >
            Cocktail Lab
          </NavLink>
          <NavLink
            to="/venue/factory"
            className="text-xs font-black tracking-widest uppercase px-8 py-4 rounded-full bg-[#A06CD5] text-white hover:bg-[#DABFFF] hover:text-[#320842] transition-all duration-300 shadow-xl shadow-[#A06CD5]/40"
          >
            Factory
          </NavLink>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-[#A06CD5] to-transparent" />
      </div>
    </div>
  );
}

// --- Esperienze ---
function Esperienze() {
  const items = [
    { icon: "☕", label: "Colazione Gourmet", desc: "Inizia la giornata con gusto" },
    { icon: "🍽️", label: "Pranzi Veloci", desc: "Qualità senza compromessi" },
    { icon: "🍹", label: "Aperitivi Originali", desc: "Cocktail artigianali unici" },
    { icon: "🕯️", label: "Cene Creative", desc: "Un'esperienza serale raffinata" },
    { icon: "🌙", label: "Dopocena & Drink", desc: "La notte è ancora giovane" },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-black tracking-[0.4em] text-[#A06CD5] uppercase mb-3">La nostra offerta</p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#DABFFF] tracking-tight">Cos'è Monkey Family</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-px bg-[#DABFFF]/5 rounded-3xl overflow-hidden border border-[#DABFFF]/10">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center px-6 py-10 bg-[#1a0526] hover:bg-[#320842]/80 transition-colors duration-300 group">
              <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</span>
              <h3 className="text-[#DABFFF] font-black text-sm mb-2 tracking-tight">{item.label}</h3>
              <p className="text-[#DABFFF]/40 text-xs leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Galleria (immagini locali) ---
function Galleria() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % galleryImages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-4 bg-[#320842]/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-black tracking-[0.4em] text-[#A06CD5] uppercase mb-3">I nostri spazi</p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#DABFFF] tracking-tight">Vivi l'atmosfera</h2>
        </div>

        {/* Mobile — carosello */}
        <div className="md:hidden">
          <div className="relative w-full h-72 rounded-3xl overflow-hidden">
            {galleryImages.map((img, i) => (
              <div key={i} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? "opacity-100" : "opacity-0"}`}>
                <img src={img} alt={`Monkey Family ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            <button
              onClick={() => setCurrent((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#320842]/80 border border-[#DABFFF]/20 text-[#DABFFF] flex items-center justify-center font-black text-sm"
            >
              ←
            </button>
            <button
              onClick={() => setCurrent((prev) => (prev + 1) % galleryImages.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#320842]/80 border border-[#DABFFF]/20 text-[#DABFFF] flex items-center justify-center font-black text-sm"
            >
              →
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-[#A06CD5]" : "w-2 h-2 bg-[#DABFFF]/40"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop — griglia asimmetrica */}
        <div className="hidden md:grid grid-cols-12 grid-rows-2 gap-3 h-[600px]">
          <div className="col-span-7 row-span-2 overflow-hidden rounded-3xl">
            <img src={galleryImages[0]} alt="Monkey Family" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="col-span-5 row-span-1 overflow-hidden rounded-3xl">
            <img src={galleryImages[1]} alt="Monkey Family" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="col-span-3 row-span-1 overflow-hidden rounded-3xl">
            <img src={galleryImages[2]} alt="Monkey Family" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
          <div className="col-span-2 row-span-1 overflow-hidden rounded-3xl">
            <img src={galleryImages[3]} alt="Monkey Family" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
}

// --- Sedi ---
function Sedi() {
  const venues = [
    { name: "Monkey Cocktail Lab", slug: "cocktail-lab", address: "Via Fratelli Canova, 51 — San Lazzaro di Savena BO", tag: "Cocktail · Aperitivi · Serate" },
    { name: "Monkey Factory", slug: "factory", address: "Via Tranquillo Cremona, 3 — Bologna BO", tag: "Pranzi · Cene · Eventi" },
  ];

  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-black tracking-[0.4em] text-[#A06CD5] uppercase mb-3">Due locali</p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#DABFFF] tracking-tight">Scegli la tua sede</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {venues.map((venue) => (
            <NavLink
              key={venue.slug}
              to={`/venue/${venue.slug}`}
              className="group relative bg-[#320842]/80 border border-[#DABFFF]/10 rounded-3xl p-8 hover:border-[#A06CD5]/40 hover:bg-[#320842] transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A06CD5]/5 rounded-bl-[100px] group-hover:bg-[#A06CD5]/10 transition-colors duration-300" />
              <p className="text-xs font-black tracking-[0.3em] text-[#A06CD5] uppercase mb-4">{venue.tag}</p>
              <h3 className="text-2xl font-black text-[#DABFFF] mb-3 tracking-tight">{venue.name}</h3>
              <p className="text-[#DABFFF]/40 text-sm mb-6">📍 {venue.address}</p>
              <span className="text-xs font-black tracking-widest uppercase text-[#A06CD5]">Scopri</span>
            </NavLink>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Mappe ---
function Mappe() {
  const venues = [
    {
      name: "Monkey Cocktail Lab",
      address: "Via Fratelli Canova, 51 — San Lazzaro di Savena",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5694.510446001849!2d11.397419276564499!3d44.4689409992906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477e2b01a2ae06fb%3A0xee9390773134f8f!2sMonkey%20Cocktail%20Lab!5e0!3m2!1sit!2sit!4v1772896356530!5m2!1sit!2sit",
    },
    {
      name: "Monkey Factory",
      address: "Via Tranquillo Cremona, 3 — Bologna",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2846.9777316959294!2d11.371483276564769!3d44.47462919891722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477e2b9fe478173b%3A0x5a1ae2a12b18c551!2sMonkey%20Factory!5e0!3m2!1sit!2sit!4v1772896543545!5m2!1sit!2sit",
    },
  ];

  return (
    <section className="py-24 px-4 bg-[#320842]/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs font-black tracking-[0.4em] text-[#A06CD5] uppercase mb-3">Vieni a trovarci</p>
          <h2 className="text-4xl sm:text-5xl font-black text-[#DABFFF] tracking-tight">Dove Trovarci</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          {venues.map((venue) => (
            <div key={venue.name} className="flex flex-col gap-3">
              <h3 className="text-lg font-black text-[#DABFFF]">{venue.name}</h3>
              <p className="text-[#DABFFF]/40 text-xs">📍 {venue.address}</p>
              <div className="w-full aspect-video rounded-3xl overflow-hidden border border-[#A06CD5]/20 shadow-lg shadow-[#A06CD5]/10">
                <iframe
                  title={venue.name}
                  src={venue.src}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- CTA Prenota ---
function CtaPrenota() {
  return (
    <section className="py-32 px-4 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-black tracking-[0.4em] text-[#A06CD5] uppercase mb-4">Prenota ora</p>
        <h2 className="text-4xl sm:text-6xl font-black text-[#DABFFF] tracking-tight mb-6 leading-none">
          Riserva il tuo
          <br />
          <span className="text-[#A06CD5]">momento.</span>
        </h2>
        <p className="text-[#DABFFF]/50 text-lg mb-10 leading-relaxed">
          Che sia una colazione di lavoro o una serata speciale,
          <br />
          siamo qui per renderla indimenticabile.
        </p>
        <NavLink
          to="/booking/form"
          className="inline-flex items-center gap-2 text-sm font-black tracking-widest uppercase px-10 py-5 rounded-full bg-[#A06CD5] text-white hover:bg-[#DABFFF] hover:text-[#320842] transition-all duration-300 shadow-2xl shadow-[#A06CD5]/40"
        >
          Prenota un Tavolo
        </NavLink>
      </div>
    </section>
  );
}

// --- Home ---
const Home = () => (
  <div className="bg-[#1a0526]">
    <Hero />
    <Esperienze />
    <Galleria />
    <Sedi />
    <Mappe />
    <CtaPrenota />
  </div>
);

export default Home;
