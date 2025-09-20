package com.CODEWITHRISHU.CraftAI_Connect.service;

import com.CODEWITHRISHU.CraftAI_Connect.utils.ObjectMapper;
import com.CODEWITHRISHU.CraftAI_Connect.dto.ArtisianStatus;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Request.CreateArtisianRequest;
import com.CODEWITHRISHU.CraftAI_Connect.dto.Response.ArtisianResponse;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Address;
import com.CODEWITHRISHU.CraftAI_Connect.entity.Artisian;
import com.CODEWITHRISHU.CraftAI_Connect.exception.UserAlreadyExists;
import com.CODEWITHRISHU.CraftAI_Connect.repository.ArtisianRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ArtisianService {
    private final AIContentService aiContentService;
    private final ArtisianRepository artisianRepository;
    private final ObjectMapper objectMapper;
    private final PasswordEncoder encoder;

    @Transactional
    public ArtisianResponse createArtisan(CreateArtisianRequest request) {
        if (artisianRepository.findByEmail(request.email()).isPresent()) {
            throw new UserAlreadyExists("Artisan with email " + request.email() + " already exists" + " try with different email");
        }

        Artisian artisan = Artisian.builder()
                .name(request.name())
                .email(request.email())
                .password(encoder.encode(request.password()))
                .craftSpecialty(request.craftSpecialty())
                .address(Address.builder()
                        .street(request.address().getStreet())
                        .city(request.address().getCity())
                        .state(request.address().getState())
                        .pinCode(request.address().getPinCode())
                        .country(request.address().getCountry())
                        .build())
                .bio(request.bio())
                .yearsOfExperience(request.yearsOfExperience())
                .status(ArtisianStatus.ACTIVE)
                .build();

        Artisian saved = artisianRepository.save(artisan);
        log.info("Created new artisan: {} with ID: {}", saved.getName(), saved.getId());

        return objectMapper.artisianMapper(saved);
    }

    public Page<ArtisianResponse> searchArtisans(String query, String location, String craftSpeciality, Pageable pageable) {
        Page<Artisian> artisans = artisianRepository.findBySearchCriteria(query, location, craftSpeciality, pageable);
        return artisans.map(objectMapper::artisianMapper);
    }

    public ArtisianResponse getArtisanById(Long id) {
        Artisian artisan = artisianRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Artisan not found with ID: " + id));
        return objectMapper.artisianMapper(artisan);
    }

    @Transactional
    public void enhanceArtisanProfile(Long artisanId) {
        Artisian artisan = artisianRepository.findById(artisanId)
                .orElseThrow(() -> new RuntimeException("Artisan not found"));

        if (artisan.getBio() == null || artisan.getBio().length() < 100) {
            String enhancedBio = aiContentService.generateArtisanBio(artisan);
            artisan.setBio(enhancedBio);
            log.info("Enhanced bio for artisan: {}", artisan.getName());
        }

        artisan.getProducts().forEach(product -> {
            if (product.getAiGeneratedDescription() == null) {
                String enhancedDescription = aiContentService.enhanceProductDescription(product);
                product.setAiGeneratedDescription(enhancedDescription);
                log.info("Enhanced description for product: {}", product.getName());
            }
        });

        artisianRepository.save(artisan);
    }
}