package com.CODEWITHRISHU.CraftAI_Connect.service;

import com.CODEWITHRISHU.CraftAI_Connect.utils.ObjectMapper;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.GenerateStoryRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.StoryResponse;
import com.CODEWITHRISHU.CraftAI_Connect.dto.StoryType;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Product;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Story;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ArtisianRepository;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ProductRepository;
import com.CODEWITHRISHU.CraftAI_Connect.repository.StoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class StoryService {
    private final StoryRepository storyRepository;
    private final ArtisianRepository artisianRepository;
    private final ProductRepository productRepository;
    private final AIContentService aiContentService;
    private final ObjectMapper objectMapper;

    @Transactional
    public StoryResponse generateStory(Long artisanId, GenerateStoryRequest request) {
        Artisian artisan = artisianRepository.findById(artisanId)
                .orElseThrow(() -> new RuntimeException("Artisan not found"));

        Product product = null;
        if (request.productId() != null) {
            product = productRepository.findById(request.productId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));
        }

        String storyContent = aiContentService.generateCraftStory(artisan, product, request.storyType(), request.additionalContext());
        String title = generateTitleFromType(request.storyType(), artisan);

        Story story = new Story();
        story.setTittle(title);
        story.setContent(storyContent);
        story.setStoryType(request.storyType());
        story.setArtisian(artisan);
        story.setProduct(product);

        Story saved = storyRepository.save(story);
        log.info("Generated story for artisan {}: {}", artisan.getName(), title);

        return objectMapper.storyMapper(saved);
    }

    public List<StoryResponse> getStoriesByArtisan(Long artisanId) {
        List<Story> stories = storyRepository.findByArtisianIdOrderByCreatedAtDesc(artisanId);
        return stories.stream().map(objectMapper::storyMapper).collect(Collectors.toList());
    }

    private String generateTitleFromType(StoryType type, Artisian artisian) {
        return switch (type) {
            case CRAFT_ORIGIN -> String.format("The Origins of %s: A Traditional Craft", artisian.getCraftSpecialty());
            case TECHNIQUE -> String.format("Mastering the Art: %s Techniques", artisian.getCraftSpecialty());
            case CULTURAL_HERITAGE -> String.format("Cultural Heritage: The Story of %s Crafts", artisian.getAddress().getCity());
            case PERSONAL_JOURNEY -> String.format("The Journey of %s: A Master Artisan", artisian.getName());
        };
    }

}