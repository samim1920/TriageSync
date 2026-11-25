
package com.triagesync.repository;

import com.triagesync.entity.Booking;
import com.triagesync.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find bookings by user
    List<Booking> findByUserId(Long userId);

    // Find bookings by resource
    List<Booking> findByResourceId(Long resourceId);

    // Find bookings by status
    List<Booking> findByStatus(BookingStatus status);

    // Find bookings for a particular user and status
    List<Booking> findByUserIdAndStatus(Long userId, BookingStatus status);

    // Count future pending/approved bookings of a user
    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.userId = :userId
          AND b.status IN :statuses
          AND b.startTime > :now
        """)
    long countFutureBookings(
            @Param("userId") Long userId,
            @Param("statuses") List<BookingStatus> statuses,
            @Param("now") LocalDateTime now
    );

    // Check overlapping bookings for a resource
    @Query("""
        SELECT COUNT(b)
        FROM Booking b
        WHERE b.resourceId = :resourceId
          AND b.status IN :statuses
          AND b.startTime < :endTime
          AND b.endTime > :startTime
        """)
    long countOverlappingBookings(
            @Param("resourceId") Long resourceId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("statuses") List<BookingStatus> statuses
    );
}
