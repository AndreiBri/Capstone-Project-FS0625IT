package com.monkeybar.backend.service;

import com.monkeybar.backend.dto.response.ProfileResponseDTO;
import com.monkeybar.backend.entity.Profile;
import com.monkeybar.backend.exception.ResourceNotFoundException;
import com.monkeybar.backend.mapper.EntityMapper;
import com.monkeybar.backend.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileResponseDTO getByEmail(String email) {
        return profileRepository.findByEmail(email)
                .map(EntityMapper::toProfileResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Profile non trovato"));
    }

    public Profile getEntityByEmail(String email) {
        return profileRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Profile non trovato"));
    }
}
