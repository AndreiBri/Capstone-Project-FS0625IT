import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchEvents } from "../features/helper/api";

// --- Eventi Menu ---
const Eventi = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = profile && (profile.role === "OWNER" || profile.role === "SUPERVISOR");

  useEffect(() => {
    const load = async () => {
      if (!venueId) return;
      setLoading(true);
      try {
        const data = await fetchEvents(venueId);
        setEvents(data);
      } catch (err) {
        console.error(err);
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
};
export default Eventi;
