package com.example.Riderent.shared.user;

import com.example.Riderent.shared.user.model.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<UserProfile, UUID> {
    Optional<UserProfile> findByEmail(String email);

    boolean existsByEmail(String email);
}