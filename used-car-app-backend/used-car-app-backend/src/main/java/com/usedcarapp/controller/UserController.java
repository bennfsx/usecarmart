package com.usedcarapp.controller;

import com.usedcarapp.dto.LoginRequestDTO;
import com.usedcarapp.dto.UserProfileDTO;
import com.usedcarapp.dto.UserRegistrationDTO;
import com.usedcarapp.entity.User;
import com.usedcarapp.entity.Role;
import com.usedcarapp.repository.UserRepository;
import com.usedcarapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequestDTO loginDTO) {
        String token = userService.authenticate(loginDTO.getEmail(), loginDTO.getPassword());
        if (token != null) {
            return ResponseEntity.ok(token);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody UserRegistrationDTO registrationDTO) {
        if (userRepository.findByEmail(registrationDTO.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already in use");
        }

        if (registrationDTO.getRole() == null) {
            registrationDTO.setRole(Role.BUYER);
        }

        User newUser = new User();
        newUser.setEmail(registrationDTO.getEmail());
        newUser.setPassword(registrationDTO.getPassword());
        newUser.setRole(registrationDTO.getRole());

        userService.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDTO> getUserProfile(Principal principal) {
        UserProfileDTO userProfile = userService.getUserProfile(principal.getName());
        return ResponseEntity.ok(userProfile);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateUserProfile(Principal principal, @RequestBody UserProfileDTO userProfileDTO) {
        userService.updateUserProfile(principal.getName(), userProfileDTO);
        return ResponseEntity.ok("Profile updated successfully");
    }
}
