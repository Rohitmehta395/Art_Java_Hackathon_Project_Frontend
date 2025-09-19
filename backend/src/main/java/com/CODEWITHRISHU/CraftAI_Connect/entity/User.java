package com.CODEWITHRISHU.CraftAI_Connect.entity;

import com.CODEWITHRISHU.CraftAI_Connect.dto.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User extends AuditEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 50)
    @Column(unique = true, nullable = false)
    private String username;

    @Email
    @NotBlank
    @Size(max = 100)
    @Column(unique = true, nullable = false)
    private String email;

    @NotBlank
    @Size(min = 6, max = 120)
    private String password;

    @Column(columnDefinition = "TEXT")
    private String craftSpecialty;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private Integer yearsOfExperience;

    @Enumerated(EnumType.STRING)
    private Role role = Role.ARTISIAN;

    @Embedded
    @JsonIgnore
    private Address address;

    @OneToMany(mappedBy = "artisan", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Product> products = new ArrayList<>();

    @OneToMany(mappedBy = "artisian", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Story> stories = new ArrayList<>();
}