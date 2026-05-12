package com.monkeybar.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class VenueRequestDTO {
    @NotBlank
    private String name;

    @NotBlank
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