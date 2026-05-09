package com.example.Riderent.shared.user.model;

import com.example.Riderent.features.vehicles.Vehicle;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.DynamicUpdate;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
@DynamicUpdate
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String email;
    private String password;
    private String fullName;
    private String phone;
    private String address;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    @JdbcTypeCode(SqlTypes.BINARY)
    @Column(name = "image", columnDefinition = "bytea")
    private byte[] image;

    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "owner")
    @JsonIgnore
    private List<Vehicle> vehicles;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public byte[] getImage() { return image; }
    public void setImage(byte[] image) { this.image = image; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}