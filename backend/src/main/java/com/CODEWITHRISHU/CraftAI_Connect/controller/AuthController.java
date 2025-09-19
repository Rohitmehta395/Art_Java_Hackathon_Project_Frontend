package com.CODEWITHRISHU.CraftAI_Connect.controller;

import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.AuthRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.CreateArtisianRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.RefreshTokenRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.JwtResponse;
import com.CODEWITHRISHU.CraftAI_Connect.entity.RefreshToken;
import com.CODEWITHRISHU.CraftAI_Connect.service.JwtService;
import com.CODEWITHRISHU.CraftAI_Connect.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final JwtService jwtService;
    private final RefreshTokenService refreshTokenService;
    private final AuthenticationManager authenticationManager;

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

    @PostMapping("/signUp")
    public JwtResponse registerAndGetAccessAndRefreshToken(@RequestBody CreateArtisianRequest request) {
        jwtService.addUser(request);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(request.name());

        return JwtResponse.builder()
                .accessToken(jwtService.generateToken(request.name()))
                .refreshToken(refreshToken.getToken()).build();
    }

    @PostMapping("/refreshToken")
    public JwtResponse getRefreshToken(@RequestBody RefreshTokenRequest refreshTokenRequest) {
        return refreshTokenService.findByToken(refreshTokenRequest.token())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUserInfo)
                .map(userInfo -> {
                    String accessToken = jwtService.generateToken(userInfo.getUsername());
                    return JwtResponse.builder()
                            .accessToken(accessToken)
                            .refreshToken(refreshTokenRequest.token())
                            .build();
                }).orElseThrow(() -> new RuntimeException(
                        "Refresh token is not in database!"));
    }

}