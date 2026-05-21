package com.example.Riderent.features.bookings;

import com.example.Riderent.shared.user.model.UserProfile;
import com.example.Riderent.features.vehicles.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBooker(UserProfile booker);
    List<Booking> findByVehicle(Vehicle vehicle);
}