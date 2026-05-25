import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { createMenuItem, fetchFullMenu, fetchVenue, getMenuItemById, updateMenuItem } from "../features/helper/api";

const FormMenuItem = () => {
  const { venueId } = useParams();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("item_id");

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [allergenSuggestions, setAllergenSuggestions] = useState([]);
  const [customAllergen, setCustomAllergen] = useState("");

  const COMMON_ALLERGENS = ["Glutine", "Lattosio", "Uova", "Frutta secca", "Arachidi", "Pesce", "Crostacei", "Soia", "Sedano", "Senape", "Sesamo", "Lupini", "Molluschi", "Anidride solforosa"];
  const navigate = useNavigate();

  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    imageUrl: "",
    allergens: [],
    venueId: venueId || "",
  });

  // ------ carica categorie e allergeni già usati nel menu per suggerimenti nel form
  useEffect(() => {
    if (!venueId || !token) return;
    fetchFullMenu(venueId, token)
      .then((data) => {
        setCategories([...new Set(data.map((i) => i.category).filter(Boolean))]);
        setAllergenSuggestions([...new Set(data.flatMap((i) => i.allergens ?? []).filter(Boolean))]);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, venueId: data[0].venueId }));
        } else {
          fetchVenue(venueId).then((v) => setForm((prev) => ({ ...prev, venueId: v.id }))).catch(() => {});
        }
      })
      .catch(() => {});
  }, [venueId, token]);

  // ------ se siamo in modifica, carica i dati dell'item esistente nel form
  useEffect(() => {
    if (!itemId) return;

    const load = async () => {
      try {
        const data = await getMenuItemById(itemId);
        setForm({
          name: data.name,
          category: data.category,
          price: data.price,
          description: data.description ?? "",
          imageUrl: data.imageUrl ?? "",
          allergens: data.allergens ?? [],
          venueId: data.venueId,
        });
      } catch {
        setError("Impossibile caricare l'item");
      }
    };
    load();
  }, [itemId]);

  // ------ upload diretto su Cloudinary, nel form viene salvata solo la URL
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
    const result = await res.json();
    setForm((prev) => ({ ...prev, imageUrl: result.secure_url }));
    setImagePreview(result.secure_url);
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (itemId) {
        await updateMenuItem(itemId, token, form);
      } else {
        await createMenuItem(token, form);
      }
      navigate(`/menu/${venueId}`);
    } catch {
      setError("Operazione fallita, riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#1C0127] to-[#320842] px-4 py-10">
      <div className="max-w-lg mx-auto">
        <button type="button" onClick={() => navigate(-1)} className="text-[#DABFFF]/50 hover:text-[#DABFFF] text-sm mb-6 flex items-center gap-1 transition">
          Torna al menu
        </button>

        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">{itemId ? "Modifica Item" : "Crea Item"}</h1>
        <p className="text-[#DABFFF]/40 text-sm mb-8">{itemId ? "Modifica i dati del prodotto" : "Aggiungi un nuovo prodotto al menu"}</p>

        {error && <div className="mb-6 p-4 bg-red-600/80 text-white rounded-lg text-center font-medium">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full p-4 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
            required
          />

          <input
            type="text"
            placeholder="Categoria"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full p-4 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
            list="categories-list"
            required
          />
          <datalist id="categories-list">
            {categories.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>

          <input
            type="number"
            placeholder="Prezzo (€)"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full p-4 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none"
            min="0"
            step="0.01"
            required
          />

          <div className="w-full p-4 rounded-lg bg-[#320842]/60 border border-[#DABFFF]/30">
            <p className="text-[#DABFFF]/60 text-xs font-black mb-3">Allergeni</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {[...new Set([...COMMON_ALLERGENS, ...allergenSuggestions])].map((a) => (
                <label key={a} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.allergens.includes(a)}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        allergens: e.target.checked
                          ? [...form.allergens, a]
                          : form.allergens.filter((x) => x !== a),
                      })
                    }
                    className="accent-[#A06CD5]"
                  />
                  <span className="text-xs text-[#DABFFF]/70">{a}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Aggiungi allergene custom..."
                value={customAllergen}
                onChange={(e) => setCustomAllergen(e.target.value)}
                className="flex-1 p-2 rounded-lg bg-[#1a0526] text-white text-sm border border-[#DABFFF]/20 focus:border-[#A06CD5] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  const val = customAllergen.trim();
                  if (val && !form.allergens.includes(val)) {
                    setForm({ ...form, allergens: [...form.allergens, val] });
                  }
                  setCustomAllergen("");
                }}
                className="px-3 py-2 bg-[#A06CD5] text-white text-xs font-black rounded-lg hover:bg-[#8a5bc0] transition"
              >
                +
              </button>
            </div>
            {form.allergens.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {form.allergens.map((a) => (
                  <span
                    key={a}
                    onClick={() => setForm({ ...form, allergens: form.allergens.filter((x) => x !== a) })}
                    className="text-xs px-2 py-1 rounded-full bg-[#A06CD5]/20 text-[#DABFFF] border border-[#A06CD5]/30 cursor-pointer hover:bg-red-400/20 hover:border-red-400/30 hover:text-red-300 transition"
                  >
                    {a} ×
                  </span>
                ))}
              </div>
            )}
          </div>

          <textarea
            placeholder="Descrizione (opzionale)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full p-4 rounded-lg bg-[#320842]/60 text-white border border-[#DABFFF]/30 focus:border-[#A06CD5] focus:outline-none resize-none"
          />

          <div className="border-2 border-dashed border-[#DABFFF]/20 rounded-xl p-6 text-center">
            {imagePreview || form.imageUrl ? (
              <img src={imagePreview ?? form.imageUrl} className="max-h-40 mx-auto rounded-lg mb-3 object-cover" />
            ) : (
              <p className="text-[#DABFFF]/30 text-sm mb-3">Nessuna immagine selezionata</p>
            )}
            <label className="cursor-pointer text-[#A06CD5] font-black text-sm hover:text-[#8a5bc0] transition">
              {uploading ? "Caricamento..." : "Carica Immagine"}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#A06CD5] text-white py-4 rounded-lg font-bold hover:bg-[#8a5bc0] transition shadow-lg shadow-[#A06CD5]/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Salvataggio..." : itemId ? "Salva Modifiche" : "Crea Item"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FormMenuItem;
