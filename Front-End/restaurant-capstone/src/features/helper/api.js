const BASE_URL = import.meta.env.VITE_API_URL;

// ------------- VENUE -----------------------

export const fetchVenue = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/venues/${slug}`);
  if (!res.ok) throw new Error("Venue non trovata");
  return res.json();
};

//  ------------ MENU ---------------------

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

// ------------ EVENTI ---------------------

export const fetchEvents = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/events/${slug}`);
  if (!res.ok) throw new Error("Eventi non trovati");
  return res.json();
};

export const deleteEvent = async (eventId, token) => {
  try {
    const res = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`Errore: ${res.status}`);

    console.log("Evento eliminato con successo");
    return true;
  } catch (err) {
    console.error(`Failed to delete:`, err);
    return false;
  }
};
