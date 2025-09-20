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
        SELECT a FROM Artisian a
        WHERE (:query IS NULL OR
               LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')) OR
               LOWER(a.craftSpecialty) LIKE LOWER(CONCAT('%', :query, '%')) OR
               LOWER(a.bio) LIKE LOWER(CONCAT('%', :query, '%')))
        AND (:location IS NULL OR LOWER(a.address.city) LIKE LOWER(CONCAT('%', :location, '%')))
        AND (:craftSpecialty IS NULL OR LOWER(a.craftSpecialty) LIKE LOWER(CONCAT('%', :craftSpecialty, '%')))
        AND a.status = 'ACTIVE'
        ORDER BY a.createdAt DESC
        """)
    Page<Artisian> findBySearchCriteria(
            @Param("query") String query,
            @Param("location") String location,
            @Param("craftSpecialty") String craftSpecialty,
            Pageable pageable
    );

    Optional<Artisian> findByEmail(String email);

    Optional<Artisian> findByName(String username);
}