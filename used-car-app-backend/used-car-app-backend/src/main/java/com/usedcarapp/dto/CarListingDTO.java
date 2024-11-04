package com.usedcarapp.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class CarListingDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Price is required")
    private Double price;

    @NotBlank(message = "Image URL is required")
    private String imageUrl;

    @NotNull(message = "Seller ID is required")
    private Long sellerId;

    private int views; 

    // Constructors
    public CarListingDTO() {}

    public CarListingDTO(String title, String description, Double price, String imageUrl, Long sellerId) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.sellerId = sellerId;
        this.views = 0; // Default value for views
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public int getViews() {
        return views;
    }

    public void setViews(int views) {
        this.views = views;
    }
}
