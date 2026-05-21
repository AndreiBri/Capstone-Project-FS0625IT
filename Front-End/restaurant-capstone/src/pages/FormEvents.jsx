import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { createEvent, fetchAllVenues, fetchEventById, updateEvent } from "../features/helper/api";

const FormEvents = () => {
  const { venueId } = useParams();
  const { profile } = useSelector((state) => state.auth);
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("event_id");
  const isEdit = Boolean(eventId);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [venues, setVenues] = useState([]);

  const token = useSelector((state) => state.auth.token);

  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    venueId: venueId || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  useEffect(() => {
    if (!isEdit) return;
    fetchEventById(eventId).then((data) => {
      setForm({
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        startDate: new Date(data.startTime).toISOString().split("T")[0],
        startTime: new Date(data.startTime).toTimeString().slice(0, 5),
        endDate: data.endTime ? new Date(data.endTime).toISOString().split("T")[0] : "",
        endTime: data.endTime ? new Date(data.endTime).toTimeString().slice(0, 5) : "",
        venueId: data.venueId,
      });
    });
  }, [eventId]);

  useEffect(() => {
    if (profile.role === "OWNER") {
      fetchAllVenues().then((data) => {
        setVenues(data);
      });
    }
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
    const result = await res.json();
    console.log(result);
    setForm((prev) => ({ ...prev, imageUrl: result.secure_url }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const startTime = new Date(`${form.startDate}T${form.startTime}`).toISOString();
    const endTime = form.endDate && form.endTime ? new Date(`${form.endDate}T${form.endTime}`).toISOString() : null;

    const payload = {
      title: form.title,
      description: form.description,
      imageUrl: form.imageUrl,
      startTime: startTime,
      endTime: endTime,
      venueId: form.venueId,
    };

    console.log(form.imageUrl);

    setLoading(true);
    try {
      if (isEdit) {
        await updateEvent(eventId, token, payload);
      } else {
        await createEvent(token, payload);
      }
      setSuccess(true);
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Qualcosa è andato storto. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-10 text-white">Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto mt-8">
      {error && <div className="p-4 bg-red-900/50 text-red-200 rounded">{error}</div>}

      {success && <div className="p-4 bg-green-900/50 text-green-200 rounded">{isEdit ? "Evento aggiornato!" : "Evento creato!"}</div>}

      <div>
        <label className="block text-white mb-2">Titolo</label>
        <input
          name="title"
          placeholder="Nome Evento *"
          required
          value={form.title}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
        />
      </div>

      {profile.role === "OWNER" && (
        <div>
          <label className="block text-white mb-2">Sede</label>
          <select
            name="venueId"
            value={form.venueId}
            onChange={handleChange}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
          >
            <option value="">Seleziona venue *</option>
            {venues.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <label className="block text-white mb-2">Data/Ora Inizio</label> <br />
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
          className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
        />
        <input
          type="time"
          name="startTime"
          value={form.startTime}
          onChange={handleChange}
          required
          className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
        />
        <span className=" text-white mb-2">Data/Ora Fine</span>
        <br />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
        />
        <input
          type="time"
          name="endTime"
          value={form.endTime}
          onChange={handleChange}
          required
          className="bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
        />
      </div>

      <div>
        <textarea
          name="description"
          rows="5"
          value={form.description}
          onChange={handleChange}
          className="w-full bg-gray-800 border border-gray-700 rounded px-4 py-2 text-white"
        />
      </div>

      <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
        <label className="cursor-pointer text-indigo-400">
          Upload Immagine
          <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </label>
      </div>

      <button type="submit" disabled={uploading} className="px-6 py-2 mb-8 bg-[#A06CD5] text-white rounded cursor-pointer">
        {uploading ? "Uploading..." : isEdit ? "Aggiorna Evento" : "Crea Evento"}
      </button>
    </form>
  );
};

export default FormEvents;
