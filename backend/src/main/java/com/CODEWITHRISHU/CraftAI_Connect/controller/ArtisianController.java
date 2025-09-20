package com.CODEWITHRISHU.CraftAI_Connect.controller;

import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.AuthRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.CreateArtisianRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.RefreshTokenRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.ArtisianResponse;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.JwtResponse;
import com.CODEWITHRISHU.CraftAI_Connect.entity.RefreshToken;
import com.CODEWITHRISHU.CraftAI_Connect.service.ArtisianService;
import com.CODEWITHRISHU.CraftAI_Connect.service.JwtService;
import com.CODEWITHRISHU.CraftAI_Connect.service.RefreshTokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/artisans")
@Validated
@RequiredArgsConstructor
public class ArtisianController {
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final ArtisianService artisianService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/signUp")
    public ArtisianResponse registerAndGetAccessAndRefreshToken(@Valid @RequestBody CreateArtisianRequest request) {
        artisianService.addArtisian(request);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(request.name());

        return ArtisianResponse.builder()
                .accessToken(jwtService.generateToken(request.name()))
                .refreshToken(refreshToken.getToken()).build();
    }

    @PostMapping("/signIn")
    public JwtResponse authenticateAndGetToken(@RequestBody AuthRequest authRequest) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password())
        );

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(authRequest.username());
        return JwtResponse.builder()
                .accessToken(jwtService.generateToken(authRequest.username()))
                .refreshToken(refreshToken.getToken()).build();
    }

    @PostMapping("/refreshToken")
    public JwtResponse getRefreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return refreshTokenService.findByToken(refreshTokenRequest.token())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getArtisianInfo)
                .map(artisianInfo -> {
                    String accessToken = jwtService.generateToken(artisianInfo.getName());
                    return JwtResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(refreshTokenRequest.token())
                            .build();
                }).orElseThrow(() -> new RuntimeException(
                        "Refresh token is not in database!"));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<ArtisianResponse>> searchArtisans(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String craftSpeciality,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<ArtisianResponse> artisans = artisianService.searchArtisans(query, location, craftSpeciality, pageable);
        return ResponseEntity.ok(artisans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtisianResponse> getArtisanById(@PathVariable Long id) {
        ArtisianResponse artisan = artisianService.getArtisanById(id);
        return ResponseEntity.ok(artisan);
    }

    @PostMapping("/{id}/enhance-profile")
    public ResponseEntity<Map<String, String>> enhanceProfile(@PathVariable Long id) {
        artisianService.enhanceArtisanProfile(id);
        return ResponseEntity.ok(Map.of("message", "Profile enhanced successfully"));
    }
}