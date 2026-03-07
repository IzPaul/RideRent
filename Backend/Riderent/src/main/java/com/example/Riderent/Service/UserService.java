package com.example.Riderent.Service;


import com.example.Riderent.DTO.UpdateProfileRequest;
import com.example.Riderent.Entity.UserProfile;
import com.example.Riderent.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    // GET PROFILE
    public UserProfile getProfile(String email) {
        UserProfile profile = repository.findByEmail(email).get();
        if (profile == null) throw new RuntimeException("Profile not found");
        return profile;
    }

    // EDIT PROFILE
    public String updateProfile(String email, UpdateProfileRequest request) {
        UserProfile profile = repository.findByEmail(email).get();
        if (profile == null) {
            profile = new UserProfile();
            profile.setId(UUID.randomUUID());
            profile.setEmail(email);
            profile.setCreatedAt(LocalDateTime.now());
        }

        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());

        repository.save(profile);
        return "Profile updated successfully";
    }

    // CHANGE PASSWORD
    public String changePassword(String email, String newPassword) {
        return "Password updated successfully for user: " + email;
    }
}