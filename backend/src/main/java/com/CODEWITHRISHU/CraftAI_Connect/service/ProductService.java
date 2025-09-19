package com.CODEWITHRISHU.CraftAI_Connect.service;

import com.CODEWITHRISHU.CraftAI_Connect.Utils.ObjectMapper;
import com.CODEWITHRISHU.CraftAI_Connect.dto.ProductStatus;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.CreateProductRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.ProductResponse;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Product;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ArtisianRepository;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;

import static com.CODEWITHRISHU.CraftAI_Connect.Utils.ObjectMapper.mapToResponse;
import static com.CODEWITHRISHU.CraftAI_Connect.Utils.ObjectMapper.productMapper;

@Service
@Slf4j
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final AIContentService aiContentService;
    private final ArtisianRepository artisianRepository;

    @Transactional
    public ProductResponse createProduct(Long artisanId, CreateProductRequest request) {
        Artisian artisan = artisianRepository.findById(artisanId)
                .orElseThrow(() -> new RuntimeException("Artisan not found"));

        Product product = new Product();
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setCategory(request.category());
        product.setMaterials(request.materials());
        product.setDimensions(request.dimensions());
        product.setTimeToCraft(request.timeToCraft());
        product.setImageUrls(request.imageUrls() != null ? new ArrayList<>(request.imageUrls()) : new ArrayList<>());
        product.setTags(request.tags() != null ? new ArrayList<>(request.tags()) : new ArrayList<>());
        product.setArtisan(artisan);
        product.setStatus(ProductStatus.ACTIVE);

        Product saved = productRepository.save(product);

        try {
            String enhancedDescription = aiContentService.enhanceProductDescription(saved);
            saved.setAiGeneratedDescription(enhancedDescription);
            productRepository.save(saved);
            log.info("Generated AI description for product: {}", saved.getName());
        } catch (Exception e) {
            log.warn("Failed to generate AI description for product {}: {}", saved.getId(), e.getMessage());
        }

        return productMapper(saved);
    }

    public Page<ProductResponse> getProductsByArtisan(Long artisanId, Pageable pageable) {
        Page<Product> products = productRepository.findByArtisanIdAndStatus(artisanId, ProductStatus.ACTIVE, pageable);
        return products.map(ObjectMapper::productMapper);
    }

    public Page<ProductResponse> searchProducts(String category, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable) {
        Page<Product> products = productRepository.findByFilters(category, minPrice, maxPrice, pageable);
        return products.map(ObjectMapper::productMapper);
    }

    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return productMapper(product);
    }

}
