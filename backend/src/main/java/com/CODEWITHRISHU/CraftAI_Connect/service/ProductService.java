package com.CODEWITHRISHU.CraftAI_Connect.service;

import com.CODEWITHRISHU.CraftAI_Connect.dto.ProductStatus;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.CreateProductRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.ProductResponse;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Product;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ArtisianRepository;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ProductRepository;
import com.CODEWITHRISHU.CraftAI_Connect.utils.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final AIContentService aiContentService;
    private final ArtisianRepository artisianRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public ProductResponse createProduct(Long artisianId, CreateProductRequest request) {
        Artisian artisian = artisianRepository.findById(artisianId)
                .orElseThrow(() -> new RuntimeException("Artisan not found"));

        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .category(request.category())
                .materials(request.materials())
                .dimensions(request.dimensions())
                .imageUrls(request.imageUrls() != null ? new ArrayList<>(request.imageUrls()) : new ArrayList<>())
                .tags(request.tags() != null ? new ArrayList<>(request.tags()) : new ArrayList<>())
                .artisian(artisian)
                .status(ProductStatus.ACTIVE)
                .build();

        Product saved = productRepository.save(product);

        try {
            String enhancedDescription = aiContentService.enhanceProductDescription(saved);
            saved.setAiGeneratedDescription(enhancedDescription);
            productRepository.save(saved);
            log.info("Generated AI description for product: {}", saved.getName());
        } catch (Exception e) {
            log.warn("Failed to generate AI description for product {}: {}", saved.getId(), e.getMessage());
        }

        return objectMapper.productMapper(saved);
    }

    public Page<ProductResponse> getProductsByArtisan(Long artisanId, Pageable pageable) {
        Page<Product> products = productRepository.findByArtisianIdAndStatus(artisanId, ProductStatus.ACTIVE, pageable);
        return products.map(objectMapper::productMapper);
    }

    public Page<ProductResponse> searchProducts(String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByFilters(category, minPrice, maxPrice, pageable);
        return products.map(objectMapper::productMapper);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return objectMapper.productMapper(product);
    }

}
