package com.example.Riderent.features.bookings;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@RequestBody BookingRequest request) {
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@RequestParam String email) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(email));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<BookingResponse>> getBookingsForVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(bookingService.getBookingsForVehicle(vehicleId));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long id,
            @RequestParam String email) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, email, "CANCELLED"));
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<BookingResponse> confirmBooking(
            @PathVariable Long id,
            @RequestParam String email) {
        return ResponseEntity.ok(bookingService.updateBookingStatus(id, email, "CONFIRMED"));
    }
}