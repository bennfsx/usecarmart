package com.usedcarapp.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.usedcarapp.boundarytwo.CarListing;

public interface CarListingController extends JpaRepository<CarListing, Long> {
    Page<CarListing> findBySellerId(Long sellerId, Pageable pageable);
}
