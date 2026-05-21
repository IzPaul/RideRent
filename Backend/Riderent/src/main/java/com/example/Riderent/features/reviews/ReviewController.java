package com.example.Riderent.features.reviews;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestBody ReviewRequest request,
            @RequestParam String email) {
        return ResponseEntity.ok(reviewService.createReview(request, email));
    }

    @GetMapping("/vehicle/{vehicleId}")
    public ResponseEntity<List<ReviewResponse>> getReviewsForVehicle(@PathVariable Long vehicleId) {
        return ResponseEntity.ok(reviewService.getReviewsForVehicle(vehicleId));
    }
}
