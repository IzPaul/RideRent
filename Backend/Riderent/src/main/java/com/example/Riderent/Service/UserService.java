package com.example.Riderent.Service;


import com.example.Riderent.DTO.UpdateProfileRequest;
import com.example.Riderent.Entity.UserProfile;
import com.example.Riderent.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    // get profile
    public UserProfile getProfile(String email) {
        UserProfile profile = repository.findByEmail(email).get();
        if (profile == null) throw new RuntimeException("Profile not found");
        return profile;
    }

    // edit profile
    public String updateProfile(String email, UpdateProfileRequest request) {
        try{
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
        }catch (Exception e){
            throw  new RuntimeException("User not found");
        }
    }

    // change password
    public String changePassword(String email, String newPassword) {
        try {
            UserProfile profile = repository.findByEmail(email).get();
            profile.setPassword(newPassword);
            repository.save(profile);

            return "Password updated successfully for user: " + email;
        }catch (Exception e){
            throw  new RuntimeException("User not found");
        }
    }

    public String uploadProfileImage(String email, MultipartFile file) throws IOException {

        try {
            UserProfile profile = repository.findByEmail(email).get();
            profile.setImage(file.getBytes());
            repository.save(profile);
            return "Image uploaded successfully";
        }catch (Exception e){
            throw  new RuntimeException("User not found");
        }
    }
}