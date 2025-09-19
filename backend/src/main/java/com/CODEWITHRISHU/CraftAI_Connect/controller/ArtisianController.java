package com.CODEWITHRISHU.CraftAI_Connect.controller;

import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.CreateArtisianRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.ArtisianResponse;
import com.CODEWITHRISHU.CraftAI_Connect.service.ArtisianService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/artisans")
@Validated
@RequiredArgsConstructor
@Slf4j
public class ArtisianController {
    private final ArtisianService artisianService;

    @PostMapping
    public ResponseEntity<ArtisianResponse> createArtisan(@Valid @RequestBody CreateArtisianRequest request) {
        try {
            ArtisianResponse artisan = artisianService.createArtisan(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(artisan);
        } catch (Exception e) {
            log.error("Error creating artisan: {}", e.getMessage());
            throw new RuntimeException("Failed to create artisan: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<ArtisianResponse>> searchArtisans(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String specialization,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<ArtisianResponse> artisans = artisianService.searchArtisans(query, location, specialization, pageable);
        return ResponseEntity.ok(artisans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtisianResponse> getArtisan(@PathVariable Long id) {
        ArtisianResponse artisan = artisianService.getArtisanById(id);
        return ResponseEntity.ok(artisan);
    }

    @PostMapping("/{id}/enhance-profile")
    public ResponseEntity<Map<String, String>> enhanceProfile(@PathVariable Long id) {
        try {
            artisianService.enhanceArtisanProfile(id);
            return ResponseEntity.ok(Map.of("message", "Profile enhanced successfully"));
        } catch (Exception e) {
            log.error("Error enhancing profile for artisan {}: {}", id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}