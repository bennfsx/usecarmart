// CarListingDTO.java
package com.usedcarapp.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class CarListingDTO {
    @NotNull
    private Long sellerId;  // Add sellerId field

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    @NotNull
    private Double price;

    private String imageUrl;

    // Getters and Setters
    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

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
}
