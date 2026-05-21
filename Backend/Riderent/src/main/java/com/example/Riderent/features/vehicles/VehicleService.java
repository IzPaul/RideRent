package com.example.Riderent.features.vehicles;

import com.example.Riderent.features.bookings.BookingRepository;
import com.example.Riderent.shared.user.model.UserProfile;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;


    private final BookingRepository bookingRepository;

    public VehicleService(VehicleRepository vehicleRepository, BookingRepository bookingRepository) {
        this.vehicleRepository = vehicleRepository;
        this.bookingRepository = bookingRepository;
    }

    public Vehicle saveVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public List<VehicleResponse> getAllVehiclesAsResponse() {
        return vehicleRepository.findAll().stream().map(this::convertToResponseDto).collect(Collectors.toList());
    }

    public List<VehicleResponse> getVehiclesByOwnerAsResponse(UserProfile owner) {
        return getVehiclesByOwnerAsResponseWithPendingCount(owner);  // reuse new logic
    }

    public List<Vehicle> getVehiclesByOwner(UserProfile owner) {
        return vehicleRepository.findByOwner(owner);
    }

    public Optional<VehicleResponse> getVehicleById(Long id) {
        return vehicleRepository.findById(id).map(this::convertToResponseDto);
    }

    public VehicleResponse updateVehicleMultipart(Long id, String model, String type, Double dailyRate,
                                                  String description, String region, String province, String city,
                                                  MultipartFile image) throws IOException {
        return vehicleRepository.findById(id).map(vehicle -> {
            vehicle.setModel(model);
            vehicle.setDescription(description);
            vehicle.setType(type);
            vehicle.setDailyRate(dailyRate);
            vehicle.setAddress(new Vehicle.Address(region, province, city));
            if (image != null && !image.isEmpty()) {
                try { vehicle.setImage(image.getBytes()); } catch (IOException e) { throw new RuntimeException(e); }
            }
            return convertToResponseDto(vehicleRepository.save(vehicle));
        }).orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    private VehicleResponse convertToResponseDto(Vehicle vehicle) {
        VehicleResponse dto = new VehicleResponse();
        dto.setId(vehicle.getId());
        dto.setModel(vehicle.getModel());
        dto.setDescription(vehicle.getDescription());
        dto.setType(vehicle.getType());
        dto.setDailyRate(vehicle.getDailyRate());
        dto.setRating(vehicle.getRating());
        dto.setAddress(vehicle.getAddress());
        if (vehicle.getOwner() != null) {
            dto.setOwnerName(vehicle.getOwner().getFullName());
            dto.setOwnerEmail(vehicle.getOwner().getEmail());
            dto.setOwnerPhone(vehicle.getOwner().getPhone());
        }
        if (vehicle.getImage() != null) {
            dto.setImage(Base64.getEncoder().encodeToString(vehicle.getImage()));
        }
        return dto;
    }

    public List<VehicleResponse> getVehiclesByOwnerAsResponseWithPendingCount(UserProfile owner) {
        List<Vehicle> vehicles = vehicleRepository.findByOwner(owner);

        return vehicles.stream().map(vehicle -> {
            VehicleResponse dto = convertToResponseDto(vehicle);

            long pendingCount = bookingRepository.countByVehicleAndStatus(vehicle, "PENDING");
            dto.setPendingBookings((int) pendingCount);

            return dto;
        }).collect(Collectors.toList());
    }
}