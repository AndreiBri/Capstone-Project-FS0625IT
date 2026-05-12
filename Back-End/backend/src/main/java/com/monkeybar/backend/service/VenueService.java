package com.monkeybar.backend.service;

import com.monkeybar.backend.dto.request.VenueRequestDTO;
import com.monkeybar.backend.dto.response.VenueResponseDTO;
import com.monkeybar.backend.entity.Venue;
import com.monkeybar.backend.entity.VenueHour;
import com.monkeybar.backend.exception.ResourceNotFoundException;
import com.monkeybar.backend.mapper.EntityMapper;
import com.monkeybar.backend.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    public List<VenueResponseDTO> getAll() {
        return venueRepository.findAll()
                .stream()
                .map(EntityMapper::toVenueResponse)
                .toList();
    }

    public VenueResponseDTO getBySlug(String slug) {
        return venueRepository.findBySlug(slug)
                .map(EntityMapper::toVenueResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Venue non trovata"));
    }

    public Venue getEntityById(UUID id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue non trovata"));
    }

    public VenueResponseDTO create(VenueRequestDTO dto) {
        Venue venue = new Venue();
        venue.setName(dto.getName());
        venue.setSlug(dto.getSlug());
        venue.setDescription(dto.getDescription());
        venue.setLocation(dto.getLocation());
        venue.setMapEmbedUrl(dto.getMapEmbedUrl());
        venue.setImages(dto.getImages());
        venue.setActivities(dto.getActivities());
        venue.setExtras(dto.getExtras());

        if (dto.getHours() != null) {
            venue.setHours(dto.getHours().stream().map(h ->
                    new VenueHour(h.getDay(), h.getTime())
            ).toList());
        }

        return EntityMapper.toVenueResponse(venueRepository.save(venue));
    }

    public Venue getEntityBySlug(String slug) {
        return venueRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Venue non trovata: " + slug));
    }
}