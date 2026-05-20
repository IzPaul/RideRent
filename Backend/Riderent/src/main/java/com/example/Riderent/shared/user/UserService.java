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
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository repository;

    public UserService(UserRepository repository) {
        this.repository = repository;
    }

    public UserProfileResponse getProfile(String email) {
        Optional<UserProfile> optional = repository.findByEmail(email);
        UserProfile profile = optional.orElseThrow(() -> new RuntimeException("Profile not found"));

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

    public Optional<UserProfile> findByEmail(String email) {
        return repository.findByEmail(email);
    }

    public String updateProfile(String email, UpdateProfileRequest request) {
        Optional<UserProfile> optionalProfile = repository.findByEmail(email);

        UserProfile profile = optionalProfile.orElseGet(() -> {
            UserProfile newProfile = new UserProfile();
            newProfile.setId(UUID.randomUUID());
            newProfile.setEmail(email);
            newProfile.setCreatedAt(LocalDateTime.now());
            return newProfile;
        });

        byte[] currentImage = profile.getImage();

        profile.setFullName(request.getFullName());
        profile.setPhone(request.getPhone());
        profile.setAddress(request.getAddress());

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            profile.setEmail(request.getEmail());
        }

        profile.setImage(currentImage);

        repository.save(profile);
        return "Profile updated successfully";
    }

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
        if (file.isEmpty()) {
            throw new RuntimeException("Please select an image file");
        }

        final long MAX_SIZE = 2 * 1024 * 1024; // 2MB
        if (file.getSize() > MAX_SIZE) {
            throw new RuntimeException("File size must be less than 2MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        UserProfile profile = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        profile.setImage(file.getBytes());
        repository.save(profile);

        return "Profile image uploaded successfully";
    }
}