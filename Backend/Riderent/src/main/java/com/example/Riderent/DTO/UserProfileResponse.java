package com.example.Riderent.DTO;

public class UserProfileResponse {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private String image;

    public UserProfileResponse(String fullName, String email, String phone, String address, String image){
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.image = image;
    }

}
