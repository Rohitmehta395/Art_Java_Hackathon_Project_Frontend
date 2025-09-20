package com.CODEWITHRISHU.CraftAI_Connect.controller;

import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.CreateProductRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.ProductResponse;
import com.CODEWITHRISHU.CraftAI_Connect.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/v1/products")
@Slf4j
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @PostMapping("/artisan/{artisanId}")
    public ResponseEntity<ProductResponse> createProduct(
            @PathVariable Long artisanId,
            @Valid @RequestBody CreateProductRequest request) {

        try {
            ProductResponse product = productService.createProduct(artisanId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(product);
        } catch (Exception e) {
            log.error("Error creating product: {}", e.getMessage());
            throw new RuntimeException("Failed to create product: " + e.getMessage());
        }
    }

    @GetMapping("/artisan/{artisanId}")
    public ResponseEntity<Page<ProductResponse>> getArtisanProducts(
            @PathVariable Long artisanId,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<ProductResponse> products = productService.getProductsByArtisan(artisanId, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ProductResponse>> searchProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<ProductResponse> products = productService.searchProducts(category, minPrice, maxPrice, pageable);
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }
}
