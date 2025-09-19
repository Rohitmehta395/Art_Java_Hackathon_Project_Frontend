package com.CODEWITHRISHU.CraftAI_Connect.service;

import com.CODEWITHRISHU.CraftAI_Connect.dto.StoryType;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Product;
import com.CODEWITHRISHU.CraftAI_Connect.entity.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AIContentService {
    private final ChatClient chatClient;
    private final User user;

    public AIContentService(ChatClient.Builder chatClientBuilder, User user) {
        this.user = user;
        this.chatClient = chatClientBuilder.build();
    }

    public String generateCraftStory(Artisian artisan, Product product, StoryType type, String additionalContext) {
        String prompt = buildStoryPrompt(artisan, product, type, additionalContext);

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Error generating story for artisan {}: {}", artisan.getId(), e.getMessage());
            return generateFallbackStory(artisan, product, type);
        }
    }

    public String enhanceProductDescription(Product product) {
        String prompt = String.format("""
                        Create an engaging, SEO-friendly product description for this handcrafted item:
                        
                        Product: %s
                        Current Description: %s
                        Materials: %s
                        Category: %s
                        Artisan Specialization: %s
                        Location: %s
                        
                        Requirements:
                        - Highlight the cultural significance and traditional techniques
                        - Emphasize the uniqueness and authenticity
                        - Include emotional appeal and storytelling elements
                        - Make it suitable for e-commerce platforms
                        - Keep it between 150-300 words
                        - Focus on the heritage and craftsmanship
                        """,
                product.getName(),
                product.getDescription(),
                product.getMaterials(),
                product.getCategory(),
                user.getAddress().getStreet()
        );

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Error enhancing description for product {}: {}", product.getId(), e.getMessage());
            return product.getDescription() != null ? product.getDescription() : "Beautiful handcrafted item made with traditional techniques.";
        }
    }

    public String generateArtisanBio(Artisian artisian) {
        String prompt = String.format("""
                        Create a compelling professional bio for an Indian artisan:
                        
                        Name: %s
                        Specialization: %s
                        Location: %s
                        Experience: %d years
                        Current Bio: %s
                        
                        Create a 150-250 word bio that:
                        - Highlights their expertise and passion
                        - Mentions cultural heritage and traditional techniques
                        - Appeals to modern consumers
                        - Shows authenticity and dedication to craft
                        - Is professional yet personal
                        """,
                artisian.getName(),
                user.getAddress().getCountry(),
                artisian.getYearsOfExperience(),
                artisian.getBio()
        );

        try {
            return chatClient.prompt()
                    .user(prompt)
                    .call()
                    .content();
        } catch (Exception e) {
            log.error("Error generating bio for artisan {}: {}", artisian.getId(), e.getMessage());
            return String.format("Meet %s, a skilled artisan specializing in %s with %d years of experience in preserving traditional craftsmanship.",
                    artisian.getName(),
                    artisian.getYearsOfExperience());
        }
    }

    private String buildStoryPrompt(Artisian artisan, Product product, StoryType storyType, String additionalContext) {
        String basePrompt = String.format("""
                        Write a compelling story about an Indian artisan and their craft:
                        
                        Artisan: %s
                        Specialization: %s
                        Location: %s
                        Experience: %d years
                        Product: %s
                        Story Type: %s
                        Additional Context: %s
                        
                        """,
                artisan.getName(),
                user.getAddress().getCountry(),
                artisan.getYearsOfExperience(),
                product.getName(),
                storyType,
                additionalContext != null ? additionalContext : "None"
        );

        return switch (storyType) {
            case CRAFT_ORIGIN -> basePrompt + """
                    Focus on the historical origins and cultural significance of this craft.
                    Include traditional techniques passed down through generations.
                    Make it educational and inspiring. (300-500 words)
                    """;
            case TECHNIQUE -> basePrompt + """
                    Describe the specific techniques and skills involved in creating this craft.
                    Include the time, patience, and expertise required.
                    Make it informative and appreciative of the skill. (250-400 words)
                    """;
            case CULTURAL_HERITAGE -> basePrompt + """
                    Explore the cultural and social significance of this craft in Indian society.
                    Connect it to festivals, traditions, or regional identity.
                    Make it culturally rich and meaningful. (300-500 words)
                    """;
            case PERSONAL_JOURNEY -> basePrompt + """
                    Tell the personal story of this artisan's journey with their craft.
                    Include challenges, passion, and dedication.
                    Make it emotional and relatable. (350-500 words)
                    """;
        };
    }

    private String generateFallbackStory(Artisian artisian, Product product, StoryType type) {
        return switch (type) {
            case CRAFT_ORIGIN ->
                    String.format("The art of %s has been practiced in %s for generations, passed down through families who have dedicated their lives to preserving this beautiful tradition.",
                            product.getName());
            case TECHNIQUE ->
                    String.format("%s employs time-honored techniques that require years to master, combining skill, patience, and artistic vision.", artisian.getName());
            case CULTURAL_HERITAGE ->
                    String.format("The craft represents the rich cultural heritage of %s, embodying traditions that connect communities to their roots.", user.getAddress().getStreet());
            case PERSONAL_JOURNEY ->
                    String.format("%s has dedicated %d years to perfecting their craft, driven by passion and commitment to preserving traditional arts.",
                            artisian.getName(), artisian.getYearsOfExperience());
        };
    }
}