package com.CODEWITHRISHU.CraftAI_Connect.repository;

import com.CODEWITHRISHU.CraftAI_Connect.entity.OttToken;
import com.CODEWITHRISHU.CraftAI_Connect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OttTokenRepository extends JpaRepository<OttToken, Integer> {
    Optional<OttToken> findByToken(String token);

    Optional<OttToken> findByUser(User user);

    Optional<OttToken> findByUserAndToken(User user, String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM OttToken o WHERE o.token = :token")
    void deleteByToken(String token);

    @Modifying
    @Transactional
    @Query("DELETE FROM OttToken o WHERE o.user = :user")
    void deleteByUser(User user);
}