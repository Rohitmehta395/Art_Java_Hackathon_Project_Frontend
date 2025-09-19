package com.CODEWITHRISHU.CraftAI_Connect.controller;

import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.GenerateStoryRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.StoryResponse;
import com.CODEWITHRISHU.CraftAI_Connect.service.StoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/AI")
@Slf4j
@RequiredArgsConstructor
public class AIAssistantController {

    private final StoryService storyService;

    @PostMapping("/artisans/{artisanId}/stories")
    public ResponseEntity<StoryResponse> generateStory(
            @PathVariable Long artisanId,
            @Valid @RequestBody GenerateStoryRequest request) {

        try {
            StoryResponse story = storyService.generateStory(artisanId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(story);
        } catch (Exception e) {
            log.error("Error generating story: {}", e.getMessage());
            throw new RuntimeException("Failed to generate story: " + e.getMessage());
        }
    }

    @GetMapping("/artisans/{artisanId}/stories")
    public ResponseEntity<List<StoryResponse>> getArtisanStories(@PathVariable Long artisanId) {
        List<StoryResponse> stories = storyService.getStoriesByArtisan(artisanId);
        return ResponseEntity.ok(stories);
    }
}
