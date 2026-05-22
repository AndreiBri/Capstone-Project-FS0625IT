import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { createBooking, fetchEventById, fetchAllVenues } from "../features/helper/api";

// --------------------- Config ----------------------------------------
const COOLDOWN_MINUTES = 30;
const MAX_PEOPLE = 25;
const MIN_ADVANCE_HOURS = 1;

// -------------------- Success Modal --------------------------------
function SuccessModal({ status, onClose }) {
  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.7)" }} className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-[#320842] border border-[#DABFFF]/20 rounded-3xl shadow-2xl shadow-[#A06CD5]/20 p-8 max-w-sm w-full text-center">
        <div className="text-5xl mb-4">{status === "confirmed" ? "✅" : "📋"}</div>
        <h2 className="text-2xl font-black tracking-tight text-[#DABFFF] mb-2">
          {status === "confirmed" ? "Prenotazione Confermata!" : "Prenotazione Ricevuta!"}
        </h2>
        <p className="text-[#DABFFF]/70 mb-6 text-sm leading-relaxed">
          {status === "confirmed"
            ? "La tua prenotazione è confermata. Ti arriverà una email di conferma a breve!"
            : "Abbiamo ricevuto la tua richiesta. Ti contatteremo via email non appena confermata."}
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#A06CD5] hover:bg-[#DABFFF] hover:text-[#320842] text-white font-black py-3 rounded-xl transition-all duration-200 tracking-wide"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full bg-[#320842]/60 border border-[#DABFFF]/20 hover:border-[#A06CD5]/60 focus:border-[#A06CD5] rounded-xl px-4 py-3 text-sm text-[#DABFFF] placeholder-[#DABFFF]/30 focus:outline-none focus:ring-1 focus:ring-[#A06CD5]/50 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";

function getCooldownRemaining() {
  const last = localStorage.getItem("last_booking_time");
  if (!last) return 0;
  const diffMinutes = (Date.now() - parseInt(last)) / (1000 * 60);
  const remaining = COOLDOWN_MINUTES - diffMinutes;
  return remaining > 0 ? Math.ceil(remaining) : 0;
}

function isTooSoon(date, time) {
  if (!date || !time) return false;
  const bookingDateTime = new Date(`${date}T${time}`);
  const minAllowed = new Date(Date.now() + MIN_ADVANCE_HOURS * 60 * 60 * 1000);
  return bookingDateTime < minAllowed;
}

function getMinDateTime() {
  const d = new Date(Date.now() + MIN_ADVANCE_HOURS * 60 * 60 * 1000);
  return d.toISOString().split("T")[0];
}

// ---------------------- Main Booking Form --------------------------

export default function BookingForm() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id");
  const venueId = searchParams.get("venue_id");
  const venueName = searchParams.get("venue_name");

  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    date: "",
    time: "",
    guests: 1,
    venueSlug: venueId ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [cooldownMinutes, setCooldownMinutes] = useState(() => getCooldownRemaining());
  const [eventInfo, setEventInfo] = useState(null);
  const [venues, setVenues] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const remaining = getCooldownRemaining();
    if (remaining > 0) {
      setError(`Hai già inviato una prenotazione di recente. Riprova tra ${remaining} minuti.`);
      return;
    }

    if (isTooSoon(form.date, form.time)) {
      setError(`Le prenotazioni devono essere effettuate con almeno ${MIN_ADVANCE_HOURS} ora di anticipo.`);
      return;
    }

    if (parseInt(form.guests) > MAX_PEOPLE) {
      setError(`Il numero massimo di persone è ${MAX_PEOPLE}.`);
      return;
    }

    setLoading(true);
    try {
      const bookingDate = `${form.date}T${form.time}`;
      await createBooking(form.customerName, form.customerEmail, form.customerPhone, bookingDate, parseInt(form.guests), form.venueSlug);
      localStorage.setItem("last_booking_time", Date.now().toString());
      setCooldownMinutes(COOLDOWN_MINUTES);
      setModal("pending");
      setForm({ customerName: "", customerEmail: "", customerPhone: "", date: "", time: "", guests: 1, venueSlug: "" });
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Qualcosa è andato storto. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!eventId) return;

    fetchEventById(eventId)
      .then((data) => {
        setEventInfo(data);
        const eventDate = new Date(data.startTime).toISOString().split("T")[0];
        const eventTime = new Date(data.startTime).toTimeString().slice(0, 5);
        setForm((prev) => ({ ...prev, date: eventDate, time: eventTime, venueSlug: venueId ?? prev.venueSlug }));
      })
      .catch(console.error);
  }, [eventId]);

  useEffect(() => {
    const loadAllVenues = async () => {
      try {
        const data = await fetchAllVenues();
        setVenues(data);
      } catch (err) {
        console.error("Errore caricamento venues:", err);
      }
    };
    loadAllVenues();
  }, []);

  return (
    <div className="min-h-screen bg-[#1a0526] flex items-center justify-center px-4 py-12">
      {modal && <SuccessModal status={modal} onClose={() => setModal(null)} />}

      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#DABFFF] mb-2">Prenota un Tavolo</h1>
          <p className="text-[#DABFFF]/60 text-sm">Completa i dettagli e ti confermeremo la prenotazione via email.</p>
        </div>

        {eventInfo && (
          <div className="border border-[#A06CD5]/30 bg-[#A06CD5]/10 rounded-2xl px-5 py-4 mb-6">
            <p className="text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1">Stai prenotando per</p>
            <p className="text-[#DABFFF] font-black text-lg">{eventInfo.title}</p>
            <p className="text-[#DABFFF]/50 text-xs mt-1">
              📅 {new Date(eventInfo.startTime).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
              {" · "}
              🕐 {new Date(eventInfo.startTime).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        )}

        {/* Banner cooldown */}
        {cooldownMinutes > 0 && (
          <div className="mb-6 border border-[#A06CD5]/30 bg-[#A06CD5]/10 rounded-2xl py-4 px-5 text-center">
            <p className="text-[#DABFFF]/80 text-sm">
              ⏳ Hai già inviato una prenotazione di recente.
              <br />
              <span className="text-[#A06CD5] font-black">
                Potrai prenotare di nuovo tra {cooldownMinutes} {cooldownMinutes === 1 ? "minuto" : "minuti"}.
              </span>
            </p>
          </div>
        )}

        {/* Card form */}
        <div className="bg-[#320842]/80 backdrop-blur-xl border border-[#DABFFF]/20 shadow-xl shadow-[#A06CD5]/10 rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Sede */}
            {venueId ? (
              <div>
                <label className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">Sede</label>
                <input type="text" value={venueName ?? ""} className={inputClass} disabled />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">Sede</label>
                <select name="venueSlug" required value={form.venueSlug} onChange={handleChange} className={inputClass} disabled={cooldownMinutes > 0}>
                  <option value="">Seleziona una sede</option>
                  {venues.map((v) => (
                    <option key={v.slug} value={v.slug}>
                      {v.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Nome */}
            <div>
              <label className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">Nome & Cognome</label>
              <input
                type="text"
                name="customerName"
                required
                value={form.customerName}
                onChange={handleChange}
                placeholder="Mario Rossi"
                className={inputClass}
                disabled={cooldownMinutes > 0}
              />
            </div>

            {/* Telefono */}
            <div>
              <label form="phone" className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">
                Numero di Telefono
              </label>
              <input
                type="tel"
                id="phone"
                name="customerPhone"
                required
                value={form.customerPhone}
                onChange={handleChange}
                onKeyDown={(e) => {
                  const allowed = /[0-9+\-\s]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/;
                  if (!allowed.test(e.key)) e.preventDefault();
                }}
                placeholder="+39 333 1234567"
                pattern="[+]?[0-9\s\-]{6,15}"
                title="Inserisci un numero di telefono valido"
                className={inputClass}
                disabled={cooldownMinutes > 0}
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">Indirizzo Email</label>
              <input
                type="email"
                name="customerEmail"
                required
                value={form.customerEmail}
                onChange={handleChange}
                placeholder="mario@esempio.com"
                className={inputClass}
                disabled={cooldownMinutes > 0}
              />
            </div>

            {/* Data + Ora — disabilitati se arriva da evento */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">Data</label>
                <input
                  type="date"
                  name="date"
                  required
                  value={form.date}
                  onChange={handleChange}
                  min={getMinDateTime()}
                  className={inputClass}
                  disabled={cooldownMinutes > 0}
                />
              </div>
              <div>
                <label className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">Ora</label>
                <input type="time" name="time" required value={form.time} onChange={handleChange} className={inputClass} disabled={cooldownMinutes > 0} />
              </div>
            </div>

            {/* Persone */}
            <div>
              <label className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">
                Numero Persone <span className="text-[#DABFFF]/30 normal-case font-normal tracking-normal">(max {MAX_PEOPLE})</span>
              </label>
              <input
                type="number"
                name="guests"
                required
                min={1}
                max={MAX_PEOPLE}
                value={form.guests}
                onChange={handleChange}
                className={inputClass}
                disabled={cooldownMinutes > 0}
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center border border-red-400/30 bg-red-400/10 rounded-xl py-2 px-3">{error}</p>}

            <button
              type="submit"
              disabled={loading || cooldownMinutes > 0}
              className="w-full bg-[#A06CD5] hover:bg-[#DABFFF] hover:text-[#320842] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-xl transition-all duration-200 text-sm tracking-widest uppercase shadow-lg shadow-[#A06CD5]/30"
            >
              {loading ? "Verifica in corso..." : cooldownMinutes > 0 ? `Disponibile tra ${cooldownMinutes} min` : "Richiedi Prenotazione →"}
            </button>
          </form>
        </div>

        {/* Info regole */}
        <div className="mt-8 grid grid-cols-3 gap-2 text-center">
          {[
            { icon: "⏱", label: `Cooldown ${COOLDOWN_MINUTES} min` },
            { icon: "🕐", label: `Min ${MIN_ADVANCE_HOURS}h anticipo` },
            { icon: "👥", label: `Max ${MAX_PEOPLE} persone` },
          ].map(({ icon, label }) => (
            <div key={label} className="border border-[#DABFFF]/10 bg-[#320842]/40 rounded-xl py-2 px-1">
              <div className="text-base">{icon}</div>
              <div className="text-[#DABFFF]/40 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        <p className="text-center text-[#DABFFF]/30 text-xs mt-4">Riceverai una email di conferma non appena la tua prenotazione sarà approvata.</p>
      </div>
    </div>
  );
}
