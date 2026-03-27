package com.example.Riderent;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = "com.example.Riderent")
public class RideRentApplication {

	public static void main(String[] args) {
		SpringApplication.run(RideRentApplication.class, args);
	}
}
