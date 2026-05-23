package com.monkeybar.backend.service;

import com.monkeybar.backend.dto.request.MenuItemRequestDTO;
import com.monkeybar.backend.dto.response.MenuItemResponseDTO;
import com.monkeybar.backend.entity.MenuItem;
import com.monkeybar.backend.entity.Profile;
import com.monkeybar.backend.entity.Venue;
import com.monkeybar.backend.exception.ResourceNotFoundException;
import com.monkeybar.backend.exception.UnauthorizedException;
import com.monkeybar.backend.mapper.EntityMapper;
import com.monkeybar.backend.repository.MenuItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuItemRepository menuItemRepository;
    private final VenueService venueService;
    private final ProfileService profileService;

    public List<MenuItemResponseDTO> getPublicMenuBySlug(String slug) {
        Venue venue = venueService.getEntityBySlug(slug);
        return menuItemRepository.findByVenueIdAndVisibleTrue(venue.getId())
                .stream()
                .map(EntityMapper::toMenuItemResponse)
                .toList();
    }

    public List<MenuItemResponseDTO> getFullMenuBySlug(String slug) {
        Venue venue = venueService.getEntityBySlug(slug);
        return menuItemRepository.findByVenueId(venue.getId())
                .stream()
                .map(EntityMapper::toMenuItemResponse)
                .toList();
    }

    public MenuItemResponseDTO getById(UUID id) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto non trovato"));
        return EntityMapper.toMenuItemResponse(item);
    }

    public MenuItemResponseDTO create(MenuItemRequestDTO dto) {
        Venue venue = venueService.getEntityById(dto.getVenueId());

        MenuItem item = new MenuItem();
        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setPrice(dto.getPrice());
        item.setDescription(dto.getDescription());
        item.setAllergens(dto.getAllergens());
        item.setImageUrl(dto.getImageUrl());
        item.setVisible(true);
        item.setVenue(venue);

        return EntityMapper.toMenuItemResponse(menuItemRepository.save(item));
    }

    public MenuItemResponseDTO toggleVisibility(UUID id, String userEmail) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto non trovato"));

        Profile profile = profileService.getEntityByEmail(userEmail);

        boolean isOwner = "OWNER".equals(profile.getRole().name());
        if (!isOwner && !item.getVenue().getId().equals(profile.getVenue().getId())) {
            throw new UnauthorizedException("Non autorizzato a modificare questo locale");
        }

        item.setVisible(!item.isVisible());
        return EntityMapper.toMenuItemResponse(menuItemRepository.save(item));
    }

    public MenuItemResponseDTO update(UUID id, MenuItemRequestDTO dto) {
        MenuItem item = menuItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prodotto non trovato"));

        item.setName(dto.getName());
        item.setCategory(dto.getCategory());
        item.setPrice(dto.getPrice());
        item.setDescription(dto.getDescription());
        item.setAllergens(dto.getAllergens());
        item.setImageUrl(dto.getImageUrl());
        item.setVisible(true);

        return EntityMapper.toMenuItemResponse(menuItemRepository.save(item));
    }

    public void delete(UUID id) {
        if (!menuItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("Prodotto non trovato");
        }
        menuItemRepository.deleteById(id);
    }
}