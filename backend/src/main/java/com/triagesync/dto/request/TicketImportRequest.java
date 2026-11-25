
package com.triagesync.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record TicketImportRequest(

        @NotNull(message = "tickets array is required")
        @NotEmpty(message = "tickets array cannot be empty")
        List<@Valid TicketImportItem> tickets

) {

    public record TicketImportItem(

            @NotBlank(message = "externalId is required")
            @Size(max = 100, message = "externalId must not exceed 100 characters")
            String externalId,

            @NotBlank(message = "subject is required")
            @Size(min = 3, max = 150,
                    message = "Subject must be between 3 and 150 characters")
            String subject,

            @NotBlank(message = "body is required")
            @Size(min = 5, max = 2000,
                    message = "Body must be between 5 and 2000 characters")
            String body

    ) {
        public TicketImportItem {
            if (externalId != null) {
                externalId = externalId.trim();
            }

            if (subject != null) {
                subject = subject.trim();
            }

            if (body != null) {
                body = body.trim();
            }
        }
    }
}

