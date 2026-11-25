
package com.triagesync.controller;

import com.triagesync.dto.request.BookingRequest;
import com.triagesync.dto.request.DecisionNoteRequest;
import com.triagesync.dto.response.BookingResponse;
import com.triagesync.entity.User;
import com.triagesync.repository.UserRepository;
import com.triagesync.service.BookingService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    public BookingController(
            BookingService bookingService,
            UserRepository userRepository
    ) {
        this.bookingService = bookingService;
        this.userRepository = userRepository;
    }

    // Create a new booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);

        BookingResponse response =
                bookingService.createBooking(request, user.getId());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // Get current user's bookings
    @GetMapping("/my")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                bookingService.getMyBookings(user.getId())
        );
    }

    // Get booking by ID
    @GetMapping("/{bookingId}")
    public ResponseEntity<BookingResponse> getBookingById(
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(
                bookingService.getBookingById(bookingId)
        );
    }

    // Approve booking (ADMIN)
    @PatchMapping("/{bookingId}/approve")
    public ResponseEntity<BookingResponse> approveBooking(
            @PathVariable Long bookingId
    ) {
        return ResponseEntity.ok(
                bookingService.approveBooking(bookingId)
        );
    }

    // Reject booking (ADMIN)
    @PatchMapping("/{bookingId}/reject")
    public ResponseEntity<BookingResponse> rejectBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody DecisionNoteRequest request
    ) {
        return ResponseEntity.ok(
                bookingService.rejectBooking(
                        bookingId,
                        request.note()
                )
        );
    }

    // Cancel own booking
    @PatchMapping("/{bookingId}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
            @PathVariable Long bookingId,
            Authentication authentication
    ) {
        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                bookingService.cancelBooking(
                        bookingId,
                        user.getId()
                )
        );
    }

    // Find authenticated user from database
    private User getAuthenticatedUser(Authentication authentication) {

        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new org.springframework.web.server.ResponseStatusException(
                                HttpStatus.UNAUTHORIZED,
                                "Authenticated user not found"
                        )
                );
    }

    // Get all bookings (ADMIN)
    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBookings() {
        return ResponseEntity.ok(
                bookingService.getAllBookings()
        );
    }
}

