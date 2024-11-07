package com.usedcarapp.boundary;

import com.usedcarapp.boundarytwo.Role;
import com.usedcarapp.boundarytwo.User;
import com.usedcarapp.controller.UserController;
import com.usedcarapp.dto.LoginRequestDTO;
import com.usedcarapp.dto.UserProfileDTO;
import com.usedcarapp.dto.UserRegistrationDTO;
import com.usedcarapp.entity.UserServiceEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/users")
public class UserBoundary {

    @Autowired
    private UserServiceEntity userService;

    @Autowired
    private UserController userRepository;

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
