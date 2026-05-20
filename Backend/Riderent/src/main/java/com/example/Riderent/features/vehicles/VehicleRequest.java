package com.example.Riderent.features.vehicles;

public class VehicleRequest {
    private String model;
    private String type;
    private Double dailyRate;
    private String ownerEmail;

    private Vehicle.Address address;

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getDailyRate() { return dailyRate; }
    public void setDailyRate(Double dailyRate) { this.dailyRate = dailyRate; }

    public String getOwnerEmail() { return ownerEmail; }
    public void setOwnerEmail(String ownerEmail) { this.ownerEmail = ownerEmail; }

    public Vehicle.Address getAddress() { return address; }
    public void setAddress(Vehicle.Address address) { this.address = address; }
}