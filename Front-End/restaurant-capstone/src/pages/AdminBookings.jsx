import { useEffect, useState, useMemo } from "react";
import { archiveBooking, confirmBooking, fetchBookingsByVenue, rejectBooking, fetchAllVenues } from "../features/helper/api";
import { useSelector } from "react-redux";

const STATUS_COLORS = {
  PENDING: "bg-amber-400/10 text-amber-300 border border-amber-400/30",
  CONFIRMED: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/30",
  REJECTED: "bg-red-400/10 text-red-300 border border-red-400/30",
};

const STATUS_LABELS = {
  PENDING: "In attesa",
  CONFIRMED: "Confermata",
  REJECTED: "Rifiutata",
};

const inputClass =
  "bg-[#320842]/60 border border-[#DABFFF]/20 hover:border-[#A06CD5]/60 focus:border-[#A06CD5] rounded-xl px-4 py-3 text-sm text-[#DABFFF] focus:outline-none focus:ring-1 focus:ring-[#A06CD5]/50 transition-all duration-200";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.7)" }} className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-[#320842] border border-[#DABFFF]/20 rounded-3xl shadow-2xl shadow-[#A06CD5]/20 p-6 max-w-sm w-full text-center">
        <p className="text-[#DABFFF]/80 font-medium mb-6 text-sm leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 border border-[#DABFFF]/20 text-[#DABFFF]/60 hover:text-[#DABFFF] font-black py-2.5 rounded-xl transition-all text-sm">
            Annulla
          </button>
          <button onClick={onConfirm} className="flex-1 bg-[#A06CD5] hover:bg-[#DABFFF] hover:text-[#320842] text-white font-black py-2.5 rounded-xl transition-all text-sm">
            Conferma
          </button>
        </div>
      </div>
    </div>
  );
}

function exportToCSV(bookings) {
  const headers = ["Nome", "Email", "Telefono", "Data", "Ospiti", "Stato"];
  const rows = bookings.map((b) => [
    b.customerName,
    b.customerEmail,
    b.customerPhone,
    b.bookingDate?.split("T")[0],
    b.guests,
    STATUS_LABELS[b.status] ?? b.status,
  ]);
  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `prenotazioni_${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

const AdminBookings = () => {
  const { profile } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);

  const isOwner = profile?.role === "OWNER";

  const [venues, setVenues] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState(profile?.venueId ?? "");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);

  useEffect(() => {
    if (!isOwner) return;
    const load = async () => {
      try {
        const data = await fetchAllVenues();
        setVenues(data);
      } catch (err) {
        console.error("Errore fetch venues:", err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!selectedVenueId) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchBookingsByVenue(selectedVenueId, token);
        setBookings(data);
      } catch (err) {
        setBookings([]);
        console.error("Errore fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedVenueId]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus = filterStatus ? b.status === filterStatus : true;
      const matchDate = filterDate ? b.bookingDate?.startsWith(filterDate) : true;
      const matchSearch = search
        ? b.customerName?.toLowerCase().includes(search.toLowerCase()) || b.customerEmail?.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchStatus && matchDate && matchSearch;
    });
  }, [bookings, filterStatus, filterDate, search]);

  const counts = {
    all: bookings.length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    REJECTED: bookings.filter((b) => b.status === "REJECTED").length,
  };

  const handleAction = async (id, action) => {
    let updated;
    if (action === "confirm") updated = await confirmBooking(id, token);
    if (action === "reject") updated = await rejectBooking(id, token);
    if (action === "archive") updated = await archiveBooking(id, token);
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    }
    setDialog(null);
  };

  return (
    <div className="min-h-screen bg-[#1a0526] px-4 py-10">
      {dialog && (
        <ConfirmDialog
          message={dialog.message}
          onConfirm={() => handleAction(dialog.id, dialog.action)}
          onCancel={() => setDialog(null)}
        />
      )}

      <div className="max-w-5xl mx-auto">
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#DABFFF]">Prenotazioni</h1>
          <button
            onClick={() => exportToCSV(filteredBookings)}
            disabled={filteredBookings.length === 0}
            className="text-xs bg-[#DABFFF]/10 hover:bg-[#DABFFF]/20 text-[#DABFFF] font-black px-4 py-2.5 rounded-xl border border-[#DABFFF]/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ↓ Esporta CSV
          </button>
        </div>

        {isOwner && (
          <div className="mb-6">
            <label className="block text-xs font-black tracking-widest text-[#A06CD5] uppercase mb-1.5">Sede</label>
            <select value={selectedVenueId} onChange={(e) => setSelectedVenueId(e.target.value)} className={inputClass}>
              <option value="">Seleziona una sede</option>
              {venues.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </div>
        )}

        {!selectedVenueId ? (
          <p className="text-[#DABFFF]/40 text-sm">Seleziona una sede per vedere le prenotazioni.</p>
        ) : (
          <>
            {/* Counter cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[
                { key: "all", label: "Tutte" },
                { key: "PENDING", label: "In attesa" },
                { key: "CONFIRMED", label: "Confermate" },
                { key: "REJECTED", label: "Rifiutate" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilterStatus(key === "all" ? "" : key)}
                  className={`rounded-2xl px-4 py-3 text-left border transition-all duration-200 ${
                    (key === "all" && !filterStatus) || filterStatus === key
                      ? "bg-[#A06CD5] border-[#A06CD5] text-white shadow-lg shadow-[#A06CD5]/30"
                      : "bg-[#320842]/80 border-[#DABFFF]/10 text-[#DABFFF]/70 hover:border-[#A06CD5]/40"
                  }`}
                >
                  <div className="text-2xl font-black">{counts[key === "all" ? "all" : key]}</div>
                  <div className="text-xs mt-0.5 opacity-70">{label}</div>
                </button>
              ))}
            </div>

            {/* Filtri */}
            <div className="flex gap-3 mb-6 flex-wrap">
              <input
                type="text"
                placeholder="Cerca per nome o email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`${inputClass} flex-1 min-w-[200px]`}
              />
              <input type="date" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} className={inputClass} />
              {(filterDate || search) && (
                <button onClick={() => { setFilterDate(""); setSearch(""); }} className="text-xs text-[#DABFFF]/40 hover:text-[#DABFFF] px-3 py-2 rounded-xl border border-[#DABFFF]/10 transition-all">
                  Reset
                </button>
              )}
            </div>

            {/* Lista */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-8 h-8 border-2 border-[#A06CD5] border-t-transparent rounded-full animate-spin" />
                <p className="text-[#DABFFF]/40 text-sm">Caricamento prenotazioni...</p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#DABFFF]/30">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm">Nessuna prenotazione trovata.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredBookings.map((booking) => (
                  <div key={booking.id} className="bg-[#320842]/80 border border-[#DABFFF]/10 rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <p className="text-[#DABFFF] font-black text-lg">{booking.customerName}</p>
                        <p className="text-[#DABFFF]/50 text-xs">{booking.customerEmail} · {booking.customerPhone}</p>
                      </div>
                      <span className={`text-xs font-black px-3 py-1 rounded-full ${STATUS_COLORS[booking.status]}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </div>

                    <div className="flex gap-4 text-sm text-[#DABFFF]/70 mb-4">
                      <span>📅 {new Date(booking.bookingDate).toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                      <span>👥 {booking.guests} persone</span>
                    </div>

                    {booking.notes && (
                      <p className="text-[#DABFFF]/50 text-xs italic mb-4">📝 {booking.notes}</p>
                    )}

                    <div className="flex gap-2">
                      {booking.status !== "CONFIRMED" && (
                        <button
                          onClick={() => handleAction(booking.id, "confirm")}
                          className="text-xs font-black px-4 py-2 rounded-xl bg-emerald-400/10 hover:bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 transition-all"
                        >
                          Conferma
                        </button>
                      )}
                      {booking.status !== "REJECTED" && (
                        <button
                          onClick={() => setDialog({ id: booking.id, action: "reject", message: "Vuoi rifiutare questa prenotazione?" })}
                          className="text-xs font-black px-4 py-2 rounded-xl bg-red-400/10 hover:bg-red-400/20 text-red-300 border border-red-400/30 transition-all"
                        >
                          Rifiuta
                        </button>
                      )}
                      <button
                        onClick={() => setDialog({ id: booking.id, action: "archive", message: "Vuoi archiviare questa prenotazione?" })}
                        className="text-xs font-black px-4 py-2 rounded-xl bg-[#DABFFF]/5 hover:bg-[#DABFFF]/10 text-[#DABFFF]/40 border border-[#DABFFF]/10 transition-all"
                      >
                        Archivia
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBookings;
