// CarListingRepository.java
package com.usedcarapp.repository;

import com.usedcarapp.entity.CarListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CarListingRepository extends JpaRepository<CarListing, Long> {
    Page<CarListing> findBySellerId(Long sellerId, Pageable pageable);
}
