package com.example.Riderent.features.vehicles;

public class VehicleResponse {
    private Long id;
    private String model;
    private String description;
    private String type;
    private Double dailyRate;
    private Double rating;
    private String ownerEmail;
    private String ownerName;
    private String ownerPhone;
    private Vehicle.Address address;
    private String image; // base64

    public VehicleResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }

    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getOwnerPhone() { return ownerPhone; }
    public void setOwnerPhone(String ownerPhone) { this.ownerPhone = ownerPhone; }

    public Vehicle.Address getAddress() { return address; }
    public void setAddress(Vehicle.Address address) { this.address = address; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }
}