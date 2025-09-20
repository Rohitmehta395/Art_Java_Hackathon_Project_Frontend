package com.CODEWITHRISHU.CraftAI_Connect.dto.Request;

import com.CODEWITHRISHU.CraftAI_Connect.entity.Address;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateArtisianRequest(
        @NotBlank(message = "Name is required") String name,
        @Email(message = "Valid email is required") @NotBlank(message = "email is required") String email,
        @Min(value = 6, message = "Password must be atleast 6 digit or letter or some special char") String password,
        String craftSpecialty,
        Address address,
        String bio,
        @Min(value = 0, message = "Years of experience must be non-negative") Integer yearsOfExperience
) {}