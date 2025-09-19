package com.CODEWITHRISHU.CraftAI_Connect.dto.Response;

import com.CODEWITHRISHU.CraftAI_Connect.dto.ArtisianStatus;

public record ArtisianResponse(
        String name,
        String email,
        String location,
        String specialization,
        String bio,
        String profileImageUrl,
        ArtisianStatus status,
        Integer yearsOfExperience
) {
}