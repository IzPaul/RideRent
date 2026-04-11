package com.example.Riderent.shared.user;


import com.example.Riderent.features.profile.dto.UpdateProfileRequest;
import com.example.Riderent.shared.user.dto.UserProfileResponse;
import com.example.Riderent.shared.user.model.UserProfile;
import com.example.Riderent.shared.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    // get profile
    public UserProfileResponse getProfile(String email) {
        UserProfile profile = repository.findByEmail(email).get();
        if (profile == null) throw new RuntimeException("Profile not found");

        String base64Image = null;
        if (profile.getImage() != null) {
            base64Image = Base64.getEncoder().encodeToString(profile.getImage());
        }

        return new UserProfileResponse(
                profile.getFullName(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getAddress(),
                base64Image);
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
            profile.setEmail(request.getEmail());
            profile.setAddress(request.getAddress());

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