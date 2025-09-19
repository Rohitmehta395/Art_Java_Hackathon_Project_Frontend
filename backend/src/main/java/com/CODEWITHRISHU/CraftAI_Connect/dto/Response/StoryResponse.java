package com.CODEWITHRISHU.CraftAI_Connect.dto.Response;

import com.CODEWITHRISHU.CraftAI_Connect.dto.StoryType;

public record StoryResponse(
        Long id,
        String title,
        String content,
        StoryType type
) {
}