package com.CODEWITHRISHU.CraftAI_Connect.dto.Response;

import com.CODEWITHRISHU.CraftAI_Connect.dto.ProductStatus;

import java.math.BigDecimal;
import java.util.List;

public record ProductResponse(
        Long id,
        String name,
        String description,
        String aiGeneratedDescription,
        BigDecimal price,
        String category,
        String materials,
        List<String> imageUrls,
        List<String> tags,
        ProductStatus status
) {
}