const BASE_URL = import.meta.env.VITE_API_URL;

// ------------- VENUE -----------------------

export const fetchVenue = async (slug) => {
  const res = await fetch(`${BASE_URL}/api/venues/${slug}`);
  if (!res.ok) throw new Error("Venue non trovata");
  return res.json();
};

export const fetchAllVenues = async () => {
  const res = await fetch(`${BASE_URL}/api/venues`);
  if (!res.ok) throw new Error("Vuene non trovate");
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

    return true;
  } catch (err) {
    console.error(`Fallita eliminazione:`, err);
    return false;
  }
};

export const updateEvent = async (eventId, token, eventData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/events/${eventId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    if (!res.ok) throw new Error(`Errore: ${res.status}`);

    console.log("Evento modificato con successo");
    return true;
  } catch (err) {
    console.error(`Fallita modifica:`, err);
    return false;
  }
};

export const createEvent = async (token, eventData) => {
  try {
    const res = await fetch(`${BASE_URL}/api/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(eventData),
    });
    if (!res.ok) throw new Error(`Errore: ${res.status}`);

    return true;
  } catch (err) {
    console.error(`Fallita creazione evento:`, err);
    return false;
  }
};

export const fetchEventById = async (id) => {
  const res = await fetch(`${BASE_URL}/api/events/item/${id}`);
  if (!res.ok) throw new Error("Evento non trovato");

  return res.json();
};

// ----------- AUTH ----------------------

export const loginUser = async (email, password) => {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Credenziali non valide");

  return res.json();
};

export const registerUser = async (email, password, role, venueSlug, token) => {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password, role, venueSlug }),
  });

  if (!res.ok) throw new Error("Registrazione fallita");

  return res.json();
};

// ----------- BOOKING ----------------------

export const createBooking = async (customerName, customerEmail, customerPhone, bookingDate, guests, venueId) => {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ customerName, customerEmail, customerPhone, bookingDate, guests, venueId }),
  });

  if (!res.ok) throw new Error("Prenotazione fallita");

  return res.json();
};
