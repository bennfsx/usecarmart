// FavoriteController.java
package com.usedcarapp.boundary;

import com.usedcarapp.boundarytwo.Favorite;
import com.usedcarapp.entity.FavoriteServiceEntity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteBoundary {
    @Autowired
    private FavoriteServiceEntity favoriteService;

    @PostMapping("/{userId}/add/{listingId}")
    public Favorite addFavorite(@PathVariable Long userId, @PathVariable Long listingId) {
        return favoriteService.addFavorite(userId, listingId);
    }

    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId) {
        return favoriteService.getFavorites(userId);
    }
}
