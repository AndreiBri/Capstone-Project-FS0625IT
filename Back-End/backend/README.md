## MonkeyBar Backend ##

## Stack ##

Java 25
Spring Boot 4.0.6
Spring Security + JWT
Spring Data JPA + Hibernate
PostgreSQL (locale)
Cloudinary (gestione immagini)
Setup
Requisiti
JDK 25
PostgreSQL in locale
Maven

## Configurazione ##

## Non committare mai env.properties — In .gitignore da inserire e committare prima della creazione di env.properties ##

Crea il file env.properties nella root del progetto:

spring.application.name=backend
spring.config.import=file:env.properties

## SERVER CONFIG ##

server.port=${PORT}

## DB CONFIG ##

spring.datasource.url=jdbc:postgresql://localhost:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
spring.datasource.driver=org.postgresql.Driver

## HIBERNATE ##

spring.jpa.hibernate.ddl-auto=update

## CLOUDINARY ##

cloudinary.cloud-name=${CLOUDINARY_NAME}
cloudinary.api-key=${CLOUDINARY_API_KEY}
cloudinary.api-secret=${CLOUDINARY_API_SECRET}
spring.servlet.multipart.max-file-size=10MB

## JWT ##

jwt.secret=${JWT_SECRET}

## Resend API (send email) ##

resend.apikey=${RESEND_API_KEY}

## CORS ##

allowed.origins=${ALLOWED_ORIGINS}

## Struttura ##

src/main/java/com/monkeybar/backend/
├── controller/ # Endpoint REST
├── service/ # Business logic
├── repository/ # JPA repositories
├── entity/ # Tabelle DB
├── dto/
│ ├── request/ # Dati in entrata
│ └── response/ # Dati in uscita
├── mapper/ # Entity → DTO
├── security/ # JWT + Spring Security
├── exception/ # Global error handling
└── enums/ # Role enum

## Endpoints ##

Auth
Method || URL || Auth || Descrizione
POST /api/auth/login ❌ Login
POST /api/auth/register OWNER Crea SUPERVISOR

## Profile ##

Method || URL || Auth || Descrizione
GET /api/profile/me ✅ Profilo utente loggato

## Venues ##

Method || URL || Auth || Descrizione
GET /api/venues ❌ Lista venues Solo OWNER
GET /api/venues/{slug} ❌ Venue per slug Solo OWNER
POST /api/venues ✅ Crea venue Solo OWNER

## Menu ##

Method || URL || Auth || Descrizione
GET /api/menu/{venueId} ❌ Menu pubblico (solo visibili)
GET /api/menu/{venueId}/all ✅ Menu completo (admin)
GET /api/menu/item/{id} ❌ Singolo prodotto
POST /api/menu ✅ Crea prodotto
PATCH /api/menu/{id}/visibility ✅ Toggle visibilità
DELETE /api/menu/{id} ✅ Elimina prodotto

## Events ##

Method || URL || Auth || Descrizione
GET /api/events/{venueId} ❌ Lista eventi
GET /api/events/item/{id} ❌ Singolo evento
POST /api/events ✅ Crea evento
DELETE /api/events/{id} ✅ Elimina evento

## Bookings ##

Method || URL || Auth || Descrizione
GET /api/bookings/{venueId} ✅ Prenotazioni attive
POST /api/bookings ❌ Crea prenotazione
PATCH /api/bookings/{id}/archive ✅ Archivia prenotazione

## Ruoli ##

Ruolo Creazione Venue Accesso
OWNER Manuale via DB

Method || URL || Auth || Descrizione

SUPERVISOR Via /api/auth/register (OWNER procedera a registrare il SUPERVISOR per questioni di sicurezza) Una specifica
La sua venue
Crea OWNER manualmente in PgAdmin

## Sicurezza ##

JWT — token valido 24h, incluso in ogni richiesta protetta come Bearer <token>
BCrypt — password hashate con rounds = 12
CORS — origini configurate via env.properties
Error handling — errori interni loggati nel GlobalExceptionHandler generale nella cartella exception

### Requisiti ##

- JDK 25
- PostgreSQL in locale
- Maven

## Immagini ##

Le immagini vengono caricate direttamente dal frontend su Cloudinary.
Il backend riceve e salva solo la imageUrl (stringa) nel database.