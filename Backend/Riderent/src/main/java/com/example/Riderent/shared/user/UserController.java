package com.example.Riderent.shared.user;

import com.example.Riderent.shared.dto.MessageResponse;
import com.example.Riderent.features.profile.dto.UpdateProfileRequest;
import com.example.Riderent.shared.user.dto.UserProfileResponse;
import com.example.Riderent.shared.user.model.UserProfile;
import com.example.Riderent.shared.user.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000/")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET PROFILE
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String email) {
        UserProfileResponse profile = userService.getProfile(email);

        if (profile == null) {
            return ResponseEntity.status(404).body("User not found");
        }
        return ResponseEntity.ok(profile);
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

    @PostMapping("/upload-image/{email}")
    public ResponseEntity<?> uploadImage(
            @PathVariable String email,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            String result = userService.uploadProfileImage(email, file);
            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
}


