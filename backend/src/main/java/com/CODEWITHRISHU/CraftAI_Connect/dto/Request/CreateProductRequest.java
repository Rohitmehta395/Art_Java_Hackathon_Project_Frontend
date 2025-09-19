package com.CODEWITHRISHU.CraftAI_Connect.dto.Request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public record CreateProductRequest(
        @NotBlank(message = "Product name is required") String name,
        String description,
        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", message = "Price must be non-negative") BigDecimal price,
        String category,
        String materials,
        String dimensions,
        List<String> imageUrls,
        List<String> tags
) {}