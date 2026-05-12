package com.monkeybar.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "venues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String mapEmbedUrl;

    @ElementCollection
    @CollectionTable(name = "venue_images", joinColumns = @JoinColumn(name = "venue_id"))
    @Column(name = "image_url")
    private List<String> images;

    @ElementCollection
    @CollectionTable(name = "venue_activities", joinColumns = @JoinColumn(name = "venue_id"))
    @Column(name = "activity")
    private List<String> activities;

    @ElementCollection
    @CollectionTable(name = "venue_extras", joinColumns = @JoinColumn(name = "venue_id"))
    @Column(name = "extra")
    private List<String> extras;

    @ElementCollection
    @CollectionTable(name = "venue_hours", joinColumns = @JoinColumn(name = "venue_id"))
    private List<VenueHour> hours;
}