package com.example.Riderent.features.vehicles;

import com.example.Riderent.shared.user.model.UserProfile;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    @EntityGraph(attributePaths = {"owner"})
    List<Vehicle> findByOwner(UserProfile owner);
}