package com.CODEWITHRISHU.CraftAI_Connect.repository;

import com.CODEWITHRISHU.CraftAI_Connect.entity.RefreshToken;
import com.CODEWITHRISHU.CraftAI_Connect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);

    Optional<RefreshToken> findByUserInfo(User user);
}