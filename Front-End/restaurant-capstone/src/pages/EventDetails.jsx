import { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { deleteEvent, fetchEventById } from "../features/helper/api";
import { useSelector } from "react-redux";

const EventDetails = () => {
  const { venueId, eventId } = useParams();
  const { profile } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);

  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const isAdmin = profile && (profile.role === "OWNER" || profile.role === "SUPERVISOR");

  useEffect(() => {
    const load = async () => {
      if (!venueId || !eventId) return;
      setLoading(true);

      try {
        const data = await fetchEventById(eventId);
        setEventData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [venueId, eventId]);

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

  if (!eventData) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex items-center justify-center">
        <p className="text-[#DABFFF]/50 text-sm">L'evento non é stato trovato.</p>
      </div>
    );
  }

  const formatDate = (date) =>
    date.toLocaleDateString("it-IT", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date) =>
    date.toLocaleTimeString("it-IT", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const startDate = new Date(eventData.startTime);
  const endDate = eventData.endTime ? new Date(eventData.endTime) : null;

  const handleDelete = async (eventId) => {
    try {
      await deleteEvent(eventId, token);
      navigate(`/events/${venueId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a0526]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Torna indietro */}
        <button
          onClick={() => navigate(`/events/${venueId}`)}
          className="mb-8 inline-flex items-center gap-2 text-[#DABFFF]/60 hover:text-[#DABFFF] transition-colors cursor-pointer text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Torna agli eventi
        </button>

        {/* Immagine */}
        {eventData.imageUrl && (
          <div className="mb-8 max-w-md mx-auto">
            <img src={eventData.imageUrl} alt={eventData.title} className="w-full object-contain rounded-2xl" />
          </div>
        )}

        {/* Titolo */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#DABFFF] mb-2">{eventData.title}</h1>
        <p className="text-[#A06CD5] text-sm font-black uppercase tracking-widest mb-6">{eventData.venueName}</p>

        {/* Data e ora */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2 text-[#DABFFF]/70 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A06CD5]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span className="capitalize">{formatDate(startDate)}</span>
          </div>
          <div className="flex items-center gap-2 text-[#DABFFF]/70 text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#A06CD5]" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{formatTime(startDate)}{endDate && ` - ${formatTime(endDate)}`}</span>
          </div>
        </div>

        {/* Descrizione */}
        {eventData.description && (
          <p className="text-[#DABFFF]/80 leading-relaxed whitespace-pre-line text-base mb-10">{eventData.description}</p>
        )}

        {/* Bottoni */}
        <div className="flex flex-col gap-3">
          <NavLink
            to={`/booking/form?event_id=${eventData.id}&venue_id=${eventData.venueId}&venue_name=${encodeURIComponent(eventData.venueName)}`}
            className="w-full text-center bg-[#A06CD5] hover:bg-[#DABFFF] hover:text-[#320842] text-white font-black py-4 rounded-xl transition-all duration-200 text-sm tracking-widest uppercase shadow-lg shadow-[#A06CD5]/30"
          >
            Prenota
          </NavLink>

          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/events/${venueId}/form?event_id=${eventData.id}`)}
                className="flex-1 text-xs bg-[#DABFFF]/10 hover:bg-[#DABFFF]/20 text-[#DABFFF] font-black px-3 py-3 rounded-xl border border-[#DABFFF]/20 transition-all duration-200 uppercase tracking-wider"
              >
                Modifica
              </button>
              <button
                onClick={() => handleDelete(eventData.id)}
                className="flex-1 text-xs bg-red-400/10 hover:bg-red-400/20 text-red-300 font-black px-3 py-3 rounded-xl border border-red-400/30 transition-all duration-200 uppercase tracking-wider"
              >
                Elimina
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
