const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchVenue = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/venues/${slug}`);
  if (!res.ok) throw new Error("Venue non trovata");
  return res.json();
};
