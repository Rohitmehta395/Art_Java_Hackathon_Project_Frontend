package com.CODEWITHRISHU.CraftAI_Connect.service;

import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.entity.RefreshToken;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ArtisianRepository;
import com.CODEWITHRISHU.CraftAI_Connect.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final ArtisianRepository artisianRepository;

    public RefreshToken createRefreshToken(String username) {
        log.info("Creating refresh token for artisian: {}", username);
        Artisian artisian = artisianRepository.findByName(username)
                .orElseThrow(() -> {
                    log.warn("User not found: {}", username);
                    return new UsernameNotFoundException("User not found");
                });

        log.debug("Deleting old refresh token for artisian: {}", username);
        refreshTokenRepository.findByArtisianInfo(artisian).ifPresent(existingToken -> {
            log.debug("Old refresh token exists, deleting it for artisian: {}", username);
            refreshTokenRepository.delete(existingToken);
        });

        RefreshToken refreshToken = RefreshToken.builder()
                .artisianInfo(artisian)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(60000 * 60 * 24 * 15)) // 15 days expiry
                .build();

        RefreshToken savedToken = refreshTokenRepository.save(refreshToken);
        log.info("Refresh token created for artisian: {}, token: {}", username, savedToken.getToken());
        return savedToken;
    }

    public Optional<RefreshToken> findByToken(String token) {
        log.debug("Finding refresh token: {}", token);
        return refreshTokenRepository.findByToken(token)
                .map(this::verifyExpiration)
                .or(() -> {
                    ;
                    log.warn("Refresh token not found or expired: {}", token);
                    return Optional.empty();
                });
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        log.debug("Verifying expiration for refresh token: {}", token.getToken());
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            log.warn("Refresh token expired: {}", token.getToken());
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token was expired. Please make a new sign in request");
        }
        log.info("Refresh token is valid: {}", token.getToken());
        return token;
    }
}