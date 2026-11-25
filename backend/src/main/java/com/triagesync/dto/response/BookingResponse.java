
package com.triagesync.dto.response;

import com.triagesync.entity.Booking;
import com.triagesync.enums.BookingStatus;

import java.time.LocalDateTime;

public record BookingResponse(
        Long id,
        Long resourceId,
        Long userId,
        Long ticketId,
        LocalDateTime startTime,
        LocalDateTime endTime,
        String purpose,
        BookingStatus status,
        String rejectionNote,
        LocalDateTime createdAt
) {

    public static BookingResponse fromEntity(Booking booking) {

        if (booking == null) {
            return null;
        }

        return new BookingResponse(
                booking.getId(),
                booking.getResourceId(),
                booking.getUserId(),
                booking.getTicketId(),
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getPurpose(),
                booking.getStatus(),
                booking.getRejectionNote(),
                booking.getCreatedAt()
        );
    }
}
