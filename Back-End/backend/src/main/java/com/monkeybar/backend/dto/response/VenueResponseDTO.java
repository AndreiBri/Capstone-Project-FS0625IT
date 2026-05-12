package com.monkeybar.backend.dto.response;

import lombok.Data;

import java.util.List;
import java.util.UUID;

@Data
public class VenueResponseDTO {
    private UUID id;
    private String name;
    private String slug;
    private String description;
    private String location;
    private String mapEmbedUrl;
    private List<String> images;
    private List<String> activities;
    private List<String> extras;
    private List<VenueHourDTO> hours;

    @Data
    public static class VenueHourDTO {
        private String day;
        private String time;
    }
}