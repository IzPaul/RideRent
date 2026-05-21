package com.example.Riderent.features.vehicles;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.Riderent.shared.user.model.UserProfile;
import com.example.Riderent.shared.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;
    private final UserService userService;

    public VehicleController(VehicleService vehicleService, UserService userService) {
        this.vehicleService = vehicleService;
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<Vehicle> createVehicle(@RequestBody VehicleRequest request) {
        UserProfile owner = userService.findByEmail(request.getOwnerEmail())
                .orElseThrow(() -> new RuntimeException("Owner not found: " + request.getOwnerEmail()));

        Vehicle vehicle = new Vehicle();
        vehicle.setModel(request.getModel());
        vehicle.setDescription(request.getDescription());
        vehicle.setType(request.getType());
        vehicle.setDailyRate(request.getDailyRate());
        vehicle.setOwner(owner);
        vehicle.setAddress(request.getAddress());
        vehicle.setRating(0.0);

        Vehicle saved = vehicleService.saveVehicle(vehicle);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/vehicle-listing")
    public ResponseEntity<List<Vehicle>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vehicle> getVehicleById(@PathVariable Long id) {
        return vehicleService.getVehicleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-vehicles")
    public ResponseEntity<List<Vehicle>> getMyVehicles(
            @RequestParam("email") String email) {

        System.out.println("Received email: " + email);
        UserProfile owner = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Vehicle> vehicles = vehicleService.getVehiclesByOwner(owner);

        return ResponseEntity.ok(vehicles);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {

        return ResponseEntity.ok(vehicleService.updateVehicle(id, vehicle));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok("Vehicle deleted successfully");
    }
}