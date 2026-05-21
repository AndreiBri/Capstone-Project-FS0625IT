package com.monkeybar.backend.service;

import com.monkeybar.backend.dto.request.EventRequestDTO;
import com.monkeybar.backend.dto.response.EventResponseDTO;
import com.monkeybar.backend.entity.Event;
import com.monkeybar.backend.entity.Venue;
import com.monkeybar.backend.exception.ResourceNotFoundException;
import com.monkeybar.backend.mapper.EntityMapper;
import com.monkeybar.backend.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final VenueService venueService;

    public List<EventResponseDTO> getByVenueId(UUID venueId) {
        return eventRepository.findByVenueId(venueId)
                .stream()
                .map(EntityMapper::toEventResponse)
                .toList();
    }

    public List<EventResponseDTO> getByVenueSlug(String slug) {
        Venue venue = venueService.getEntityBySlug(slug);

        return eventRepository.findByVenueId(venue.getId())
                .stream()
                .map(entity -> EntityMapper.toEventResponse(entity))
                .toList();
    }

    public EventResponseDTO getById(UUID id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento non trovato"));
        return EntityMapper.toEventResponse(event);
    }

    public EventResponseDTO create(EventRequestDTO dto) throws IOException {
        Venue venue = venueService.getEntityById(dto.getVenueId());

        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setVenue(venue);

        return EntityMapper.toEventResponse(eventRepository.save(event));
    }

    public EventResponseDTO update(EventRequestDTO dto, UUID eventId) throws IOException {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Evento non trovato"));

        event.setTitle(dto.getTitle());
        event.setDescription(dto.getDescription());
        event.setStartTime(dto.getStartTime());
        event.setEndTime(dto.getEndTime());
        event.setVenue(venueService.getEntityById(dto.getVenueId()));

        return EntityMapper.toEventResponse(eventRepository.save(event));
    }

    public void delete(UUID id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Evento non trovato");
        }
        eventRepository.deleteById(id);
    }
}