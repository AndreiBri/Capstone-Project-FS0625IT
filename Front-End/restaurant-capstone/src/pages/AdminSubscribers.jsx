import { useState, useEffect } from "react";
import { fetchSubscribers, deleteSubscriber, deleteAllSubscribers } from "../features/helper/api";
import { useSelector } from "react-redux";

// --- Confirm Dialog -------------------------------------------
function ConfirmDialog({ email, onConfirm, onCancel }) {
  return (
    <div style={{ minHeight: "100vh", background: "rgba(0,0,0,0.7)" }} className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-[#320842] border border-[#DABFFF]/20 rounded-3xl shadow-2xl p-6 max-w-sm w-full text-center">
        <p className="text-[#DABFFF]/80 font-medium mb-2 text-sm leading-relaxed">Rimuovere questo iscritto?</p>
        <p className="text-[#A06CD5] text-xs mb-6 font-black">{email}</p>
        <p className="text-[#DABFFF]/40 text-xs mb-6">L'utente non riceverà più le newsletter. L'operazione è irreversibile.</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 border border-[#DABFFF]/20 text-[#DABFFF]/60 hover:border-[#DABFFF]/40 hover:text-[#DABFFF] font-black py-2.5 rounded-xl transition-all duration-200 text-sm"
          >
            Annulla
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500/80 hover:bg-red-500 text-white font-black py-2.5 rounded-xl transition-all duration-200 text-sm"
          >
            Rimuovi
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Main Subscribers Page ------------------------------------
export default function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState(null);
  const [success, setSuccess] = useState("");
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const token = useSelector((state) => state.auth.token);

  const loadSubscribers = async () => {
    setLoading(true);
    const data = await fetchSubscribers(token);
    setSubscribers(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await loadSubscribers();
    };
    loadData();
  }, []);

  const handleDelete = async () => {
    if (!dialog) return;
    const ok = await deleteSubscriber(token, dialog.id);

    if (ok) {
      setSuccess(`${dialog.email} rimosso dalla newsletter.`);
      loadSubscribers();
      setTimeout(() => setSuccess(""), 4000);
    }
    setDialog(null);
  };

  const handleDeleteAll = async () => {
    await deleteAllSubscribers(token);
    setSubscribers([]);
    setConfirmDeleteAll(false);
    setSuccess("Tutti gli iscritti sono stati rimossi.");
    setTimeout(() => setSuccess(""), 4000);
  };

  const exportCSV = () => {
    const headers = ["Email", "Iscritto il"];
    const rows = filtered.map((s) => [s.email, s.createdAt?.split("T")[0]]);
    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `iscritti_newsletter_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#1a0526] px-4 py-10">
      {dialog && <ConfirmDialog email={dialog.email} onConfirm={handleDelete} onCancel={() => setDialog(null)} />}
      {confirmDeleteAll && <ConfirmDialog email="tutti gli iscritti" onConfirm={handleDeleteAll} onCancel={() => setConfirmDeleteAll(false)} />}

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#DABFFF]">Iscritti Newsletter</h1>
            <p className="text-[#DABFFF]/50 mt-1 text-sm">{subscribers.length} iscritti totali · Gestione consensi GDPR</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={exportCSV}
              disabled={filtered.length === 0}
              className="text-xs bg-[#DABFFF]/10 hover:bg-[#DABFFF]/20 text-[#DABFFF] font-black px-4 py-2.5 rounded-xl border border-[#DABFFF]/20 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ↓ Esporta CSV
            </button>
            <button
              onClick={() => setConfirmDeleteAll(true)}
              disabled={subscribers.length === 0}
              className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300 font-black px-4 py-2.5 rounded-xl border border-red-400/30 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Elimina tutti
            </button>
          </div>
        </div>

        {/* Success message */}
        {success && <div className="mb-4 text-emerald-400 text-sm border border-emerald-400/30 bg-emerald-400/10 rounded-xl py-3 px-4">✅ {success}</div>}

        {/* GDPR notice */}
        <div className="mb-6 border border-[#DABFFF]/10 bg-[#320842]/40 rounded-2xl py-3 px-4">
          <p className="text-[#DABFFF]/40 text-xs leading-relaxed">
            In caso di richiesta di cancellazione da parte di un utente, rimuovilo entro 30 giorni come previsto dal GDPR (Art. 17 — Diritto alla
            cancellazione). Conserva prova della richiesta e dell'avvenuta cancellazione.
          </p>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cerca per email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-sm bg-[#320842]/60 border border-[#DABFFF]/20 hover:border-[#A06CD5]/60 focus:border-[#A06CD5] rounded-xl px-4 py-2.5 text-sm text-[#DABFFF] placeholder-[#DABFFF]/30 focus:outline-none focus:ring-1 focus:ring-[#A06CD5]/50 transition-all duration-200"
          />
        </div>

        {/* Lista */}
        <div className="bg-[#320842]/80 backdrop-blur-xl border border-[#DABFFF]/10 rounded-3xl overflow-hidden shadow-xl shadow-[#A06CD5]/10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-8 h-8 border-2 border-[#A06CD5] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#DABFFF]/40 text-sm">Caricamento iscritti...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#DABFFF]/30">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">Nessun iscritto trovato.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#DABFFF]/5">
              {filtered.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-6 py-4 hover:bg-[#A06CD5]/5 transition-colors duration-150">
                  <div>
                    <div className="font-semibold text-[#DABFFF] text-sm">{s.email}</div>
                    <div className="text-[#DABFFF]/40 text-xs mt-0.5">
                      Iscritto il{" "}
                      {new Date(s.createdAt).toLocaleDateString("it-IT", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <button
                    onClick={() => setDialog({ id: s.id, email: s.email })}
                    className="text-xs bg-red-400/10 hover:bg-red-400/20 text-red-300 font-black px-3 py-1.5 rounded-lg border border-red-400/30 transition-all duration-200 shrink-0"
                  >
                    Rimuovi
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-[#DABFFF]/20 mt-4 text-center">Solo il proprietario può accedere a questa pagina · </p>
      </div>
    </div>
  );
}
