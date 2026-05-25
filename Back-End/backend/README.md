# MonkeyBar — Backend

Backend del progetto capstone MonkeyBar, API REST per la gestione di venue, menu, eventi e prenotazioni.

## Stack

- Java 25
- Spring Boot 4.0.6
- Spring Security + JWT
- Spring Data JPA + Hibernate
- PostgreSQL
- Cloudinary (gestione immagini)

## Requisiti

- JDK 25
- PostgreSQL in locale
- Maven

## Avvio in locale

```bash
./mvnw spring-boot:run
```

## Configurazione

> Non committare mai `env.properties` — aggiungilo al `.gitignore` prima di crearlo.

Crea il file `env.properties` nella root del progetto backend:

```properties
PORT=la_tua_porta

DB_PORT=la_tua_porta_db
DB_NAME=il_tuo_db
DB_USERNAME=il_tuo_username
DB_PASSWORD=la_tua_password

CLOUDINARY_NAME=il_tuo_cloud_name
CLOUDINARY_API_KEY=la_tua_api_key
CLOUDINARY_API_SECRET=il_tuo_api_secret

JWT_SECRET=il_tuo_secret

RESEND_API_KEY=la_tua_api_key

ALLOWED_ORIGINS=il_tuo_origin
```

## Struttura

```
src/main/java/com/monkeybar/backend/
├── controller/      # Endpoint REST
├── service/         # Business logic
├── repository/      # JPA repositories
├── entity/          # Tabelle DB
├── dto/
│   ├── request/     # Dati in entrata
│   └── response/    # Dati in uscita
├── mapper/          # Entity → DTO
├── security/        # JWT + Spring Security
├── exception/       # Global error handling
└── enums/           # Role enum
```

## Endpoints

### Auth

| Method | URL | Auth | Descrizione |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | Login |
| POST | `/api/auth/register` | OWNER | Crea SUPERVISOR |

### Profile

| Method | URL | Auth | Descrizione |
|---|---|---|---|
| GET | `/api/profile/me` | ✅ | Profilo utente loggato |

### Venues

| Method | URL | Auth | Descrizione |
|---|---|---|---|
| GET | `/api/venues` | OWNER | Lista tutte le venues |
| GET | `/api/venues/{slug}` | OWNER | Venue per slug |
| POST | `/api/venues` | OWNER | Crea venue |

### Menu

| Method | URL | Auth | Descrizione |
|---|---|---|---|
| GET | `/api/menu/{venueId}` | ❌ | Menu pubblico (solo visibili) |
| GET | `/api/menu/{venueId}/all` | ✅ | Menu completo (admin) |
| GET | `/api/menu/item/{id}` | ❌ | Singolo prodotto |
| POST | `/api/menu` | ✅ | Crea prodotto |
| PUT | `/api/menu/{id}` | ✅ | Modifica prodotto |
| PATCH | `/api/menu/{id}/visibility` | ✅ | Toggle visibilità |
| DELETE | `/api/menu/{id}` | ✅ | Elimina prodotto |

### Events

| Method | URL | Auth | Descrizione |
|---|---|---|---|
| GET | `/api/events/{slug}` | ❌ | Lista eventi per venue |
| GET | `/api/events/item/{id}` | ❌ | Singolo evento |
| POST | `/api/events` | ✅ | Crea evento |
| PUT | `/api/events/{id}` | ✅ | Modifica evento |
| DELETE | `/api/events/{id}` | ✅ | Elimina evento |

### Bookings

| Method | URL | Auth | Descrizione |
|---|---|---|---|
| GET | `/api/bookings/{venueId}` | ✅ | Prenotazioni attive |
| POST | `/api/bookings` | ❌ | Crea prenotazione |
| PATCH | `/api/bookings/{id}/confirm` | ✅ | Conferma prenotazione |
| PATCH | `/api/bookings/{id}/reject` | ✅ | Rifiuta prenotazione |
| PATCH | `/api/bookings/{id}/pending` | ✅ | Rimetti in pending |
| PATCH | `/api/bookings/{id}/archive` | ✅ | Archivia prenotazione |

## Ruoli

| Ruolo | Come viene creato | Accesso |
|---|---|---|
| OWNER | Manualmente via DB (PgAdmin) | Tutto |
| SUPERVISOR | Registrato dall'OWNER via `/api/auth/register` | Solo la propria venue |

## Sicurezza

- JWT — token valido 24h, incluso in ogni richiesta protetta come `Bearer <token>`
- BCrypt — password hashate con rounds = 12
- CORS — origini configurate via `env.properties`
- Error handling — gestito globalmente da `GlobalExceptionHandler`

## Immagini

Le immagini vengono caricate direttamente dal frontend su Cloudinary.
Il backend riceve e salva solo la `imageUrl` (stringa) nel database.
