package com.CODEWITHRISHU.CraftAI_Connect.repository;

import com.CODEWITHRISHU.CraftAI_Connect.dto.StoryType;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {
    List<Story> findByProductIdOrderByCreatedAtDesc(Long productId);

    List<Story> findByStoryTypeAndArtisianId(StoryType storyType, Long artisianId);

    List<Story> findByArtisianIdOrderByCreatedAtDesc(Long artisianId);
}