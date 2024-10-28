package com.usedcarapp.dto;

public class CarListingDTO {
    private String title;
    private String description;
    private Double price;
    private Long sellerId; // Optional: Include if you have a sellerId field
    private Long views; // Optional: Include if you want to track views

    // Constructors, Getters and Setters

    public CarListingDTO() {
    }

    public CarListingDTO(String title, String description, Double price, Long sellerId, Long views) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.sellerId = sellerId;
        this.views = views;
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

    public Long getSellerId() {
        return sellerId;
    }

    public void setSellerId(Long sellerId) {
        this.sellerId = sellerId;
    }

    public Long getViews() {
        return views; // Getter for views
    }

    public void setViews(Long views) {
        this.views = views; // Setter for views
    }
}
