package com.example.Riderent.features.bookings;

import com.example.Riderent.features.vehicles.Vehicle;
import com.example.Riderent.features.vehicles.VehicleRepository;
import com.example.Riderent.shared.user.UserRepository;
import com.example.Riderent.shared.user.model.UserProfile;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;

    public BookingService(BookingRepository bookingRepository,
                          UserRepository userRepository,
                          VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public BookingResponse createBooking(BookingRequest request) {
        UserProfile booker = userRepository.findByEmail(request.getBookerEmail())
                .orElseThrow(() -> new RuntimeException("Booker not found"));

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        if (days <= 0) throw new RuntimeException("End date must be after start date");

        double totalCost = days * vehicle.getDailyRate();

        Booking booking = new Booking();
        booking.setBooker(booker);
        booking.setVehicle(vehicle);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalCost(totalCost);
        booking.setStatus("PENDING");
        booking.setExtraInfo(request.getExtraInfo());

        return toResponse(bookingRepository.save(booking));
    }

    public List<BookingResponse> getBookingsByUser(String email) {
        UserProfile booker = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByBooker(booker).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<BookingResponse> getBookingsForVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return bookingRepository.findByVehicle(vehicle).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public BookingResponse updateBookingStatus(Long bookingId, String requesterEmail, String newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Booker can cancel their own booking; vehicle owner can confirm or cancel
        boolean isBooker = booking.getBooker().getEmail().equals(requesterEmail);
        boolean isOwner = booking.getVehicle().getOwner().getEmail().equals(requesterEmail);

        if (!isBooker && !isOwner) {
            throw new RuntimeException("Unauthorized");
        }

        if ("CONFIRMED".equals(newStatus) && !isOwner) {
            throw new RuntimeException("Only the vehicle owner can confirm bookings");
        }

        booking.setStatus(newStatus);
        return toResponse(bookingRepository.save(booking));
    }

    private BookingResponse toResponse(Booking booking) {
        BookingResponse res = new BookingResponse();
        res.setId(booking.getId());
        res.setVehicleId(booking.getVehicle().getId());
        res.setVehicleModel(booking.getVehicle().getModel());
        res.setBookerEmail(booking.getBooker().getEmail());
        res.setBookerName(booking.getBooker().getFullName());
        res.setStartDate(booking.getStartDate());
        res.setEndDate(booking.getEndDate());
        res.setTotalCost(booking.getTotalCost());
        res.setStatus(booking.getStatus());
        res.setExtraInfo(booking.getExtraInfo());
        return res;
    }
}