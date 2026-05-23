import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { deleteEvent, fetchEvents } from "../features/helper/api";

// --- Eventi Menu ---
const Eventi = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [errorMsg, setErrorMsg] = useState("");

  const isAdmin = profile && (profile.role === "OWNER" || profile.role === "SUPERVISOR");

  useEffect(() => {
    const load = async () => {
      if (!venueId) return;
      setLoading(true);
      try {
        const data = await fetchEvents(venueId);
        setEvents(data);
      } catch {
        setErrorMsg("Impossibile caricare gli eventi, riprova.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [venueId]);

  const handleDelete = async (eventId) => {
    if (!window.confirm(`Eliminare "${event.title}"?`)) return;
    try {
      await deleteEvent(eventId, token);
      setEvents((prev) => prev.filter((i) => i.id !== eventId));
    } catch {
      setErrorMsg("Eliminazione fallita, riprova.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#A06CD5] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#DABFFF]/50 text-sm">Caricamento eventi...</p>
        </div>
      </div>
    );
  }

  if (!venueId) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex items-center justify-center">
        <p className="text-[#DABFFF]/50 text-sm">Seleziona prima una sede.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0526] px-4 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#DABFFF]">Eventi</h1>
            <p className="text-[#DABFFF]/50 mt-1 text-sm capitalize">{venueId?.replace("-", " ")}</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate(`/events/${venueId}/form`)}
              className="bg-[#A06CD5] hover:bg-[#DABFFF] hover:text-[#320842] text-white font-black px-4 py-2 rounded-xl transition-all duration-200 text-sm tracking-widest uppercase shadow-lg shadow-[#A06CD5]/30"
            >
              + Crea Evento
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#DABFFF]/30">
            <div className="text-5xl mb-4">🎭</div>
            <p className="text-sm">Nessun evento disponibile al momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => {
              return (
                <div
                  key={event.id}
                  className="bg-[#320842]/80 backdrop-blur-lg border border-[#DABFFF]/10 rounded-3xl overflow-hidden shadow-xl shadow-[#A06CD5]/10 flex flex-col"
                >
                  <div onClick={() => navigate(`/events/${venueId}/${event.id}`)} className="cursor-pointer overflow-hidden">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} className="w-full h-52 object-cover hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-52 bg-[#320842] flex items-center justify-center">
                        <span className="text-[#A06CD5] font-black text-5xl">{event.title?.charAt(0).toUpperCase()}</span>
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => navigate(`/events/${venueId}/${event.id}`)}
                    className="cursor-pointer p-5 flex-1 hover:bg-[#A06CD5]/10 transition-colors duration-200"
                  >
                    <h2 className="text-lg font-black text-[#DABFFF] tracking-tight mb-2">{event.title}</h2>
                    <p className="text-[#DABFFF]/60 text-sm leading-relaxed mb-3">{event.description}</p>
                    <p className="text-xs font-semibold text-[#A06CD5] uppercase tracking-widest">
                      {new Date(event.startTime).toLocaleString("it-IT", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {event.endTime && (
                        <span className="text-[#DABFFF]/40">
                          {" · "}
                          {new Date(event.endTime).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="px-5 pb-5 pt-2 flex flex-col gap-2">
                    <NavLink
                      to={`/booking/form?event_id=${event.id}&venue_id=${event.venueId}`}
                      className="w-full text-center bg-[#A06CD5] hover:bg-[#DABFFF] hover:text-[#320842] text-white font-black py-2.5 rounded-xl transition-all duration-200 text-sm tracking-widest uppercase shadow-lg shadow-[#A06CD5]/30"
                    >
                      Prenota
                    </NavLink>

                    {isAdmin && (
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => navigate(`/events/${venueId}/form?event_id=${event.id}`)}
                          className="flex-1 text-xs bg-[#DABFFF]/10 hover:bg-[#DABFFF]/20 text-[#DABFFF] font-black px-3 py-2 rounded-xl border border-[#DABFFF]/20 transition-all duration-200 uppercase tracking-wider"
                        >
                          Modifica
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="flex-1 text-xs bg-red-400/10 hover:bg-red-400/20 text-red-300 font-black px-3 py-2 rounded-xl border border-red-400/30 transition-all duration-200 uppercase tracking-wider"
                        >
                          Elimina
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
export default Eventi;
