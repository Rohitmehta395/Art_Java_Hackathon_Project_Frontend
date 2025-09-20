package com.CODEWITHRISHU.CraftAI_Connect.repository;

import com.CODEWITHRISHU.CraftAI_Connect.dto.ProductStatus;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByArtisianIdAndStatus(Long artisanId, ProductStatus status, Pageable pageable);

    @Query("""
            SELECT p FROM Product p 
            WHERE (:category IS NULL OR LOWER(p.category) = LOWER(:category))
            AND (:minPrice IS NULL OR p.price >= :minPrice)
            AND (:maxPrice IS NULL OR p.price <= :maxPrice)
            AND p.status = 'ACTIVE'
            ORDER BY p.createdAt DESC
            """)
    Page<Product> findByFilters(
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

}