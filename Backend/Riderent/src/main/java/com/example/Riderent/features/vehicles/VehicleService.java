package com.example.Riderent.features.vehicles;

import com.example.Riderent.shared.user.model.UserProfile;
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

    public Optional<VehicleResponse> getVehicleById(Long id) {
        return vehicleRepository.findById(id).map(this::convertToResponseDto);
    }

    private VehicleResponse convertToResponseDto(Vehicle vehicle) {
        VehicleResponse dto = new VehicleResponse();
        dto.setModel(vehicle.getModel());
        dto.setDescription(vehicle.getDescription());
        dto.setType(vehicle.getType());
        dto.setDailyRate(vehicle.getDailyRate());
        dto.setAddress(vehicle.getAddress());

        if (vehicle.getOwner() != null) {
            dto.setOwnerName(vehicle.getOwner().getFullName());
            dto.setOwnerEmail(vehicle.getOwner().getEmail());
            dto.setOwnerPhone(vehicle.getOwner().getPhone());
        }

        return dto;
    }

    public List<Vehicle> getVehiclesByOwner(UserProfile owner) {
        return vehicleRepository.findByOwner(owner);
    }

    public Vehicle updateVehicle(Long id, Vehicle updatedVehicle) {
        return vehicleRepository.findById(id)
                .map(vehicle -> {
                    vehicle.setModel(updatedVehicle.getModel());
                    vehicle.setDescription(updatedVehicle.getDescription());
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