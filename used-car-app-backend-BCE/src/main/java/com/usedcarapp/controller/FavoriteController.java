package com.usedcarapp.controller;

import org.springframework.data.jpa.repository.JpaRepository;

import com.usedcarapp.boundarytwo.Favorite;

import java.util.List;

public interface FavoriteController extends JpaRepository<Favorite, Long> {
    List<Favorite> findByUserId(Long userId);
}
