import { useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchVenue } from "../features/helper/api";
import menuLayoutImg from "../assets/img/menulayout.png";

// --- Auto Slider ---
function AutoSlider({ images }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [images?.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="relative w-full h-[500px] sm:h-[700px] rounded-3xl overflow-hidden border border-[#DABFFF]/10 shadow-xl shadow-[#A06CD5]/10">
      {images.map((img, i) => (
        <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? "opacity-100" : "opacity-0"}`}>
          <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
        </div>
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "w-5 h-2 bg-[#A06CD5]" : "w-2 h-2 bg-[#DABFFF]/40 hover:bg-[#DABFFF]/60"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// --- Venue Page ---
const Venue = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchVenue(venueId);
        setVenue(data);
        localStorage.setItem("selectedVenue", data.slug);
        window.dispatchEvent(new Event("venueChanged"));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [venueId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#A06CD5] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#DABFFF]/50 text-sm">Caricamento...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex items-center justify-center">
        <p className="text-red-400 text-sm border border-red-400/30 bg-red-400/10 rounded-xl py-3 px-6">{error ?? "Venue non trovata"}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1a0526] text-[#DABFFF]">
      {/* Hero */}
      <div className="relative h-[80vh] w-full overflow-hidden">
        {venue.images?.[0] ? (
          <img src={venue.images[0]} alt={venue.name} className="absolute inset-0 w-full h-full object-cover object-center" />
        ) : (
          <div className="absolute inset-0 bg-[#320842]" />
        )}
        <div className="absolute inset-0 bg-black/50 flex items-end justify-start px-8 pb-12">
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl px-6 py-4">
            <p className="text-[#A06CD5] text-xs font-black tracking-[0.3em] uppercase mb-1">Monkey Family</p>
            <h1 className="text-4xl sm:text-6xl font-black text-[#DABFFF] tracking-tight leading-none">{venue.name}</h1>
          </div>
        </div>
      </div>

      {/* Contenuto */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-14 space-y-16">
        {/* Descrizione + CTA */}
        {venue.description && (
          <section>
            <p className="text-lg sm:text-xl text-[#DABFFF]/80 leading-relaxed font-light text-center max-w-2xl mx-auto">{venue.description}</p>
            <div className="flex justify-center mt-8 gap-4 flex-wrap">
              <NavLink
                to="/booking/form"
                className="text-xs font-black tracking-widest uppercase px-6 py-3 rounded-full bg-[#A06CD5] text-white hover:bg-[#DABFFF] hover:text-[#320842] transition-all duration-200 shadow-lg shadow-[#A06CD5]/30"
              >
                Prenota →
              </NavLink>
              <NavLink
                to={`/events/${venue.slug}`}
                className="text-xs font-black tracking-widest uppercase px-6 py-3 rounded-full border border-[#DABFFF]/20 text-[#DABFFF] hover:border-[#A06CD5] hover:text-[#A06CD5] transition-all duration-200"
              >
                Eventi 🎉
              </NavLink>
            </div>
          </section>
        )}

        {/* Galleria */}
        {venue.images?.length > 0 && (
          <section>
            <p className="text-xs font-black tracking-[0.3em] text-[#A06CD5] uppercase mb-5">Galleria</p>
            <AutoSlider images={venue.images} />
          </section>
        )}

        {/* Orari */}
        {venue.hours?.length > 0 && (
          <section>
            <p className="text-xs font-black tracking-[0.3em] text-[#A06CD5] uppercase mb-5">Orari</p>
            <div className="divide-y divide-[#DABFFF]/10">
              {venue.hours.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <span className="text-[#DABFFF]/60 text-sm">{h.day}</span>
                  <span className="text-[#DABFFF] font-black text-sm">{h.time}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Attività + Extra */}
        {(venue.activities?.length > 0 || venue.extras?.length > 0) && (
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {venue.activities?.length > 0 && (
              <div>
                <p className="text-xs font-black tracking-[0.3em] text-[#A06CD5] uppercase mb-5">Attività</p>
                <ul className="space-y-3">
                  {venue.activities.map((a, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#DABFFF]/70">
                      <span className="w-1 h-1 rounded-full bg-[#A06CD5] shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {venue.extras?.length > 0 && (
              <div>
                <p className="text-xs font-black tracking-[0.3em] text-[#A06CD5] uppercase mb-5">Extra</p>
                <ul className="space-y-3">
                  {venue.extras.map((e, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#DABFFF]/70">
                      <span className="w-1 h-1 rounded-full bg-[#A06CD5] shrink-0" />
                      {e}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Menu preview */}
        <section className="text-center">
          <p className="text-xs font-black tracking-[0.3em] text-[#A06CD5] uppercase mb-2">Menu</p>
          <h2 className="text-3xl font-black text-[#DABFFF] mb-8">Scopri cosa offriamo</h2>
          <div className="rounded-3xl overflow-hidden border border-[#DABFFF]/10 shadow-xl shadow-[#A06CD5]/10 mb-8">
            <img src={menuLayoutImg} alt="Menu preview" className="w-full object-cover" />
          </div>
          <NavLink
            to={`/menu/${venue.slug}`}
            className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase px-8 py-3.5 rounded-full bg-[#A06CD5] text-white hover:bg-[#DABFFF] hover:text-[#320842] transition-all duration-200 shadow-lg shadow-[#A06CD5]/30"
          >
            Vedi Menu →
          </NavLink>
        </section>

        {/* Mappa */}
        {venue.mapEmbedUrl && (
          <section>
            <p className="text-xs font-black tracking-[0.3em] text-[#A06CD5] uppercase mb-5">Dove Trovarci</p>
            <div className="w-full aspect-video rounded-3xl overflow-hidden border border-[#A06CD5]/30 shadow-lg shadow-[#A06CD5]/20">
              <iframe
                title={venue.name}
                src={venue.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
            {venue.location && <p className="text-[#DABFFF]/40 text-sm mt-3 text-center">📍 {venue.location}</p>}
          </section>
        )}
      </div>
    </main>
  );
};

export default Venue;
