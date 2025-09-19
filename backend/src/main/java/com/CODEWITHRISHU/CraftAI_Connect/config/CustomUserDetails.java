package com.CODEWITHRISHU.CraftAI_Connect.config;

import com.CODEWITHRISHU.CraftAI_Connect.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {
    private final String name;
    private final String password;
    private final String email;
    private final List<GrantedAuthority> authorities;

    public CustomUserDetails(User userInfo) {
        this.name = userInfo.getUsername();
        this.password = userInfo.getPassword();
        this.email = userInfo.getEmail();
        this.authorities = Arrays.stream(String.valueOf(userInfo.getRole()).split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.name;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}