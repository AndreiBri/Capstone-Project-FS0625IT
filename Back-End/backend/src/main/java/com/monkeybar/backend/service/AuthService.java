package com.monkeybar.backend.service;

import com.monkeybar.backend.dto.request.LoginRequestDTO;
import com.monkeybar.backend.dto.request.RegisterRequestDTO;
import com.monkeybar.backend.dto.response.AuthResponseDTO;
import com.monkeybar.backend.entity.Profile;
import com.monkeybar.backend.entity.Venue;
import com.monkeybar.backend.enums.Role;
import com.monkeybar.backend.repository.ProfileRepository;
import com.monkeybar.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private final ProfileRepository profileRepository;
    private final VenueService venueService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (profileRepository.existsByEmail(dto.getEmail())) {
            log.warn("Tentativo registrazione email esistente: {}", dto.getEmail());
            throw new RuntimeException("Credenziali non valide.");
        }

        if (dto.getVenueSlug() == null || dto.getVenueSlug().isBlank()) {
            log.warn("Tentativo registrazione SUPERVISOR senza venue slug");
            throw new RuntimeException("SUPERVISOR deve essere assegnato a un locale. Richiesta non valida.");
        }

        Venue venue = venueService.getEntityBySlug(dto.getVenueSlug());

        Profile profile = new Profile();
        profile.setEmail(dto.getEmail());
        profile.setPassword(passwordEncoder.encode(dto.getPassword()));
        profile.setRole(Role.SUPERVISOR);
        profile.setVenue(venue);
        profile.setAlias(dto.getAlias());

        profileRepository.save(profile);
        return buildAuthResponse(profile);
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        Profile profile = profileRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login fallito - email non trovata: {}", dto.getEmail());
                    return new RuntimeException("Credenziali non valide.");
                });

        if (!passwordEncoder.matches(dto.getPassword(), profile.getPassword())) {
            log.warn("Login fallito - password errata per: {}", dto.getEmail());
            throw new RuntimeException("Credenziali non valide.");
        }

        return buildAuthResponse(profile);
    }

    private AuthResponseDTO buildAuthResponse(Profile profile) {
        String token = jwtUtil.generateToken(profile.getEmail(), profile.getRole().name());

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setProfileId(profile.getId());
        response.setEmail(profile.getEmail());
        response.setRole(profile.getRole());

        if (profile.getVenue() != null) {
            response.setVenueId(profile.getVenue().getId());
            response.setVenueName(profile.getVenue().getName());
            response.setVenueSlug(profile.getVenue().getSlug());
        }
        ;

        response.setAlias(profile.getAlias());

        return response;
    }
}