package com.usedcarapp.repository;

import com.usedcarapp.entity.CarListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarListingRepository extends JpaRepository<CarListing, Long> {

    // Custom method to find car listings by seller ID
    List<CarListing> findBySellerId(Long sellerId);
}
