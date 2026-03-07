package com.example.Riderent.Controller;

import com.example.Riderent.DTO.MessageResponse;
import com.example.Riderent.DTO.UpdateProfileRequest;
import com.example.Riderent.Entity.UserProfile;
import com.example.Riderent.Service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET PROFILE
    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(@RequestParam String email) {
        return ResponseEntity.ok(userService.getProfile(email));
    }

    // EDIT PROFILE
    @PutMapping("/profile")
    public ResponseEntity<MessageResponse> updateProfile(
            @RequestParam String email,
            @RequestBody UpdateProfileRequest request) {

        String message = userService.updateProfile(email, request);
        return ResponseEntity.ok(new MessageResponse(message));
    }

    // CHANGE PASSWORD
    @PutMapping("/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @RequestParam String email,
            @RequestBody Map<String, String> body) {

        String message = userService.changePassword(email, body.get("password"));
        return ResponseEntity.ok(new MessageResponse(message));
    }
}


