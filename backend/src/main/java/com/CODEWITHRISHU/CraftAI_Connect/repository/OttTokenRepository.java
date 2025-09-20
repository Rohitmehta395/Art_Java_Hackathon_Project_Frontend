package com.CODEWITHRISHU.CraftAI_Connect.repository;

import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.entity.OttToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OttTokenRepository extends JpaRepository<OttToken, Integer> {

    @Modifying
    @Transactional
    @Query("DELETE FROM OttToken o WHERE o.artisian = :artisian")
    void deleteByArtisian(@Param("artisian") Artisian artisian);

    Optional<OttToken> findByToken(String token);

    @Modifying
    @Transactional
    void deleteByToken(String token);
}