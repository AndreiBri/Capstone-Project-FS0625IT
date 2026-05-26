# MonkeyBar

Progetto capstone full-stack — app per la gestione di venue/bar con menu, eventi e prenotazioni.

## 🌐 Live Demo

**[monkeyfamilywebsite.netlify.app](https://monkeyfamilywebsite.netlify.app)**

## Struttura del progetto

```
Capstone-Project-FS0625IT/
├── Back-End/backend/        # Spring Boot API
└── Front-End/restaurant-capstone/   # React + Vite
```

## Stack

**Backend** — Java 25, Spring Boot, Spring Security + JWT, PostgreSQL, Cloudinary  
**Frontend** — React 19, Vite, Redux Toolkit, Tailwind CSS, React Router DOM v7

## Avvio in locale

**1. Backend**

```bash
cd Back-End/backend
./mvnw spring-boot:run
```

La porta è definita dalla variabile `PORT` in `env.properties`. Richiede PostgreSQL attivo e il file `env.properties` configurato (vedi README backend).

**2. Frontend**

```bash
cd Front-End/restaurant-capstone
npm install
npm run dev
```

Richiede il file `.env` configurato (vedi README frontend).

## Documentazione

- [Backend README](Back-End/backend/README.md)
- [Frontend README](Front-End/restaurant-capstone/README.md)

## Funzionalità principali

- Visualizzazione pubblica di menu ed eventi per venue
- Prenotazioni tavoli con form pubblico
- Admin panel per OWNER e SUPERVISOR
- Gestione menu (crea, modifica, nascondi, elimina prodotti)
- Gestione eventi (crea, modifica, elimina)
- Gestione prenotazioni (conferma, rifiuta, archivia)
- Registrazione SUPERVISOR da parte dell'OWNER
- Upload immagini via Cloudinary

## Ruoli

| Ruolo | Come viene creato | Accesso |
|---|---|---|
| OWNER | Manualmente via DB | Tutto |
| SUPERVISOR | Registrato dall'OWNER via app | Solo la propria venue |
