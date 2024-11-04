// CarListingService.java
package com.usedcarapp.service;

import com.usedcarapp.dto.CarListingDTO;
import com.usedcarapp.entity.CarListing;
import com.usedcarapp.repository.CarListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CarListingService {
    @Autowired
    private CarListingRepository carListingRepository;

    public CarListing createListing(CarListingDTO carListingDTO) {
        CarListing carListing = new CarListing();
        carListing.setSellerId(carListingDTO.getSellerId());
        carListing.setTitle(carListingDTO.getTitle());
        carListing.setDescription(carListingDTO.getDescription());
        carListing.setPrice(carListingDTO.getPrice());
        carListing.setImageUrl(carListingDTO.getImageUrl());
        carListing.setViews(0); // Initialize views to zero
        return carListingRepository.save(carListing);
    }

    public CarListing getListingDetails(Long id) {
        return carListingRepository.findById(id).orElse(null);
    }

    public void incrementViews(Long id) {
        CarListing carListing = getListingDetails(id);
        if (carListing != null) {
            carListing.setViews(carListing.getViews() + 1);
            carListingRepository.save(carListing);
        }
    }

    public List<CarListing> getSellerListings(Long sellerId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return carListingRepository.findBySellerId(sellerId, pageable).getContent();
    }
}
