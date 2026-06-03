package com.monkeybar.backend.controller;

import com.monkeybar.backend.entity.NewsletterSubscriber;
import com.monkeybar.backend.service.NewsletterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/newsletter")
public class NewsletterController {

    private final NewsletterService newsletterService;

    @GetMapping("/subscribers")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<List<NewsletterSubscriber>> getAllSubscribers() {
        return ResponseEntity.ok(newsletterService.getAllSubscribers());
    }

    @DeleteMapping("/subscribers/{id}")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteSubscriber(@PathVariable UUID id) {
        newsletterService.deleteSubscriber(id);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/subscribers")
    @PreAuthorize("hasRole('OWNER')")
    public ResponseEntity<Void> deleteAll() {
        newsletterService.deleteAllSubscribers();
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/subscribe")
    public ResponseEntity<String> subscribe(@RequestBody Map<String, String> body) {
        newsletterService.subscribe(body.get("email"));
        return ResponseEntity.ok("Iscrizione avvenuta con successo");
    }
}
