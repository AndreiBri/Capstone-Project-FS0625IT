import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMenuItemById } from "../features/helper/api";

const ItemDetail = () => {
  const { venueId, itemId } = useParams();
  const [item, setItem] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!venueId || !itemId) return;

      try {
        const data = await getMenuItemById(itemId);
        setItem(data);
      } catch {
        setError("Impossibile caricare il prodotto, riprova.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [venueId, itemId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#A06CD5] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#DABFFF]/50 text-sm">Caricamento item...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a0526] flex flex-col items-center justify-center gap-4">
        <p className="text-red-400 text-sm">{error}</p>
        <button onClick={() => navigate(-1)} className="text-[#DABFFF]/50 hover:text-[#DABFFF] text-sm transition">
          Torna indietro
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a0526] px-4 py-10">
      <div className="max-w-2xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="text-[#DABFFF]/50 hover:text-[#DABFFF] text-sm mb-6 flex items-center gap-1 transition">
          Torna al menu
        </button>

        {/* Immagine */}
        {item.imageUrl && (
          <img src={item.imageUrl} alt={item.name} className="w-full max-w-md mx-auto rounded-3xl object-cover mb-8 border border-[#DABFFF]/10" />
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-3xl font-black text-[#DABFFF] tracking-tight">{item.name}</h1>
            <span className="text-xs px-3 py-1 rounded-full border border-[#DABFFF]/10 text-[#DABFFF]/40">{item.category}</span>
          </div>
          <p className="text-2xl font-black text-[#A06CD5]">{item.price != null ? `${Number(item.price).toFixed(2)}€` : "—"}</p>
        </div>

        {/* Descrizione */}
        {item.description && <p className="text-[#DABFFF]/70 text-sm leading-relaxed mb-6">{item.description}</p>}

        {/* Allergeni */}
        {item.allergens?.length > 0 && (
          <div className="border border-amber-400/20 bg-amber-400/5 rounded-2xl px-5 py-4">
            <p className="text-amber-300 text-xs font-black mb-2">Allergeni</p>
            <div className="flex flex-wrap gap-2">
              {item.allergens.map((a) => (
                <span key={a} className="text-xs px-3 py-1 rounded-full border border-amber-400/30 text-amber-200 bg-amber-400/10">
                  {a}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
