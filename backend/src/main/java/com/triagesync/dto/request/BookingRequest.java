
package com.triagesync.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public record BookingRequest(

        @NotNull(message = "resourceId is required")
        Long resourceId,

        @NotNull(message = "startTime is required")
        Instant startTime,

        @NotNull(message = "endTime is required")
        Instant endTime,

        @NotBlank(message = "purpose is required")
        @Size(
                min = 5,
                max = 500,
                message = "Purpose must be between 5 and 500 characters"
        )
        String purpose,

        Long ticketId

) {

    public BookingRequest {
        if (purpose != null) {
            purpose = purpose.trim();
        }
    }
}
