package com.CODEWITHRISHU.CraftAI_Connect.service;

import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.CreateArtisianRequest;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Address;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.exception.UserAlreadyExists;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ArtisianRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;

    private final ArtisianRepository artisianRepository;
    private final PasswordEncoder passwordEncoder;

    public String extractUsername(String token) {
        log.debug("Extracting username from token");
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        log.debug("Extracting expiration from token");
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        log.debug("Extracting all claims from token");
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        boolean expired = extractExpiration(token).before(new Date());
        log.debug("Token expired: {}", expired);
        return expired;
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        boolean valid = (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
        log.info("Validating token for user '{}': {}", username, valid);
        return valid;
    }

    public String generateToken(String userName) {
        Map<String, Object> claims = new HashMap<>();
        String token = createToken(claims, userName);

        log.info("Generated JWT for user '{}', expires at {}", userName, extractExpiration(token));
        return token;
    }

    private String createToken(Map<String, Object> claims, String userName) {
        log.debug("Creating token for user '{}'", userName);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userName)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 30)) // 30-minute expiration
                .signWith(getSignKey(), SignatureAlgorithm.HS256).compact();
    }

    private Key getSignKey() {
        log.debug("Getting signing key");
        byte[] keyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public void addUser(CreateArtisianRequest userInfo) {
        log.info("Adding new artisian1: {}", userInfo.name());
        if (artisianRepository.findByEmail(userInfo.email()).isPresent()) {
            throw new UserAlreadyExists("User already exists with name: " + userInfo.name());
        }

        Artisian artisian1 = artisianRepository.findByEmail(userInfo.name()).get();
        artisian1.setPassword(passwordEncoder.encode(userInfo.password()));
        Artisian artisian = Artisian.builder()
                .name(userInfo.name())
                .email(userInfo.email())
                .password(userInfo.password())
                .address(Address.builder()
                        .street(userInfo.address().getStreet())
                        .city(userInfo.address().getCity())
                        .state(userInfo.address().getState())
                        .country(userInfo.address().getCountry())
                        .pinCode(userInfo.address().getPinCode())
                        .phoneNumber(userInfo.address().getPhoneNumber())
                        .build())
                .craftSpecialty(userInfo.craftSpecialty())
                .yearsOfExperience(userInfo.yearsOfExperience())
                .bio(userInfo.bio())
                .build();

        artisianRepository.save(artisian);
        log.info("User '{}' added successfully", userInfo.name());
    }
}