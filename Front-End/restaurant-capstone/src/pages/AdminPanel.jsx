import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllVenues } from "../features/helper/api";

const ROLE_LABELS = {
  OWNER: "Proprietario",
  SUPERVISOR: "Supervisore",
};

const ROLE_COLORS = {
  OWNER: "bg-[#A06CD5]/20 text-[#A06CD5] border border-[#A06CD5]/40",
  SUPERVISOR: "bg-amber-400/10 text-amber-300 border border-amber-400/30",
};

const buildFeatures = (venueId) => [
  {
    id: "bookings",
    title: "Prenotazioni",
    description: "Gestisci e conferma le prenotazioni online",
    icon: "📋",
    path: "/admin/bookings",
    roles: ["OWNER", "SUPERVISOR"],
    color: "from-amber-400/20 to-amber-400/5",
    border: "border-amber-400/30",
    accent: "text-amber-300",
  },
  {
    id: "menu",
    title: "Gestisci Menu",
    description: "Modifica voci, categorie e visibilità del menu",
    icon: "🍹",
    path: `/menu/${venueId}`,
    roles: ["OWNER", "SUPERVISOR"],
    color: "from-pink-400/20 to-pink-400/5",
    border: "border-pink-400/30",
    accent: "text-pink-300",
  },
  {
    id: "events",
    title: "Crea Evento",
    description: "Pubblica nuovi eventi per il tuo locale",
    icon: "🎉",
    path: `/events/${venueId}/form`,
    roles: ["OWNER", "SUPERVISOR"],
    color: "from-purple-400/20 to-purple-400/5",
    border: "border-purple-400/30",
    accent: "text-purple-300",
  },
  {
    id: "register-staff",
    title: "Registra Staff",
    description: "Aggiungi supervisori al tuo locale",
    icon: "👤",
    path: "/admin/register-staff",
    roles: ["OWNER"],
    color: "from-emerald-400/20 to-emerald-400/5",
    border: "border-emerald-400/30",
    accent: "text-emerald-300",
  },
];

export default function AdminPanel() {
  const { profile } = useSelector((state) => state.auth);

  const [venues, setVenues] = useState([]);
  const [pendingfeature, setPendingFeature] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const role = profile?.role ?? "SUPERVISOR";
  const venueId = profile?.venueId;
  const features = buildFeatures(venueId).filter((f) => f.roles.includes(role));

  useEffect(() => {
    if (role === "OWNER") {
      fetchAllVenues()
        .then(setVenues)
        .catch(() => {
          setErrorMsg("Impossibile caricare le venues.");
        });
    }
  }, [role]);

  return (
    <div className="min-h-screen bg-[#1a0526] px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#DABFFF]">Pannello Admin</h1>
            <span className={`text-xs font-black px-3 py-1 rounded-full ${ROLE_COLORS[role] ?? ""}`}>{ROLE_LABELS[role] ?? role}</span>
          </div>
          <p className="text-[#DABFFF]/50 text-sm">
            Ciao {profile?.alias ?? ""}! Hai accesso a {features.length} funzionalità.
          </p>
        </div>

        {/* Error */}
        {errorMsg && <div className="mb-4 p-4 bg-red-600/80 text-white rounded-lg text-center font-medium">{errorMsg}</div>}

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => {
                if (role === "OWNER" && feature.path.includes("null") && feature.id !== "events") {
                  setPendingFeature(feature);
                } else {
                  navigate(feature.path);
                }
              }}
              className={`text-left bg-linear-to-br ${feature.color} border ${feature.border} rounded-3xl p-6 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 group`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className={`font-black text-lg text-[#DABFFF] mb-1`}>{feature.title}</h3>
              <p className="text-[#DABFFF]/50 text-xs leading-relaxed">{feature.description}</p>
              <div className={`mt-4 text-xs font-black ${feature.accent} opacity-0 group-hover:opacity-100 transition-opacity`}>Vai</div>
            </button>
          ))}
        </div>

        {/* Venue Selector — OWNER only, appare quando clicca una card con venueId richiesto */}
        {pendingfeature && (
          <div className="mt-6 p-5 bg-[#320842]/80 border border-[#DABFFF]/10 rounded-2xl flex flex-col gap-3">
            <p className="text-[#DABFFF] font-black text-sm">Seleziona il locale per: {pendingfeature.title}</p>
            <select
              className="w-full p-3 rounded-lg bg-[#1a0526] text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
              onChange={(e) => navigate(pendingfeature.path.replace("null", e.target.value))}
              defaultValue=""
            >
              <option value="" disabled>
                Scegli venue...
              </option>
              {venues.map((v) => (
                <option key={v.slug} value={v.slug}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Nota SUPERVISOR */}
        {role === "SUPERVISOR" && (
          <div className="mt-8 border border-[#DABFFF]/10 bg-[#320842]/40 rounded-2xl px-5 py-4">
            <p className="text-[#DABFFF]/30 text-xs">Hai accesso a prenotazioni, menu ed eventi. Contatta il proprietario per registrare nuovo staff.</p>
          </div>
        )}
      </div>
    </div>
  );
}
