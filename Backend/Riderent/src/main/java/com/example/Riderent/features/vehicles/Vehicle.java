package com.example.Riderent.features.vehicles;


import com.example.Riderent.shared.user.model.UserProfile;
import jakarta.persistence.*;

@Entity
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private UserProfile owner;

    private String model;

    private String type;

    private Double rating;

    @Embedded
    private Address address;

    public UserProfile getOwner() {
        return owner;
    }

    public void setOwner(UserProfile owner) {
        this.owner = owner;
    }

    public Vehicle() {
    }

    public Vehicle(String model, String type, Double rating, Address address) {
        this.model = model;
        this.type = type;
        this.rating = rating;
        this.address = address;
    }

    public Long getId() {
        return id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }
}

@Embeddable
class Address {

    @Column(name = "region")
    private String region;

    @Column(name = "province")
    private String province;

    @Column(name = "city")
    private String city;

    public Address() {
    }

    public Address(String region, String province, String city) {
        this.region = region;
        this.province = province;
        this.city = city;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getProvince() {
        return province;
    }

    public void setProvince(String province) {
        this.province = province;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    @Override
    public String toString() {
        return region + ", " + province + ", " + city;
    }
}