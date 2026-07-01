# MonkeyBar — Frontend

Frontend del progetto capstone MonkeyBar, un'app per la gestione di venue/bar con menu, eventi e prenotazioni.

## 🌐 Live Demo

**[monkeyfamilywebsite.netlify.app](https://monkeyfamilywebsite.netlify.app)**

## Stack

- React 19
- Vite
- Redux Toolkit + redux-persist
- React Router DOM v7
- Tailwind CSS v4
- Framer Motion
- Headless UI + Heroicons

## Requisiti

- Node.js >= 18
- npm

## Avvio in locale

```bash
npm install
npm run dev
```

## Variabili d'ambiente

Crea un file `.env` nella root del frontend:

```
VITE_API_URL=la_tua_api_url
VITE_CLOUDINARY_CLOUD_NAME=il_tuo_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=il_tuo_upload_preset
```

> Le immagini vengono caricate direttamente su Cloudinary dal frontend — il backend riceve solo la URL.

## Struttura

```
src/
├── assets/          # Immagini e CSS statici
├── components/      # Componenti riutilizzabili (Navbar, Footer, ProtectedRoute...)
├── features/
│   ├── auth/        # authSlice — gestione token e profilo utente
│   ├── helper/      # api.js — tutte le chiamate al backend
│   └── store/       # configurazione Redux store con redux-persist
└── pages/           # Una pagina per ogni route
```

## Pagine principali

| Pagina | Path | Accesso |
|---|---|---|
| Home | `/` | Pubblico |
| Venue | `/venue/:venueId` | Pubblico |
| Menu | `/menu/:venueId` | Pubblico |
| Item Detail | `/menu/:venueId/item/:id` | Pubblico |
| Eventi | `/events/:venueId` | Pubblico |
| Event Detail | `/events/:venueId/:eventId` | Pubblico |
| Booking Form | `/booking/form` | Pubblico |
| Login | `/login` | Pubblico |
| Admin Panel | `/admin` | OWNER / SUPERVISOR |
| Admin Bookings | `/admin/bookings` | OWNER / SUPERVISOR |
| Form Evento | `/events/:venueId/form` | OWNER / SUPERVISOR |
| Form Menu Item | `/admin/menu/form` | OWNER / SUPERVISOR |
| Registra Staff | `/admin/register-staff` | OWNER |
| Newsletter Iscritti | `/admin/newsletter` | OWNER |
| Cookie Policy | `/cookie` | Pubblico |
| Privacy Policy | `/privacy` | Pubblico |
| Termini di Servizio | `/termini` | Pubblico |

## Autenticazione

Il login restituisce un JWT token che viene salvato in Redux (con persist su localStorage).  
Le route protette usano `ProtectedRoute.jsx` che controlla la presenza del token prima di renderizzare la pagina.

## Newsletter

Il Footer contiene un form di iscrizione alla newsletter. Quando un utente si iscrive, l'email viene salvata nel DB tramite `POST /api/newsletter/subscribe`.

Quando l'OWNER o SUPERVISOR crea un nuovo evento, tutti gli iscritti ricevono automaticamente un'email di notifica via Resend.

L'OWNER può gestire gli iscritti dalla pagina `/admin/newsletter`:
- Lista iscritti con ricerca per email
- Rimozione singola con dialog di conferma
- Rimozione di tutti gli iscritti (in caso di data breach)
- Export CSV per conformità GDPR

## Cookie & Privacy

Il sito include un banner cookie con consenso granulare (necessari / analitici / marketing).  
Le Google Maps sono bloccate fino al consenso marketing.  
Sono presenti pagine statiche: Cookie Policy, Privacy Policy, Termini di Servizio.

## Ruoli

- **OWNER** — accede a tutto, gestisce tutte le venue
- **SUPERVISOR** — accede solo alla propria venue
