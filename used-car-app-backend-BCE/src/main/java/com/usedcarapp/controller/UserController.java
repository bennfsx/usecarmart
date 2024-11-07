package com.usedcarapp.controller;

import org.springframework.data.jpa.repository.JpaRepository;

import com.usedcarapp.boundarytwo.User;

import java.util.Optional;

public interface UserController extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndPassword(String email, String password);
}
