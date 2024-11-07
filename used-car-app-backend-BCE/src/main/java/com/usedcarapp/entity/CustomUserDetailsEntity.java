package com.usedcarapp.entity;

import com.usedcarapp.controller.UserController;
import com.usedcarapp.boundarytwo.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Collections;

@Service
public class CustomUserDetailsEntity implements UserDetailsService {

    @Autowired
    private UserController userRepository; // Assuming you have a UserRepository to fetch users

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username) // Use findByEmail to fetch user
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(), 
                user.getPassword(), 
                getAuthorities(user)
        );
    }

    private Collection<? extends GrantedAuthority> getAuthorities(User user) {
        // Create a single authority based on the user's role
        return Collections.singletonList(new SimpleGrantedAuthority(user.getRole().name()));
    }
}
