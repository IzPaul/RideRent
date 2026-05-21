package com.example.Riderent.features.reviews;

import com.example.Riderent.features.vehicles.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    @Query("SELECT r FROM Review r WHERE r.booking.vehicle = :vehicle")
    List<Review> findByVehicle(@Param("vehicle") Vehicle vehicle);

    Optional<Review> findByBookingId(Long bookingId);
}
