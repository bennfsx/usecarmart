package com.usedcarapp.controller;

import com.usedcarapp.dto.CarListingDTO;
import com.usedcarapp.entity.CarListing;
import com.usedcarapp.service.CarListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/listings")
public class CarListingController {

    @Autowired
    private CarListingService carListingService;

    @PostMapping("/create")
    public CarListing createListing(@RequestBody CarListingDTO carListingDTO) {
        return carListingService.createListing(carListingDTO);
    }

    @GetMapping("/{id}/details")
    public CarListing getListingDetails(@PathVariable Long id) {
        return carListingService.getListingDetails(id);
    }

    @PutMapping("/{id}/view")
    public void updateListingViews(@PathVariable Long id) {
        carListingService.incrementViews(id);
    }

    @GetMapping("/seller/{sellerId}")
    public List<CarListing> getSellerListings(@PathVariable Long sellerId) {
        return carListingService.getSellerListings(sellerId);
    }
}
