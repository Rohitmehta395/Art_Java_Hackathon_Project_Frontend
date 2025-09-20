package com.CODEWITHRISHU.CraftAI_Connect.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.*;

import javax.validation.constraints.Size;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {
    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String state;

    @Column(nullable = false)
    private int pinCode;

    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    @Size(min = 10, max = 15)
    private Integer phoneNumber;
}