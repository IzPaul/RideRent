package com.example.Riderent.features.vehicles;

import com.example.Riderent.shared.user.model.UserProfile;
import com.example.Riderent.shared.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "*")
public class VehicleController {

    private final VehicleService vehicleService;
    private final UserService userService;

    public VehicleController(VehicleService vehicleService, UserService userService) {
        this.vehicleService = vehicleService;
        this.userService = userService;
    }

    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<VehicleResponse> createVehicle(
            @RequestParam("model") String model,
            @RequestParam("type") String type,
            @RequestParam("dailyRate") Double dailyRate,
            @RequestParam("description") String description,
            @RequestParam("ownerEmail") String ownerEmail,
            @RequestParam("region") String region,
            @RequestParam("province") String province,
            @RequestParam("city") String city,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        UserProfile owner = userService.findByEmail(ownerEmail)
                .orElseThrow(() -> new RuntimeException("Owner not found: " + ownerEmail));

        Vehicle vehicle = new Vehicle();
        vehicle.setModel(model);
        vehicle.setDescription(description);
        vehicle.setType(type);
        vehicle.setDailyRate(dailyRate);
        vehicle.setOwner(owner);
        vehicle.setAddress(new Vehicle.Address(region, province, city));
        vehicle.setRating(0.0);

        if (image != null && !image.isEmpty()) {
            vehicle.setImage(image.getBytes());
        }

        Vehicle saved = vehicleService.saveVehicle(vehicle);
        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping("/vehicle-listing")
    public ResponseEntity<List<VehicleResponse>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehiclesAsResponse());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleResponse> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-vehicles")
    public ResponseEntity<List<VehicleResponse>> getMyVehicles(@RequestParam("email") String email) {
        UserProfile owner = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(vehicleService.getVehiclesByOwnerAsResponse(owner));
    }

    // Update vehicle with optional new image (multipart)
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public ResponseEntity<VehicleResponse> updateVehicleMultipart(
            @PathVariable Long id,
            @RequestParam("model") String model,
            @RequestParam("type") String type,
            @RequestParam("dailyRate") Double dailyRate,
            @RequestParam("description") String description,
            @RequestParam("region") String region,
            @RequestParam("province") String province,
            @RequestParam("city") String city,
            @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {

        return ResponseEntity.ok(vehicleService.updateVehicleMultipart(
                id, model, type, dailyRate, description, region, province, city, image));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok("Vehicle deleted successfully");
    }

    private VehicleResponse toResponse(Vehicle v) {
        VehicleResponse r = new VehicleResponse();
        r.setId(v.getId());
        r.setModel(v.getModel());
        r.setDescription(v.getDescription());
        r.setType(v.getType());
        r.setDailyRate(v.getDailyRate());
        r.setRating(v.getRating());
        r.setAddress(v.getAddress());
        if (v.getOwner() != null) {
            r.setOwnerName(v.getOwner().getFullName());
            r.setOwnerEmail(v.getOwner().getEmail());
            r.setOwnerPhone(v.getOwner().getPhone());
        }
        if (v.getImage() != null) {
            r.setImage(Base64.getEncoder().encodeToString(v.getImage()));
        }
        return r;
    }
}