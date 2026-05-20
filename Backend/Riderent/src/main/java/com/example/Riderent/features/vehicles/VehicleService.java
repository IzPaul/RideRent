package com.example.Riderent.features.vehicles;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicleById(Long id) {
        return vehicleRepository.findById(id);
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setModel(updatedVehicle.getModel());
                    vehicle.setType(updatedVehicle.getType());
                    vehicle.setDailyRate(updatedVehicle.getDailyRate());
                    vehicle.setRating(updatedVehicle.getRating());
                    vehicle.setAddress(updatedVehicle.getAddress());

                    return vehicleRepository.save(vehicle);
                })
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}