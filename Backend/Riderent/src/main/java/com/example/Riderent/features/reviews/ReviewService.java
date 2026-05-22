package com.example.Riderent.features.reviews;

import com.example.Riderent.features.bookings.Booking;
import com.example.Riderent.features.bookings.BookingRepository;
import com.example.Riderent.features.vehicles.Vehicle;
import com.example.Riderent.features.vehicles.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         BookingRepository bookingRepository,
                         VehicleRepository vehicleRepository) {
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public ReviewResponse createReview(ReviewRequest request, String bookerEmail) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (!booking.getBooker().getEmail().equals(bookerEmail)) {
            throw new RuntimeException("You can only review your own bookings");
        }

        if (!"COMPLETED".equals(booking.getStatus()) && !"CONFIRMED".equals(booking.getStatus())) {
            throw new RuntimeException("You can only review completed or confirmed bookings");
        }

        if (reviewRepository.findByBookingId(request.getBookingId()).isPresent()) {
            throw new RuntimeException("You have already reviewed this booking");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        Vehicle vehicle = booking.getVehicle();
        if (vehicle == null) {
            throw new RuntimeException("Vehicle associated with booking not found");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setBookerName(booking.getBooker().getFullName());
        review.setRating(request.getRating());
        String comment = request.getComment();
        review.setComment(request.getComment() != null ? request.getComment().trim() : "");
        review.setCreatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);

        updateVehicleRating(booking.getVehicle().getId());

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ReviewResponse> getReviewsForVehicle(Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
        return reviewRepository.findByVehicle(vehicle).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private ReviewResponse toResponse(Review review) {
        ReviewResponse res = new ReviewResponse();
        res.setId(review.getId());
        res.setBookingId(review.getBooking().getId());
        res.setVehicleId(review.getBooking().getVehicle().getId());
        res.setBookerName(review.getBookerName());
        res.setRating(review.getRating());
        res.setComment(review.getComment());
        res.setCreatedAt(review.getCreatedAt());
        return res;
    }

    private void updateVehicleRating(Long vehicleId) {
        List<Review> reviews = reviewRepository.findByVehicle(
                vehicleRepository.findById(vehicleId).orElseThrow()
        );

        if (reviews.isEmpty()) {
            return;
        }

        double average = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);

        Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow();
        vehicle.setRating(Math.round(average * 10.0) / 10.0);
        vehicleRepository.save(vehicle);
    }
}
