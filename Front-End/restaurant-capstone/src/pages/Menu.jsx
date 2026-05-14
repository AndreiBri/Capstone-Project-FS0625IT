import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchPublicMenu, fetchFullMenu, toogleMenuItemsVisibility } from "../features/helper/api";
import { useSelector } from "react-redux";

// --- Main Menu ---
const Menu = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const { profile } = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  const isAdmin = profile && (profile.role === "OWNER" || profile.role === "SUPERVISOR");

  const categories = ["all", ...new Set(menuItems.map((i) => i.category || "Altro"))];
  const filtered = activeCategory === "all" ? menuItems : menuItems.filter((i) => (i.category || "Altro") === activeCategory);

  useEffect(() => {
    const load = async () => {
      if (!venueId) return;
      setLoading(true);
      try {
        const data = isAdmin && token ? await fetchFullMenu(venueId, token) : await fetchPublicMenu(venueId);
        setMenuItems(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [venueId, isAdmin, token]);

  const handleToogleVisible = async (item) => {
    try {
      const update = await toogleMenuItemsVisibility(item.id, token);
      setMenuItems((prev) => prev.map((i) => (i.id === item.id ? update : i)));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#A06CD5] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#DABFFF]/50 text-sm">Caricamento menu...</p>
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
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#DABFFF] mb-1">Menu</h1>
          <p className="text-[#A06CD5] font-semibold text-sm uppercase tracking-widest">{menuItems[0]?.venueName ?? venueId}</p>
          {isAdmin && <p className="text-[#DABFFF]/30 text-xs mt-2">Modalità admin — puoi nascondere le voci dal menu pubblico</p>}
        </div>

        {/* Card */}
        <div className="bg-[#320842]/80 backdrop-blur-xl border border-[#DABFFF]/10 rounded-3xl overflow-hidden shadow-xl shadow-[#A06CD5]/10">
          {/* Tabs categorie */}
          <div className="px-6 pt-5 pb-4 border-b border-[#DABFFF]/10 flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`text-xs font-black px-4 py-2 rounded-full border transition-all duration-200 ${
                  activeCategory === c
                    ? "bg-[#A06CD5] border-[#A06CD5] text-white shadow-lg shadow-[#A06CD5]/30"
                    : "bg-transparent border-[#DABFFF]/20 text-[#DABFFF]/60 hover:border-[#A06CD5]/50 hover:text-[#DABFFF]"
                }`}
              >
                {c === "all" ? "Tutti" : c}
              </button>
            ))}
          </div>

          {/* Lista voci */}
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-[#DABFFF]/30">
              <div className="text-4xl mb-3">🍹</div>
              <p className="text-sm">Nessuna voce disponibile.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#DABFFF]/5">
              {filtered.map((item) => (
                <div key={item.id} className={`relative group ${!item.visible ? "opacity-40" : ""}`}>
                  {/* Riga cliccabile */}
                  <div
                    onClick={() => navigate(`/product/${venueId}/${item.id}`)}
                    className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer hover:bg-[#A06CD5]/5 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Immagine */}
                      <div className="shrink-0 w-20 h-20 rounded-2xl overflow-hidden border border-[#DABFFF]/10 bg-[#320842] flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#A06CD5] font-black text-2xl">{item.name?.charAt(0).toUpperCase()}</span>
                        )}
                      </div>

                      {/* Nome + badge */}
                      <div className="flex items-center gap-2 flex-wrap min-w-0">
                        <span className="font-black text-[#DABFFF]">{item.name}</span>
                        {activeCategory === "all" && (
                          <span className="text-xs px-2 py-0.5 rounded-full border border-[#DABFFF]/10 text-[#DABFFF]/40">{item.category}</span>
                        )}
                        {!item.visible && (
                          <span className="text-xs px-2 py-0.5 rounded-full border border-red-400/30 bg-red-400/10 text-red-300">Nascosto</span>
                        )}
                      </div>
                    </div>

                    <span className="font-black text-[#A06CD5] shrink-0">{item.price != null ? `${Number(item.price).toFixed(2)}€` : "—"}</span>
                  </div>

                  {/* Admin toggle */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToogleVisible(item);
                      }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black px-3 py-1.5 rounded-lg border opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-red-400/10 hover:bg-red-400/20 text-red-300 border-red-400/30"
                    >
                      {item.visible ? "Nascondi" : "Mostra"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nota allergeni */}
        <p className="text-center text-white text-xs mt-6">I nostri prodotti potrebbero contenere tracce di allergeni. Chiedi al personale per informazioni.</p>
      </div>
    </div>
  );
};

export default Menu;
