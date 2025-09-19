package com.CODEWITHRISHU.CraftAI_Connect.dto.Request;

import com.CODEWITHRISHU.CraftAI_Connect.dto.StoryType;
import jakarta.validation.constraints.NotNull;

public record GenerateStoryRequest(
        @NotNull(message = "Story type is required") StoryType storyType,
        String additionalContext,
        Long productId
) {}