// FavoriteController.java
package com.usedcarapp.controller;

import com.usedcarapp.entity.Favorite;
import com.usedcarapp.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favorites")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;

    @PostMapping("/{userId}/add/{listingId}")
    public Favorite addFavorite(@PathVariable Long userId, @PathVariable Long listingId) {
        return favoriteService.addFavorite(userId, listingId);
    }

    @GetMapping("/{userId}")
    public List<Favorite> getFavorites(@PathVariable Long userId) {
        return favoriteService.getFavorites(userId);
    }
}
