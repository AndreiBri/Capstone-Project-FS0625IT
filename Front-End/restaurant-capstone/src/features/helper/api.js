const BASE_URL = import.meta.env.VITE_API_URL;

export const fetchVenue = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/venues/${slug}`);
  if (!res.ok) throw new Error("Venue non trovata");
  return res.json();
};

export const fetchPublicMenu = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/menu/${slug}`);
  if (!res.ok) throw new Error("Menu della venue non trovato");

  return res.json();
};

export const fetchFullMenu = async (slug, token) => {
  const res = await fetch(`${BASE_URL}/api/menu/${slug}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Menu della venue non trovato");
  return res.json();
};

export const toogleMenuItemsVisibility = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/menu/${id}/visibility`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Errore toogle visibilita");
  return res.json();
};
