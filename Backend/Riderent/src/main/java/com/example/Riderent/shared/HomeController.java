package com.example.Riderent.shared;

import org.springframework.web.bind.annotation.GetMapping;

public class HomeController {
    @GetMapping("/")
    public String home() {
        return "RideRent API is running";
    }
}
