// FavoriteService.java
package com.usedcarapp.entity;

import com.usedcarapp.controller.FavoriteController;
import com.usedcarapp.boundarytwo.Favorite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteServiceEntity {
    @Autowired
    private FavoriteController favoriteRepository;

    public Favorite addFavorite(Long userId, Long listingId) {
        // Logic to create and save a favorite
        Favorite favorite = new Favorite();
        favorite.setUserId(userId);
        favorite.setListingId(listingId);
        return favoriteRepository.save(favorite);
    }

    public List<Favorite> getFavorites(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }
}
