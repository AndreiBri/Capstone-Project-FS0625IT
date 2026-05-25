package com.monkeybar.backend.controller;

import com.monkeybar.backend.dto.request.EventRequestDTO;
import com.monkeybar.backend.dto.response.EventResponseDTO;
import com.monkeybar.backend.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping("/{slug}")
    public ResponseEntity<List<EventResponseDTO>> getByVenueSlug(@PathVariable String slug) {
        return ResponseEntity.ok(eventService.getByVenueSlug(slug));
    }

    @GetMapping("/item/{id}")
    public ResponseEntity<EventResponseDTO> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(eventService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'SUPERVISOR')")
    public ResponseEntity<EventResponseDTO> create(@Valid @RequestBody EventRequestDTO dto) throws IOException {
        return ResponseEntity.ok(eventService.create(dto));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'SUPERVISOR')")
    public ResponseEntity<EventResponseDTO> update(@PathVariable UUID id, @Valid @RequestBody EventRequestDTO dto) throws IOException {
        return ResponseEntity.ok(eventService.update(dto, id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'SUPERVISOR')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}