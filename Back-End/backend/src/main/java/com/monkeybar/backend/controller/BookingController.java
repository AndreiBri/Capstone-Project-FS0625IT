package com.monkeybar.backend.controller;

import com.monkeybar.backend.dto.request.BookingRequestDTO;
import com.monkeybar.backend.dto.response.BookingResponseDTO;
import com.monkeybar.backend.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    @GetMapping("/{venueId}")
    @PreAuthorize("hasAnyRole('OWNER', 'SUPERVISOR')")
    public ResponseEntity<List<BookingResponseDTO>> getActiveByVenueId(@PathVariable UUID venueId) {
        return ResponseEntity.ok(bookingService.getActiveByVenueId(venueId));
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> create(@Valid @RequestBody BookingRequestDTO dto) {
        return ResponseEntity.ok(bookingService.create(dto));
    }

    @PatchMapping("/{id}/archive")
    @PreAuthorize("hasAnyRole('OWNER', 'SUPERVISOR')")
    public ResponseEntity<BookingResponseDTO> archive(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.archive(id));
    }

    @PatchMapping("/{id}/confirm")
    @PreAuthorize("hasAnyRole('OWNER', 'SUPERVISOR')")
    public ResponseEntity<BookingResponseDTO> confirm(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.confirm(id));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('OWNER', 'SUPERVISOR')")
    public ResponseEntity<BookingResponseDTO> reject(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.reject(id));
    }

    @PatchMapping("/{id}/pending")
    @PreAuthorize("hasAnyRole('OWNER', 'SUPERVISOR')")
    public ResponseEntity<BookingResponseDTO> pending(@PathVariable UUID id) {
        return ResponseEntity.ok(bookingService.pending(id));
    }
}