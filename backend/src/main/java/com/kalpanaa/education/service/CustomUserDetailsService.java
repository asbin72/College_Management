package com.kalpanaa.education.service;

import com.kalpanaa.education.model.User;
import com.kalpanaa.education.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(usernameOrEmail)
                .or(() -> userRepository.findByIdentifier(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email or ID: " + usernameOrEmail));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                user.getActive() != null ? user.getActive() : true,
                true, true, true,
                Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()))
        );
    }
}
