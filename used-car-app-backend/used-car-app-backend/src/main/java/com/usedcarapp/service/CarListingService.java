// src/main/java/com/usedcarapp/service/CarListingService.java
package com.usedcarapp.service;

import com.usedcarapp.dto.CarListingDTO;
import com.usedcarapp.entity.CarListing;
import com.usedcarapp.repository.CarListingRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarListingService {

    @Autowired
    private CarListingRepository carListingRepository;

    public CarListing createListing(CarListingDTO carListingDTO) {
        CarListing carListing = new CarListing(carListingDTO);
        return carListingRepository.save(carListing);
    }

    public CarListing getListingDetails(Long id) {
        return carListingRepository.findById(id).orElse(null);
    }

    public void incrementViews(Long id) {
        CarListing carListing = carListingRepository.findById(id).orElse(null);
        if (carListing != null) {
            carListing.setViews(carListing.getViews() == null ? 1 : carListing.getViews() + 1);
            carListingRepository.save(carListing);
        }
    }
    
    

    public List<CarListing> getSellerListings(Long sellerId) {
        return carListingRepository.findBySellerId(sellerId);
    }
}
