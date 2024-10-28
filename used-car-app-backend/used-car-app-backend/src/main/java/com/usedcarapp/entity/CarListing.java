package com.usedcarapp.entity;

import com.usedcarapp.dto.CarListingDTO; // Ensure this import is added
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CarListing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private Double price;
    private Long sellerId; // Optional: Include if you have a sellerId field
    private Long views; // Add the views field

    // Constructor to create a CarListing from CarListingDTO
    public CarListing(CarListingDTO carListingDTO) {
        this.title = carListingDTO.getTitle();
        this.description = carListingDTO.getDescription();
        this.price = carListingDTO.getPrice();
        this.sellerId = carListingDTO.getSellerId(); // Add this if you have a sellerId field
        this.views = carListingDTO.getViews(); // Initialize views
    }

    // Getter and Setter for views
    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }
}
