package com.CODEWITHRISHU.CraftAI_Connect.dto.Response;

import com.CODEWITHRISHU.CraftAI_Connect.dto.ArtisianStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArtisianResponse {
    private String name;
    private String email;
    private String location;
    private String specialization;
    private String bio;
    private String profileImageUrl;
    private ArtisianStatus status;
    private Integer yearsOfExperience;
    private String accessToken;
    private String refreshToken;
}