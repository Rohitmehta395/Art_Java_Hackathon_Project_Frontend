package com.CODEWITHRISHU.CraftAI_Connect.entity;

import com.CODEWITHRISHU.CraftAI_Connect.dto.StoryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Table(name = "stories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Story extends AuditEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 50)
    @NotNull
    @Column(nullable = false)
    private String tittle;

    @Enumerated(EnumType.STRING)
    private StoryType storyType;

    @Size(max = 500)
    @Column(columnDefinition = "TEXT")
    @NotBlank(message = "Content is required")
    private String content;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisian_id")
    private Artisian artisian;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}