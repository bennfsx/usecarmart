package com.usedcarapp.controller;

import com.usedcarapp.dto.CarListingDTO;
import com.usedcarapp.entity.CarListing;
import com.usedcarapp.service.CarListingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/listings")
@Validated // Enables validation annotations
public class CarListingController {

    @Autowired
    private CarListingService carListingService;

    @PostMapping("/create")
    public ResponseEntity<CarListing> createListing(@Valid @RequestBody CarListingDTO carListingDTO) {
        CarListing createdListing = carListingService.createListing(carListingDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdListing);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<CarListing> getListingDetails(@PathVariable Long id) {
        CarListing listing = carListingService.getListingDetails(id);
        return ResponseEntity.ok(listing);
    }

    @PutMapping("/{id}/view")
    public ResponseEntity<Void> updateListingViews(@PathVariable Long id) {
        carListingService.incrementViews(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<CarListing>> getSellerListings(
            @PathVariable Long sellerId,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        List<CarListing> listings = carListingService.getSellerListings(sellerId, page, size);
        return ResponseEntity.ok(listings);
    }
}
