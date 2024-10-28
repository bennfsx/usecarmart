package com.usedcarapp.dto;

import com.usedcarapp.entity.Role;

public class UserProfileDTO {
    private String email;
    private String name;
    private Role role; // Optional: add role if relevant to the profile
    private String phoneNumber; // Optional: add phone number
    private String address; // Optional: add address

    // Constructors, Getters and Setters

    public UserProfileDTO() {
    }

    public UserProfileDTO(String email, String name, Role role, String phoneNumber, String address) {
        this.email = email;
        this.name = name;
        this.role = role;
        this.phoneNumber = phoneNumber;
        this.address = address;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
