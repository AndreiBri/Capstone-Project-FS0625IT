package com.monkeybar.backend.service;

import com.monkeybar.backend.entity.Booking;
import com.monkeybar.backend.entity.Event;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class EmailService {

    private static final DateTimeFormatter DATE_FMT =
            DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.ITALIAN);
    private final RestClient restClient;
    private final String from;

    public EmailService(
            @Value("${resend.apikey}") String apiKey,
            @Value("${resend.from}") String from
    ) {
        this.from = from;
        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public void sendBookingConfirmationEmail(Booking booking) {
        Map<String, Object> body = Map.of("from", from,
                "to", List.of(booking.getCustomerEmail()),
                "subject", "Prenotazione ricevuta - " + booking.getVenue().getName(),
                "html", buildHtml(booking));

        restClient.post()
                .uri("/emails")
                .body(body)
                .retrieve()
                .toBodilessEntity();
    }

    public void sendBookingConfirmed(Booking booking) {
        Map<String, Object> body = Map.of(
                "from", from,
                "to", List.of(booking.getCustomerEmail()),
                "subject", "Prenotazione Confermata – " + booking.getVenue().getName(),
                "html", buildStatusHtml(booking, true)
        );
        restClient.post().uri("/emails").body(body).retrieve().toBodilessEntity();
    }

    public void sendBookingRejected(Booking booking) {
        Map<String, Object> body = Map.of(
                "from", from,
                "to", List.of(booking.getCustomerEmail()),
                "subject", "Prenotazione Non Disponibile – " + booking.getVenue().getName(),
                "html", buildStatusHtml(booking, false)
        );
        restClient.post().uri("/emails").body(body).retrieve().toBodilessEntity();
    }

    private String buildHtml(Booking booking) {
        String date = booking.getBookingDate().format(DATE_FMT);
        String venue = booking.getVenue().getName();
        String name = booking.getCustomerName();
        int guests = booking.getGuests();

        return """
                <!DOCTYPE html>
                <html lang="it">
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { margin: 0; padding: 0; background: #1a0526; font-family: Arial, sans-serif; }
                    .container { max-width: 560px; margin: 40px auto; background: #320842; border-radius: 16px; overflow: hidden; border: 1px solid rgba(218,191,255,0.15); }
                    .header { background: #1C0127; padding: 32px; text-align: center; border-bottom: 1px solid rgba(160,108,213,0.3); }
                    .header h1 { color: #DABFFF; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: 900; }
                    .body { padding: 32px; color: #DABFFF; }
                    .body p { line-height: 1.7; color: rgba(218,191,255,0.8); }
                    .label { color: #A06CD5; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
                    .details { background: rgba(28,1,39,0.6); border: 1px solid rgba(160,108,213,0.25); border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
                    .details table { width: 100%%; border-collapse: collapse; }
                    .details td { padding: 8px 0; font-size: 15px; color: #DABFFF; border-bottom: 1px solid rgba(218,191,255,0.08); }
                    .details tr:last-child td { border-bottom: none; }
                    .details td:first-child { color: #A06CD5; font-size: 11px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; width: 100px; }
                    .footer { background: #1C0127; padding: 16px; text-align: center; color: rgba(218,191,255,0.3); font-size: 12px; border-top: 1px solid rgba(160,108,213,0.2); }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <span class="label">Monkey Family</span>
                      <h1>Prenotazione Ricevuta</h1>
                    </div>
                    <div class="body">
                      <p>Ciao <strong style="color:#DABFFF">%s</strong>,</p>
                      <p>Abbiamo ricevuto la tua richiesta di prenotazione presso <strong style="color:#A06CD5">%s</strong>. Ti contatteremo non appena confermata.</p>
                      <div class="details">
                        <table>
                          <tr><td>Venue</td><td><strong>%s</strong></td></tr>
                          <tr><td>Data</td><td><strong>%s</strong></td></tr>
                          <tr><td>Ospiti</td><td><strong>%d</strong></td></tr>
                        </table>
                      </div>
                      <p>A presto,<br><strong style="color:#DABFFF">Il team di Monkey Family</strong></p>
                    </div>
                    <div class="footer">© %d Monkey Family – Tutti i diritti riservati</div>
                  </div>
                </body>
                </html>
                """.formatted(name, venue, venue, date, guests, Year.now().getValue());
    }

    private String buildStatusHtml(Booking booking, boolean confirmed) {
        String date = booking.getBookingDate().format(DATE_FMT);
        String venue = booking.getVenue().getName();
        String name = booking.getCustomerName();
        int guests = booking.getGuests();
        String statusColor = confirmed ? "#A06CD5" : "#e05252";
        String statusLabel = confirmed ? "Confermata ✓" : "Non Disponibile";
        String message = confirmed
                ? "La tua prenotazione presso <strong style=\"color:#A06CD5\">%s</strong> è stata <strong style=\"color:#A06CD5\">confermata</strong>. Ti aspettiamo!".formatted(venue)
                : "Siamo spiacenti, la tua prenotazione presso <strong style=\"color:#e05252\">%s</strong> non è al momento disponibile. Contattaci per trovare un'alternativa.".formatted(venue);

        return """
                <!DOCTYPE html>
                <html lang="it">
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { margin: 0; padding: 0; background: #1a0526; font-family: Arial, sans-serif; }
                    .container { max-width: 560px; margin: 40px auto; background: #320842; border-radius: 16px; overflow: hidden; border: 1px solid rgba(218,191,255,0.15); }
                    .header { background: #1C0127; padding: 32px; text-align: center; border-bottom: 1px solid rgba(160,108,213,0.3); }
                    .header h1 { color: #DABFFF; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: 900; }
                    .status { color: %s; font-size: 13px; font-weight: 900; letter-spacing: 2px; margin-top: 8px; }
                    .body { padding: 32px; color: #DABFFF; }
                    .body p { line-height: 1.7; color: rgba(218,191,255,0.8); }
                    .details { background: rgba(28,1,39,0.6); border: 1px solid rgba(160,108,213,0.25); border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
                    .details table { width: 100%%; border-collapse: collapse; }
                    .details td { padding: 8px 0; font-size: 15px; color: #DABFFF; border-bottom: 1px solid rgba(218,191,255,0.08); }
                    .details tr:last-child td { border-bottom: none; }
                    .details td:first-child { color: #A06CD5; font-size: 11px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; width: 100px; }
                    .footer { background: #1C0127; padding: 16px; text-align: center; color: rgba(218,191,255,0.3); font-size: 12px; border-top: 1px solid rgba(160,108,213,0.2); }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <span style="color:#A06CD5;font-size:11px;font-weight:900;letter-spacing:2px;text-transform:uppercase">Monkey Family</span>
                      <h1>Prenotazione</h1>
                      <div class="status">%s</div>
                    </div>
                    <div class="body">
                      <p>Ciao <strong style="color:#DABFFF">%s</strong>,</p>
                      <p>%s</p>
                      <div class="details">
                        <table>
                          <tr><td>Venue</td><td><strong>%s</strong></td></tr>
                          <tr><td>Data</td><td><strong>%s</strong></td></tr>
                          <tr><td>Ospiti</td><td><strong>%d</strong></td></tr>
                        </table>
                      </div>
                      <p>A presto,<br><strong style="color:#DABFFF">Il team di Monkey Family</strong></p>
                    </div>
                    <div class="footer">© %d Monkey Family – Tutti i diritti riservati</div>
                  </div>
                </body>
                </html>
                """.formatted(statusColor, statusLabel, name, message, venue, date, guests, Year.now().getValue());
    }

    public void sendNewsletterEmail(String subscriberEmail, Event event) {
        Map<String, Object> body = Map.of(
                "from", from,
                "to", List.of(subscriberEmail),
                "subject", "Nuovo Evento – " + event.getTitle(),
                "html", buildNewsletterHtml(event)
        );
        restClient.post().uri("/emails").body(body).retrieve().toBodilessEntity();
    }

    private String buildNewsletterHtml(Event event) {
        String title = event.getTitle();
        String venue = event.getVenue().getName();
        String date = event.getStartTime().format(DATE_FMT);
        String description = event.getDescription() != null ? event.getDescription() : "";

        return """
                <!DOCTYPE html>
                <html lang="it">
                <head>
                  <meta charset="UTF-8">
                  <style>
                    body { margin: 0; padding: 0; background: #1a0526; font-family: Arial, sans-serif; }
                    .container { max-width: 560px; margin: 40px auto; background: #320842; border-radius: 16px; overflow: hidden; border: 1px solid rgba(218,191,255,0.15); }
                    .header { background: #1C0127; padding: 32px; text-align: center; border-bottom: 1px solid rgba(160,108,213,0.3); }
                    .header h1 { color: #DABFFF; margin: 0; font-size: 24px; letter-spacing: 2px; font-weight: 900; }
                    .tag { color: #A06CD5; font-size: 11px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
                    .body { padding: 32px; color: #DABFFF; }
                    .body p { line-height: 1.7; color: rgba(218,191,255,0.8); }
                    .details { background: rgba(28,1,39,0.6); border: 1px solid rgba(160,108,213,0.25); border-radius: 12px; padding: 20px 24px; margin: 24px 0; }
                    .details table { width: 100%%; border-collapse: collapse; }
                    .details td { padding: 8px 0; font-size: 15px; color: #DABFFF; border-bottom: 1px solid rgba(218,191,255,0.08); }
                    .details tr:last-child td { border-bottom: none; }
                    .details td:first-child { color: #A06CD5; font-size: 11px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; width: 100px; }
                    .footer { background: #1C0127; padding: 16px; text-align: center; color: rgba(218,191,255,0.3); font-size: 12px; border-top: 1px solid rgba(160,108,213,0.2); }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <div class="header">
                      <span class="tag">Monkey Family – Nuovo Evento</span>
                      <h1>%s</h1>
                    </div>
                    <div class="body">
                      <p>%s</p>
                      <div class="details">
                        <table>
                          <tr><td>Venue</td><td><strong>%s</strong></td></tr>
                          <tr><td>Data</td><td><strong>%s</strong></td></tr>
                        </table>
                      </div>
                      <p>A presto,<br><strong style="color:#DABFFF">Il team di Monkey Family</strong></p>
                    </div>
                    <div class="footer">© %d Monkey Family – Tutti i diritti riservati</div>
                  </div>
                </body>
                </html>
                """.formatted(title, description, venue, date, Year.now().getValue());
    }
}