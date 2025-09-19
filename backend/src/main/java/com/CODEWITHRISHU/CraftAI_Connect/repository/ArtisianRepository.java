package com.CODEWITHRISHU.CraftAI_Connect.repository;

import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ArtisianRepository extends JpaRepository<Artisian, Long> {
    @Query("""
            SELECT a FROM Artisan a 
            WHERE (:query IS NULL OR 
                   LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) OR
                   LOWER(a.specialization) LIKE LOWER(CONCAT('%', :query, '%')) OR
                   LOWER(a.bio) LIKE LOWER(CONCAT('%', :query, '%'))) 
            AND (:location IS NULL OR LOWER(a.location) LIKE LOWER(CONCAT('%', :location, '%')))
            AND (:specialization IS NULL OR LOWER(a.specialization) LIKE LOWER(CONCAT('%', :specialization, '%')))
            AND a.status = 'ACTIVE'
            ORDER BY a.createdAt DESC
            """)
    Page<Artisian> findBySearchCriteria(
            @Param("query") String query,
            @Param("location") String location,
            @Param("specialization") String specialization,
            Pageable pageable
    );

    Optional<Artisian> findByEmail(String email);
}