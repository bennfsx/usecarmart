// FavoriteService.java
package com.usedcarapp.service;

import com.usedcarapp.entity.Favorite;
import com.usedcarapp.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavoriteService {
    @Autowired
    private FavoriteRepository favoriteRepository;

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
