package com.CODEWITHRISHU.CraftAI_Connect.Utils;

import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.ArtisianResponse;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.ProductResponse;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.StoryResponse;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Product;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Story;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ObjectMapper {
    ArtisianResponse artisianMapper(Artisian artisan);

    ProductResponse productMapper(Product product);

    StoryResponse storyMapper(Story story);
}