
package com.triagesync.service;

import com.triagesync.dto.request.BookingRequest;
import com.triagesync.dto.response.BookingResponse;
import com.triagesync.entity.Booking;
import com.triagesync.entity.Resource;
import com.triagesync.enums.BookingStatus;
import com.triagesync.repository.BookingRepository;
import com.triagesync.repository.ResourceRepository;
import com.triagesync.repository.TicketRepository;
import com.triagesync.repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final ResourceRepository resourceRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            ResourceRepository resourceRepository,
            TicketRepository ticketRepository,
            UserRepository userRepository) {

        this.bookingRepository = bookingRepository;
        this.resourceRepository = resourceRepository;
        this.ticketRepository = ticketRepository;
        this.userRepository = userRepository;
    }

    // Create a new booking
    @Transactional
    public BookingResponse createBooking(
            BookingRequest request,
            Long userId) {

        // Check user existence
        if (!userRepository.existsById(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "User not found");
        }

        // Convert Instant to UTC LocalDateTime
        LocalDateTime startTime =
                LocalDateTime.ofInstant(request.startTime(), ZoneOffset.UTC);

        LocalDateTime endTime =
                LocalDateTime.ofInstant(request.endTime(), ZoneOffset.UTC);

        LocalDateTime now = LocalDateTime.now(ZoneOffset.UTC);

        // Validate start and end time
        if (!startTime.isAfter(now)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Booking must be in the future");
        }

        if (!endTime.isAfter(startTime)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "End time must be after start time");
        }

        // Booking must be within next 30 days
        if (startTime.isAfter(now.plusDays(30))) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Booking cannot be more than 30 days in advance");
        }

        // Validate 30-minute time grid
        if (!isValidTimeSlot(startTime) || !isValidTimeSlot(endTime)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Booking time must follow a 30-minute grid");
        }

        // Validate booking duration: 30 to 240 minutes
        long duration = Duration.between(startTime, endTime).toMinutes();

        if (duration < 30 || duration > 240) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Booking duration must be between 30 and 240 minutes");
        }

        // Check resource
        Resource resource = resourceRepository.findById(request.resourceId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Resource not found"));

        if (!Boolean.TRUE.equals(resource.getIsActive())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This resource is currently inactive");
        }

        // Check optional ticket
        if (request.ticketId() != null &&
                !ticketRepository.existsById(request.ticketId())) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Ticket not found");
        }

        List<BookingStatus> blockingStatuses = List.of(
                BookingStatus.PENDING,
                BookingStatus.APPROVED
        );

        // Maximum 3 future pending/approved bookings per user
        long futureBookings = bookingRepository.countFutureBookings(
                userId,
                blockingStatuses,
                now
        );

        if (futureBookings >= 3) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "You can have a maximum of 3 future bookings");
        }

        // Check overlapping bookings
        long overlappingBookings =
                bookingRepository.countOverlappingBookings(
                        request.resourceId(),
                        startTime,
                        endTime,
                        blockingStatuses
                );

        if (overlappingBookings > 0) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "This resource is already booked for the selected time");
        }

        // Save booking
        Booking booking = new Booking();

        booking.setUserId(userId);
        booking.setResourceId(request.resourceId());
        booking.setTicketId(request.ticketId());
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setPurpose(request.purpose());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        return BookingResponse.fromEntity(savedBooking);
    }

    // Get all bookings of a user
    @Transactional(readOnly = true)
    public List<BookingResponse> getMyBookings(Long userId) {

        return bookingRepository.findByUserId(userId)
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }

    // Get booking by ID
    @Transactional(readOnly = true)
    public BookingResponse getBookingById(Long bookingId) {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));

        return BookingResponse.fromEntity(booking);
    }

    // Admin approves a booking
    @Transactional
    public BookingResponse approveBooking(Long bookingId) {

        Booking booking = findBooking(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending bookings can be approved");
        }

        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionNote(null);

        return BookingResponse.fromEntity(
                bookingRepository.save(booking));
    }

    // Admin rejects a booking
    @Transactional
    public BookingResponse rejectBooking(
            Long bookingId,
            String rejectionNote) {

        Booking booking = findBooking(bookingId);

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending bookings can be rejected");
        }

        if (rejectionNote == null ||
                rejectionNote.trim().length() < 5 ||
                rejectionNote.trim().length() > 200) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Rejection note must be between 5 and 200 characters");
        }

        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionNote(rejectionNote.trim());

        return BookingResponse.fromEntity(
                bookingRepository.save(booking));
    }

    // User cancels their own pending booking
    @Transactional
    public BookingResponse cancelBooking(
            Long bookingId,
            Long userId) {

        Booking booking = findBooking(bookingId);

        if (!booking.getUserId().equals(userId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot cancel another user's booking");
        }

        if (booking.getStatus() != BookingStatus.PENDING) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Only pending bookings can be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return BookingResponse.fromEntity(
                bookingRepository.save(booking));
    }

    // Helper method
    private Booking findBooking(Long bookingId) {

        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found"));
    }


    // Check whether time follows 30-minute grid
    private boolean isValidTimeSlot(LocalDateTime time) {
        return (time.getMinute() == 0 || time.getMinute() == 30)
                && time.getSecond() == 0
                && time.getNano() == 0;
    }

    // Get all bookings (ADMIN)
    @Transactional(readOnly = true)
    public List<BookingResponse> getAllBookings() {
        return bookingRepository.findAll()
                .stream()
                .map(BookingResponse::fromEntity)
                .toList();
    }
}






